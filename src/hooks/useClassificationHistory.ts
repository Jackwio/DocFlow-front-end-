/**
 * useClassificationHistory hook
 * Fetches complete classification and routing history for a document
 */

import { useQuery } from '@tanstack/react-query';
import { DocumentsApiService } from '@/services/api/documents';

export interface UseClassificationHistoryOptions {
  documentId: string | null;
  enabled?: boolean;
}

export function useClassificationHistory({
  documentId,
  enabled = true,
}: UseClassificationHistoryOptions) {
  const query = useQuery({
    queryKey: ['documents', documentId, 'history'],
    queryFn: () => {
      if (!documentId) {
        throw new Error('Document ID is required');
      }
      return DocumentsApiService.getClassificationHistory(documentId);
    },
    enabled: enabled && !!documentId,
    staleTime: 60000, // History data is less likely to change, consider fresh for 60 seconds
  });

  return query;
}
