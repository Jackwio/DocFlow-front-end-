/**
 * TagList component
 * Displays automatic and manual tags with remove functionality (FR-021, FR-023, FR-024)
 */

import { TagDto } from '@/types';
import { formatDate } from '@/utils/formatting';
import clsx from 'clsx';

export interface TagListProps {
  tags: TagDto[];
  /** Callback when a manual tag should be removed */
  onRemoveTag?: (tagName: string) => void;
  /** Whether tag removal is in progress */
  isRemoving?: boolean;
}

/**
 * Generate consistent color for a tag based on its name
 * Uses hash function to assign colors consistently
 */
function getTagColor(tagName: string): string {
  const colors = [
    'bg-blue-100 text-blue-700 border-blue-200',
    'bg-green-100 text-green-700 border-green-200',
    'bg-purple-100 text-purple-700 border-purple-200',
    'bg-pink-100 text-pink-700 border-pink-200',
    'bg-yellow-100 text-yellow-700 border-yellow-200',
    'bg-indigo-100 text-indigo-700 border-indigo-200',
    'bg-red-100 text-red-700 border-red-200',
    'bg-orange-100 text-orange-700 border-orange-200',
  ];

  // Simple hash function for consistent color assignment
  let hash = 0;
  for (let i = 0; i < tagName.length; i++) {
    hash = tagName.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
}

export function TagList({ tags, onRemoveTag, isRemoving = false }: TagListProps) {
  const automaticTags = tags.filter(tag => tag.source === 0); // TagSource.Automatic
  const manualTags = tags.filter(tag => tag.source === 1); // TagSource.Manual

  if (tags.length === 0) {
    return (
      <section className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
          Tags
        </h3>
        <p className="text-sm text-gray-500 italic">
          No tags assigned yet.
        </p>
      </section>
    );
  }

  return (
    <section className="mb-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
        Tags
      </h3>

      {/* Automatic Tags */}
      {automaticTags.length > 0 && (
        <div className="mb-4">
          <h4 className="text-xs font-medium text-gray-500 mb-2">
            Automatic Tags
          </h4>
          <div className="flex flex-wrap gap-2">
            {automaticTags.map((tag, index) => (
              <div
                key={`auto-${tag.name}-${index}`}
                className={clsx(
                  'inline-flex items-center gap-2',
                  'px-3 py-1.5 rounded-full',
                  'text-sm font-medium border',
                  'transition-all duration-200',
                  getTagColor(tag.name)
                )}
                title={`Added ${formatDate(tag.addedAt)}`}
              >
                <svg 
                  className="w-3.5 h-3.5" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M5.5 2a3.5 3.5 0 101.665 6.58L8.585 10l-1.42 1.42a3.5 3.5 0 101.414 1.414l8.128-8.127a1 1 0 00-1.414-1.414L7.165 11.42A3.5 3.5 0 105.5 2z" 
                    clipRule="evenodd" 
                  />
                </svg>
                <span>{tag.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Manual Tags */}
      {manualTags.length > 0 && (
        <div>
          <h4 className="text-xs font-medium text-gray-500 mb-2">
            Manual Tags
          </h4>
          <div className="flex flex-wrap gap-2">
            {manualTags.map((tag, index) => (
              <div
                key={`manual-${tag.name}-${index}`}
                className={clsx(
                  'group inline-flex items-center gap-2',
                  'px-3 py-1.5 rounded-full',
                  'text-sm font-medium border',
                  'transition-all duration-200',
                  getTagColor(tag.name),
                  onRemoveTag && 'hover:shadow-md'
                )}
                title={`Added by ${tag.addedBy || 'user'} on ${formatDate(tag.addedAt)}`}
              >
                <svg 
                  className="w-3.5 h-3.5" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" 
                    clipRule="evenodd" 
                  />
                </svg>
                <span>{tag.name}</span>
                
                {/* Remove button - appears on hover */}
                {onRemoveTag && (
                  <button
                    onClick={() => onRemoveTag(tag.name)}
                    disabled={isRemoving}
                    className={clsx(
                      'ml-1 opacity-0 group-hover:opacity-100',
                      'rounded-full p-0.5',
                      'hover:bg-red-500 hover:text-white',
                      'transition-all duration-200',
                      'focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1',
                      'disabled:opacity-50 disabled:cursor-not-allowed'
                    )}
                    aria-label={`Remove ${tag.name} tag`}
                    title="Remove tag"
                  >
                    <svg 
                      className="w-3.5 h-3.5" 
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
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
