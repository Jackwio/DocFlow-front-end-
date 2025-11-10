/**
 * useDocumentUpload hook
 * TanStack Query mutation for uploading documents with progress tracking
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DocumentsApiService, type UploadProgressCallback } from '@/services/api/documents';
import { useUIStore } from '@/state/useUIStore';
import type { DocumentDto } from '@/types';

interface UploadDocumentParams {
  file: File;
  fileName?: string;
  description?: string;
  onProgress?: UploadProgressCallback;
}

export function useDocumentUpload() {
  const queryClient = useQueryClient();
  const addNotification = useUIStore((state) => state.addNotification);

  return useMutation({
    mutationFn: ({ file, fileName, description, onProgress }: UploadDocumentParams) =>
      DocumentsApiService.uploadDocument(file, fileName, description, onProgress),
    onSuccess: (document: DocumentDto) => {
      // Invalidate document list query to refetch
      queryClient.invalidateQueries({ queryKey: ['documents'] });

      // Show success notification
      addNotification({
        type: 'success',
        message: 'Upload successful',
        description: `${document.fileName} has been uploaded and is being classified.`,
        duration: 5000,
      });
    },
    onError: (error: Error) => {
      // Show error notification
      addNotification({
        type: 'error',
        message: 'Upload failed',
        description: error.message || 'An unexpected error occurred during upload.',
        duration: 7000,
      });
    },
  });
}
