/**
 * DocumentsPage component
 * Main page integrating upload zone and document list
 */

import { useState } from 'react';
import { UploadZone } from '@/components/documents/UploadZone';
import { DocumentList } from '@/components/documents/DocumentList';
import { ToastContainer } from '@/components/ui/Toast';
import { useDocuments } from '@/hooks/useDocuments';
import { useRetryClassification } from '@/hooks/useRetryClassification';
import { useUIStore } from '@/state/useUIStore';

export function DocumentsPage() {
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<string[]>([]);
  const { documents, isLoading, totalCount } = useDocuments();
  const retryMutation = useRetryClassification();
  const openDetailPanel = useUIStore((state) => state.openDetailPanel);

  const handleDocumentSelect = (id: string) => {
    setSelectedDocumentIds((prev) =>
      prev.includes(id) ? prev.filter((docId) => docId !== id) : [...prev, id]
    );
  };

  const handleDocumentClick = (id: string) => {
    openDetailPanel(id);
  };

  const handleDocumentRetry = (id: string) => {
    retryMutation.mutate(id);
  };

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
        <div className="space-y-8">
          {/* Upload Zone Section */}
          <section>
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Upload Documents</h2>
            <UploadZone multiple />
          </section>

          {/* Document List Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-neutral-900">
                Documents
                {totalCount > 0 && (
                  <span className="ml-2 text-base font-normal text-neutral-600">
                    ({totalCount} total)
                  </span>
                )}
              </h2>
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
            />
          </section>
        </div>
      </main>
    </div>
  );
}
