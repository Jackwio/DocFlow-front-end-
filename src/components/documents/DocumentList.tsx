import React from 'react';
import DocumentCard from './DocumentCard';
import './DocumentList.css';

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedBy: string;
  uploadedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface DocumentListProps {
  documents: Document[];
}

const DocumentList: React.FC<DocumentListProps> = ({ documents }) => {
  if (documents.length === 0) {
    return (
      <div className="no-documents">
        <p>📄</p>
        <p>No documents yet. Upload your first document to get started.</p>
      </div>
    );
  }

  return (
    <div className="document-list">
      {documents.map((doc) => (
        <DocumentCard key={doc.id} {...doc} />
      ))}
    </div>
  );
};

export default DocumentList;
