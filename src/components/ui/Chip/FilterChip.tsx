/**
 * FilterChip component with selected/unselected visual states
 * Used for filtering documents by status, tags, etc.
 */

import { type ButtonHTMLAttributes } from 'react';
import { clsx } from 'clsx';

export interface FilterChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Label text for the chip
   */
  label: string;
  /**
   * Whether the chip is selected
   */
  selected?: boolean;
  /**
   * Count badge to show next to the label (e.g., number of documents)
   */
  count?: number;
  /**
   * Size variant of the chip
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Callback when chip is clicked
   */
  onClick?: () => void;
}

export const FilterChip = ({
  label,
  selected = false,
  count,
  size = 'md',
  onClick,
  className,
  disabled,
  ...props
}: FilterChipProps) => {
  const baseStyles =
    'inline-flex items-center gap-1.5 font-medium rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1',
    md: 'text-sm px-3.5 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  const stateStyles = selected
    ? 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-sm'
    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 active:bg-neutral-300 border border-neutral-300';

  const chipClasses = clsx(
    baseStyles,
    sizeStyles[size],
    stateStyles,
    className
  );

  const countBadgeStyles = selected
    ? 'bg-primary-700 text-white'
    : 'bg-neutral-200 text-neutral-700';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={chipClasses}
      role="switch"
      aria-checked={selected}
      aria-label={`Filter by ${label}`}
      {...props}
    >
      <span>{label}</span>
      {count !== undefined && (
        <span
          className={clsx(
            'inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full text-xs font-semibold transition-colors duration-200',
            countBadgeStyles
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
};

FilterChip.displayName = 'FilterChip';
