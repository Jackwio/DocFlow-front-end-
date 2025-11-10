export enum DocumentStatus {
  DRAFT = 'Draft',
  IN_REVIEW = 'In Review',
  APPROVED = 'Approved',
  REJECTED = 'Rejected'
}

export interface Document {
  id: string;
  title: string;
  description: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  status: DocumentStatus;
  uploadedAt: Date;
  updatedAt: Date;
  uploadedBy: string;
}
