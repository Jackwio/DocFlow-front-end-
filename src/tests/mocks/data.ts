/**
 * Mock document data for testing
 */

import type { DocumentDto, DocumentListDto, DocumentStatus, TagSource } from '@/types';

/**
 * Create mock document with default values
 */
export function createMockDocument(overrides?: Partial<DocumentDto>): DocumentDto {
  const id = `doc-${Date.now()}-${Math.random()}`;
  return {
    id,
    fileName: `document-${id}.pdf`,
    fileSize: 1024 * 512, // 512 KB
    mimeType: 'application/pdf',
    description: 'Mock document for testing',
    status: 1 as DocumentStatus, // Classified
    uploadedAt: new Date().toISOString(),
    classifiedAt: new Date().toISOString(),
    blobUri: `https://storage.example.com/${id}`,
    classificationResults: [
      {
        ruleId: 'rule-001',
        ruleName: 'Invoice Detection',
        tagName: 'Invoice',
        confidenceScore: 0.95,
        appliedAt: new Date().toISOString(),
      },
    ],
    tags: [
      {
        name: 'Invoice',
        source: 0 as TagSource, // Automatic
        addedAt: new Date().toISOString(),
      },
    ],
    routingHistory: [
      {
        toQueueId: 'queue-001',
        toQueueName: 'Accounting Queue',
        routedAt: new Date().toISOString(),
        routedBy: 'system',
      },
    ],
    ...overrides,
  };
}

/**
 * Mock document DTO
 */
export const mockDocumentDto: DocumentDto = createMockDocument();

/**
 * Mock document list (as DocumentDto with full tag objects)
 */
export const mockDocuments: DocumentDto[] = [
  createMockDocument({
    id: '1',
    fileName: 'invoice-2024-001.pdf',
    status: 1,
    tags: [{ name: 'Invoice', source: 0, addedAt: new Date().toISOString() }],
  }),
  createMockDocument({
    id: '2',
    fileName: 'contract-2024-002.pdf',
    status: 1,
    tags: [{ name: 'Contract', source: 0, addedAt: new Date().toISOString() }],
  }),
  createMockDocument({
    id: '3',
    fileName: 'receipt-2024-003.pdf',
    status: 0,
    tags: [],
  }),
  createMockDocument({
    id: '4',
    fileName: 'failed-document.pdf',
    status: 2,
    tags: [],
  }),
];

/**
 * Factory function for creating test documents
 */
export function createMockDocumentList(count: number): DocumentListDto[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `doc-${i + 1}`,
    fileName: `document-${i + 1}.pdf`,
    fileSize: 1024 * (100 + i * 10),
    status: (i % 4) as DocumentStatus,
    uploadedAt: new Date(Date.now() - i * 1000 * 60 * 60).toISOString(),
    classifiedAt:
      i % 4 === 1 ? new Date(Date.now() - i * 1000 * 60 * 55).toISOString() : undefined,
    tags: i % 2 === 0 ? ['Invoice'] : ['Contract', 'Legal'],
  }));
}
