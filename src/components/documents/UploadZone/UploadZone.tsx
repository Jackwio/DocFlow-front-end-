/**
 * UploadZone component
 * Drag-and-drop file upload zone with visual feedback
 */

import { useRef, useState } from 'react';
import { clsx } from 'clsx';
import { Button } from '@/components/ui/Button';
import { useFileUpload } from './useFileUpload';
import { UploadProgressItem } from './UploadProgressItem';
import { FILE_SIZE, ACCEPTED_MIME_TYPES } from '@/utils/constants';

export interface UploadZoneProps {
  onFilesSelected?: (files: File[]) => void;
  multiple?: boolean;
  maxFileSize?: number;
  acceptedMimeTypes?: readonly string[];
  disabled?: boolean;
  className?: string;
}

export function UploadZone({
  onFilesSelected,
  multiple = true,
  maxFileSize = FILE_SIZE.MAX_UPLOAD,
  acceptedMimeTypes = ACCEPTED_MIME_TYPES,
  disabled = false,
  className,
}: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploads, uploadFiles, clearUpload } = useFileUpload();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    handleFiles(files);
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  };

  const handleFiles = (files: File[]) => {
    if (files.length === 0) return;

    const validFiles = multiple ? files : [files[0]];
    onFilesSelected?.(validFiles);
    uploadFiles(validFiles);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={clsx('space-y-4', className)}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={clsx(
          'border-2 border-dashed rounded-lg p-8 transition-all duration-150',
          'flex flex-col items-center justify-center gap-4 text-center',
          'min-h-[200px] cursor-pointer',
          !disabled && 'hover:border-primary-500 hover:bg-primary-50',
          isDragOver && !disabled && 'border-primary-600 bg-primary-100 scale-[1.02]',
          disabled && 'opacity-50 cursor-not-allowed bg-neutral-50',
          !isDragOver && !disabled && 'border-neutral-300 bg-neutral-50'
        )}
        onClick={!disabled ? handleBrowseClick : undefined}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            handleBrowseClick();
          }
        }}
        aria-label="Upload documents"
        aria-disabled={disabled}
      >
        <svg
          className={clsx(
            'w-12 h-12 transition-colors',
            isDragOver ? 'text-primary-600' : 'text-neutral-400'
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>

        <div>
          <p className="text-base font-medium text-neutral-900">
            {isDragOver ? 'Drop files here' : 'Drag and drop files here'}
          </p>
          <p className="text-sm text-neutral-500 mt-1">or</p>
          <Button
            variant="primary"
            size="md"
            className="mt-2"
            disabled={disabled}
            onClick={(e) => {
              e.stopPropagation();
              handleBrowseClick();
            }}
          >
            Browse Files
          </Button>
        </div>

        <p className="text-xs text-neutral-500">
          Accepted: {acceptedMimeTypes.join(', ')} • Max size:{' '}
          {(maxFileSize / 1024 / 1024).toFixed(0)} MB
        </p>

        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={acceptedMimeTypes.join(',')}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled}
          aria-hidden="true"
        />
      </div>

      {uploads.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-neutral-700">
            Uploading {uploads.length} file{uploads.length > 1 ? 's' : ''}
          </h3>
          {uploads.map((upload) => (
            <UploadProgressItem
              key={upload.id}
              {...upload}
              onClear={() => clearUpload(upload.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
