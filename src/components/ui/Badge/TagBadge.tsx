/**
 * TagBadge component
 * Displays document tags with consistent colors and optional remove action
 */

import { clsx } from 'clsx';
import { TagDto, TagSource } from '@/types';
import { stringToColor } from '@/utils/formatting';

export type TagBadgeSize = 'sm' | 'md' | 'lg';

export interface TagBadgeProps {
  tag: TagDto;
  onRemove?: () => void;
  size?: TagBadgeSize;
  className?: string;
}

const sizeStyles = {
  sm: 'text-xs px-2 py-0.5 gap-1',
  md: 'text-sm px-2.5 py-1 gap-1.5',
  lg: 'text-base px-3 py-1.5 gap-2',
};

export function TagBadge({ tag, onRemove, size = 'md', className }: TagBadgeProps) {
  const backgroundColor = stringToColor(tag.name);
  const isManual = tag.source === TagSource.Manual;

  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium rounded-full transition-all duration-150',
        sizeStyles[size],
        className
      )}
      style={{
        backgroundColor,
        color: '#fff',
      }}
      role="status"
      aria-label={`Tag: ${tag.name} (${isManual ? 'Manual' : 'Automatic'})`}
    >
      {isManual && (
        <span aria-hidden="true" className="text-inherit text-xs">
          ✏️
        </span>
      )}
      <span>{tag.name}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-0.5 hover:opacity-80 focus:outline-none focus:ring-1 focus:ring-white rounded-full"
          aria-label={`Remove tag ${tag.name}`}
        >
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </span>
  );
}
