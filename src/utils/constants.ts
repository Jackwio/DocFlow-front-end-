/**
 * Application constants
 */

/**
 * Responsive breakpoints (px)
 */
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1440,
} as const;

/**
 * File size limits (bytes)
 */
export const FILE_SIZE = {
  MAX_UPLOAD: 50 * 1024 * 1024, // 50MB
  WARNING_THRESHOLD: 10 * 1024 * 1024, // 10MB
} as const;

/**
 * Pagination defaults
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;

/**
 * Polling intervals (ms)
 */
export const POLLING = {
  STATUS_UPDATE: 5000, // 5 seconds
  BACKGROUND_REFETCH: 30000, // 30 seconds
} as const;

/**
 * Animation durations (ms)
 */
export const ANIMATION = {
  FAST: 150,
  DEFAULT: 300,
  SLOW: 500,
} as const;

/**
 * Z-index layers
 */
export const Z_INDEX = {
  DROPDOWN: 1000,
  MODAL: 1100,
  TOAST: 1200,
  TOOLTIP: 1300,
} as const;

/**
 * Accepted MIME types for upload
 */
export const ACCEPTED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/png',
  'image/jpeg',
] as const;

/**
 * API configuration
 */
export const API_CONFIG = {
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;
