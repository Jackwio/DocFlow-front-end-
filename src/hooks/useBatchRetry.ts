/**
 * useBatchRetry hook
 * Mutation for retrying multiple failed document classifications in batch
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DocumentsApiService } from '@/services/api/documents';
import { useUIStore } from '@/state/useUIStore';
import type { DocumentDto } from '@/types';

export interface BatchRetryResult {
  documentId: string;
  fileName: string;
  success: boolean;
  error?: string;
}

export interface BatchRetryProgress {
  total: number;
  completed: number;
  successful: number;
  failed: number;
  results: BatchRetryResult[];
}

export function useBatchRetry() {
  const queryClient = useQueryClient();
  const addNotification = useUIStore((state) => state.addNotification);

  return useMutation({
    mutationFn: async (documentIds: string[]): Promise<BatchRetryProgress> => {
      const progress: BatchRetryProgress = {
        total: documentIds.length,
        completed: 0,
        successful: 0,
        failed: 0,
        results: [],
      };

      // Process each document sequentially to avoid overwhelming the server
      for (const documentId of documentIds) {
        try {
          const document: DocumentDto = await DocumentsApiService.retryClassification(documentId);
          
          progress.results.push({
            documentId: document.id,
            fileName: document.fileName,
            success: true,
          });
          progress.successful++;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          
          // Try to get document name for better error reporting
          let fileName = documentId;
          try {
            const doc = await DocumentsApiService.getDocument(documentId);
            fileName = doc.fileName;
          } catch {
            // If we can't get the document, use the ID
          }
          
          progress.results.push({
            documentId,
            fileName,
            success: false,
            error: errorMessage,
          });
          progress.failed++;
        }
        
        progress.completed++;
      }

      return progress;
    },
    onSuccess: (progress: BatchRetryProgress) => {
      // Invalidate queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ['documents'] });

      // Show summary notification
      if (progress.failed === 0) {
        addNotification({
          type: 'success',
          message: 'Batch retry completed',
          description: `Successfully retried ${progress.successful} document${progress.successful !== 1 ? 's' : ''}.`,
          duration: 5000,
        });
      } else if (progress.successful === 0) {
        addNotification({
          type: 'error',
          message: 'Batch retry failed',
          description: `Failed to retry all ${progress.failed} document${progress.failed !== 1 ? 's' : ''}.`,
          duration: 7000,
        });
      } else {
        addNotification({
          type: 'warning',
          message: 'Batch retry completed with errors',
          description: `Successfully retried ${progress.successful} document${progress.successful !== 1 ? 's' : ''}, ${progress.failed} failed.`,
          duration: 7000,
        });
      }
    },
    onError: (error: Error) => {
      // Show error notification for unexpected failures
      addNotification({
        type: 'error',
        message: 'Batch retry failed',
        description: error.message || 'An unexpected error occurred during batch retry.',
        duration: 7000,
      });
    },
  });
}
