import React from 'react';
import './EasyUpload.css';

const EasyUpload: React.FC = () => {
  const [isDragging, setIsDragging] = React.useState(false);

  const recentUploads = [
    { name: 'Contract_2025.pdf', size: '2.4 MB', time: '2 mins ago', status: 'success' },
    { name: 'Invoice_Q4.xlsx', size: '890 KB', time: '5 mins ago', status: 'success' },
    { name: 'Presentation.pptx', size: '5.2 MB', time: '10 mins ago', status: 'processing' },
    { name: 'Report_Final.docx', size: '1.8 MB', time: '15 mins ago', status: 'success' }
  ];

  return (
    <div className="easy-upload">
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
            onDragEnter={() => setIsDragging(true)}
            onDragLeave={() => setIsDragging(false)}
            onDrop={() => setIsDragging(false)}
          >
            <div className="drop-zone-content">
              <div className="upload-icon">📤</div>
              <h2>Drag & Drop your files here</h2>
              <p className="drop-zone-text">or</p>
              <button className="btn-browse">Browse Files</button>
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
              <button className="btn-option">Select Folder</button>
            </div>

            <div className="option-card">
              <div className="option-icon">🔗</div>
              <h3>Upload from URL</h3>
              <p>Import files from web links</p>
              <button className="btn-option">Enter URL</button>
            </div>

            <div className="option-card">
              <div className="option-icon">☁️</div>
              <h3>Cloud Import</h3>
              <p>Import from Google Drive, Dropbox</p>
              <button className="btn-option">Connect</button>
            </div>

            <div className="option-card">
              <div className="option-icon">📧</div>
              <h3>Email Upload</h3>
              <p>Forward files to your upload email</p>
              <button className="btn-option">Get Email</button>
            </div>
          </div>
        </div>

        <aside className="upload-sidebar">
          <div className="sidebar-section">
            <h3>⚙️ Upload Settings</h3>
            <div className="setting-item">
              <label>
                <input type="checkbox" checked readOnly />
                <span>Auto-classify documents</span>
              </label>
            </div>
            <div className="setting-item">
              <label>
                <input type="checkbox" checked readOnly />
                <span>Extract metadata</span>
              </label>
            </div>
            <div className="setting-item">
              <label>
                <input type="checkbox" />
                <span>OCR for scanned documents</span>
              </label>
            </div>
            <div className="setting-item">
              <label>
                <input type="checkbox" checked readOnly />
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
              {recentUploads.map((file, index) => (
                <div key={index} className="recent-item">
                  <div className="recent-icon">
                    {file.status === 'success' ? '✅' : '⏳'}
                  </div>
                  <div className="recent-info">
                    <div className="recent-name">{file.name}</div>
                    <div className="recent-meta">
                      {file.size} • {file.time}
                    </div>
                  </div>
                </div>
              ))}
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
