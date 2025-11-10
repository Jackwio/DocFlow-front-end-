/**
 * useFileUpload hook
 * Manages file selection, validation, and upload progress tracking
 */

import { useState, useCallback } from 'react';

import { useDocumentUpload } from '@/hooks/useDocumentUpload';
import { FILE_SIZE, ACCEPTED_MIME_TYPES } from '@/utils/constants';

export interface FileUploadState {
  file: File;
  progress: number;
  status: 'idle' | 'uploading' | 'success' | 'error';
  error?: string;
}

export function useFileUpload() {
  const [uploads, setUploads] = useState<Map<string, FileUploadState>>(new Map());
  const uploadMutation = useDocumentUpload();

  const validateFile = useCallback((file: File): string | null => {
    // Check file type
    if (!ACCEPTED_MIME_TYPES.includes(file.type as typeof ACCEPTED_MIME_TYPES[number])) {
      return `File type ${file.type} is not supported. Only PDF files are allowed.`;
    }

    // Check file size
    if (file.size > FILE_SIZE.MAX_UPLOAD) {
      return `File size ${(file.size / 1024 / 1024).toFixed(2)} MB exceeds maximum allowed size of ${FILE_SIZE.MAX_UPLOAD / 1024 / 1024} MB.`;
    }

    return null;
  }, []);

  const uploadFile = useCallback(
    async (file: File) => {
      const fileId = `${file.name}-${file.size}-${file.lastModified}`;

      // Validate file
      const validationError = validateFile(file);
      if (validationError) {
        setUploads((prev) =>
          new Map(prev).set(fileId, {
            file,
            progress: 0,
            status: 'error',
            error: validationError,
          })
        );
        return;
      }

      // Set initial upload state
      setUploads((prev) =>
        new Map(prev).set(fileId, {
          file,
          progress: 0,
          status: 'uploading',
        })
      );

      try {
        await uploadMutation.mutateAsync({
          file,
          onProgress: ({ percentage }) => {
            setUploads((prev) => {
              const current = prev.get(fileId);
              if (!current) return prev;
              return new Map(prev).set(fileId, {
                ...current,
                progress: percentage,
              });
            });
          },
        });

        // Mark as success
        setUploads((prev) => {
          const current = prev.get(fileId);
          if (!current) return prev;
          return new Map(prev).set(fileId, {
            ...current,
            progress: 100,
            status: 'success',
          });
        });

        // Remove from list after 2 seconds
        setTimeout(() => {
          setUploads((prev) => {
            const newMap = new Map(prev);
            newMap.delete(fileId);
            return newMap;
          });
        }, 2000);
      } catch (error) {
        setUploads((prev) => {
          const current = prev.get(fileId);
          if (!current) return prev;
          return new Map(prev).set(fileId, {
            ...current,
            status: 'error',
            error: error instanceof Error ? error.message : 'Upload failed',
          });
        });
      }
    },
    [uploadMutation, validateFile]
  );

  const uploadFiles = useCallback(
    async (files: File[]) => {
      // Upload files sequentially to avoid overwhelming the server
      for (const file of files) {
        await uploadFile(file);
      }
    },
    [uploadFile]
  );

  const clearUpload = useCallback((fileId: string) => {
    setUploads((prev) => {
      const newMap = new Map(prev);
      newMap.delete(fileId);
      return newMap;
    });
  }, []);

  return {
    uploads: Array.from(uploads.entries()).map(([id, state]) => ({ id, ...state })),
    uploadFile,
    uploadFiles,
    clearUpload,
    isUploading: uploadMutation.isPending,
  };
}
