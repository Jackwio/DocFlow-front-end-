/**
 * DocumentListItem component
 * Individual document list item with status badge and metadata
 */

import { useState } from 'react';
import { StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { formatFileSize, formatDate } from '@/utils/formatting';
import type { DocumentListDto, DocumentStatus } from '@/types';
import { clsx } from 'clsx';

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
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={clsx(
        'border border-neutral-200 rounded-lg p-4 transition-all duration-150 group',
        'hover:shadow-md hover:border-primary-300 hover:bg-neutral-50',
        isSelected && 'ring-2 ring-primary-500 border-primary-500 bg-primary-50',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={() => onClick?.(document.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick(document.id);
        }
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {onSelect && (
            <div
              className={clsx(
                'transition-opacity duration-200',
                isHovered || isSelected ? 'opacity-100' : 'opacity-0'
              )}
            >
              <Checkbox
                checked={isSelected}
                onChange={() => onSelect(document.id)}
                onClick={(e) => e.stopPropagation()}
                aria-label={`Select ${document.fileName}`}
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
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
    </div>
  );
}
