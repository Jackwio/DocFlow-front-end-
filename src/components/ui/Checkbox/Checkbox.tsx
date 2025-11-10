/**
 * Checkbox component with accessible states and animations
 * Supports checked, unchecked, and indeterminate states
 */

import { forwardRef, type InputHTMLAttributes } from 'react';
import { clsx } from 'clsx';

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /**
   * Indeterminate state (for "select all" partial selection)
   */
  indeterminate?: boolean;
  /**
   * Label text for the checkbox
   */
  label?: string;
  /**
   * Error state
   */
  error?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      indeterminate = false,
      label,
      error = false,
      className,
      disabled,
      checked,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'h-4 w-4 rounded border-2 transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50';

    const stateStyles = error
      ? 'border-status-failed-dark text-status-failed-dark'
      : 'border-neutral-300 text-primary-600 hover:border-primary-500';

    const checkedStyles =
      checked || indeterminate
        ? 'bg-primary-600 border-primary-600'
        : 'bg-white';

    return (
      <label
        className={clsx(
          'inline-flex items-center gap-2',
          disabled && 'cursor-not-allowed opacity-50',
          className
        )}
      >
        <div className="relative inline-flex items-center">
          <input
            ref={ref}
            type="checkbox"
            className={clsx(baseStyles, stateStyles, checkedStyles)}
            disabled={disabled}
            checked={checked}
            aria-checked={indeterminate ? 'mixed' : checked}
            {...props}
          />
          {/* Checkmark icon */}
          {checked && !indeterminate && (
            <svg
              className="absolute left-0 top-0 h-4 w-4 pointer-events-none text-white animate-checkmark"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M13 4L6 11L3 8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          {/* Indeterminate icon (horizontal line) */}
          {indeterminate && (
            <svg
              className="absolute left-0 top-0 h-4 w-4 pointer-events-none text-white"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M4 8H12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </div>
        {label && (
          <span
            className={clsx(
              'text-sm text-neutral-700',
              disabled && 'text-neutral-400'
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
