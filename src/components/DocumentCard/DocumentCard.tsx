import React from 'react';
import { Document } from '../../types/Document';
import './DocumentCard.css';

interface DocumentCardProps {
  document: Document;
  onView?: (id: string) => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document, onView }) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="document-card">
      <div className="document-card-header">
        <h3 className="document-title">{document.title}</h3>
        <span className={`document-status status-${document.status.toLowerCase().replace(' ', '-')}`}>
          {document.status}
        </span>
      </div>
      <p className="document-description">{document.description}</p>
      <div className="document-meta">
        <div className="meta-item">
          <span className="meta-label">File:</span>
          <span className="meta-value">{document.fileName}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Size:</span>
          <span className="meta-value">{formatFileSize(document.fileSize)}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Uploaded:</span>
          <span className="meta-value">{formatDate(document.uploadedAt)}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">By:</span>
          <span className="meta-value">{document.uploadedBy}</span>
        </div>
      </div>
      {onView && (
        <button className="view-button" onClick={() => onView(document.id)}>
          View Details
        </button>
      )}
    </div>
  );
};

export default DocumentCard;
