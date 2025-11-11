// API configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://localhost:44347';

// ========== Enums ==========

export enum DocumentStatus {
  Pending = 0,
  Classified = 1,
  Failed = 2,
  Routed = 3
}

export enum TagSource {
  Automatic = 0,
  Manual = 1
}

// ========== API Response Models ==========

export interface DocumentDto {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  description?: string;
  status: DocumentStatus;
  uploadedAt: string;
  classifiedAt?: string;
  blobUri: string;
  classificationResults: ClassificationResultDto[];
  tags: TagDto[];
  routingHistory: RoutingHistoryDto[];
}

export interface DocumentListDto {
  id: string;
  fileName: string;
  fileSize: number;
  status: DocumentStatus;
  creationTime: string;
  classifiedAt?: string;
  tags: string[];
}

export interface ClassificationResultDto {
  ruleId: string;
  ruleName: string;
  tagName: string;
  confidenceScore: number;
  appliedAt: string;
}

export interface TagDto {
  name: string;
  source: TagSource;
  addedAt: string;
  addedBy?: string;
}

export interface RoutingHistoryDto {
  fromQueueId?: string;
  fromQueueName?: string;
  toQueueId: string;
  toQueueName: string;
  routedAt: string;
  routedBy: string;
}

export interface PagedResultDto<T> {
  totalCount: number;
  items: T[];
}

// ========== API Request Models ==========

export interface DocumentSearchDto {
  fileName?: string;
  status?: DocumentStatus;
  tags?: string[];
  uploadedAfter?: string;
  uploadedBefore?: string;
  minFileSize?: number;
  maxFileSize?: number;
  skipCount?: number;
  maxResultCount?: number;
}

export interface AddManualTagDto {
  tagName: string;
}

// ========== Error Response ==========

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

// ========== API Client Service ==========

export class DocumentsApiClient {
  private baseUrl: string;
  private getToken: () => string | null;

  constructor(baseUrl: string = API_BASE_URL, getToken: () => string | null = () => null) {
    this.baseUrl = baseUrl;
    this.getToken = getToken;
  }

  private getHeaders(includeContentType: boolean = true): HeadersInit {
    const headers: HeadersInit = {};
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (includeContentType) {
      headers['Content-Type'] = 'application/json';
    }
    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        error: {
          code: 'UnknownError',
          message: `HTTP ${response.status}: ${response.statusText}`,
        },
      }));
      throw new Error(error.error.message);
    }
    return response.json();
  }

  /**
   * Upload a single document
   */
  async uploadDocument(
    file: File,
    fileName?: string,
    description?: string,
    onProgress?: (progress: number) => void
  ): Promise<DocumentDto> {
    const formData = new FormData();
    formData.append('File', file);
    if (fileName) formData.append('FileName', fileName);
    if (description) formData.append('Description', description);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      if (onProgress) {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100;
            onProgress(percentComplete);
          }
        });
      }

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          try {
            resolve(JSON.parse(xhr.responseText));
          } catch (error) {
            reject(new Error('Invalid JSON response'));
          }
        } else {
          try {
            const error: ApiError = JSON.parse(xhr.responseText);
            reject(new Error(error.error.message));
          } catch {
            reject(new Error(`Upload failed: ${xhr.status}`));
          }
        }
      });

      xhr.addEventListener('error', () => reject(new Error('Upload failed')));

      xhr.open('POST', `${this.baseUrl}/api/documents/upload`);
      const token = this.getToken();
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }
      xhr.send(formData);
    });
  }

  /**
   * Upload multiple documents in batch
   */
  async uploadBatch(files: File[]): Promise<DocumentDto[]> {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    const response = await fetch(`${this.baseUrl}/api/documents/upload-batch`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: formData,
    });

    return this.handleResponse<DocumentDto[]>(response);
  }

  /**
   * Get a single document by ID
   */
  async getDocument(id: string): Promise<DocumentDto> {
    const response = await fetch(`${this.baseUrl}/api/documents/${id}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse<DocumentDto>(response);
  }

  /**
   * Get document list with optional filtering and pagination
   */
  async getDocumentList(
    status?: DocumentStatus,
    uploadedAfter?: string,
    uploadedBefore?: string,
    skipCount: number = 0,
    maxResultCount: number = 10
  ): Promise<PagedResultDto<DocumentListDto>> {
    const params = new URLSearchParams();
    if (status !== undefined) params.append('status', status.toString());
    if (uploadedAfter) params.append('uploadedAfter', uploadedAfter);
    if (uploadedBefore) params.append('uploadedBefore', uploadedBefore);
    params.append('skipCount', skipCount.toString());
    params.append('maxResultCount', maxResultCount.toString());

    const response = await fetch(`${this.baseUrl}/api/documents?${params}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse<PagedResultDto<DocumentListDto>>(response);
  }

  /**
   * Retry classification for a failed document
   */
  async retryClassification(id: string): Promise<DocumentDto> {
    const response = await fetch(`${this.baseUrl}/api/documents/${id}/retry`, {
      method: 'POST',
      headers: this.getHeaders(),
    });

    return this.handleResponse<DocumentDto>(response);
  }

  /**
   * Search documents with advanced criteria
   */
  async searchDocuments(criteria: DocumentSearchDto): Promise<PagedResultDto<DocumentListDto>> {
    const response = await fetch(`${this.baseUrl}/api/documents/search`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(criteria),
    });

    return this.handleResponse<PagedResultDto<DocumentListDto>>(response);
  }

  /**
   * Add a manual tag to a document
   */
  async addManualTag(id: string, tagName: string): Promise<DocumentDto> {
    const response = await fetch(`${this.baseUrl}/api/documents/${id}/tags`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ tagName }),
    });

    return this.handleResponse<DocumentDto>(response);
  }

  /**
   * Remove a manual tag from a document
   */
  async removeManualTag(id: string, tagName: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/documents/${id}/tags/${tagName}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        error: {
          code: 'UnknownError',
          message: `HTTP ${response.status}: ${response.statusText}`,
        },
      }));
      throw new Error(error.error.message);
    }
  }

  /**
   * Get classification history for a document
   */
  async getClassificationHistory(id: string): Promise<DocumentDto> {
    const response = await fetch(`${this.baseUrl}/api/documents/${id}/history`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse<DocumentDto>(response);
  }

  /**
   * View document in browser
   * Returns blob URL that can be opened in a new tab
   */
  async viewDocument(id: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/api/documents/${id}/view`, {
      method: 'GET',
      headers: this.getHeaders(false),
    });

    if (!response.ok) {
      throw new Error(`Failed to view document: ${response.status} ${response.statusText}`);
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  }

  /**
   * Download document file
   * Returns blob URL and filename for download
   */
  async downloadDocument(id: string): Promise<{ url: string; filename: string }> {
    const response = await fetch(`${this.baseUrl}/api/documents/${id}/download`, {
      method: 'GET',
      headers: this.getHeaders(false),
    });

    if (!response.ok) {
      throw new Error(`Failed to download document: ${response.status} ${response.statusText}`);
    }

    // Extract filename from Content-Disposition header if available
    const contentDisposition = response.headers.get('Content-Disposition');
    let filename = 'document';
    if (contentDisposition) {
      const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
      if (matches != null && matches[1]) {
        filename = matches[1].replace(/['"]/g, '');
      }
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    
    return { url, filename };
  }
}

// Export a default instance
export const documentsApi = new DocumentsApiClient();

// Helper function to get status display name
export function getStatusDisplayName(status: DocumentStatus): string {
  switch (status) {
    case DocumentStatus.Pending:
      return 'Pending';
    case DocumentStatus.Classified:
      return 'Classified';
    case DocumentStatus.Failed:
      return 'Failed';
    case DocumentStatus.Routed:
      return 'Routed';
    default:
      return 'Unknown';
  }
}

// Helper function to format file size
export function formatFileSize(bytes?: number | null): string {
  if (bytes == null || typeof bytes !== 'number' || isNaN(bytes)) return '0 B';
  const abs = Math.abs(bytes);
  if (abs < 1024) return bytes + ' B';
  if (abs < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
  return (bytes / 1048576).toFixed(2) + ' MB';
}
