/**
 * useDocumentSearch hook
 * Advanced document search with filtering and pagination
 */

import { useQuery } from '@tanstack/react-query';
import { DocumentsApiService } from '@/services/api/documents';
import type { DocumentSearchDto } from '@/types';

export interface UseDocumentSearchOptions extends DocumentSearchDto {
  enabled?: boolean;
}

export function useDocumentSearch(options: UseDocumentSearchOptions = {}) {
  const { enabled = true, ...criteria } = options;

  const query = useQuery({
    queryKey: ['documents', 'search', criteria],
    queryFn: () => DocumentsApiService.searchDocuments(criteria),
    enabled: enabled && Object.keys(criteria).length > 0, // Only search if criteria provided
    staleTime: 30000, // Consider data fresh for 30 seconds
  });

  return {
    ...query,
    documents: query.data?.items ?? [],
    totalCount: query.data?.totalCount ?? 0,
  };
}
