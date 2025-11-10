/**
 * Tests for validation schemas
 */

import { describe, it, expect } from 'vitest';
import { uploadDocumentSchema, searchDocumentSchema, addManualTagSchema } from './validation';
import { DocumentStatus } from '@/types';

describe('uploadDocumentSchema', () => {
  it('validates valid upload data', () => {
    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    const result = uploadDocumentSchema.safeParse({
      file,
      fileName: 'invoice.pdf',
      description: 'Test invoice',
    });
    expect(result.success).toBe(true);
  });

  it('rejects file exceeding size limit', () => {
    const largeContent = new Array(51 * 1024 * 1024).fill('x').join(''); // 51 MB
    const file = new File([largeContent], 'large.pdf', { type: 'application/pdf' });
    const result = uploadDocumentSchema.safeParse({ file });
    expect(result.success).toBe(false);
  });

  it('accepts optional fields', () => {
    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    const result = uploadDocumentSchema.safeParse({ file });
    expect(result.success).toBe(true);
  });
});

describe('searchDocumentSchema', () => {
  it('validates valid search criteria', () => {
    const result = searchDocumentSchema.safeParse({
      fileName: 'invoice',
      status: DocumentStatus.Classified,
      tags: ['Invoice', 'Accounting'],
      skipCount: 0,
      maxResultCount: 20,
    });
    expect(result.success).toBe(true);
  });

  it('applies default pagination values', () => {
    const result = searchDocumentSchema.parse({});
    expect(result.skipCount).toBe(0);
    expect(result.maxResultCount).toBe(20);
  });

  it('rejects negative skipCount', () => {
    const result = searchDocumentSchema.safeParse({ skipCount: -1 });
    expect(result.success).toBe(false);
  });

  it('rejects maxResultCount exceeding limit', () => {
    const result = searchDocumentSchema.safeParse({ maxResultCount: 200 });
    expect(result.success).toBe(false);
  });
});

describe('addManualTagSchema', () => {
  it('validates valid tag name', () => {
    const result = addManualTagSchema.safeParse({ tagName: 'Urgent' });
    expect(result.success).toBe(true);
  });

  it('rejects empty tag name', () => {
    const result = addManualTagSchema.safeParse({ tagName: '' });
    expect(result.success).toBe(false);
  });

  it('rejects tag name with special characters', () => {
    const result = addManualTagSchema.safeParse({ tagName: 'Tag@123' });
    expect(result.success).toBe(false);
  });

  it('accepts tag name with hyphens and underscores', () => {
    const result = addManualTagSchema.safeParse({ tagName: 'High-Priority_Tag' });
    expect(result.success).toBe(true);
  });

  it('rejects tag name exceeding length', () => {
    const longTag = 'A'.repeat(51);
    const result = addManualTagSchema.safeParse({ tagName: longTag });
    expect(result.success).toBe(false);
  });
});
