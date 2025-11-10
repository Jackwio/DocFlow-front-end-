/**
 * Documents API Client Contract
 * 
 * TypeScript client implementation for the Documents API
 * Based on documents-api.md specification
 * 
 * @see documents-api.md for full API documentation
 */

import type {
  DocumentDto,
  DocumentListDto,
  DocumentSearchDto,
  DocumentStatus,
  PagedResultDto,
  AddManualTagDto
} from '../data-model';

/**
 * Documents API endpoints configuration
 */
export const API_ENDPOINTS = {
  UPLOAD_SINGLE: '/api/documents/upload',
  UPLOAD_BATCH: '/api/documents/upload-batch',
  GET_DOCUMENT: '/api/documents/:id',
  GET_DOCUMENTS: '/api/documents',
  RETRY_CLASSIFICATION: '/api/documents/:id/retry',
  SEARCH_DOCUMENTS: '/api/documents/search',
  ADD_TAG: '/api/documents/:id/tags',
  REMOVE_TAG: '/api/documents/:id/tags/:tagName',
  GET_HISTORY: '/api/documents/:id/history'
} as const;

/**
 * Documents API client interface
 */
export interface IDocumentsApiClient {
  /**
   * Upload single document
   * @param file File to upload
   * @param fileName Optional custom file name
   * @param description Optional document description
   * @returns Uploaded document details
   */
  uploadDocument(
    file: File,
    fileName?: string,
    description?: string
  ): Promise<DocumentDto>;

  /**
   * Upload multiple documents in batch
   * @param files Array of files to upload
   * @returns Array of uploaded document details
   */
  uploadBatch(files: File[]): Promise<DocumentDto[]>;

  /**
   * Get single document by ID
   * @param id Document UUID
   * @returns Full document details
   */
  getDocument(id: string): Promise<DocumentDto>;

  /**
   * Get paginated list of documents with optional filters
   * @param params Query parameters for filtering and pagination
   * @returns Paginated document list
   */
  getDocumentList(params?: {
    status?: DocumentStatus;
    uploadedAfter?: string;
    uploadedBefore?: string;
    skipCount?: number;
    maxResultCount?: number;
  }): Promise<PagedResultDto<DocumentListDto>>;

  /**
   * Retry classification for failed document
   * @param id Document UUID
   * @returns Updated document with pending status
   */
  retryClassification(id: string): Promise<DocumentDto>;

  /**
   * Search documents with advanced criteria
   * @param criteria Search parameters
   * @returns Paginated search results
   */
  searchDocuments(
    criteria: DocumentSearchDto
  ): Promise<PagedResultDto<DocumentListDto>>;

  /**
   * Add manual tag to document
   * @param id Document UUID
   * @param tagName Tag name to add
   * @returns Updated document with new tag
   */
  addManualTag(id: string, tagName: string): Promise<DocumentDto>;

  /**
   * Remove manual tag from document
   * @param id Document UUID
   * @param tagName Tag name to remove
   * @returns void (204 No Content)
   */
  removeManualTag(id: string, tagName: string): Promise<void>;

  /**
   * Get document classification and routing history
   * @param id Document UUID
   * @returns Document with full audit trail
   */
  getClassificationHistory(id: string): Promise<DocumentDto>;
}

/**
 * Upload progress callback
 */
export type UploadProgressCallback = (progress: {
  loaded: number;
  total: number;
  percentage: number;
}) => void;

/**
 * API client configuration
 */
export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
  getToken: () => string | null;
  onUnauthorized?: () => void;
  onError?: (error: Error) => void;
}

/**
 * HTTP request options
 */
export interface RequestOptions {
  signal?: AbortSignal;
  onUploadProgress?: UploadProgressCallback;
}
