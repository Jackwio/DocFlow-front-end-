/**
 * BatchActionBar component
 * Floating action bar for batch operations on selected documents
 */

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { clsx } from 'clsx';

export interface BatchActionBarProps {
  /**
   * Number of selected documents
   */
  selectedCount: number;
  
  /**
   * Called when user clicks "Retry All"
   */
  onRetryAll?: () => void;
  
  /**
   * Called when user clicks "Clear Selection"
   */
  onClearSelection?: () => void;
  
  /**
   * Whether retry operation is in progress
   */
  isRetrying?: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

export function BatchActionBar({
  selectedCount,
  onRetryAll,
  onClearSelection,
  isRetrying = false,
  className,
}: BatchActionBarProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleRetryClick = () => {
    if (!showConfirmation) {
      setShowConfirmation(true);
      // Auto-hide confirmation after 5 seconds
      setTimeout(() => setShowConfirmation(false), 5000);
    } else {
      setShowConfirmation(false);
      onRetryAll?.();
    }
  };

  const handleClearSelection = () => {
    setShowConfirmation(false);
    onClearSelection?.();
  };

  if (selectedCount === 0) {
    return null;
  }

  return (
    <div
      className={clsx(
        'fixed bottom-0 left-0 right-0 z-50',
        'transform transition-all duration-300 ease-out',
        'animate-[slideUp_0.3s_ease-out]',
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div
          className={clsx(
            'bg-white rounded-lg shadow-2xl border border-neutral-200',
            'px-6 py-4',
            'flex items-center justify-between gap-4'
          )}
        >
          {/* Selection count */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-700 font-semibold text-sm">
              {selectedCount}
            </div>
            <span className="text-sm font-medium text-neutral-700">
              {selectedCount === 1 ? '1 document' : `${selectedCount} documents`} selected
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {showConfirmation ? (
              <>
                <span className="text-sm text-neutral-600 mr-2">
                  Confirm retry for {selectedCount} document{selectedCount !== 1 ? 's' : ''}?
                </span>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleRetryClick}
                  disabled={isRetrying}
                  className="min-w-[100px]"
                >
                  {isRetrying ? 'Retrying...' : 'Confirm'}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowConfirmation(false)}
                  disabled={isRetrying}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                {onRetryAll && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleRetryClick}
                    disabled={isRetrying}
                    className="min-w-[100px]"
                  >
                    {isRetrying ? 'Retrying...' : 'Retry All'}
                  </Button>
                )}
                {onClearSelection && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleClearSelection}
                    disabled={isRetrying}
                  >
                    Clear Selection
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
