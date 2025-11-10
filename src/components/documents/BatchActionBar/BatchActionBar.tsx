/**
 * BatchActionBar component
 * Floating action bar that appears when documents are selected
 * Provides batch operations like retry all and clear selection
 */

import { Button } from '@/components/ui/Button';
import { clsx } from 'clsx';

export interface BatchActionBarProps {
  selectedCount: number;
  visible: boolean;
  onRetryAll?: () => void;
  onClearSelection: () => void;
  isRetrying?: boolean;
  className?: string;
}

export function BatchActionBar({
  selectedCount,
  visible,
  onRetryAll,
  onClearSelection,
  isRetrying = false,
  className,
}: BatchActionBarProps) {
  return (
    <div
      className={clsx(
        'fixed bottom-0 left-0 right-0 z-50',
        'bg-white border-t border-neutral-200 shadow-lg',
        'transition-all duration-300 ease-out',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0',
        className
      )}
      role="toolbar"
      aria-label="Batch actions toolbar"
      aria-hidden={!visible}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Selection Count */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-sm font-semibold text-primary-700">
                  {selectedCount}
                </span>
              </div>
              <span className="text-sm font-medium text-neutral-700">
                {selectedCount === 1
                  ? '1 document selected'
                  : `${selectedCount} documents selected`}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {onRetryAll && (
              <Button
                variant="primary"
                size="sm"
                onClick={onRetryAll}
                isLoading={isRetrying}
                disabled={isRetrying}
                leftIcon={
                  !isRetrying && (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  )
                }
              >
                Retry All
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearSelection}
              disabled={isRetrying}
              leftIcon={
                <svg
                  className="w-4 h-4"
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
              }
              aria-label="Clear selection"
            >
              Clear
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
