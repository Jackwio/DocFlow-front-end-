/**
 * DocumentDetailPanel component
 * Main detail panel with slide-in animation integrating all sections (FR-017)
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useDocumentDetail } from '@/hooks/useDocumentDetail';
import { useAddManualTag } from '@/hooks/useAddManualTag';
import { useRemoveManualTag } from '@/hooks/useRemoveManualTag';
import { SkeletonDetailPanel } from '@/components/ui/Skeleton';
import { MetadataSection } from './MetadataSection';
import { ClassificationResults } from './ClassificationResults';
import { TagList } from './TagList';
import { RoutingTimeline } from './RoutingTimeline';
import { useState } from 'react';
import clsx from 'clsx';

export interface DocumentDetailPanelProps {
  /** Document ID to display */
  documentId: string | null;
  /** Whether the panel is open */
  isOpen: boolean;
  /** Callback when panel should close */
  onClose: () => void;
}

export function DocumentDetailPanel({ 
  documentId, 
  isOpen, 
  onClose 
}: DocumentDetailPanelProps) {
  const [newTagName, setNewTagName] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);

  // Fetch document details
  const { document, isLoading, error } = useDocumentDetail({
    documentId,
    enabled: isOpen && !!documentId,
    includeHistory: true,
  });

  // Tag mutations
  const { mutate: addTag, isPending: isAddingTag } = useAddManualTag();
  const { mutate: removeTag, isPending: isRemovingTag } = useRemoveManualTag();

  // Handle tag addition
  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!documentId || !newTagName.trim()) return;

    addTag(
      { documentId, tagName: newTagName.trim() },
      {
        onSuccess: () => {
          setNewTagName('');
          setShowTagInput(false);
        },
      }
    );
  };

  // Handle tag removal
  const handleRemoveTag = (tagName: string) => {
    if (!documentId) return;
    removeTag({ documentId, tagName });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - desktop only */}
          <motion.div
            className="fixed inset-0 bg-black/30 z-40 hidden lg:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            className={clsx(
              'fixed right-0 top-0 h-full z-50',
              'bg-white shadow-2xl',
              'w-full lg:w-[480px] xl:w-[600px]',
              'overflow-hidden flex flex-col'
            )}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">
                Document Details
              </h2>
              <button
                onClick={onClose}
                className={clsx(
                  'rounded-md p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100',
                  'transition-colors duration-200',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500'
                )}
                aria-label="Close panel"
              >
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Loading State */}
              {isLoading && (
                <SkeletonDetailPanel className="p-6" />
              )}

              {/* Error State */}
              {error && (
                <div className="p-6">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <svg 
                        className="w-5 h-5 text-red-500 mt-0.5 mr-3" 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path 
                          fillRule="evenodd" 
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                          clipRule="evenodd" 
                        />
                      </svg>
                      <div>
                        <h3 className="text-sm font-medium text-red-800">
                          Failed to load document details
                        </h3>
                        <p className="mt-1 text-sm text-red-700">
                          {error instanceof Error ? error.message : 'An error occurred'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Document Details */}
              {document && (
                <div className="p-6 space-y-6">
                  {/* Status Badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Status</span>
                    <span className={clsx(
                      'px-3 py-1 rounded-full text-xs font-semibold',
                      {
                        'bg-yellow-100 text-yellow-800': document.status === 0, // Pending
                        'bg-green-100 text-green-800': document.status === 1, // Classified
                        'bg-red-100 text-red-800': document.status === 2, // Failed
                        'bg-blue-100 text-blue-800': document.status === 3, // Routed
                      }
                    )}>
                      {['Pending', 'Classified', 'Failed', 'Routed'][document.status] || 'Unknown'}
                    </span>
                  </div>

                  {/* Sections */}
                  <MetadataSection document={document} />
                  
                  <ClassificationResults results={document.classificationResults} />
                  
                  <TagList 
                    tags={document.tags} 
                    onRemoveTag={handleRemoveTag}
                    isRemoving={isRemovingTag}
                  />

                  {/* Manual Tag Input (T133) */}
                  <div className="border-t border-gray-200 pt-4">
                    {!showTagInput ? (
                      <button
                        onClick={() => setShowTagInput(true)}
                        className={clsx(
                          'w-full flex items-center justify-center gap-2',
                          'px-4 py-2 rounded-lg',
                          'bg-blue-50 text-blue-700 hover:bg-blue-100',
                          'border border-blue-200',
                          'text-sm font-medium',
                          'transition-colors duration-200',
                          'focus:outline-none focus:ring-2 focus:ring-blue-500'
                        )}
                      >
                        <svg 
                          className="w-4 h-4" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M12 4v16m8-8H4" 
                          />
                        </svg>
                        Add Manual Tag
                      </button>
                    ) : (
                      <form onSubmit={handleAddTag} className="space-y-2">
                        <input
                          type="text"
                          value={newTagName}
                          onChange={(e) => setNewTagName(e.target.value)}
                          placeholder="Enter tag name..."
                          className={clsx(
                            'w-full px-3 py-2 rounded-lg',
                            'border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200',
                            'text-sm',
                            'transition-all duration-200'
                          )}
                          autoFocus
                          disabled={isAddingTag}
                        />
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            disabled={!newTagName.trim() || isAddingTag}
                            className={clsx(
                              'flex-1 px-4 py-2 rounded-lg',
                              'bg-blue-600 text-white hover:bg-blue-700',
                              'text-sm font-medium',
                              'transition-colors duration-200',
                              'disabled:opacity-50 disabled:cursor-not-allowed',
                              'focus:outline-none focus:ring-2 focus:ring-blue-500'
                            )}
                          >
                            {isAddingTag ? 'Adding...' : 'Add Tag'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowTagInput(false);
                              setNewTagName('');
                            }}
                            disabled={isAddingTag}
                            className={clsx(
                              'px-4 py-2 rounded-lg',
                              'bg-gray-100 text-gray-700 hover:bg-gray-200',
                              'text-sm font-medium',
                              'transition-colors duration-200',
                              'disabled:opacity-50 disabled:cursor-not-allowed',
                              'focus:outline-none focus:ring-2 focus:ring-gray-400'
                            )}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                  
                  <RoutingTimeline history={document.routingHistory} />
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
