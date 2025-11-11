import React, { useState, useRef } from 'react';
import PageLayout from '../components/PageLayout';
import { documentsApi, formatFileSize } from '../services/documentsApi';

interface UploadFile {
  id: string;
  name: string;
  size: number;
  progress: number;
  status: 'uploading' | 'completed' | 'failed';
  file?: File;
  error?: string;
}

const EasyUpload: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadFile[]>([]);
  const [selectedInbox, setSelectedInbox] = useState('Finance');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleFiles(Array.from(files));
    }
  };

  const handleFiles = (files: File[]) => {
    // Check file size (50MB limit)
    const MAX_FILE_SIZE = 50 * 1024 * 1024;
    const validFiles = files.filter((file) => {
      if (file.size > MAX_FILE_SIZE) {
        alert(`File ${file.name} exceeds 50MB limit`);
        return false;
      }
      return true;
    });

    // Add files to upload queue
    const newFiles: UploadFile[] = validFiles.map((file) => ({
      id: `temp-${Date.now()}-${Math.random()}`,
      name: file.name,
      size: file.size,
      progress: 0,
      status: 'uploading' as const,
      file,
    }));

    setUploadedFiles((prev) => [...prev, ...newFiles]);

    // Start uploading each file
    newFiles.forEach((uploadFile) => {
      uploadDocument(uploadFile);
    });
  };

  const uploadDocument = async (uploadFile: UploadFile) => {
    if (!uploadFile.file) return;

    try {
      const result = await documentsApi.uploadDocument(
        uploadFile.file,
        uploadFile.name,
        `Uploaded to ${selectedInbox}`,
        (progress) => {
          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.id === uploadFile.id ? { ...f, progress: Math.round(progress) } : f
            )
          );
        }
      );

      // Update with actual document ID and mark as completed
      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id
            ? { ...f, id: result.id, progress: 100, status: 'completed' }
            : f
        )
      );
    } catch (error) {
      // Mark as failed
      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id
            ? {
                ...f,
                progress: 0,
                status: 'failed',
                error: error instanceof Error ? error.message : 'Upload failed',
              }
            : f
        )
      );
    }
  };

  const handleRetry = (fileId: string) => {
    const file = uploadedFiles.find((f) => f.id === fileId);
    if (file && file.file) {
      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.id === fileId ? { ...f, progress: 0, status: 'uploading', error: undefined } : f
        )
      );
      uploadDocument(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    const files = Array.from(event.dataTransfer.files);
    handleFiles(files);
  };

  const handleClickBrowse = () => {
    fileInputRef.current?.click();
  };

  const handleView = async (fileId: string) => {
    try {
      const url = await documentsApi.viewDocument(fileId);
      // Open blob URL in new tab
      window.open(url, '_blank');
    } catch (error) {
      alert('Failed to view document: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
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

      <div
        className="upload-zone"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          border: isDragging ? '2px dashed #5b6fff' : '2px dashed #ddd',
          backgroundColor: isDragging ? '#f0f2ff' : 'transparent',
        }}
      >
        <div className="upload-zone-icon">📤</div>
        <h3>Drop files here or click to browse</h3>
        <p style={{ color: '#666', marginTop: '10px' }}>
          Supports all file types • Max 50MB per file
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        <button className="action-button" style={{ marginTop: '20px' }} onClick={handleClickBrowse}>
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
                    title={file.error}
                  >
                    🔄 Retry
                  </button>
                )}
                {file.status === 'completed' && (
                  <button className="action-button secondary" onClick={() => handleView(file.id)}>
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
