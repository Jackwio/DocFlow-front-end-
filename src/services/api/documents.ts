/**
 * Documents API client
 * Implements endpoints from documents-api.md specification
 */

import type { AxiosProgressEvent } from 'axios';
import type {
  DocumentDto,
  DocumentListDto,
  DocumentSearchDto,
  DocumentStatus,
  PagedResultDto,
  AddManualTagDto,
} from '@/types';
import { getApiClient } from './client';

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
    const response = await getApiClient().get<PagedResultDto<DocumentListDto>>('/api/documents', {
      params,
    });
    return response.data;
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
