/**
 * useRemoveManualTag hook
 * Mutation for removing manual tags from documents
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DocumentsApiService } from '@/services/api/documents';
import { useUIStore } from '@/state/useUIStore';
import type { DocumentDto } from '@/types';

interface RemoveManualTagParams {
  documentId: string;
  tagName: string;
}

export function useRemoveManualTag() {
  const queryClient = useQueryClient();
  const addNotification = useUIStore((state) => state.addNotification);

  return useMutation({
    mutationFn: ({ documentId, tagName }: RemoveManualTagParams) =>
      DocumentsApiService.removeManualTag(documentId, tagName),
    onMutate: async ({ documentId, tagName }: RemoveManualTagParams) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['document', documentId] });

      // Snapshot previous value
      const previousDocument = queryClient.getQueryData<DocumentDto>(['document', documentId]);

      // Optimistically update by removing the tag
      if (previousDocument) {
        queryClient.setQueryData<DocumentDto>(['document', documentId], {
          ...previousDocument,
          tags: previousDocument.tags.filter((tag) => tag.name !== tagName),
        });
      }

      return { previousDocument };
    },
    onSuccess: (_, { documentId }) => {
      // Invalidate queries to refetch
      queryClient.invalidateQueries({ queryKey: ['document', documentId] });
      queryClient.invalidateQueries({ queryKey: ['documents'] });

      addNotification({
        type: 'success',
        message: 'Tag removed',
        description: 'Tag has been removed from the document.',
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
        message: 'Failed to remove tag',
        description: error.message || 'An unexpected error occurred.',
        duration: 5000,
      });
    },
  });
}
