/**
 * Documents API client
 * Implements endpoints from documents-api.md specification
 */

import type { AxiosProgressEvent } from 'axios';

import { getApiClient } from './client';

import type {
  DocumentDto,
  DocumentListDto,
  DocumentSearchDto,
  DocumentStatus,
  PagedResultDto,
  AddManualTagDto,
} from '@/types';

/**
 * Upload progress callback
 */
export type UploadProgressCallback = (progress: {
  loaded: number;
  total: number;
  percentage: number;
}) => void;

/**
 * Documents API service
 */
export class DocumentsApiService {
  /**
   * Upload single document
   */
  static async uploadDocument(
    file: File,
    fileName?: string,
    description?: string,
    onProgress?: UploadProgressCallback
  ): Promise<DocumentDto> {
    const formData = new FormData();
    formData.append('File', file);
    if (fileName) formData.append('FileName', fileName);
    if (description) formData.append('Description', description);

    const response = await getApiClient().post<DocumentDto>('/api/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        if (progressEvent.total && onProgress) {
          const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress({
            loaded: progressEvent.loaded,
            total: progressEvent.total,
            percentage,
          });
        }
      },
    });

    return response.data;
  }

  /**
   * Upload multiple documents in batch
   */
  static async uploadBatch(files: File[]): Promise<DocumentDto[]> {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    const response = await getApiClient().post<DocumentDto[]>(
      '/api/documents/upload-batch',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  }

  /**
   * Get single document by ID
   */
  static async getDocument(id: string): Promise<DocumentDto> {
    const response = await getApiClient().get<DocumentDto>(`/api/documents/${id}`);
    return response.data;
  }

  /**
   * Get paginated list of documents
   */
  static async getDocumentList(params?: {
    status?: DocumentStatus;
    uploadedAfter?: string;
    uploadedBefore?: string;
    skipCount?: number;
    maxResultCount?: number;
  }): Promise<PagedResultDto<DocumentListDto>> {
    const response = await getApiClient().get('/api/documents', { params });

    // Normalize server response into our frontend DTO shape.
    // Some backends return `fileSizeBytes` and `creationTime` instead of `fileSize`/`uploadedAt`.
    interface ServerDocument {
      id: string;
      fileName: string;
      fileSize?: number;
      fileSizeBytes?: number;
      status?: number;
      documentStatus?: number;
      uploadedAt?: string;
      creationTime?: string;
      classifiedAt?: string;
      classifiedTime?: string;
      tags?: string[];
      tagNames?: string[];
    }

    interface ServerResponse {
      totalCount?: number;
      items?: ServerDocument[];
    }

    const data = response.data as ServerResponse;

    const items: DocumentListDto[] = (data.items || []).map((it) => ({
      id: it.id,
      fileName: it.fileName,
      // prefer `fileSize`, fall back to `fileSizeBytes` then 0
      fileSize: typeof it.fileSize === 'number' ? it.fileSize : typeof it.fileSizeBytes === 'number' ? it.fileSizeBytes : 0,
      // prefer `status`, fall back to `documentStatus` or 0 (Pending)
      status: typeof it.status === 'number' ? it.status : typeof it.documentStatus === 'number' ? it.documentStatus : 0,
      // prefer `uploadedAt`, fall back to `creationTime` or empty string
      uploadedAt: it.uploadedAt ?? it.creationTime ?? '',
      classifiedAt: it.classifiedAt ?? it.classifiedTime ?? undefined,
      tags: it.tags ?? it.tagNames ?? [],
    }));

    return {
      totalCount: typeof data.totalCount === 'number' ? data.totalCount : items.length,
      items,
    };
  }

  /**
   * Retry classification for failed document
   */
  static async retryClassification(id: string): Promise<DocumentDto> {
    const response = await getApiClient().post<DocumentDto>(`/api/documents/${id}/retry`);
    return response.data;
  }

  /**
   * Search documents with advanced criteria
   */
  static async searchDocuments(
    criteria: DocumentSearchDto
  ): Promise<PagedResultDto<DocumentListDto>> {
    const response = await getApiClient().post<PagedResultDto<DocumentListDto>>(
      '/api/documents/search',
      criteria
    );
    return response.data;
  }

  /**
   * Add manual tag to document
   */
  static async addManualTag(id: string, tagDto: AddManualTagDto): Promise<DocumentDto> {
    const response = await getApiClient().post<DocumentDto>(`/api/documents/${id}/tags`, tagDto);
    return response.data;
  }

  /**
   * Remove manual tag from document
   */
  static async removeManualTag(id: string, tagName: string): Promise<void> {
    await getApiClient().delete(`/api/documents/${id}/tags/${encodeURIComponent(tagName)}`);
  }

  /**
   * Get document classification and routing history
   */
  static async getClassificationHistory(id: string): Promise<DocumentDto> {
    const response = await getApiClient().get<DocumentDto>(`/api/documents/${id}/history`);
    return response.data;
  }
}

// Export as default
export default DocumentsApiService;
