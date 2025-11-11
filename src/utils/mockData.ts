import { Document, Inbox, ClassificationRule, WebhookLog, AuditLog, TenantSettings, AIsuggestion } from '../types';

export const mockDocuments: Document[] = [
  {
    id: 'doc-001',
    name: 'Invoice_2024_Jan.pdf',
    type: 'application/pdf',
    size: 2048576,
    status: 'Classified',
    uploadDate: '2024-01-15T10:30:00Z',
    inbox: 'Finance',
    uploader: 'john.doe@company.com',
    tags: ['Invoice', 'Finance', '2024'],
  },
  {
    id: 'doc-002',
    name: 'Contract_ClientA.docx',
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    size: 1536000,
    status: 'Routed',
    uploadDate: '2024-01-14T14:22:00Z',
    inbox: 'Legal',
    uploader: 'jane.smith@company.com',
    tags: ['Contract', 'Legal', 'ClientA'],
  },
  {
    id: 'doc-003',
    name: 'Report_Q4_2023.xlsx',
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    size: 3072000,
    status: 'Pending',
    uploadDate: '2024-01-16T09:15:00Z',
    inbox: 'Reports',
    uploader: 'bob.wilson@company.com',
    tags: ['Report', 'Q4', '2023'],
  },
  {
    id: 'doc-004',
    name: 'Meeting_Notes.txt',
    type: 'text/plain',
    size: 10240,
    status: 'Failed',
    uploadDate: '2024-01-16T11:45:00Z',
    inbox: 'General',
    uploader: 'alice.brown@company.com',
    tags: ['Meeting', 'Notes'],
  },
  {
    id: 'doc-005',
    name: 'Presentation_2024.pptx',
    type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    size: 5120000,
    status: 'Classified',
    uploadDate: '2024-01-15T16:00:00Z',
    inbox: 'Marketing',
    uploader: 'chris.davis@company.com',
    tags: ['Presentation', 'Marketing', '2024'],
  },
];

export const mockInboxes: Inbox[] = [
  {
    id: 'inbox-001',
    name: 'Finance',
    status: 'active',
    department: 'Finance Department',
    documentCount: 156,
  },
  {
    id: 'inbox-002',
    name: 'Legal',
    status: 'active',
    department: 'Legal Department',
    documentCount: 89,
  },
  {
    id: 'inbox-003',
    name: 'HR',
    status: 'disabled',
    department: 'Human Resources',
    documentCount: 234,
  },
  {
    id: 'inbox-004',
    name: 'Marketing',
    status: 'active',
    department: 'Marketing Department',
    documentCount: 78,
  },
  {
    id: 'inbox-005',
    name: 'Reports',
    status: 'active',
    department: 'General',
    documentCount: 45,
  },
];

export const mockRules: ClassificationRule[] = [
  {
    id: 'rule-001',
    name: 'Invoice Classification',
    priority: 1,
    enabled: true,
    conditions: {
      fileNamePattern: '.*invoice.*',
      mimeType: 'application/pdf',
    },
    actions: {
      tags: ['Invoice', 'Finance'],
      route: 'finance-folder',
    },
  },
  {
    id: 'rule-002',
    name: 'Contract Documents',
    priority: 2,
    enabled: true,
    conditions: {
      fileNamePattern: '.*contract.*',
      textPattern: 'agreement',
    },
    actions: {
      tags: ['Contract', 'Legal'],
      route: 'legal-webhook',
    },
  },
  {
    id: 'rule-003',
    name: 'Large Files',
    priority: 3,
    enabled: false,
    conditions: {
      minSize: 10485760, // 10MB
    },
    actions: {
      tags: ['Large', 'Archive'],
    },
  },
];

export const mockWebhookLogs: WebhookLog[] = [
  {
    id: 'webhook-001',
    documentId: 'doc-002',
    url: 'https://api.example.com/legal/webhook',
    status: 'success',
    attempts: 1,
    lastAttempt: '2024-01-14T14:25:00Z',
    response: '200 OK',
  },
  {
    id: 'webhook-002',
    documentId: 'doc-004',
    url: 'https://api.example.com/general/webhook',
    status: 'failed',
    attempts: 3,
    lastAttempt: '2024-01-16T12:00:00Z',
    response: '500 Internal Server Error',
  },
];

export const mockAuditLogs: AuditLog[] = [
  {
    id: 'audit-001',
    timestamp: '2024-01-16T10:30:00Z',
    user: 'admin@company.com',
    action: 'CREATE_INBOX',
    resource: 'inbox-005',
    details: 'Created new inbox: Reports',
  },
  {
    id: 'audit-002',
    timestamp: '2024-01-16T09:15:00Z',
    user: 'john.doe@company.com',
    action: 'UPLOAD_DOCUMENT',
    resource: 'doc-001',
    details: 'Uploaded document: Invoice_2024_Jan.pdf',
  },
  {
    id: 'audit-003',
    timestamp: '2024-01-15T16:45:00Z',
    user: 'admin@company.com',
    action: 'UPDATE_SETTINGS',
    resource: 'tenant-settings',
    details: 'Changed retention days from 30 to 90',
  },
  {
    id: 'audit-004',
    timestamp: '2024-01-15T14:20:00Z',
    user: 'jane.smith@company.com',
    action: 'CREATE_RULE',
    resource: 'rule-002',
    details: 'Created classification rule: Contract Documents',
  },
];

export const mockTenantSettings: TenantSettings = {
  maxFileSize: 52428800, // 50MB
  retentionDays: 90,
  aiEnabled: true,
  storageUsed: 10737418240, // 10GB
  storageLimit: 107374182400, // 100GB
  documentCount: 602,
  documentLimit: 10000,
};

export const mockAISuggestions: AIsuggestion[] = [
  {
    documentId: 'doc-001',
    suggestedTags: ['Invoice', 'Finance', 'Payment', 'Q1-2024'],
    summary: 'Monthly invoice for January 2024 including service fees and recurring charges.',
    confidence: 0.95,
  },
  {
    documentId: 'doc-003',
    suggestedTags: ['Report', 'Quarterly', 'Finance', 'Revenue'],
    summary: 'Q4 2023 financial report showing revenue growth and expense breakdown.',
    confidence: 0.88,
  },
  {
    documentId: 'doc-005',
    suggestedTags: ['Presentation', 'Marketing', 'Strategy', '2024'],
    summary: 'Marketing strategy presentation for 2024 including campaign plans and budget allocation.',
    confidence: 0.92,
  },
];
