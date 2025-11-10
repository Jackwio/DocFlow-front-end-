/**
 * DocumentsPage component
 * Main page integrating upload zone, search, filters, and document list
 */

import { UploadZone } from '@/components/documents/UploadZone';
import { DocumentList } from '@/components/documents/DocumentList';
import { BatchActionBar } from '@/components/documents/BatchActionBar';
import { Modal } from '@/components/ui/Modal';
import { ToastContainer } from '@/components/ui/Toast';
import { useDocuments } from '@/hooks/useDocuments';
import { useDocumentSelection } from '@/hooks/useDocumentSelection';
import { useRetryClassification } from '@/hooks/useRetryClassification';
import { useBatchRetry } from '@/hooks/useBatchRetry';
import { DocumentDetailPanel } from '@/components/documents/DocumentDetailPanel';
import { BatchActionBar } from '@/components/documents/BatchActionBar';
import { ToastContainer } from '@/components/ui/Toast';
import { useDocuments } from '@/hooks/useDocuments';
import { useDocumentSearch } from '@/hooks/useDocumentSearch';
import { useRetryClassification } from '@/hooks/useRetryClassification';
import { useBatchRetry } from '@/hooks/useBatchRetry';
import { useDocumentSelection } from '@/hooks/useDocumentSelection';
import { useUIStore } from '@/state/useUIStore';
import { DocumentStatus } from '@/types';

export function DocumentsPage() {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { documents, isLoading, totalCount } = useDocuments();
  const retryMutation = useRetryClassification();
  const batchRetryMutation = useBatchRetry();
  const openDetailPanel = useUIStore((state) => state.openDetailPanel);
  
  // T143: Use document selection hook
  const {
    selectedIds,
    isSelected,
    toggleSelection,
    selectAll,
    deselectAll,
    selectedCount,
  } = useDocumentSelection();

  const handleDocumentSelect = (id: string) => {
    toggleSelection(id);
  };

  const handleSelectAll = () => {
    const documentIds = documents.map((doc) => doc.id);
    selectAll(documentIds);
  };

  const handleDeselectAll = () => {
    clearSelection();
  };

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

  const handleBatchRetry = () => {
    // Filter to only retry failed documents from selection
    const selectedDocuments = documents.filter((doc) => selectedIds.has(doc.id));
    const failedDocumentIds = selectedDocuments
      .filter((doc) => doc.status === DocumentStatus.Failed)
      .map((doc) => doc.id);

    if (failedDocumentIds.length === 0) {
      // Show notification if no failed documents in selection
      return;
    }

    batchRetryMutation.mutate(failedDocumentIds, {
      onSuccess: () => {
        // Clear selection after successful batch retry
        clearSelection();
      },
    });
  };

  // T148: Select all / deselect all
  const handleSelectAll = () => {
    selectAll(documents.map((doc) => doc.id));
  };

  const handleDeselectAll = () => {
    deselectAll();
  };

  // T150: Retry All with confirmation modal
  const handleRetryAllClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmRetryAll = () => {
    const selectedDocumentIds = Array.from(selectedIds);
    batchRetryMutation.mutate(selectedDocumentIds, {
      onSuccess: () => {
        setShowConfirmModal(false);
        // T151: Clear selection after successful batch operation
        deselectAll();
      },
    });
  };

  // T151: Clear Selection action
  const handleClearSelection = () => {
    deselectAll();
  };

  // Convert Set to Array for DocumentList
  const selectedDocumentIds = Array.from(selectedIds);

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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
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
            </div>
            <DocumentList
              documents={documents}
              isLoading={isLoading}
              selectedDocumentIds={selectedDocumentIds}
              onDocumentSelect={handleDocumentSelect}
              onDocumentClick={handleDocumentClick}
              onDocumentRetry={handleDocumentRetry}
              onSelectAll={handleSelectAll}
              onDeselectAll={handleDeselectAll}
              showBatchActions={true}
            />
          </section>
        </div>
      </main>

      {/* T152: Integrate BatchActionBar with conditional visibility */}
      <BatchActionBar
        selectedCount={selectedCount}
        visible={selectedCount > 0}
        onRetryAll={handleRetryAllClick}
        onClearSelection={handleClearSelection}
        isRetrying={batchRetryMutation.isPending}
      />

      {/* T150: Confirmation modal for batch retry */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmRetryAll}
        title="Retry Selected Documents"
        description={`Are you sure you want to retry classification for ${selectedCount} selected document${selectedCount === 1 ? '' : 's'}? This will re-run the classification process.`}
        confirmText="Retry All"
        cancelText="Cancel"
        confirmVariant="primary"
        isConfirming={batchRetryMutation.isPending}
      />
    </div>
  );
}
