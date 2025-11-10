/**
 * Toast notification component
 * Displays success/error/info messages with auto-dismiss
 */

import { useEffect } from 'react';
import { clsx } from 'clsx';
import type { Notification } from '@/types';

export interface ToastProps {
  notification: Notification;
  onClose: () => void;
}

const typeConfig = {
  success: {
    icon: '✓',
    colors: 'bg-status-classified-light text-status-classified-dark border-status-classified-dark',
  },
  error: {
    icon: '✗',
    colors: 'bg-status-failed-light text-status-failed-dark border-status-failed-dark',
  },
  info: {
    icon: 'ℹ',
    colors: 'bg-primary-50 text-primary-900 border-primary-500',
  },
  warning: {
    icon: '⚠',
    colors: 'bg-yellow-50 text-yellow-900 border-yellow-500',
  },
};

export function Toast({ notification, onClose }: ToastProps) {
  const config = typeConfig[notification.type];

  useEffect(() => {
    if (notification.duration) {
      const timer = setTimeout(onClose, notification.duration);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [notification.duration, onClose]);

  return (
    <div
      className={clsx(
        'flex items-start gap-3 p-4 rounded-lg border shadow-lg min-w-[300px] max-w-md animate-slide-in-right',
        config.colors
      )}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <span className="text-xl flex-shrink-0" aria-hidden="true">
        {config.icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm">{notification.message}</p>
        {notification.description && (
          <p className="text-sm mt-1 opacity-90">{notification.description}</p>
        )}
        {notification.action && (
          <button
            onClick={notification.action.onClick}
            className="text-sm font-medium underline mt-2 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-1 rounded"
          >
            {notification.action.label}
          </button>
        )}
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-1 rounded"
        aria-label="Close notification"
      >
        <svg
          className="w-5 h-5"
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
      </button>
    </div>
  );
}
