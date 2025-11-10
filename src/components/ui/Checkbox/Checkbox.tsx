/**
 * Checkbox component
 * Accessible checkbox with animation and indeterminate state support
 */

import { forwardRef, InputHTMLAttributes } from 'react';
import { clsx } from 'clsx';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /**
   * Indeterminate state (for "select all" functionality)
   */
  indeterminate?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Label for the checkbox
   */
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ indeterminate = false, className, label, ...props }, ref) => {
    return (
      <label
        className={clsx(
          'inline-flex items-center gap-2 cursor-pointer group',
          props.disabled && 'cursor-not-allowed opacity-50',
          className
        )}
      >
        <div className="relative">
          <input
            type="checkbox"
            className={clsx(
              'h-4 w-4 rounded border-neutral-300 text-primary-600',
              'transition-all duration-200 ease-in-out',
              'focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
              'hover:border-primary-400',
              'disabled:cursor-not-allowed disabled:bg-neutral-100',
              // Indeterminate state styling
              indeterminate && 'indeterminate:bg-primary-600 indeterminate:border-primary-600',
              // Animation on check
              'checked:scale-110 checked:animate-[checkBounce_0.2s_ease-in-out]'
            )}
            {...props}
            // Handle indeterminate state and forward ref
            ref={(node) => {
              if (node) {
                node.indeterminate = indeterminate;
              }
              if (typeof ref === 'function') {
                ref(node);
              } else if (ref) {
                ref.current = node;
              }
            }}
          />
          {/* Visual checkmark indicator for better feedback */}
          {(props.checked || indeterminate) && (
            <div
              className={clsx(
                'absolute inset-0 pointer-events-none flex items-center justify-center',
                'transition-opacity duration-150',
                props.checked ? 'opacity-100' : 'opacity-0'
              )}
            >
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {indeterminate ? (
                  <line x1="5" y1="12" x2="19" y2="12" />
                ) : (
                  <polyline points="20 6 9 17 4 12" />
                )}
              </svg>
            </div>
          )}
        </div>
        {label && (
          <span
            className={clsx(
              'text-sm text-neutral-700 select-none',
              'group-hover:text-neutral-900 transition-colors'
            )}
          >
            {label}
          </span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
