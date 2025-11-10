/**
 * Document domain types
 * Based on Documents API specification
 */

/**
 * Document status enum matching API DocumentStatus
 */
export enum DocumentStatus {
  Pending = 0,
  Classified = 1,
  Failed = 2,
  Routed = 3,
}

/**
 * Tag source enum indicating how a tag was applied
 */
export enum TagSource {
  Automatic = 0,
  Manual = 1,
}

/**
 * Full document data transfer object from API
 */
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

/**
 * Simplified document DTO for list views
 */
export interface DocumentListDto {
  id: string;
  fileName: string;
  fileSize: number;
  status: DocumentStatus;
  uploadedAt: string;
  classifiedAt?: string;
  tags: string[];
}

/**
 * Classification result from rule engine
 */
export interface ClassificationResultDto {
  ruleId: string;
  ruleName: string;
  tagName: string;
  confidenceScore: number;
  appliedAt: string;
}

/**
 * Document tag (automatic or manual)
 */
export interface TagDto {
  name: string;
  source: TagSource;
  addedAt: string;
  addedBy?: string;
}

/**
 * Document routing history entry
 */
export interface RoutingHistoryDto {
  fromQueueId?: string;
  fromQueueName?: string;
  toQueueId: string;
  toQueueName: string;
  routedAt: string;
  routedBy: string;
}

/**
 * Document upload request payload
 */
export interface UploadDocumentRequest {
  file: File;
  fileName?: string;
  description?: string;
}

/**
 * Document search criteria
 */
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

/**
 * Simplified filter state for UI
 */
export interface DocumentFilters {
  searchQuery?: string;
  status?: DocumentStatus | null;
  tags?: string[];
  dateRange?: {
    start: Date | null;
    end: Date | null;
  };
  pageSize: number;
  pageIndex: number;
}

/**
 * Add manual tag request
 */
export interface AddManualTagDto {
  tagName: string;
}
