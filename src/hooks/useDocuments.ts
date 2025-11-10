/**
 * useDocuments hook
 * Fetches document list with automatic polling for pending documents
 */

import { useQuery } from '@tanstack/react-query';

import { DocumentsApiService } from '@/services/api/documents';
import { DocumentStatus } from '@/types';
import { POLLING } from '@/utils/constants';

export interface UseDocumentsOptions {
  status?: DocumentStatus;
  uploadedAfter?: string;
  uploadedBefore?: string;
  skipCount?: number;
  maxResultCount?: number;
  enabled?: boolean;
}

export function useDocuments(options: UseDocumentsOptions = {}) {
  const { enabled = true, ...params } = options;

  const query = useQuery({
    queryKey: ['documents', params],
    queryFn: () => DocumentsApiService.getDocumentList(params),
    enabled,
    staleTime: 30000, // Consider data fresh for 30 seconds
    refetchInterval: (query) => {
      // Auto-refresh every 5 seconds if there are pending/processing documents
      const hasPendingDocs = query.state.data?.items.some(
        (doc) => doc.status === DocumentStatus.Pending
      );
      return hasPendingDocs ? POLLING.STATUS_UPDATE : false;
    },
  });

  return {
    ...query,
    documents: query.data?.items ?? [],
    totalCount: query.data?.totalCount ?? 0,
  };
}
