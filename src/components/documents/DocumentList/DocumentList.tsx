/**
 * DocumentList component
 * Container for document list with loading and empty states
 */

import { DocumentListItem } from './DocumentListItem';
import type { DocumentListDto } from '@/types';
import { clsx } from 'clsx';

export interface DocumentListProps {
  documents: DocumentListDto[];
  isLoading?: boolean;
  selectedDocumentIds?: string[];
  onDocumentSelect?: (id: string) => void;
  onDocumentClick?: (id: string) => void;
  onDocumentRetry?: (id: string) => void;
  totalCount?: number;
  searchQuery?: string;
  className?: string;
}

export function DocumentList({
  documents,
  isLoading = false,
  selectedDocumentIds = [],
  onDocumentSelect,
  onDocumentClick,
  onDocumentRetry,
  totalCount,
  searchQuery,
  className,
}: DocumentListProps) {
  if (isLoading) {
    return (
      <div className={clsx('flex items-center justify-center py-12', className)}>
        <div className="text-center">
          <svg
            className="animate-spin h-8 w-8 text-primary-600 mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p className="mt-2 text-sm text-neutral-600">Loading documents...</p>
        </div>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className={clsx('flex items-center justify-center py-12', className)}>
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-neutral-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-neutral-900">No documents</h3>
          <p className="mt-1 text-sm text-neutral-500">
            Upload your first document to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Result count header */}
      {totalCount !== undefined && (
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-neutral-600">
            {totalCount === 0 ? (
              'No documents found'
            ) : totalCount === 1 ? (
              '1 document found'
            ) : (
              <span>
                <span className="font-semibold text-neutral-900">{totalCount}</span> documents found
              </span>
            )}
          </p>
        </div>
      )}

      {/* Document list */}
      <div className="space-y-3" role="list">
        {documents.map((document) => (
          <DocumentListItem
            key={document.id}
            document={document}
            isSelected={selectedDocumentIds.includes(document.id)}
            onSelect={onDocumentSelect}
            onClick={onDocumentClick}
            onRetry={onDocumentRetry}
            searchQuery={searchQuery}
          />
        ))}
      </div>
    </div>
  );
}
