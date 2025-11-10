import React from 'react';
import './DocumentManagement.css';

const DocumentManagement: React.FC = () => {
  const mockDocuments = [
    {
      id: 1,
      name: 'Q4 Financial Report.pdf',
      type: 'Financial',
      uploadDate: '2025-11-08',
      size: '2.4 MB',
      status: 'Approved',
      tags: ['Finance', 'Q4', 'Report']
    },
    {
      id: 2,
      name: 'Employee Handbook 2025.docx',
      type: 'HR',
      uploadDate: '2025-11-05',
      size: '1.8 MB',
      status: 'Pending',
      tags: ['HR', 'Policy', '2025']
    },
    {
      id: 3,
      name: 'Project Proposal - Alpha.pdf',
      type: 'Project',
      uploadDate: '2025-11-01',
      size: '3.2 MB',
      status: 'Draft',
      tags: ['Project', 'Alpha', 'Proposal']
    },
    {
      id: 4,
      name: 'Marketing Strategy Q1.pptx',
      type: 'Marketing',
      uploadDate: '2025-10-28',
      size: '5.1 MB',
      status: 'Approved',
      tags: ['Marketing', 'Strategy', 'Q1']
    },
    {
      id: 5,
      name: 'Contract - Vendor ABC.pdf',
      type: 'Legal',
      uploadDate: '2025-10-25',
      size: '890 KB',
      status: 'Pending',
      tags: ['Legal', 'Contract', 'Vendor']
    },
    {
      id: 6,
      name: 'Technical Specification.pdf',
      type: 'Technical',
      uploadDate: '2025-10-20',
      size: '4.5 MB',
      status: 'Approved',
      tags: ['Tech', 'Specification']
    }
  ];

  const categories = [
    { name: 'All Documents', count: 156, icon: '📄' },
    { name: 'Financial', count: 42, icon: '💰' },
    { name: 'HR', count: 28, icon: '👥' },
    { name: 'Legal', count: 35, icon: '⚖️' },
    { name: 'Marketing', count: 24, icon: '📢' },
    { name: 'Technical', count: 27, icon: '🔧' }
  ];

  return (
    <div className="document-management">
      <div className="page-header">
        <div className="header-content">
          <h1>📄 Document Management</h1>
          <p className="subtitle">Organize and manage all your documents in one place</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary">
            <span>⚙️</span> Settings
          </button>
          <button className="btn-primary">
            <span>+</span> Add Document
          </button>
        </div>
      </div>

      <div className="management-container">
        <aside className="sidebar-categories">
          <h3>Categories</h3>
          <div className="category-list">
            {categories.map((category) => (
              <div key={category.name} className="category-item">
                <span className="category-icon">{category.icon}</span>
                <span className="category-name">{category.name}</span>
                <span className="category-count">{category.count}</span>
              </div>
            ))}
          </div>

          <div className="folder-section">
            <h3>📁 Folders</h3>
            <div className="folder-list">
              <div className="folder-item">
                <span>📁</span> Archives
              </div>
              <div className="folder-item">
                <span>📁</span> Shared
              </div>
              <div className="folder-item">
                <span>📁</span> Important
              </div>
              <div className="folder-item">
                <span>📁</span> Templates
              </div>
            </div>
          </div>
        </aside>

        <main className="documents-main">
          <div className="toolbar">
            <div className="view-options">
              <button className="view-btn active">
                <span>▦</span> Grid
              </button>
              <button className="view-btn">
                <span>☰</span> List
              </button>
            </div>
            <div className="sort-filter">
              <select className="sort-select">
                <option>Sort by: Date (Newest)</option>
                <option>Sort by: Name (A-Z)</option>
                <option>Sort by: Size</option>
                <option>Sort by: Type</option>
              </select>
              <button className="filter-btn">
                <span>⚙️</span> Filters
              </button>
            </div>
          </div>

          <div className="documents-grid">
            {mockDocuments.map((doc) => (
              <div key={doc.id} className="document-card">
                <div className="doc-card-header">
                  <div className="doc-icon">📄</div>
                  <div className="doc-menu">⋮</div>
                </div>
                <div className="doc-card-body">
                  <h4 className="doc-name">{doc.name}</h4>
                  <div className="doc-meta">
                    <span className="doc-type">{doc.type}</span>
                    <span className="doc-size">{doc.size}</span>
                  </div>
                  <div className="doc-date">📅 {doc.uploadDate}</div>
                  <div className="doc-tags">
                    {doc.tags.map((tag) => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                  <div className={`doc-status status-${doc.status.toLowerCase()}`}>
                    {doc.status}
                  </div>
                </div>
                <div className="doc-card-footer">
                  <button className="btn-icon">👁️ View</button>
                  <button className="btn-icon">↓ Download</button>
                  <button className="btn-icon">🔗 Share</button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DocumentManagement;
