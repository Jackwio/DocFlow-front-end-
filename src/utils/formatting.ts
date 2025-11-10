/**
 * Formatting utility functions
 */

import { format, formatDistance, formatRelative } from 'date-fns';

/**
 * File size unit
 */
export type FileSizeUnit = 'B' | 'KB' | 'MB' | 'GB';

/**
 * Format file size in bytes to human-readable string
 */
export function formatFileSize(bytes: number): string {
  // Guard against invalid inputs
  if (!Number.isFinite(bytes)) return '';
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes: FileSizeUnit[] = ['B', 'KB', 'MB', 'GB'];
  // Ensure i is within bounds (for very small values i could be negative)
  const i = Math.min(Math.max(Math.floor(Math.log(bytes) / Math.log(k)), 0), sizes.length - 1);
  const value = bytes / Math.pow(k, i);

  return `${value.toFixed(2)} ${sizes[i]}`;
}

/**
 * Date format options
 */
export type DateFormat = 'short' | 'long' | 'relative';

/**
 * Format ISO date string to human-readable format
 */
export function formatDate(isoString: string, formatType: DateFormat = 'short'): string {
  if (!isoString) return '';

  const date = new Date(isoString);
  if (isNaN(date.getTime())) return '';

  switch (formatType) {
    case 'short':
      return format(date, 'MMM d, yyyy');
    case 'long':
      return format(date, 'MMMM d, yyyy h:mm a');
    case 'relative':
      return formatDistance(date, new Date(), { addSuffix: true });
    default:
      return format(date, 'MMM d, yyyy');
  }
}

/**
 * Format date for relative display (e.g., "2 hours ago", "yesterday")
 */
export function formatRelativeDate(isoString: string): string {
  if (!isoString) return '';

  const date = new Date(isoString);
  if (isNaN(date.getTime())) return '';

  return formatRelative(date, new Date());
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Get file extension from filename
 */
export function getFileExtension(fileName: string): string {
  const parts = fileName.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
}

/**
 * Generate color hash from string (for consistent tag colors)
 */
export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = hash % 360;
  return `hsl(${hue}, 70%, 85%)`; // Light, pastel colors
}
