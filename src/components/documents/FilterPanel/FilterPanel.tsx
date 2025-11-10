/**
 * FilterPanel component with status and tag filter chips
 * Provides visual filtering interface with clear all functionality
 */

import { useCallback } from 'react';
import { FilterChip } from '@/components/ui/Chip';
import { Button } from '@/components/ui/Button';
import { DocumentStatus } from '@/types';

export interface FilterPanelProps {
  /**
   * Currently selected status filter
   */
  selectedStatus?: DocumentStatus | null;
  /**
   * Callback when status filter changes
   */
  onStatusChange: (status: DocumentStatus | null) => void;
  /**
   * Currently selected tags
   */
  selectedTags?: string[];
  /**
   * Callback when tag selection changes
   */
  onTagsChange: (tags: string[]) => void;
  /**
   * Available tags to filter by (with optional counts)
   */
  availableTags?: Array<{ name: string; count?: number }>;
  /**
   * Callback when all filters are cleared
   */
  onClearAll?: () => void;
  /**
   * Additional CSS classes
   */
  className?: string;
}

const STATUS_OPTIONS = [
  { value: DocumentStatus.Pending, label: 'Pending' },
  { value: DocumentStatus.Classified, label: 'Classified' },
  { value: DocumentStatus.Failed, label: 'Failed' },
  { value: DocumentStatus.Routed, label: 'Routed' },
];

export const FilterPanel = ({
  selectedStatus,
  onStatusChange,
  selectedTags = [],
  onTagsChange,
  availableTags = [],
  onClearAll,
  className,
}: FilterPanelProps) => {
  const handleStatusClick = useCallback(
    (status: DocumentStatus) => {
      // Toggle status: if already selected, clear it; otherwise, set it
      if (selectedStatus === status) {
        onStatusChange(null);
      } else {
        onStatusChange(status);
      }
    },
    [selectedStatus, onStatusChange]
  );

  const handleTagClick = useCallback(
    (tagName: string) => {
      // Toggle tag: if already selected, remove it; otherwise, add it
      if (selectedTags.includes(tagName)) {
        onTagsChange(selectedTags.filter((t) => t !== tagName));
      } else {
        onTagsChange([...selectedTags, tagName]);
      }
    },
    [selectedTags, onTagsChange]
  );

  const handleClearAll = useCallback(() => {
    onStatusChange(null);
    onTagsChange([]);
    onClearAll?.();
  }, [onStatusChange, onTagsChange, onClearAll]);

  const hasActiveFilters = selectedStatus !== null && selectedStatus !== undefined || selectedTags.length > 0;

  return (
    <div className={className}>
      <div className="space-y-4">
        {/* Header with Clear All button */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-neutral-900">Filters</h3>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="text-primary-600 hover:text-primary-700"
            >
              Clear All
            </Button>
          )}
        </div>

        {/* Status Filters */}
        <div>
          <h4 className="text-xs font-medium text-neutral-600 mb-2">Status</h4>
          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((option) => (
              <FilterChip
                key={option.value}
                label={option.label}
                selected={selectedStatus === option.value}
                onClick={() => handleStatusClick(option.value)}
              />
            ))}
          </div>
        </div>

        {/* Tag Filters */}
        {availableTags.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-neutral-600 mb-2">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <FilterChip
                  key={tag.name}
                  label={tag.name}
                  count={tag.count}
                  selected={selectedTags.includes(tag.name)}
                  onClick={() => handleTagClick(tag.name)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

FilterPanel.displayName = 'FilterPanel';
