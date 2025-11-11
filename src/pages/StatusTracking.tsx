import React, { useState } from 'react';
import PageLayout from '../components/PageLayout';
import { mockDocuments } from '../utils/mockData';

const StatusTracking: React.FC = () => {
  const [documents] = useState(mockDocuments);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return '⏳';
      case 'Classified':
        return '✅';
      case 'Routed':
        return '📤';
      case 'Failed':
        return '❌';
      default:
        return '📄';
    }
  };

  const statusCounts = {
    total: documents.length,
    pending: documents.filter((d) => d.status === 'Pending').length,
    classified: documents.filter((d) => d.status === 'Classified').length,
    routed: documents.filter((d) => d.status === 'Routed').length,
    failed: documents.filter((d) => d.status === 'Failed').length,
  };

  return (
    <PageLayout title="Status Tracking">
      <h2 className="section-title">Document Status Overview</h2>

      <div className="info-grid">
        <div className="info-card">
          <h4>📊 Total Documents</h4>
          <p>{statusCounts.total}</p>
        </div>
        <div className="info-card">
          <h4>⏳ Pending</h4>
          <p>{statusCounts.pending}</p>
        </div>
        <div className="info-card">
          <h4>✅ Classified</h4>
          <p>{statusCounts.classified}</p>
        </div>
        <div className="info-card">
          <h4>📤 Routed</h4>
          <p>{statusCounts.routed}</p>
        </div>
        <div className="info-card">
          <h4>❌ Failed</h4>
          <p>{statusCounts.failed}</p>
        </div>
      </div>

      <h2 className="section-title" style={{ marginTop: '40px' }}>
        Document Processing Status
      </h2>

      <table className="data-table">
        <thead>
          <tr>
            <th>Document</th>
            <th>Status</th>
            <th>Upload Date</th>
            <th>Inbox</th>
            <th>Uploader</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id}>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.5rem' }}>{getStatusIcon(doc.status)}</span>
                  <span>{doc.name}</span>
                </div>
              </td>
              <td>
                <span className={`status-badge status-${doc.status.toLowerCase()}`}>
                  {doc.status}
                </span>
              </td>
              <td>{formatDate(doc.uploadDate)}</td>
              <td>{doc.inbox}</td>
              <td>{doc.uploader}</td>
              <td>
                {doc.status === 'Failed' && (
                  <button className="action-button">🔄 Retry</button>
                )}
                <button className="action-button secondary">View Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        style={{
          marginTop: '40px',
          padding: '20px',
          background: '#f8f9fa',
          borderRadius: '8px',
        }}
      >
        <h3 style={{ marginTop: 0 }}>Status Workflow</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div className="status-badge status-pending">1. Pending</div>
          <span>→</span>
          <div className="status-badge status-classified">2. Classified</div>
          <span>→</span>
          <div className="status-badge status-routed">3. Routed</div>
        </div>
        <p style={{ marginTop: '15px', color: '#666', fontSize: '0.95rem' }}>
          Documents go through classification and routing stages. Failed documents can be
          manually retried for processing.
        </p>
      </div>
    </PageLayout>
  );
};

export default StatusTracking;
