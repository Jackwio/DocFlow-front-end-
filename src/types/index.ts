// Document types
export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  status: 'Pending' | 'Classified' | 'Routed' | 'Failed';
  uploadDate: string;
  inbox: string;
  uploader: string;
  tags: string[];
  metadata?: Record<string, any>;
}

// Inbox types
export interface Inbox {
  id: string;
  name: string;
  status: 'active' | 'disabled';
  department: string;
  documentCount: number;
}

// Rule types
export interface ClassificationRule {
  id: string;
  name: string;
  priority: number;
  enabled: boolean;
  conditions: {
    fileNamePattern?: string;
    mimeType?: string;
    minSize?: number;
    maxSize?: number;
    textPattern?: string;
  };
  actions: {
    tags: string[];
    route?: string;
  };
}

// Webhook types
export interface WebhookLog {
  id: string;
  documentId: string;
  url: string;
  status: 'success' | 'failed' | 'pending';
  attempts: number;
  lastAttempt: string;
  response?: string;
}

// Audit types
export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  details: string;
}

// Tenant types
export interface TenantSettings {
  maxFileSize: number;
  retentionDays: number;
  aiEnabled: boolean;
  storageUsed: number;
  storageLimit: number;
  documentCount: number;
  documentLimit: number;
}

// AI types
export interface AIsuggestion {
  documentId: string;
  suggestedTags: string[];
  summary?: string;
  confidence: number;
}
