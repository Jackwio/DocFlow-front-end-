# Phase 1: Data Model & TypeScript Interfaces

**Feature**: Document Intake + Classification Frontend Interface  
**Date**: 2025-11-10  
**Status**: Complete

## Overview

This document defines all TypeScript interfaces, types, and enums for the Document Intake + Classification frontend. All types are derived from the feature specification requirements and the Documents API schema defined in `documents-api.md`.

---

## 1. Core Domain Types

### Document Entities

```typescript
/**
 * Document status enum matching API DocumentStatus
 */
export enum DocumentStatus {
  Pending = 0,
  Classified = 1,
  Failed = 2,
  Routed = 3
}

/**
 * Tag source enum indicating how a tag was applied
 */
export enum TagSource {
  Automatic = 0,
  Manual = 1
}

/**
 * Full document data transfer object from API
 */
export interface DocumentDto {
  id: string;                           // UUID
  fileName: string;
  fileSize: number;                     // Bytes
  mimeType: string;                     // e.g., "application/pdf"
  description?: string;
  status: DocumentStatus;
  uploadedAt: string;                   // ISO 8601 date string
  classifiedAt?: string;                // ISO 8601 date string
  blobUri: string;                      // Azure Blob Storage URI
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
  tags: string[];                       // Simplified to tag names only
}

/**
 * Classification result from rule engine
 */
export interface ClassificationResultDto {
  ruleId: string;
  ruleName: string;
  tagName: string;
  confidenceScore: number;              // 0-1 range
  appliedAt: string;                    // ISO 8601 date string
}

/**
 * Document tag (automatic or manual)
 */
export interface TagDto {
  name: string;
  source: TagSource;
  addedAt: string;                      // ISO 8601 date string
  addedBy?: string;                     // Only present for manual tags (email/username)
}

/**
 * Document routing history entry
 */
export interface RoutingHistoryDto {
  fromQueueId?: string;                 // Null for initial routing
  fromQueueName?: string;
  toQueueId: string;
  toQueueName: string;
  routedAt: string;                     // ISO 8601 date string
  routedBy: string;                     // "system" or user email
}

/**
 * Paginated API response wrapper
 */
export interface PagedResultDto<T> {
  totalCount: number;
  items: T[];
}
```

---

## 2. API Request Types

### Upload

```typescript
/**
 * Document upload request payload (FormData)
 */
export interface UploadDocumentRequest {
  file: File;
  fileName?: string;                    // Optional override
  description?: string;
}

/**
 * Batch upload request (FormData with multiple files)
 */
export interface UploadBatchRequest {
  files: File[];
}
```

### Search & Filter

```typescript
/**
 * Document search criteria
 */
export interface DocumentSearchDto {
  fileName?: string;                    // Partial match
  status?: DocumentStatus;              // Exact match
  tags?: string[];                      // OR condition
  uploadedAfter?: string;               // ISO 8601
  uploadedBefore?: string;              // ISO 8601
  minFileSize?: number;                 // Bytes
  maxFileSize?: number;                 // Bytes
  skipCount?: number;                   // Pagination offset (default: 0)
  maxResultCount?: number;              // Page size (default: 10)
}

/**
 * Simplified filter state for UI
 */
export interface DocumentFilters {
  searchQuery?: string;                 // File name search
  status?: DocumentStatus | null;       // Single status filter
  tags?: string[];                      // Multiple tag filters
  dateRange?: {
    start: Date | null;
    end: Date | null;
  };
  pageSize: number;                     // Items per page
  pageIndex: number;                    // Current page (0-based)
}
```

### Tag Management

```typescript
/**
 * Request to add manual tag
 */
export interface AddManualTagDto {
  tagName: string;
}

/**
 * Request to remove manual tag (path parameter + DELETE)
 */
export interface RemoveManualTagRequest {
  documentId: string;
  tagName: string;
}
```

---

## 3. UI Component Prop Types

### Status Badge

```typescript
/**
 * Status badge component props
 */
export interface StatusBadgeProps {
  status: DocumentStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

/**
 * Status badge configuration (color, icon, label)
 */
export interface StatusBadgeConfig {
  label: string;
  colorLight: string;                   // Background color (hex)
  colorDark: string;                    // Text/border color (hex)
  icon: React.ComponentType<{ className?: string }>;
  ariaLabel: string;
}
```

### Tag Badge

```typescript
/**
 * Tag badge component props
 */
export interface TagBadgeProps {
  tag: TagDto;
  onRemove?: (tagName: string) => void; // Only for removable manual tags
  size?: 'sm' | 'md';
  className?: string;
}

/**
 * Tag color mapping (consistent colors per tag name)
 */
export type TagColorMap = Record<string, string>;
```

### Upload Zone

```typescript
/**
 * Upload zone component props
 */
export interface UploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  multiple?: boolean;                   // Allow multiple file selection
  maxFileSize?: number;                 // Bytes (default: 50MB)
  acceptedMimeTypes?: string[];         // e.g., ['application/pdf']
  disabled?: boolean;
  className?: string;
}

/**
 * Upload progress state
 */
export interface UploadProgress {
  fileId: string;                       // Temporary client-side ID
  fileName: string;
  fileSize: number;
  progress: number;                     // 0-100
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}
```

### Document List

```typescript
/**
 * Document list component props
 */
export interface DocumentListProps {
  documents: DocumentListDto[];
  isLoading?: boolean;
  selectedDocumentIds?: Set<string>;
  onDocumentSelect?: (documentId: string) => void;
  onDocumentClick?: (documentId: string) => void;
  onSelectAll?: () => void;
  onDeselectAll?: () => void;
  className?: string;
}

/**
 * Document list item component props
 */
export interface DocumentListItemProps {
  document: DocumentListDto;
  isSelected?: boolean;
  onSelect?: () => void;
  onClick?: () => void;
  showCheckbox?: boolean;
  className?: string;
}
```

### Document Detail Panel

```typescript
/**
 * Document detail panel component props
 */
export interface DocumentDetailPanelProps {
  documentId: string;
  onClose: () => void;
  isOpen: boolean;
  className?: string;
}

/**
 * Classification results section props
 */
export interface ClassificationResultsProps {
  results: ClassificationResultDto[];
  className?: string;
}

/**
 * Routing timeline component props
 */
export interface RoutingTimelineProps {
  history: RoutingHistoryDto[];
  className?: string;
}
```

### Filter Panel

```typescript
/**
 * Filter panel component props
 */
export interface FilterPanelProps {
  filters: DocumentFilters;
  onFiltersChange: (filters: DocumentFilters) => void;
  availableTags: string[];              // All possible tag values
  documentCount: number;                // Total matching documents
  className?: string;
}

/**
 * Filter chip component props
 */
export interface FilterChipProps {
  label: string;
  isSelected: boolean;
  onToggle: () => void;
  variant?: 'status' | 'tag' | 'default';
  className?: string;
}
```

### Batch Action Bar

```typescript
/**
 * Batch action bar component props
 */
export interface BatchActionBarProps {
  selectedDocumentIds: Set<string>;
  onRetryAll: () => void;
  onClearSelection: () => void;
  isVisible: boolean;
  className?: string;
}
```

---

## 4. UI State Types

### Global UI Store (Zustand)

```typescript
/**
 * Global UI state store
 */
export interface UIStore {
  // Theme
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;

  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;

  // Modals
  activeModal: string | null;
  openModal: (modalId: string) => void;
  closeModal: () => void;

  // Detail panel
  detailPanelDocumentId: string | null;
  openDetailPanel: (documentId: string) => void;
  closeDetailPanel: () => void;
}

/**
 * Notification object
 */
export interface Notification {
  id: string;                           // Auto-generated UUID
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  description?: string;
  duration?: number;                    // Auto-dismiss after N ms (default: 3000)
  action?: NotificationAction;
}

/**
 * Notification action button
 */
export interface NotificationAction {
  label: string;
  onClick: () => void;
}
```

---

## 5. Form Types

### Upload Form

```typescript
/**
 * Upload form state (React Hook Form)
 */
export interface UploadFormData {
  files: FileList;
  fileName?: string;
  description?: string;
}

/**
 * Upload form validation schema (Zod)
 */
export const uploadFormSchema = z.object({
  files: z.instanceof(FileList).refine(
    (files) => files.length > 0,
    { message: 'At least one file is required' }
  ),
  fileName: z.string().max(255).optional(),
  description: z.string().max(500).optional()
});
```

### Search Form

```typescript
/**
 * Search form state
 */
export interface SearchFormData {
  query: string;
}

/**
 * Advanced search form state
 */
export interface AdvancedSearchFormData {
  fileName?: string;
  tags?: string[];
  status?: DocumentStatus | null;
  dateRange?: {
    start: Date | null;
    end: Date | null;
  };
  minFileSize?: number;
  maxFileSize?: number;
}
```

---

## 6. API Error Types

### Error Responses

```typescript
/**
 * Standard API error response
 */
export interface ApiErrorResponse {
  error: {
    code: string;                       // e.g., "ValidationError", "NotFound"
    message: string;                    // User-friendly error message
    details?: unknown;                  // Additional error context
  };
}

/**
 * Typed error codes
 */
export enum ApiErrorCode {
  ValidationError = 'ValidationError',
  Unauthorized = 'Unauthorized',
  NotFound = 'NotFound',
  TooManyRequests = 'TooManyRequests',
  InternalServerError = 'InternalServerError'
}

/**
 * Client-side error wrapper
 */
export class ApiError extends Error {
  constructor(
    public code: ApiErrorCode,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
```

---

## 7. Utility Types

### Formatters

```typescript
/**
 * File size unit
 */
export type FileSizeUnit = 'B' | 'KB' | 'MB' | 'GB';

/**
 * Formatted file size
 */
export interface FormattedFileSize {
  value: number;
  unit: FileSizeUnit;
  formatted: string;                    // e.g., "2.5 MB"
}

/**
 * Date format options
 */
export type DateFormat = 'short' | 'long' | 'relative';
```

### Pagination

```typescript
/**
 * Pagination state
 */
export interface PaginationState {
  pageIndex: number;                    // 0-based
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

/**
 * Pagination controls
 */
export interface PaginationControls {
  canPreviousPage: boolean;
  canNextPage: boolean;
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  setPageSize: (size: number) => void;
}
```

---

## 8. Hook Return Types

### useDocuments Hook

```typescript
/**
 * Return type for useDocuments hook
 */
export interface UseDocumentsResult {
  documents: DocumentListDto[];
  totalCount: number;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
  isFetching: boolean;
}
```

### useDocumentUpload Hook

```typescript
/**
 * Return type for useDocumentUpload hook
 */
export interface UseDocumentUploadResult {
  upload: (files: File[], options?: UploadOptions) => Promise<DocumentDto[]>;
  uploadProgress: Map<string, UploadProgress>;
  isUploading: boolean;
  reset: () => void;
}

/**
 * Upload options
 */
export interface UploadOptions {
  onProgress?: (progress: UploadProgress) => void;
  onSuccess?: (document: DocumentDto) => void;
  onError?: (error: Error) => void;
}
```

### useDocumentSearch Hook

```typescript
/**
 * Return type for useDocumentSearch hook
 */
export interface UseDocumentSearchResult {
  results: DocumentListDto[];
  totalCount: number;
  isSearching: boolean;
  search: (criteria: DocumentSearchDto) => void;
  clearSearch: () => void;
  filters: DocumentFilters;
  updateFilters: (filters: Partial<DocumentFilters>) => void;
}
```

---

## 9. Constants & Enums

### UI Constants

```typescript
/**
 * Responsive breakpoints (px)
 */
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1440
} as const;

/**
 * File size limits
 */
export const FILE_SIZE = {
  MAX_UPLOAD: 50 * 1024 * 1024,         // 50MB
  WARNING_THRESHOLD: 10 * 1024 * 1024   // 10MB
} as const;

/**
 * Pagination defaults
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100]
} as const;

/**
 * Polling intervals (ms)
 */
export const POLLING = {
  STATUS_UPDATE: 5000,                  // 5 seconds
  BACKGROUND_REFETCH: 30000             // 30 seconds
} as const;

/**
 * Animation durations (ms)
 */
export const ANIMATION = {
  FAST: 150,
  DEFAULT: 300,
  SLOW: 500
} as const;

/**
 * Z-index layers
 */
export const Z_INDEX = {
  DROPDOWN: 1000,
  MODAL: 1100,
  TOAST: 1200,
  TOOLTIP: 1300
} as const;
```

---

## 10. Type Guards & Validators

```typescript
/**
 * Type guard for DocumentDto
 */
export function isDocumentDto(value: unknown): value is DocumentDto {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'fileName' in value &&
    'status' in value
  );
}

/**
 * Type guard for ApiErrorResponse
 */
export function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  return (
    typeof value === 'object' &&
    value !== null &&
    'error' in value &&
    typeof (value as ApiErrorResponse).error.code === 'string'
  );
}

/**
 * Validate file type
 */
export function isValidFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type);
}

/**
 * Validate file size
 */
export function isValidFileSize(file: File, maxSize: number): boolean {
  return file.size <= maxSize;
}
```

---

## Type Exports

All types should be exported from a central `src/types/index.ts` file:

```typescript
// src/types/index.ts
export * from './document';
export * from './api';
export * from './ui';
export * from './forms';
export * from './errors';
export * from './constants';
```

---

## Validation Schemas (Zod)

### Document Upload Validation

```typescript
import { z } from 'zod';

export const uploadDocumentSchema = z.object({
  file: z.instanceof(File)
    .refine((f) => f.size <= FILE_SIZE.MAX_UPLOAD, {
      message: `File size must be less than ${FILE_SIZE.MAX_UPLOAD / (1024 * 1024)}MB`
    })
    .refine((f) => f.type === 'application/pdf', {
      message: 'Only PDF files are allowed'
    }),
  fileName: z.string()
    .min(1, 'File name is required')
    .max(255, 'File name too long')
    .optional(),
  description: z.string()
    .max(500, 'Description too long')
    .optional()
});

export type UploadDocumentSchema = z.infer<typeof uploadDocumentSchema>;
```

### Search Validation

```typescript
export const searchDocumentSchema = z.object({
  fileName: z.string().max(255).optional(),
  status: z.nativeEnum(DocumentStatus).optional(),
  tags: z.array(z.string()).optional(),
  uploadedAfter: z.string().datetime().optional(),
  uploadedBefore: z.string().datetime().optional(),
  minFileSize: z.number().int().positive().optional(),
  maxFileSize: z.number().int().positive().optional(),
  skipCount: z.number().int().nonnegative().default(0),
  maxResultCount: z.number().int().positive().max(100).default(20)
});

export type SearchDocumentSchema = z.infer<typeof searchDocumentSchema>;
```

---

## Data Model Summary

This data model provides:

1. **Type Safety**: Strict TypeScript interfaces for all API contracts and UI components
2. **Constitution IV Compliance**: No `any` types; explicit interfaces for all data structures
3. **Runtime Validation**: Zod schemas for form inputs and API responses
4. **Consistency**: Centralized type definitions prevent duplication
5. **Developer Experience**: IntelliSense support and compile-time error checking

**Next Steps**: Create API client contracts in `contracts/` directory.
