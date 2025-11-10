/**
 * useBatchRetry hook
 * Mutation for retrying classification of multiple documents
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DocumentsApiService } from '@/services/api/documents';
import { useUIStore } from '@/state/useUIStore';
import type { DocumentDto } from '@/types';

export interface BatchRetryResult {
  successful: string[];
  failed: Array<{ id: string; error: string }>;
}

export function useBatchRetry() {
  const queryClient = useQueryClient();
  const addNotification = useUIStore((state) => state.addNotification);

  return useMutation({
    mutationFn: async (documentIds: string[]): Promise<BatchRetryResult> => {
      const results: BatchRetryResult = {
        successful: [],
        failed: [],
      };

      // Process all retries in parallel
      const promises = documentIds.map(async (id) => {
        try {
          await DocumentsApiService.retryClassification(id);
          results.successful.push(id);
        } catch (error) {
          results.failed.push({
            id,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      });

      await Promise.all(promises);
      return results;
    },
    onSuccess: (results: BatchRetryResult) => {
      // Invalidate queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ['documents'] });

      // Show success notification
      if (results.successful.length > 0) {
        addNotification({
          type: 'success',
          message: 'Batch retry initiated',
          description: `${results.successful.length} document${
            results.successful.length === 1 ? '' : 's'
          } ${results.successful.length === 1 ? 'is' : 'are'} being reclassified.`,
          duration: 5000,
        });
      }

      // Show error notification if any failed
      if (results.failed.length > 0) {
        addNotification({
          type: 'error',
          message: 'Some retries failed',
          description: `${results.failed.length} document${
            results.failed.length === 1 ? '' : 's'
          } failed to retry.`,
          duration: 7000,
        });
      }
    },
    onError: (error: Error) => {
      // Show error notification
      addNotification({
        type: 'error',
        message: 'Batch retry failed',
        description: error.message || 'Failed to retry classifications.',
        duration: 7000,
      });
    },
  });
}
