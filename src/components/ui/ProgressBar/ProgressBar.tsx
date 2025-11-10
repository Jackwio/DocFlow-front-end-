/**
 * ProgressBar component
 * Visual progress indicator with percentage display and accessibility
 */

import { clsx } from 'clsx';

export type ProgressBarVariant = 'primary' | 'success' | 'warning' | 'error';
export type ProgressBarSize = 'sm' | 'md' | 'lg';

export interface ProgressBarProps {
  percentage: number;
  variant?: ProgressBarVariant;
  size?: ProgressBarSize;
  showPercentage?: boolean;
  label?: string;
  className?: string;
}

const variantColors = {
  primary: 'bg-primary-600',
  success: 'bg-status-classified-dark',
  warning: 'bg-yellow-500',
  error: 'bg-status-failed-dark',
};

const sizeStyles = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

export function ProgressBar({
  percentage,
  variant = 'primary',
  size = 'md',
  showPercentage = true,
  label,
  className,
}: ProgressBarProps) {
  const clampedPercentage = Math.min(100, Math.max(0, percentage));

  return (
    <div className={clsx('w-full', className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-1 text-sm text-neutral-700">
          {label && <span>{label}</span>}
          {showPercentage && (
            <span className="font-medium">{Math.round(clampedPercentage)}%</span>
          )}
        </div>
      )}
      <div
        className={clsx(
          'w-full bg-neutral-200 rounded-full overflow-hidden',
          sizeStyles[size]
        )}
        role="progressbar"
        aria-valuenow={clampedPercentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || 'Progress'}
      >
        <div
          className={clsx(
            'h-full transition-all duration-300 ease-out rounded-full',
            variantColors[variant]
          )}
          style={{ width: `${clampedPercentage}%` }}
        />
      </div>
    </div>
  );
}
