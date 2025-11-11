import React, { useState, useEffect } from 'react';
import './DocumentManagement.css';

// TypeScript interfaces based on documents-api.md
enum DocumentStatus {
  Pending = 0,
  Classified = 1,
  Failed = 2,
  Routed = 3
}

interface DocumentListDto {
  id: string;
  fileName: string;
  fileSize: number;
  status: DocumentStatus;
  uploadedAt: string;
  classifiedAt?: string;
  tags: string[];
}

interface PagedResultDto<T> {
  totalCount: number;
  items: T[];
}

const DocumentManagement: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentListDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Documents');
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 12;

  const categories = [
    { name: 'All Documents', count: totalCount, icon: '📄' },
    { name: 'Financial', count: 0, icon: '💰' },
    { name: 'HR', count: 0, icon: '👥' },
    { name: 'Legal', count: 0, icon: '⚖️' },
    { name: 'Marketing', count: 0, icon: '📢' },
    { name: 'Technical', count: 0, icon: '🔧' }
  ];

  // Fetch documents from API
  const fetchDocuments = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token') || '';
      const skipCount = (currentPage - 1) * pageSize;
      
      const params = new URLSearchParams({
        skipCount: skipCount.toString(),
        maxResultCount: pageSize.toString()
      });

      if (statusFilter !== null) {
        params.append('status', statusFilter.toString());
      }

      const response = await fetch(`/api/documents?${params}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch documents: ${response.status} ${response.statusText}`);
      }

      const result: PagedResultDto<DocumentListDto> = await response.json();
      setDocuments(result.items);
      setTotalCount(result.totalCount);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError(err instanceof Error ? err.message : 'Failed to load documents');
      
      // Use mock data as fallback
      const mockDocuments: DocumentListDto[] = [
        {
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          fileName: 'Q4 Financial Report.pdf',
          fileSize: 2516582,
          status: DocumentStatus.Classified,
          uploadedAt: '2025-11-08T10:30:00Z',
          classifiedAt: '2025-11-08T10:30:15Z',
          tags: ['Financial', 'Q4', 'Report']
        },
        {
          id: '7fb95f64-6828-5673-c4gd-3d074g77bgb7',
          fileName: 'Employee Handbook 2025.docx',
          fileSize: 1887437,
          status: DocumentStatus.Pending,
          uploadedAt: '2025-11-05T11:00:00Z',
          tags: ['HR', 'Policy', '2025']
        },
        {
          id: '8gc06g75-7939-6784-d5he-4e185h88chc8',
          fileName: 'Project Proposal - Alpha.pdf',
          fileSize: 3355443,
          status: DocumentStatus.Classified,
          uploadedAt: '2025-11-01T09:15:00Z',
          classifiedAt: '2025-11-01T09:15:20Z',
          tags: ['Project', 'Alpha', 'Proposal']
        },
        {
          id: '9hd17h86-8040-7895-e6if-5f296i99dih9',
          fileName: 'Marketing Strategy Q1.pptx',
          fileSize: 5348474,
          status: DocumentStatus.Routed,
          uploadedAt: '2025-10-28T14:20:00Z',
          classifiedAt: '2025-10-28T14:20:25Z',
          tags: ['Marketing', 'Strategy', 'Q1']
        },
        {
          id: '0ie28i97-9151-8906-f7jg-6g307j00ejia',
          fileName: 'Contract - Vendor ABC.pdf',
          fileSize: 911565,
          status: DocumentStatus.Pending,
          uploadedAt: '2025-10-25T16:45:00Z',
          tags: ['Legal', 'Contract', 'Vendor']
        },
        {
          id: '1jf39j08-0262-9017-g8kh-7h418k11fkjb',
          fileName: 'Technical Specification.pdf',
          fileSize: 4718592,
          status: DocumentStatus.Classified,
          uploadedAt: '2025-10-20T08:30:00Z',
          classifiedAt: '2025-10-20T08:30:18Z',
          tags: ['Technical', 'Specification']
        }
      ];
      setDocuments(mockDocuments);
      setTotalCount(mockDocuments.length);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [currentPage, statusFilter]);

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Get status display text
  const getStatusText = (status: DocumentStatus): string => {
    switch (status) {
      case DocumentStatus.Pending:
        return 'Pending';
      case DocumentStatus.Classified:
        return 'Approved';
      case DocumentStatus.Failed:
        return 'Failed';
      case DocumentStatus.Routed:
        return 'Routed';
      default:
        return 'Unknown';
    }
  };

  // Download document
  const handleDownload = async (documentId: string, fileName: string) => {
    try {
      const token = localStorage.getItem('token') || '';
      const response = await fetch(`/api/documents/${documentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const doc = await response.json();
        // Open blob URI for download
        window.open(doc.blobUri, '_blank');
      } else {
        alert('Failed to download document');
      }
    } catch (err) {
      console.error('Download error:', err);
      alert('Failed to download document');
    }
  };

  // View document details
  const handleView = async (documentId: string) => {
    try {
      const token = localStorage.getItem('token') || '';
      const response = await fetch(`/api/documents/${documentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const doc = await response.json();
        console.log('Document details:', doc);
        // Could open a modal or navigate to detail page
        alert(`Document: ${doc.fileName}\nStatus: ${getStatusText(doc.status)}\nTags: ${doc.tags.map((t: any) => t.name || t).join(', ')}`);
      }
    } catch (err) {
      console.error('View error:', err);
    }
  };

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
          <button className="btn-primary" onClick={() => window.location.href = '/#/easy-upload'}>
            <span>+</span> Add Document
          </button>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          ⚠️ {error} - Showing cached data
          <button onClick={() => fetchDocuments()}>Retry</button>
        </div>
      )}

      <div className="management-container">
        <aside className="sidebar-categories">
          <h3>Categories</h3>
          <div className="category-list">
            {categories.map((category) => (
              <div 
                key={category.name} 
                className={`category-item ${selectedCategory === category.name ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.name)}
              >
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

          <div className="status-filter-section">
            <h3>Status Filter</h3>
            <div className="filter-options">
              <label>
                <input 
                  type="radio" 
                  name="status" 
                  checked={statusFilter === null}
                  onChange={() => setStatusFilter(null)}
                />
                All
              </label>
              <label>
                <input 
                  type="radio" 
                  name="status" 
                  checked={statusFilter === DocumentStatus.Pending}
                  onChange={() => setStatusFilter(DocumentStatus.Pending)}
                />
                Pending
              </label>
              <label>
                <input 
                  type="radio" 
                  name="status" 
                  checked={statusFilter === DocumentStatus.Classified}
                  onChange={() => setStatusFilter(DocumentStatus.Classified)}
                />
                Classified
              </label>
              <label>
                <input 
                  type="radio" 
                  name="status" 
                  checked={statusFilter === DocumentStatus.Routed}
                  onChange={() => setStatusFilter(DocumentStatus.Routed)}
                />
                Routed
              </label>
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
              <button className="filter-btn" onClick={() => fetchDocuments()}>
                <span>🔄</span> Refresh
              </button>
            </div>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading documents...</p>
            </div>
          ) : documents.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>No documents found</h3>
              <p>Upload your first document to get started</p>
              <button className="btn-primary" onClick={() => window.location.href = '/#/easy-upload'}>
                <span>+</span> Upload Document
              </button>
            </div>
          ) : (
            <>
              <div className="documents-grid">
                {documents.map((doc) => (
                  <div key={doc.id} className="document-card">
                    <div className="doc-card-header">
                      <div className="doc-icon">📄</div>
                      <div className="doc-menu">⋮</div>
                    </div>
                    <div className="doc-card-body">
                      <h4 className="doc-name">{doc.fileName}</h4>
                      <div className="doc-meta">
                        <span className="doc-type">{doc.tags[0] || 'Document'}</span>
                        <span className="doc-size">{formatFileSize(doc.fileSize)}</span>
                      </div>
                      <div className="doc-date">📅 {formatDate(doc.uploadedAt)}</div>
                      <div className="doc-tags">
                        {doc.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="tag">{tag}</span>
                        ))}
                      </div>
                      <div className={`doc-status status-${getStatusText(doc.status).toLowerCase()}`}>
                        {getStatusText(doc.status)}
                      </div>
                    </div>
                    <div className="doc-card-footer">
                      <button className="btn-icon" onClick={() => handleView(doc.id)}>👁️ View</button>
                      <button className="btn-icon" onClick={() => handleDownload(doc.id, doc.fileName)}>↓ Download</button>
                      <button className="btn-icon">🔗 Share</button>
                    </div>
                  </div>
                ))}
              </div>

              {totalCount > pageSize && (
                <div className="pagination">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <span className="page-info">
                    Page {currentPage} of {Math.ceil(totalCount / pageSize)}
                  </span>
                  <button 
                    onClick={() => setCurrentPage(p => p + 1)}
                    disabled={currentPage >= Math.ceil(totalCount / pageSize)}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default DocumentManagement;
