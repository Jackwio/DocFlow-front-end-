import React from 'react';
import './DocumentCard.css';

interface DocumentCardProps {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedBy: string;
  uploadedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  name,
  type,
  size,
  uploadedBy,
  uploadedAt,
  status,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'approved':
        return '#4caf50';
      case 'rejected':
        return '#f44336';
      default:
        return '#ff9800';
    }
  };

  const getTypeIcon = () => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return '📕';
      case 'doc':
      case 'docx':
        return '📘';
      case 'xls':
      case 'xlsx':
        return '📗';
      default:
        return '📄';
    }
  };

  return (
    <div className="document-card">
      <div className="document-icon">{getTypeIcon()}</div>
      <div className="document-info">
        <h3 className="document-name">{name}</h3>
        <div className="document-meta">
          <span className="document-size">{size}</span>
          <span className="document-type">{type.toUpperCase()}</span>
        </div>
        <div className="document-details">
          <span>Uploaded by {uploadedBy}</span>
          <span>{uploadedAt}</span>
        </div>
      </div>
      <div className="document-status" style={{ backgroundColor: getStatusColor() }}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </div>
    </div>
  );
};

export default DocumentCard;
