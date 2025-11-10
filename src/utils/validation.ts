/**
 * Zod validation schemas
 */

import { z } from 'zod';
import { DocumentStatus } from '@/types';
import { FILE_SIZE, ACCEPTED_MIME_TYPES } from './constants';

/**
 * Upload document validation schema
 */
export const uploadDocumentSchema = z.object({
  file: z
    .instanceof(File)
    .refine((f) => f.size <= FILE_SIZE.MAX_UPLOAD, {
      message: `File size must be less than ${FILE_SIZE.MAX_UPLOAD / (1024 * 1024)}MB`,
    })
    .refine((f) => ACCEPTED_MIME_TYPES.includes(f.type as typeof ACCEPTED_MIME_TYPES[number]), {
      message: 'Invalid file type. Please upload PDF, Word, Excel, or image files.',
    }),
  fileName: z.string().min(1, 'File name is required').max(255, 'File name too long').optional(),
  description: z.string().max(500, 'Description too long').optional(),
});

export type UploadDocumentSchema = z.infer<typeof uploadDocumentSchema>;

/**
 * Search document validation schema
 */
export const searchDocumentSchema = z.object({
  fileName: z.string().max(255).optional(),
  status: z.nativeEnum(DocumentStatus).optional(),
  tags: z.array(z.string()).optional(),
  uploadedAfter: z.string().datetime().optional(),
  uploadedBefore: z.string().datetime().optional(),
  minFileSize: z.number().int().positive().optional(),
  maxFileSize: z.number().int().positive().optional(),
  skipCount: z.number().int().nonnegative().default(0),
  maxResultCount: z.number().int().positive().max(100).default(20),
});

export type SearchDocumentSchema = z.infer<typeof searchDocumentSchema>;

/**
 * Add manual tag validation schema
 */
export const addManualTagSchema = z.object({
  tagName: z
    .string()
    .min(1, 'Tag name is required')
    .max(50, 'Tag name too long')
    .regex(/^[a-zA-Z0-9-_\s]+$/, 'Tag name can only contain letters, numbers, hyphens, and underscores'),
});

export type AddManualTagSchema = z.infer<typeof addManualTagSchema>;
