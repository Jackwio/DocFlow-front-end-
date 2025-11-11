import React, { useState, useEffect } from 'react';
import PageLayout from '../components/PageLayout';
import {
  documentsApi,
  DocumentListDto,
  DocumentStatus,
  formatFileSize,
  getStatusDisplayName,
} from '../services/documentsApi';

const DocumentManagement: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentListDto[]>([]);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | undefined>(undefined);
  const [addTagDialogOpen, setAddTagDialogOpen] = useState(false);
  const [newTagName, setNewTagName] = useState('');

  useEffect(() => {
    loadDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, statusFilter]);

  const loadDocuments = async () => {
    setLoading(true);
    setError(null);
    try {
      const skipCount = (currentPage - 1) * pageSize;
      const result = await documentsApi.getDocumentList(
        statusFilter,
        undefined,
        undefined,
        skipCount,
        pageSize
      );
      // Map backend `fileSizeBytes` (if present) to `fileSize` expected by UI
      const items = (result?.items ?? []).map((item: any) => ({
        ...item,
        fileSize: item.fileSize ?? item.fileSizeBytes ?? 0,
      }));
      setDocuments(items);
      setTotalCount(result?.totalCount ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDoc = (docId: string) => {
    setSelectedDocs((prev) =>
      prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]
    );
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedDocs(documents.map((doc) => doc.id));
    } else {
      setSelectedDocs([]);
    }
  };

  const handleAddTags = async () => {
    if (!newTagName.trim()) {
      alert('Please enter a tag name');
      return;
    }

    try {
      // Add tag to all selected documents
      await Promise.all(
        selectedDocs.map((docId) => documentsApi.addManualTag(docId, newTagName.trim()))
      );
      setNewTagName('');
      setAddTagDialogOpen(false);
      setSelectedDocs([]);
      // Reload documents to show new tags
      await loadDocuments();
    } catch (err) {
      alert('Failed to add tags: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleView = async (docId: string) => {
    try {
      const doc = await documentsApi.getDocument(docId);
      window.open(doc.blobUri, '_blank');
    } catch (err) {
      alert('Failed to view document: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleDownload = async (docId: string) => {
    try {
      const doc = await documentsApi.getDocument(docId);
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = doc.blobUri;
      link.download = doc.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert('Failed to download document: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleDownloadSelected = async () => {
    for (const docId of selectedDocs) {
      await handleDownload(docId);
    }
  };

  return (
    <PageLayout title="Document Management">
      <h2 className="section-title">All Documents</h2>
      
      {error && (
        <div style={{ padding: '10px', backgroundColor: '#fee', color: '#c00', marginBottom: '20px', borderRadius: '6px' }}>
          {error}
        </div>
      )}

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <label style={{ fontWeight: 600 }}>Filter by Status:</label>
        <select
          value={statusFilter !== undefined ? statusFilter.toString() : ''}
          onChange={(e) => {
            const value = e.target.value;
            setStatusFilter(value === '' ? undefined : parseInt(value));
            setCurrentPage(1);
          }}
          style={{
            padding: '8px',
            borderRadius: '6px',
            border: '1px solid #ddd',
            fontSize: '1rem',
          }}
        >
          <option value="">All</option>
          <option value={DocumentStatus.Pending}>Pending</option>
          <option value={DocumentStatus.Classified}>Classified</option>
          <option value={DocumentStatus.Failed}>Failed</option>
          <option value={DocumentStatus.Routed}>Routed</option>
        </select>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button
          className="action-button secondary"
          disabled={selectedDocs.length === 0}
          onClick={() => setAddTagDialogOpen(true)}
        >
          🏷️ Add Tags ({selectedDocs.length} selected)
        </button>
        <button
          className="action-button secondary"
          disabled={selectedDocs.length === 0}
          onClick={handleDownloadSelected}
        >
          📥 Download Selected
        </button>
      </div>

      {addTagDialogOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setAddTagDialogOpen(false)}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '12px',
              maxWidth: '400px',
              width: '100%',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginTop: 0 }}>Add Tag</h3>
            <input
              type="text"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="Enter tag name"
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                fontSize: '1rem',
                marginBottom: '20px',
              }}
            />
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                className="action-button secondary"
                onClick={() => {
                  setAddTagDialogOpen(false);
                  setNewTagName('');
                }}
              >
                Cancel
              </button>
              <button className="action-button" onClick={handleAddTags}>
                Add Tag
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading documents...</div>
      ) : (
        <>
          <table className="data-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedDocs.length === documents.length && documents.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Name</th>
                <th>Type</th>
                <th>Size</th>
                <th>Status</th>
                <th>Uploaded</th>
                <th>Tags</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '40px' }}>
                    No documents found
                  </td>
                </tr>
              ) : (
                documents.map((doc) => (
                  <tr key={doc.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedDocs.includes(doc.id)}
                        onChange={() => handleSelectDoc(doc.id)}
                      />
                    </td>
                    <td>{doc.fileName}</td>
                    <td>
                      {doc.fileName.split('.').pop()?.toUpperCase() || 'Unknown'}
                    </td>
                    <td>{formatFileSize(doc.fileSize)}</td>
                    <td>
                      <span
                        className={`status-badge status-${getStatusDisplayName(doc.status).toLowerCase()}`}
                      >
                        {getStatusDisplayName(doc.status)}
                      </span>
                    </td>
                    <td>{new Date(doc.creationTime).toLocaleString()}</td>
                    <td>
                      {(doc.tags || []).map((tag) => {
                        const tagName = typeof tag === 'string' ? tag : (tag as any).name || String(tag);
                        return (
                          <span key={tagName} className="tag">
                            {tagName}
                          </span>
                        );
                      })}
                    </td>
                    <td>
                      <button className="action-button" onClick={() => handleView(doc.id)}>
                        View
                      </button>
                      <button className="action-button" onClick={() => handleDownload(doc.id)}>
                        Download
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              Showing {documents.length} of {totalCount} documents
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className="action-button secondary"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Previous
              </button>
              <span style={{ padding: '10px' }}>
                Page {currentPage} of {Math.ceil(totalCount / pageSize) || 1}
              </span>
              <button
                className="action-button secondary"
                disabled={currentPage >= Math.ceil(totalCount / pageSize)}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      <div className="info-grid" style={{ marginTop: '30px' }}>
        <div className="info-card">
          <h4>Total Documents</h4>
          <p>{totalCount}</p>
        </div>
        <div className="info-card">
          <h4>Classified</h4>
          <p>{documents.filter((d) => d.status === DocumentStatus.Classified).length}</p>
        </div>
        <div className="info-card">
          <h4>Pending</h4>
          <p>{documents.filter((d) => d.status === DocumentStatus.Pending).length}</p>
        </div>
        <div className="info-card">
          <h4>Failed</h4>
          <p>{documents.filter((d) => d.status === DocumentStatus.Failed).length}</p>
        </div>
      </div>
    </PageLayout>
  );
};

export default DocumentManagement;
