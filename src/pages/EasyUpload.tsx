import React from 'react';
import './EasyUpload.css';

interface UploadedFile {
  name: string;
  size: string;
  time: string;
  status: 'success' | 'processing' | 'error';
  id?: string;
}

interface UploadProgress {
  [key: string]: number;
}

const EasyUpload: React.FC = () => {
  const [isDragging, setIsDragging] = React.useState(false);
  const [recentUploads, setRecentUploads] = React.useState<UploadedFile[]>([
    { name: 'Contract_2025.pdf', size: '2.4 MB', time: '2 mins ago', status: 'success' },
    { name: 'Invoice_Q4.xlsx', size: '890 KB', time: '5 mins ago', status: 'success' },
    { name: 'Presentation.pptx', size: '5.2 MB', time: '10 mins ago', status: 'processing' },
    { name: 'Report_Final.docx', size: '1.8 MB', time: '15 mins ago', status: 'success' }
  ]);
  const [uploadProgress, setUploadProgress] = React.useState<UploadProgress>({});
  const [uploadSettings, setUploadSettings] = React.useState({
    autoClassify: true,
    extractMetadata: true,
    ocr: false,
    virusScan: true
  });
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const uploadFile = async (file: File) => {
    const fileKey = `${file.name}-${Date.now()}`;
    
    // Add to recent uploads immediately
    const newUpload: UploadedFile = {
      name: file.name,
      size: formatFileSize(file.size),
      time: 'Just now',
      status: 'processing'
    };
    setRecentUploads(prev => [newUpload, ...prev.slice(0, 3)]);

    try {
      const formData = new FormData();
      formData.append('File', file);
      formData.append('FileName', file.name);

      // Create XMLHttpRequest for progress tracking
      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          setUploadProgress(prev => ({ ...prev, [fileKey]: percentComplete }));
        }
      });

      const uploadPromise = new Promise<any>((resolve, reject) => {
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              resolve(JSON.parse(xhr.responseText));
            } catch {
              resolve({ success: true });
            }
          } else {
            reject(new Error(`Upload failed: ${xhr.status}`));
          }
        });

        xhr.addEventListener('error', () => reject(new Error('Upload failed')));
        xhr.addEventListener('abort', () => reject(new Error('Upload cancelled')));

        // Replace with actual API endpoint
        xhr.open('POST', '/api/documents/upload');
        
        // Add authentication header if available
        const token = localStorage.getItem('auth_token');
        if (token) {
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }
        
        xhr.send(formData);
      });

      const result = await uploadPromise;
      
      // Update status to success
      setRecentUploads(prev => 
        prev.map(upload => 
          upload.name === file.name && upload.time === 'Just now'
            ? { ...upload, status: 'success' as const, id: result.id }
            : upload
        )
      );

      // Remove progress tracking
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[fileKey];
        return newProgress;
      });

      console.log('Upload successful:', result);
      return result;
    } catch (error) {
      console.error('Upload error:', error);
      
      // Update status to error
      setRecentUploads(prev => 
        prev.map(upload => 
          upload.name === file.name && upload.time === 'Just now'
            ? { ...upload, status: 'error' as const }
            : upload
        )
      );

      // Remove progress tracking
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[fileKey];
        return newProgress;
      });

      alert(`Failed to upload ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const uploadMultipleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    
    // Upload files in parallel (or sequentially if preferred)
    const uploadPromises = fileArray.map(file => uploadFile(file));
    
    try {
      await Promise.all(uploadPromises);
      console.log('All files uploaded successfully');
    } catch (error) {
      console.error('Some uploads failed:', error);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      uploadMultipleFiles(files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      uploadMultipleFiles(files);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="easy-upload">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
      />
      
      <div className="page-header">
        <div className="header-content">
          <h1>🔥 Easy Upload</h1>
          <p className="subtitle">Upload documents quickly and securely</p>
        </div>
      </div>

      <div className="upload-container">
        <div className="upload-main">
          <div 
            className={`drop-zone ${isDragging ? 'dragging' : ''}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="drop-zone-content">
              <div className="upload-icon">📤</div>
              <h2>Drag & Drop your files here</h2>
              <p className="drop-zone-text">or</p>
              <button className="btn-browse" onClick={handleBrowseClick}>Browse Files</button>
              <div className="file-info">
                <p>Supported formats: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, JPG, PNG</p>
                <p>Maximum file size: 50 MB</p>
              </div>
            </div>
          </div>

          <div className="upload-options">
            <div className="option-card">
              <div className="option-icon">📂</div>
              <h3>Folder Upload</h3>
              <p>Upload entire folders at once</p>
              <button className="btn-option" onClick={() => alert('Folder upload feature coming soon!')}>Select Folder</button>
            </div>

            <div className="option-card">
              <div className="option-icon">🔗</div>
              <h3>Upload from URL</h3>
              <p>Import files from web links</p>
              <button className="btn-option" onClick={() => alert('URL upload feature coming soon!')}>Enter URL</button>
            </div>

            <div className="option-card">
              <div className="option-icon">☁️</div>
              <h3>Cloud Import</h3>
              <p>Import from Google Drive, Dropbox</p>
              <button className="btn-option" onClick={() => alert('Cloud import feature coming soon!')}>Connect</button>
            </div>

            <div className="option-card">
              <div className="option-icon">📧</div>
              <h3>Email Upload</h3>
              <p>Forward files to your upload email</p>
              <button className="btn-option" onClick={() => alert('Email upload feature coming soon!')}>Get Email</button>
            </div>
          </div>
        </div>

        <aside className="upload-sidebar">
          <div className="sidebar-section">
            <h3>⚙️ Upload Settings</h3>
            <div className="setting-item">
              <label>
                <input 
                  type="checkbox" 
                  checked={uploadSettings.autoClassify} 
                  onChange={(e) => setUploadSettings({...uploadSettings, autoClassify: e.target.checked})}
                />
                <span>Auto-classify documents</span>
              </label>
            </div>
            <div className="setting-item">
              <label>
                <input 
                  type="checkbox" 
                  checked={uploadSettings.extractMetadata}
                  onChange={(e) => setUploadSettings({...uploadSettings, extractMetadata: e.target.checked})}
                />
                <span>Extract metadata</span>
              </label>
            </div>
            <div className="setting-item">
              <label>
                <input 
                  type="checkbox"
                  checked={uploadSettings.ocr}
                  onChange={(e) => setUploadSettings({...uploadSettings, ocr: e.target.checked})}
                />
                <span>OCR for scanned documents</span>
              </label>
            </div>
            <div className="setting-item">
              <label>
                <input 
                  type="checkbox" 
                  checked={uploadSettings.virusScan}
                  onChange={(e) => setUploadSettings({...uploadSettings, virusScan: e.target.checked})}
                />
                <span>Virus scan</span>
              </label>
            </div>
          </div>

          <div className="sidebar-section">
            <h3>📊 Upload Statistics</h3>
            <div className="stat-row">
              <span className="stat-label">Today</span>
              <span className="stat-value">24 files</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">This week</span>
              <span className="stat-value">156 files</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Total</span>
              <span className="stat-value">2,847 files</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Storage used</span>
              <span className="stat-value">24.5 GB / 100 GB</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '24.5%' }}></div>
            </div>
          </div>

          <div className="sidebar-section">
            <h3>⏱️ Recent Uploads</h3>
            <div className="recent-list">
              {recentUploads.map((file, index) => {
                const fileKey = `${file.name}-${index}`;
                const progress = uploadProgress[fileKey];
                
                return (
                  <div key={index} className="recent-item">
                    <div className="recent-icon">
                      {file.status === 'success' ? '✅' : file.status === 'error' ? '❌' : '⏳'}
                    </div>
                    <div className="recent-info">
                      <div className="recent-name">{file.name}</div>
                      <div className="recent-meta">
                        {file.size} • {file.time}
                      </div>
                      {progress !== undefined && (
                        <div className="upload-progress-bar">
                          <div className="upload-progress-fill" style={{ width: `${progress}%` }}></div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </div>

      <div className="upload-tips">
        <h3>💡 Quick Tips</h3>
        <div className="tips-grid">
          <div className="tip-card">
            <div className="tip-icon">⚡</div>
            <div className="tip-content">
              <h4>Batch Upload</h4>
              <p>Select multiple files at once for faster uploads</p>
            </div>
          </div>
          <div className="tip-card">
            <div className="tip-icon">🏷️</div>
            <div className="tip-content">
              <h4>Auto-Tagging</h4>
              <p>Documents are automatically tagged based on content</p>
            </div>
          </div>
          <div className="tip-card">
            <div className="tip-icon">🔒</div>
            <div className="tip-content">
              <h4>Secure Transfer</h4>
              <p>All uploads are encrypted with SSL/TLS</p>
            </div>
          </div>
          <div className="tip-card">
            <div className="tip-icon">📱</div>
            <div className="tip-content">
              <h4>Mobile Friendly</h4>
              <p>Upload from any device, anywhere</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EasyUpload;
