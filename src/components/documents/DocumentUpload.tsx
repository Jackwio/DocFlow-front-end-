import React, { useState, useRef } from 'react';
import './DocumentUpload.css';

interface DocumentUploadProps {
  onUpload: (file: File) => void;
  onClose: () => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ onUpload, onClose }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile);
      onClose();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="upload-modal-overlay" onClick={onClose}>
      <div className="upload-modal" role="dialog" aria-modal="true" aria-labelledby="upload-dialog-title" onClick={(e) => e.stopPropagation()}>
        <div className="upload-header">
          <h2 id="upload-dialog-title">Upload Document</h2>
          <button className="close-button" onClick={onClose} aria-label="Close upload dialog">✕</button>
        </div>
        
        <div
          className={`upload-area ${dragActive ? 'drag-active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            accept=".pdf,.doc,.docx,.xls,.xlsx"
          />
          {selectedFile ? (
            <div className="selected-file">
              <p className="file-icon">📄</p>
              <p className="file-name">{selectedFile.name}</p>
              <p className="file-size">{formatFileSize(selectedFile.size)}</p>
            </div>
          ) : (
            <div className="upload-prompt">
              <p className="upload-icon">📁</p>
              <p>Drag and drop your file here, or click to browse</p>
              <p className="upload-hint">Supported formats: PDF, DOC, DOCX, XLS, XLSX</p>
            </div>
          )}
        </div>

        <div className="upload-actions">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button
            className="btn-primary"
            onClick={handleUpload}
            disabled={!selectedFile}
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;
