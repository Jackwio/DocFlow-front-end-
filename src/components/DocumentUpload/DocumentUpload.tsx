import React, { useState } from 'react';
import Button from '../Button/Button';
import './DocumentUpload.css';

const DocumentUpload: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !file) {
      alert('Please fill in all required fields');
      return;
    }

    setUploading(true);
    
    // Simulate file upload
    setTimeout(() => {
      console.log('Uploading document:', {
        title,
        description,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      });
      
      setUploading(false);
      setUploadSuccess(true);
      
      // Reset form
      setTitle('');
      setDescription('');
      setFile(null);
      
      setTimeout(() => setUploadSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="document-upload">
      <div className="upload-container">
        <h2>Upload Document</h2>
        
        {uploadSuccess && (
          <div className="success-message">
            Document uploaded successfully!
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="upload-form">
          <div className="form-group">
            <label htmlFor="title">
              Title <span className="required">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter document title"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter document description"
              rows={4}
              className="form-textarea"
            />
          </div>

          <div className="form-group">
            <label htmlFor="file">
              File <span className="required">*</span>
            </label>
            <div className="file-input-wrapper">
              <input
                type="file"
                id="file"
                onChange={handleFileChange}
                required
                className="file-input"
              />
              {file && (
                <div className="file-info">
                  <span className="file-name">{file.name}</span>
                  <span className="file-size">
                    ({(file.size / 1024).toFixed(2)} KB)
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="form-actions">
            <Button type="submit" disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload Document'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setTitle('');
                setDescription('');
                setFile(null);
              }}
            >
              Clear
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DocumentUpload;
