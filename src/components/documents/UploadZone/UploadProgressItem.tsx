/**
 * UploadProgressItem component
 * Displays individual file upload progress with status
 */

import { clsx } from 'clsx';

import type { FileUploadState } from './useFileUpload';

import { ProgressBar } from '@/components/ui/ProgressBar';
import { formatFileSize } from '@/utils/formatting';

export interface UploadProgressItemProps {
  id: string;
  file: File;
  progress: number;
  status: FileUploadState['status'];
  error?: string;
  onClear?: () => void;
}

export function UploadProgressItem({
  file,
  progress,
  status,
  error,
  onClear,
}: UploadProgressItemProps) {
  const getVariant = () => {
    if (status === 'success') return 'success';
    if (status === 'error') return 'error';
    return 'primary';
  };

  const getStatusIcon = () => {
    if (status === 'success') return '✓';
    if (status === 'error') return '✗';
    return null;
  };

  return (
    <div className="border border-neutral-200 rounded-lg p-4 bg-white shadow-sm">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-neutral-900 truncate">{file.name}</p>
          <p className="text-xs text-neutral-500">{formatFileSize(file.size)}</p>
        </div>
        {getStatusIcon() && (
          <span
            className={clsx(
              'text-lg ml-2',
              status === 'success' && 'text-status-classified-dark',
              status === 'error' && 'text-status-failed-dark'
            )}
            aria-label={status}
          >
            {getStatusIcon()}
          </span>
        )}
        {onClear && status !== 'uploading' && (
          <button
            onClick={onClear}
            className="ml-2 text-neutral-400 hover:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
            aria-label="Clear upload"
          >
            <svg
              className="w-4 h-4"
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
        )}
      </div>

      {status === 'uploading' && (
        <ProgressBar percentage={progress} variant={getVariant()} size="sm" showPercentage />
      )}

      {status === 'error' && error && (
        <p className="text-xs text-status-failed-dark mt-2">{error}</p>
      )}

      {status === 'success' && (
        <p className="text-xs text-status-classified-dark mt-2">Upload complete!</p>
      )}
    </div>
  );
}
