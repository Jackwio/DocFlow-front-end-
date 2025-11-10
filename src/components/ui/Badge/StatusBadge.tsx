/**
 * StatusBadge component
 * Color-coded badges for document status with animations
 */

import { clsx } from 'clsx';
import { DocumentStatus } from '@/types';

export type BadgeSize = 'sm' | 'md' | 'lg';

export interface StatusBadgeProps {
  status: DocumentStatus;
  size?: BadgeSize;
  showIcon?: boolean;
  className?: string;
}

const statusConfig = {
  [DocumentStatus.Pending]: {
    label: 'Pending',
    colors: 'bg-status-pending-light text-status-pending-dark border-status-pending-dark',
    icon: '⏳',
  },
  [DocumentStatus.Classified]: {
    label: 'Classified',
    colors: 'bg-status-classified-light text-status-classified-dark border-status-classified-dark',
    icon: '✓',
  },
  [DocumentStatus.Failed]: {
    label: 'Failed',
    colors: 'bg-status-failed-light text-status-failed-dark border-status-failed-dark',
    icon: '✗',
  },
  [DocumentStatus.Routed]: {
    label: 'Routed',
    colors: 'bg-status-routed-light text-status-routed-dark border-status-routed-dark',
    icon: '→',
  },
};

const sizeStyles = {
  sm: 'text-xs px-2 py-0.5 gap-1',
  md: 'text-sm px-2.5 py-1 gap-1.5',
  lg: 'text-base px-3 py-1.5 gap-2',
};

export function StatusBadge({
  status,
  size = 'md',
  showIcon = true,
  className,
}: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium rounded-full border transition-all duration-300',
        config.colors,
        sizeStyles[size],
        status === DocumentStatus.Pending && 'animate-pulse-soft',
        className
      )}
      role="status"
      aria-label={`Status: ${config.label}`}
    >
      {showIcon && (
        <span aria-hidden="true" className="text-inherit">
          {config.icon}
        </span>
      )}
      {config.label}
    </span>
  );
}
