/**
 * SearchInput component with search icon, clear button, and debounce functionality
 * Used for search functionality throughout the application
 */

import { forwardRef, useCallback, useEffect, useState, type InputHTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { Input, type InputSize } from './Input';

export interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  /**
   * Size variant of the input
   */
  inputSize?: InputSize;
  /**
   * Callback fired when the search value changes (after debounce)
   */
  onChange?: (value: string) => void;
  /**
   * Callback fired when the search is cleared
   */
  onClear?: () => void;
  /**
   * Debounce delay in milliseconds
   * @default 300
   */
  debounceMs?: number;
  /**
   * Whether to show the clear button
   * @default true
   */
  showClearButton?: boolean;
  /**
   * Initial value for the search input
   */
  defaultValue?: string;
}

const SearchIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const ClearIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
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
);

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      inputSize = 'md',
      onChange,
      onClear,
      debounceMs = 300,
      showClearButton = true,
      defaultValue = '',
      className,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const [debouncedValue, setDebouncedValue] = useState(defaultValue);

    // Debounce the search value
    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(internalValue);
      }, debounceMs);

      return () => {
        clearTimeout(handler);
      };
    }, [internalValue, debounceMs]);

    // Trigger onChange callback when debounced value changes
    useEffect(() => {
      onChange?.(debouncedValue);
    }, [debouncedValue, onChange]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      setInternalValue(e.target.value);
    }, []);

    const handleClear = useCallback(() => {
      setInternalValue('');
      setDebouncedValue('');
      onClear?.();
    }, [onClear]);

    const showClear = showClearButton && internalValue.length > 0;

    return (
      <Input
        ref={ref}
        type="search"
        inputSize={inputSize}
        value={internalValue}
        onChange={handleChange}
        className={className}
        leftIcon={<SearchIcon />}
        rightIcon={
          showClear ? (
            <button
              type="button"
              onClick={handleClear}
              className="cursor-pointer hover:text-neutral-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
              aria-label="Clear search"
            >
              <ClearIcon />
            </button>
          ) : undefined
        }
        {...props}
      />
    );
  }
);

SearchInput.displayName = 'SearchInput';
