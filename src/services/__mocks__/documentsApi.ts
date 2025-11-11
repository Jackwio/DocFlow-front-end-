// Mock implementation for documentsApi

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

export const documentsApi = {
  uploadDocument: jest.fn(),
  uploadBatch: jest.fn(),
  getDocument: jest.fn(),
  getDocumentList: jest.fn(),
  retryClassification: jest.fn(),
  searchDocuments: jest.fn(),
  addManualTag: jest.fn(),
  removeManualTag: jest.fn(),
  getClassificationHistory: jest.fn(),
  viewDocument: jest.fn(),
  downloadDocument: jest.fn(),
};

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

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
  return (bytes / 1048576).toFixed(2) + ' MB';
}

export class DocumentsApiClient {}
