import React, { useState } from 'react';
import PageLayout from '../components/PageLayout';

interface UploadFile {
  id: string;
  name: string;
  size: number;
  progress: number;
  status: 'uploading' | 'completed' | 'failed';
}

const EasyUpload: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadFile[]>([
    {
      id: '1',
      name: 'Sample_Document_1.pdf',
      size: 2048576,
      progress: 100,
      status: 'completed',
    },
    {
      id: '2',
      name: 'Sample_Document_2.docx',
      size: 1536000,
      progress: 65,
      status: 'uploading',
    },
    {
      id: '3',
      name: 'Sample_Document_3.xlsx',
      size: 3072000,
      progress: 0,
      status: 'failed',
    },
  ]);

  const [selectedInbox, setSelectedInbox] = useState('Finance');

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / 1048576).toFixed(2) + ' MB';
  };

  const handleRetry = (fileId: string) => {
    setUploadedFiles((prev) =>
      prev.map((file) =>
        file.id === fileId
          ? { ...file, progress: 0, status: 'uploading' }
          : file
      )
    );
  };

  return (
    <PageLayout title="Easy Upload">
      <h2 className="section-title">Upload Documents</h2>

      <div style={{ marginBottom: '30px' }}>
        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 600 }}>
          Select Target Inbox:
        </label>
        <select
          value={selectedInbox}
          onChange={(e) => setSelectedInbox(e.target.value)}
          style={{
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #ddd',
            fontSize: '1rem',
            marginBottom: '20px',
            minWidth: '200px',
          }}
        >
          <option value="Finance">Finance</option>
          <option value="Legal">Legal</option>
          <option value="HR">HR</option>
          <option value="Marketing">Marketing</option>
          <option value="General">General</option>
        </select>
      </div>

      <div className="upload-zone">
        <div className="upload-zone-icon">📤</div>
        <h3>Drop files here or click to browse</h3>
        <p style={{ color: '#666', marginTop: '10px' }}>
          Supports all file types • Max 50MB per file
        </p>
        <button className="action-button" style={{ marginTop: '20px' }}>
          Select Files
        </button>
      </div>

      <h2 className="section-title" style={{ marginTop: '40px' }}>
        Upload Queue
      </h2>

      <table className="data-table">
        <thead>
          <tr>
            <th>File Name</th>
            <th>Size</th>
            <th>Status</th>
            <th>Progress</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {uploadedFiles.map((file) => (
            <tr key={file.id}>
              <td>{file.name}</td>
              <td>{formatFileSize(file.size)}</td>
              <td>
                <span
                  className={`status-badge status-${file.status === 'completed' ? 'success' : file.status === 'failed' ? 'failed' : 'pending'}`}
                >
                  {file.status === 'uploading' ? 'Uploading...' : file.status === 'completed' ? 'Completed' : 'Failed'}
                </span>
              </td>
              <td>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${file.progress}%` }}
                  ></div>
                </div>
                <span style={{ fontSize: '0.85rem', color: '#666', marginTop: '4px', display: 'block' }}>
                  {file.progress}%
                </span>
              </td>
              <td>
                {file.status === 'failed' && (
                  <button
                    className="action-button"
                    onClick={() => handleRetry(file.id)}
                  >
                    🔄 Retry
                  </button>
                )}
                {file.status === 'completed' && (
                  <button className="action-button secondary">
                    View
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="info-grid" style={{ marginTop: '30px' }}>
        <div className="info-card">
          <h4>Total Files</h4>
          <p>{uploadedFiles.length}</p>
        </div>
        <div className="info-card">
          <h4>Completed</h4>
          <p>{uploadedFiles.filter((f) => f.status === 'completed').length}</p>
        </div>
        <div className="info-card">
          <h4>In Progress</h4>
          <p>{uploadedFiles.filter((f) => f.status === 'uploading').length}</p>
        </div>
        <div className="info-card">
          <h4>Failed</h4>
          <p>{uploadedFiles.filter((f) => f.status === 'failed').length}</p>
        </div>
      </div>
    </PageLayout>
  );
};

export default EasyUpload;
