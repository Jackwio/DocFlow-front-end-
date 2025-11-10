/**
 * Drawer component
 * Collapsible sidebar drawer for tablet and mobile layouts
 * Provides slide-in navigation with backdrop overlay
 */

import { useEffect, type ReactNode } from 'react';
import { clsx } from 'clsx';
import { Button } from '@/components/ui/Button';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  side?: 'left' | 'right';
  className?: string;
}

export function Drawer({
  isOpen,
  onClose,
  title,
  children,
  side = 'left',
  className,
}: DrawerProps) {
  // Handle escape key to close drawer
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={clsx(
          'fixed inset-0 bg-black/50 z-40 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        className={clsx(
          'fixed inset-y-0 z-50 flex flex-col bg-white shadow-xl',
          'transition-transform duration-300 ease-in-out',
          'w-80 max-w-[85vw]',
          side === 'left' ? 'left-0' : 'right-0',
          isOpen
            ? 'translate-x-0'
            : side === 'left'
              ? '-translate-x-full'
              : 'translate-x-full',
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-label={title || 'Drawer'}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-neutral-200">
          {title && (
            <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>
          )}
          <button
            onClick={onClose}
            className={clsx(
              'p-2 rounded-md text-neutral-500 hover:text-neutral-700',
              'hover:bg-neutral-100 transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-primary-500',
              // Minimum 44px touch target for accessibility
              'min-w-[44px] min-h-[44px] flex items-center justify-center'
            )}
            aria-label="Close drawer"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4">{children}</div>
      </div>
    </>
  );
}

/**
 * DrawerTrigger component
 * Button to open the drawer, typically a hamburger menu icon
 */
export interface DrawerTriggerProps {
  onClick: () => void;
  label?: string;
  className?: string;
}

export function DrawerTrigger({
  onClick,
  label = 'Open menu',
  className,
}: DrawerTriggerProps) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={clsx(
        // Minimum 44px touch target for accessibility
        'min-w-[44px] min-h-[44px] p-2',
        className
      )}
      aria-label={label}
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </Button>
  );
}
