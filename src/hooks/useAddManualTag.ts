/**
 * useAddManualTag hook
 * Mutation for adding manual tags to documents
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DocumentsApiService } from '@/services/api/documents';
import { useUIStore } from '@/state/useUIStore';
import type { DocumentDto } from '@/types';

interface AddManualTagParams {
  documentId: string;
  tagName: string;
}

export function useAddManualTag() {
  const queryClient = useQueryClient();
  const addNotification = useUIStore((state) => state.addNotification);

  return useMutation({
    mutationFn: ({ documentId, tagName }: AddManualTagParams) =>
      DocumentsApiService.addManualTag(documentId, { tagName }),
    onMutate: async ({ documentId, tagName }: AddManualTagParams) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['document', documentId] });

      // Snapshot previous value
      const previousDocument = queryClient.getQueryData<DocumentDto>(['document', documentId]);

      // Optimistically update to the new value
      if (previousDocument) {
        queryClient.setQueryData<DocumentDto>(['document', documentId], {
          ...previousDocument,
          tags: [
            ...previousDocument.tags,
            {
              name: tagName,
              source: 1, // Manual
              addedAt: new Date().toISOString(),
              addedBy: 'current-user', // Will be replaced by server response
            },
          ],
        });
      }

      return { previousDocument };
    },
    onSuccess: (document: DocumentDto) => {
      // Invalidate queries to refetch with server data
      queryClient.invalidateQueries({ queryKey: ['document', document.id] });
      queryClient.invalidateQueries({ queryKey: ['documents'] });

      addNotification({
        type: 'success',
        message: 'Tag added',
        description: `Tag has been added to ${document.fileName}.`,
        duration: 3000,
      });
    },
    onError: (error: Error, { documentId }, context) => {
      // Rollback optimistic update
      if (context?.previousDocument) {
        queryClient.setQueryData(['document', documentId], context.previousDocument);
      }

      addNotification({
        type: 'error',
        message: 'Failed to add tag',
        description: error.message || 'An unexpected error occurred.',
        duration: 5000,
      });
    },
  });
}
