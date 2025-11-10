/**
 * UI component prop types
 */

import type { DocumentStatus, TagDto } from './document';

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
 * Tag badge component props
 */
export interface TagBadgeProps {
  tag: TagDto;
  onRemove?: (tagName: string) => void;
  size?: 'sm' | 'md';
  className?: string;
}

/**
 * Upload progress state
 */
export interface UploadProgress {
  fileId: string;
  fileName: string;
  fileSize: number;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

/**
 * Notification object
 */
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  description?: string;
  duration?: number;
  action?: NotificationAction;
}

/**
 * Notification action button
 */
export interface NotificationAction {
  label: string;
  onClick: () => void;
}
