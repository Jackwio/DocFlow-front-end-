/**
 * DocumentListItem component
 * Individual document list item with status badge and metadata
 * Responsive: Renders as card on mobile (<768px), row on larger screens
 */

import { StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatFileSize, formatDate } from '@/utils/formatting';
import type { DocumentListDto, DocumentStatus } from '@/types';
import { clsx } from 'clsx';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export interface DocumentListItemProps {
  document: DocumentListDto;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onClick?: (id: string) => void;
  onRetry?: (id: string) => void;
  className?: string;
}

export function DocumentListItem({
  document,
  isSelected = false,
  onSelect,
  onClick,
  onRetry,
  className,
}: DocumentListItemProps) {
  const isFailed = document.status === 2; // DocumentStatus.Failed
  const { isMobile } = useMediaQuery();

  return (
    <div
      className={clsx(
        'border border-neutral-200 rounded-lg transition-all duration-150',
        'hover:shadow-md hover:border-primary-300',
        isSelected && 'ring-2 ring-primary-500 border-primary-500',
        onClick && 'cursor-pointer',
        // Mobile: Card layout with more padding
        isMobile ? 'p-4 space-y-3' : 'p-4',
        className
      )}
      onClick={() => onClick?.(document.id)}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick(document.id);
        }
      }}
    >
      {/* Mobile Card Layout */}
      {isMobile ? (
        <>
          {/* Header with checkbox and status */}
          <div className="flex items-center justify-between">
            {onSelect && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onSelect(document.id)}
                onClick={(e) => e.stopPropagation()}
                // Minimum 44px touch target
                className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                aria-label={`Select ${document.fileName}`}
              />
            )}
            <StatusBadge status={document.status as DocumentStatus} size="sm" />
          </div>

          {/* File name */}
          <div>
            <h3 className="text-base font-semibold text-neutral-900 break-words">
              {document.fileName}
            </h3>
          </div>

          {/* Metadata */}
          <div className="flex flex-col gap-1 text-sm text-neutral-500">
            <div className="flex items-center gap-2">
              <span className="font-medium text-neutral-700">Size:</span>
              <span>{formatFileSize(document.fileSize)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-neutral-700">Uploaded:</span>
              <span>{formatDate(document.uploadedAt, 'relative')}</span>
            </div>
            {document.classifiedAt && (
              <div className="flex items-center gap-2">
                <span className="font-medium text-neutral-700">Classified:</span>
                <span>{formatDate(document.classifiedAt, 'relative')}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {document.tags && document.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {document.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-neutral-100 text-neutral-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Retry button for failed documents */}
          {isFailed && onRetry && (
            <Button
              variant="secondary"
              size="md"
              onClick={(e) => {
                e.stopPropagation();
                onRetry(document.id);
              }}
              className="w-full min-h-[44px]"
            >
              Retry Classification
            </Button>
          )}
        </>
      ) : (
        // Desktop/Tablet Row Layout
        <>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {onSelect && (
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onSelect(document.id)}
                  onClick={(e) => e.stopPropagation()}
                  className="mr-3 h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                  aria-label={`Select ${document.fileName}`}
                />
              )}
              <div className="inline-block">
                <h3 className="text-sm font-semibold text-neutral-900 truncate">
                  {document.fileName}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-xs text-neutral-500">
                  <span>{formatFileSize(document.fileSize)}</span>
                  <span>•</span>
                  <span>{formatDate(document.uploadedAt, 'relative')}</span>
                  {document.classifiedAt && (
                    <>
                      <span>•</span>
                      <span>Classified {formatDate(document.classifiedAt, 'relative')}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <StatusBadge status={document.status as DocumentStatus} size="sm" />
              {isFailed && onRetry && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRetry(document.id);
                  }}
                >
                  Retry
                </Button>
              )}
            </div>
          </div>

          {document.tags && document.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {document.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
