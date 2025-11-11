import React, { useState } from 'react';
import PageLayout from '../components/PageLayout';
import { mockDocuments } from '../utils/mockData';

const DocumentManagement: React.FC = () => {
  const [documents] = useState(mockDocuments);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);

  const handleSelectDoc = (docId: string) => {
    setSelectedDocs((prev) =>
      prev.includes(docId)
        ? prev.filter((id) => id !== docId)
        : [...prev, docId]
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / 1048576).toFixed(2) + ' MB';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <PageLayout title="Document Management">
      <h2 className="section-title">All Documents</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button className="action-button">
          + Upload New Document
        </button>
        <button className="action-button secondary" disabled={selectedDocs.length === 0}>
          🏷️ Add Tags ({selectedDocs.length} selected)
        </button>
        <button className="action-button secondary" disabled={selectedDocs.length === 0}>
          📥 Download Selected
        </button>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>
              <input type="checkbox" />
            </th>
            <th>Name</th>
            <th>Type</th>
            <th>Size</th>
            <th>Status</th>
            <th>Uploaded</th>
            <th>Inbox</th>
            <th>Tags</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedDocs.includes(doc.id)}
                  onChange={() => handleSelectDoc(doc.id)}
                />
              </td>
              <td>{doc.name}</td>
              <td>{doc.type.split('/').pop()}</td>
              <td>{formatFileSize(doc.size)}</td>
              <td>
                <span className={`status-badge status-${doc.status.toLowerCase()}`}>
                  {doc.status}
                </span>
              </td>
              <td>{formatDate(doc.uploadDate)}</td>
              <td>{doc.inbox}</td>
              <td>
                {doc.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </td>
              <td>
                <button className="action-button">View</button>
                <button className="action-button">Download</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="info-grid" style={{ marginTop: '30px' }}>
        <div className="info-card">
          <h4>Total Documents</h4>
          <p>{documents.length}</p>
        </div>
        <div className="info-card">
          <h4>Classified</h4>
          <p>{documents.filter(d => d.status === 'Classified').length}</p>
        </div>
        <div className="info-card">
          <h4>Pending</h4>
          <p>{documents.filter(d => d.status === 'Pending').length}</p>
        </div>
        <div className="info-card">
          <h4>Failed</h4>
          <p>{documents.filter(d => d.status === 'Failed').length}</p>
        </div>
      </div>
    </PageLayout>
  );
};

export default DocumentManagement;
