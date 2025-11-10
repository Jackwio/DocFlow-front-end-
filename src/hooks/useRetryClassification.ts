/**
 * useRetryClassification hook
 * Mutation for retrying failed document classifications
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { DocumentsApiService } from '@/services/api/documents';
import { useUIStore } from '@/state/useUIStore';
import type { DocumentDto } from '@/types';

export function useRetryClassification() {
  const queryClient = useQueryClient();
  const addNotification = useUIStore((state) => state.addNotification);

  return useMutation({
    mutationFn: (documentId: string) => DocumentsApiService.retryClassification(documentId),
    onSuccess: (document: DocumentDto) => {
      // Invalidate queries to refresh the list
      void queryClient.invalidateQueries({ queryKey: ['documents'] });

      // Show success notification
      addNotification({
        type: 'success',
        message: 'Classification retry initiated',
        description: `${document.fileName} is being reclassified.`,
        duration: 5000,
      });
    },
    onError: (error: Error) => {
      // Show error notification
      addNotification({
        type: 'error',
        message: 'Retry failed',
        description: error.message || 'Failed to retry classification.',
        duration: 7000,
      });
    },
  });
}
