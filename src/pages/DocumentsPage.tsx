/**
 * DocumentsPage component
 * Main page integrating upload zone, search, filters, and document list
 */

import { useState, useCallback } from 'react';
import { UploadZone } from '@/components/documents/UploadZone';
import { DocumentList } from '@/components/documents/DocumentList';
import { SearchBar } from '@/components/documents/SearchBar';
import { FilterPanel } from '@/components/documents/FilterPanel';
import { ToastContainer } from '@/components/ui/Toast';
import { useDocuments } from '@/hooks/useDocuments';
import { useDocumentSearch } from '@/hooks/useDocumentSearch';
import { useRetryClassification } from '@/hooks/useRetryClassification';
import { useUIStore } from '@/state/useUIStore';
import { DocumentStatus } from '@/types';

export function DocumentsPage() {
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<DocumentStatus | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Use search when filters are active, otherwise use default documents query
  const hasActiveFilters = searchQuery || selectedStatus !== null || selectedTags.length > 0;

  const {
    documents: searchDocuments,
    totalCount: searchTotalCount,
    isLoading: isSearchLoading,
  } = useDocumentSearch({
    fileName: searchQuery || undefined,
    status: selectedStatus !== null ? selectedStatus : undefined,
    tags: selectedTags.length > 0 ? selectedTags : undefined,
    enabled: hasActiveFilters,
  });

  const {
    documents: allDocuments,
    totalCount: allTotalCount,
    isLoading: isAllLoading,
  } = useDocuments({
    enabled: !hasActiveFilters,
  });

  // Use search results when filters are active, otherwise use all documents
  const documents = hasActiveFilters ? searchDocuments : allDocuments;
  const totalCount = hasActiveFilters ? searchTotalCount : allTotalCount;
  const isLoading = hasActiveFilters ? isSearchLoading : isAllLoading;

  const retryMutation = useRetryClassification();
  const openDetailPanel = useUIStore((state) => state.openDetailPanel);

  // Extract unique tags from all documents for filter panel
  const availableTags = Array.from(
    new Set(
      allDocuments.flatMap((doc) => doc.tags || [])
    )
  ).map((tag) => ({
    name: tag,
    count: allDocuments.filter((doc) => doc.tags?.includes(tag)).length,
  }));

  const handleDocumentSelect = useCallback((id: string) => {
    setSelectedDocumentIds((prev) =>
      prev.includes(id) ? prev.filter((docId) => docId !== id) : [...prev, id]
    );
  }, []);

  const handleDocumentClick = useCallback((id: string) => {
    openDetailPanel(id);
  }, [openDetailPanel]);

  const handleDocumentRetry = useCallback((id: string) => {
    retryMutation.mutate(id);
  }, [retryMutation]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleStatusChange = useCallback((status: DocumentStatus | null) => {
    setSelectedStatus(status);
  }, []);

  const handleTagsChange = useCallback((tags: string[]) => {
    setSelectedTags(tags);
  }, []);

  const handleClearAllFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedStatus(null);
    setSelectedTags([]);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50">
      <ToastContainer />

      {/* Header */}
      <header className="bg-white border-b border-neutral-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-neutral-900">
            DocFlow - Document Intake & Classification
          </h1>
          <p className="mt-2 text-sm text-neutral-600">
            Upload and manage your documents with automated classification
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Filter Panel */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4 sticky top-8">
              <FilterPanel
                selectedStatus={selectedStatus}
                onStatusChange={handleStatusChange}
                selectedTags={selectedTags}
                onTagsChange={handleTagsChange}
                availableTags={availableTags}
                onClearAll={handleClearAllFilters}
              />
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-8">
            {/* Upload Zone Section */}
            <section>
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">Upload Documents</h2>
              <UploadZone multiple />
            </section>

            {/* Search Bar */}
            <section>
              <SearchBar
                value={searchQuery}
                onSearch={handleSearch}
                placeholder="Search by document name..."
              />
            </section>

            {/* Document List Section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-neutral-900">Documents</h2>
                {selectedDocumentIds.length > 0 && (
                  <button
                    onClick={() => setSelectedDocumentIds([])}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 rounded px-2 py-1"
                  >
                    Clear selection ({selectedDocumentIds.length})
                  </button>
                )}
              </div>
              <DocumentList
                documents={documents}
                isLoading={isLoading}
                selectedDocumentIds={selectedDocumentIds}
                onDocumentSelect={handleDocumentSelect}
                onDocumentClick={handleDocumentClick}
                onDocumentRetry={handleDocumentRetry}
                totalCount={totalCount}
                searchQuery={searchQuery}
              />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
