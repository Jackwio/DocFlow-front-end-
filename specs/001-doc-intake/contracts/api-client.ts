/**
 * Axios-based API Client Implementation
 * 
 * Implements IDocumentsApiClient interface using Axios
 * Includes interceptors for authentication, error handling, and retry logic
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import type {
  IDocumentsApiClient,
  ApiClientConfig,
  RequestOptions,
  API_ENDPOINTS
} from './documents-api';
import type {
  DocumentDto,
  DocumentListDto,
  DocumentSearchDto,
  DocumentStatus,
  PagedResultDto,
  ApiErrorResponse,
  ApiError
} from '../data-model';

/**
 * Axios-based Documents API client
 */
export class DocumentsApiClient implements IDocumentsApiClient {
  private axiosInstance: AxiosInstance;
  private config: ApiClientConfig;

  constructor(config: ApiClientConfig) {
    this.config = config;
    this.axiosInstance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers
      }
    });

    this.setupInterceptors();
  }

  /**
   * Configure request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor: Add auth token
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = this.config.getToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor: Handle errors
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<ApiErrorResponse>) => {
        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
          this.config.onUnauthorized?.();
        }

        // Transform API error to application error
        if (error.response?.data?.error) {
          const apiError = new Error(error.response.data.error.message) as ApiError;
          apiError.code = error.response.data.error.code;
          apiError.details = error.response.data.error.details;
          
          this.config.onError?.(apiError);
          return Promise.reject(apiError);
        }

        // Network or other errors
        this.config.onError?.(error);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Upload single document
   */
  async uploadDocument(
    file: File,
    fileName?: string,
    description?: string
  ): Promise<DocumentDto> {
    const formData = new FormData();
    formData.append('File', file);
    if (fileName) formData.append('FileName', fileName);
    if (description) formData.append('Description', description);

    const response = await this.axiosInstance.post<DocumentDto>(
      '/api/documents/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    return response.data;
  }

  /**
   * Upload multiple documents in batch
   */
  async uploadBatch(files: File[]): Promise<DocumentDto[]> {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    const response = await this.axiosInstance.post<DocumentDto[]>(
      '/api/documents/upload-batch',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    return response.data;
  }

  /**
   * Get single document by ID
   */
  async getDocument(id: string): Promise<DocumentDto> {
    const response = await this.axiosInstance.get<DocumentDto>(
      `/api/documents/${id}`
    );
    return response.data;
  }

  /**
   * Get paginated list of documents
   */
  async getDocumentList(params?: {
    status?: DocumentStatus;
    uploadedAfter?: string;
    uploadedBefore?: string;
    skipCount?: number;
    maxResultCount?: number;
  }): Promise<PagedResultDto<DocumentListDto>> {
    const response = await this.axiosInstance.get<PagedResultDto<DocumentListDto>>(
      '/api/documents',
      { params }
    );
    return response.data;
  }

  /**
   * Retry classification for failed document
   */
  async retryClassification(id: string): Promise<DocumentDto> {
    const response = await this.axiosInstance.post<DocumentDto>(
      `/api/documents/${id}/retry`
    );
    return response.data;
  }

  /**
   * Search documents with advanced criteria
   */
  async searchDocuments(
    criteria: DocumentSearchDto
  ): Promise<PagedResultDto<DocumentListDto>> {
    const response = await this.axiosInstance.post<PagedResultDto<DocumentListDto>>(
      '/api/documents/search',
      criteria
    );
    return response.data;
  }

  /**
   * Add manual tag to document
   */
  async addManualTag(id: string, tagName: string): Promise<DocumentDto> {
    const response = await this.axiosInstance.post<DocumentDto>(
      `/api/documents/${id}/tags`,
      { tagName }
    );
    return response.data;
  }

  /**
   * Remove manual tag from document
   */
  async removeManualTag(id: string, tagName: string): Promise<void> {
    await this.axiosInstance.delete(`/api/documents/${id}/tags/${tagName}`);
  }

  /**
   * Get document classification and routing history
   */
  async getClassificationHistory(id: string): Promise<DocumentDto> {
    const response = await this.axiosInstance.get<DocumentDto>(
      `/api/documents/${id}/history`
    );
    return response.data;
  }
}

/**
 * Factory function to create API client instance
 */
export function createDocumentsApiClient(config: ApiClientConfig): IDocumentsApiClient {
  return new DocumentsApiClient(config);
}

/**
 * Example usage:
 * 
 * ```typescript
 * const apiClient = createDocumentsApiClient({
 *   baseURL: 'https://api.docflow.com',
 *   getToken: () => localStorage.getItem('auth_token'),
 *   onUnauthorized: () => {
 *     // Redirect to login
 *     window.location.href = '/login';
 *   },
 *   onError: (error) => {
 *     console.error('API Error:', error);
 *   }
 * });
 * 
 * // Upload document
 * const document = await apiClient.uploadDocument(file, 'invoice.pdf', 'Q1 Invoice');
 * 
 * // Search documents
 * const results = await apiClient.searchDocuments({
 *   fileName: 'invoice',
 *   status: DocumentStatus.Classified,
 *   skipCount: 0,
 *   maxResultCount: 20
 * });
 * ```
 */
