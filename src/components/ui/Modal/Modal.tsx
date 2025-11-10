/**
 * Simple Modal/Dialog component for confirmations
 * Basic implementation for batch operations
 */

import { useEffect, type ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { clsx } from 'clsx';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'destructive';
  isConfirming?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  children,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'primary',
  isConfirming = false,
}: ModalProps) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isConfirming) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, isConfirming, onClose]);

  // Prevent body scroll when modal is open
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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-900 bg-opacity-50 transition-opacity animate-fade-in"
        onClick={!isConfirming ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Modal content */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={clsx(
            'relative bg-white rounded-lg shadow-xl max-w-md w-full',
            'transform transition-all animate-fade-in'
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 pt-6 pb-4">
            <h3
              id="modal-title"
              className="text-lg font-semibold text-neutral-900"
            >
              {title}
            </h3>
            {description && (
              <p className="mt-2 text-sm text-neutral-600">{description}</p>
            )}
          </div>

          {/* Body */}
          {children && <div className="px-6 pb-4">{children}</div>}

          {/* Footer */}
          <div className="px-6 pb-6 flex items-center justify-end gap-3">
            <Button
              variant="ghost"
              onClick={onClose}
              disabled={isConfirming}
            >
              {cancelText}
            </Button>
            {onConfirm && (
              <Button
                variant={confirmVariant}
                onClick={onConfirm}
                isLoading={isConfirming}
                disabled={isConfirming}
              >
                {confirmText}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
