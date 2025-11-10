/**
 * useDocumentDetail hook
 * Fetches single document details by ID with classification history
 */

import { useQuery } from '@tanstack/react-query';
import { DocumentsApiService } from '@/services/api/documents';

export interface UseDocumentDetailOptions {
  documentId: string | null;
  enabled?: boolean;
  includeHistory?: boolean;
}

export function useDocumentDetail({ documentId, enabled = true, includeHistory = false }: UseDocumentDetailOptions) {
  const query = useQuery({
    queryKey: ['document', documentId, { includeHistory }],
    queryFn: () => {
      if (!documentId) {
        throw new Error('Document ID is required');
      }
      
      // Fetch full history if requested, otherwise just document details
      return includeHistory
        ? DocumentsApiService.getClassificationHistory(documentId)
        : DocumentsApiService.getDocument(documentId);
    },
    enabled: enabled && !!documentId,
    staleTime: 60000, // Consider data fresh for 1 minute
  });

  return {
    ...query,
    document: query.data ?? null,
  };
}
