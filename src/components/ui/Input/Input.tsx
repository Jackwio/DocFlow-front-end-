/**
 * Input component with focus states and icon support
 * Base input component used throughout the application
 */

import { forwardRef, type InputHTMLAttributes } from 'react';
import { clsx } from 'clsx';

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /**
   * Size variant of the input
   */
  inputSize?: InputSize;
  /**
   * Icon to display on the left side
   */
  leftIcon?: React.ReactNode;
  /**
   * Icon to display on the right side
   */
  rightIcon?: React.ReactNode;
  /**
   * Error message to display below the input
   */
  error?: string;
  /**
   * Label for the input
   */
  label?: string;
  /**
   * Helper text to display below the input
   */
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      inputSize = 'md',
      leftIcon,
      rightIcon,
      error,
      label,
      helperText,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'w-full border rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-neutral-50';

    const sizeStyles = {
      sm: 'text-sm px-3 py-1.5',
      md: 'text-base px-4 py-2',
      lg: 'text-lg px-5 py-3',
    };

    const stateStyles = error
      ? 'border-status-failed-dark focus:ring-status-failed-dark focus:border-status-failed-dark'
      : 'border-neutral-300 focus:ring-primary-500 focus:border-primary-500 hover:border-neutral-400';

    const paddingStyles = {
      left: leftIcon ? 'pl-10' : '',
      right: rightIcon ? 'pr-10' : '',
    };

    const inputClasses = clsx(
      baseStyles,
      sizeStyles[inputSize],
      stateStyles,
      paddingStyles.left,
      paddingStyles.right,
      className
    );

    const iconSizeStyles = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    };

    const iconPositionStyles = {
      left: leftIcon ? 'left-3' : '',
      right: rightIcon ? 'right-3' : '',
    };

    return (
      <div className="w-full">
        {label && (
          <label
            className={clsx(
              'block mb-1.5 text-sm font-medium text-neutral-700',
              disabled && 'opacity-50'
            )}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div
              className={clsx(
                'absolute top-1/2 transform -translate-y-1/2 text-neutral-400 pointer-events-none',
                iconSizeStyles[inputSize],
                iconPositionStyles.left
              )}
            >
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            disabled={disabled}
            className={inputClasses}
            {...props}
          />
          {rightIcon && (
            <div
              className={clsx(
                'absolute top-1/2 transform -translate-y-1/2 text-neutral-400',
                iconSizeStyles[inputSize],
                iconPositionStyles.right
              )}
            >
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-status-failed-dark">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-neutral-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
