/**
 * DocumentsPage component
 * Main page integrating upload zone and document list
 * Responsive layouts:
 * - Desktop (≥1024px): Three-column layout with sidebar, list, and detail panel
 * - Tablet (768-1023px): Two-column with collapsible drawer sidebar
 * - Mobile (<768px): Single column with bottom upload button
 */

import { useState } from 'react';
import { UploadZone } from '@/components/documents/UploadZone';
import { DocumentList } from '@/components/documents/DocumentList';
import { ToastContainer } from '@/components/ui/Toast';
import { Drawer, DrawerTrigger } from '@/components/ui/Drawer';
import { useDocuments } from '@/hooks/useDocuments';
import { useRetryClassification } from '@/hooks/useRetryClassification';
import { useUIStore } from '@/state/useUIStore';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { clsx } from 'clsx';

export function DocumentsPage() {
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<string[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showUploadZone, setShowUploadZone] = useState(false);
  
  const { documents, isLoading, totalCount } = useDocuments();
  const retryMutation = useRetryClassification();
  const openDetailPanel = useUIStore((state) => state.openDetailPanel);
  const { isMobile, isTablet, isDesktop } = useMediaQuery();

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

  // Sidebar content (for drawer on mobile/tablet)
  const sidebarContent = (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-neutral-700 mb-2">Filters</h3>
        <p className="text-sm text-neutral-500">Filter options coming soon...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-50">
      <ToastContainer />

      {/* Header */}
      <header className="bg-white border-b border-neutral-200 shadow-sm">
        <div className={clsx(
          'mx-auto px-4 py-4',
          isDesktop ? 'max-w-7xl sm:px-6 lg:px-8' : ''
        )}>
          <div className="flex items-center justify-between">
            {/* Mobile/Tablet: Hamburger menu */}
            {!isDesktop && (
              <DrawerTrigger
                onClick={() => setIsDrawerOpen(true)}
                label="Open navigation menu"
              />
            )}
            
            <div className="flex-1">
              <h1 className={clsx(
                'font-bold text-neutral-900',
                isMobile ? 'text-xl' : 'text-3xl'
              )}>
                DocFlow
              </h1>
              {!isMobile && (
                <p className="mt-1 text-sm text-neutral-600">
                  Document Intake & Classification
                </p>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Responsive Layout */}
      <main className={clsx(
        'mx-auto',
        isDesktop ? 'max-w-7xl px-4 sm:px-6 lg:px-8 py-8' : 'px-4 py-4'
      )}>
        {/* Desktop: Three-column layout */}
        {isDesktop && (
          <div className="grid grid-cols-12 gap-6">
            {/* Left Sidebar - Filters */}
            <aside className="col-span-3 bg-white rounded-lg border border-neutral-200 p-4">
              {sidebarContent}
            </aside>

            {/* Main Content - Upload & Documents */}
            <div className="col-span-9 space-y-6">
              {/* Upload Zone Section */}
              <section className="bg-white rounded-lg border border-neutral-200 p-6">
                <h2 className="text-xl font-semibold text-neutral-900 mb-4">
                  Upload Documents
                </h2>
                <UploadZone multiple />
              </section>

              {/* Document List Section */}
              <section className="bg-white rounded-lg border border-neutral-200 p-6">
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
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 rounded px-2 py-1 min-h-[44px]"
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
          </div>
        )}

        {/* Tablet: Two-column with drawer */}
        {isTablet && (
          <>
            <Drawer
              isOpen={isDrawerOpen}
              onClose={() => setIsDrawerOpen(false)}
              title="Filters"
              side="left"
            >
              {sidebarContent}
            </Drawer>

            <div className="space-y-6">
              {/* Upload Zone Section */}
              <section className="bg-white rounded-lg border border-neutral-200 p-4">
                <h2 className="text-lg font-semibold text-neutral-900 mb-3">
                  Upload Documents
                </h2>
                <UploadZone multiple />
              </section>

              {/* Document List Section */}
              <section className="bg-white rounded-lg border border-neutral-200 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-neutral-900">
                    Documents
                    {totalCount > 0 && (
                      <span className="ml-2 text-sm font-normal text-neutral-600">
                        ({totalCount})
                      </span>
                    )}
                  </h2>
                  {selectedDocumentIds.length > 0 && (
                    <button
                      onClick={() => setSelectedDocumentIds([])}
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 rounded px-2 py-1 min-h-[44px]"
                    >
                      Clear ({selectedDocumentIds.length})
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
          </>
        )}

        {/* Mobile: Single column with bottom upload button */}
        {isMobile && (
          <>
            <Drawer
              isOpen={isDrawerOpen}
              onClose={() => setIsDrawerOpen(false)}
              title="Filters"
              side="left"
            >
              {sidebarContent}
            </Drawer>

            <div className="space-y-4 pb-24">
              {/* Document List Section */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold text-neutral-900">
                    Documents
                    {totalCount > 0 && (
                      <span className="ml-2 text-sm font-normal text-neutral-600">
                        ({totalCount})
                      </span>
                    )}
                  </h2>
                  {selectedDocumentIds.length > 0 && (
                    <button
                      onClick={() => setSelectedDocumentIds([])}
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 rounded px-2 py-1 min-h-[44px]"
                    >
                      Clear ({selectedDocumentIds.length})
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

            {/* Fixed Bottom Upload Button */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 p-4 shadow-lg">
              <button
                onClick={() => setShowUploadZone(!showUploadZone)}
                className="w-full bg-primary-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 min-h-[44px]"
              >
                {showUploadZone ? 'Hide Upload' : 'Upload Documents'}
              </button>
            </div>

            {/* Upload Zone Modal/Sheet for Mobile */}
            {showUploadZone && (
              <div className="fixed inset-0 bg-black/50 z-40 flex items-end" onClick={() => setShowUploadZone(false)}>
                <div 
                  className="bg-white rounded-t-2xl p-6 w-full max-h-[80vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-neutral-900">
                      Upload Documents
                    </h2>
                    <button
                      onClick={() => setShowUploadZone(false)}
                      className="p-2 rounded-md text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 min-w-[44px] min-h-[44px]"
                      aria-label="Close upload"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <UploadZone multiple />
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
