/**
 * Test data factory functions
 */

import { createMockDocument } from '../mocks/data';

import type {
  DocumentDto,
  DocumentListDto,
  TagDto,
  ClassificationResultDto,
  TagSource,
} from '@/types';

/**
 * Create test document DTO
 */
export function buildDocumentDto(overrides?: Partial<DocumentDto>): DocumentDto {
  return createMockDocument(overrides);
}

/**
 * Create test document list DTO
 */
export function buildDocumentListDto(overrides?: Partial<DocumentListDto>): DocumentListDto {
  const doc = createMockDocument();
  return {
    id: doc.id,
    fileName: doc.fileName,
    fileSize: doc.fileSize,
    status: doc.status,
    uploadedAt: doc.uploadedAt,
    classifiedAt: doc.classifiedAt,
    tags: doc.tags.map((t) => t.name),
    ...overrides,
  };
}

/**
 * Create test tag
 */
export function buildTag(overrides?: Partial<TagDto>): TagDto {
  return {
    name: 'TestTag',
    source: 0,
    addedAt: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Create mock tag with specified name and source
 */
export function createMockTag(name: string, source: TagSource = 0): TagDto {
  return {
    name,
    source,
    addedAt: new Date().toISOString(),
    addedBy: source === TagSource.Manual ? 'user@example.com' : undefined,
  };
}

/**
 * Create test classification result
 */
export function buildClassificationResult(
  overrides?: Partial<ClassificationResultDto>
): ClassificationResultDto {
  return {
    ruleId: 'rule-test',
    ruleName: 'Test Rule',
    tagName: 'TestTag',
    confidenceScore: 0.9,
    appliedAt: new Date().toISOString(),
    ...overrides,
  };
}
