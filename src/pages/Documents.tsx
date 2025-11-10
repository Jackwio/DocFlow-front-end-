import React, { useState, useEffect } from 'react';
import DocumentList from '../components/documents/DocumentList';
import DocumentUpload from '../components/documents/DocumentUpload';
import { DocumentsApiService } from '../services/api/documents';
import { DocumentListDto, DocumentStatus } from '../types/document';
import { formatFileSize } from '../utils/formatting';
import './Documents.css';

// Map API status to UI status
const mapStatus = (status: DocumentStatus): 'pending' | 'approved' | 'rejected' => {
  switch (status) {
    case DocumentStatus.Classified:
    case DocumentStatus.Routed:
      return 'approved';
    case DocumentStatus.Failed:
      return 'rejected';
    default:
      return 'pending';
  }
};

const Documents: React.FC = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');

  // Load documents from API
  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await DocumentsApiService.getDocumentList({
        skipCount: 0,
        maxResultCount: 100,
      });

      // Transform API documents to UI format
      const transformedDocs = result.items.map((doc: DocumentListDto) => ({
        id: doc.id,
        name: doc.fileName,
        type: doc.fileName.split('.').pop() || 'unknown',
        size: formatFileSize(doc.fileSize),
        uploadedBy: 'System User', // API doesn't provide this yet
        uploadedAt: new Date(doc.uploadedAt).toLocaleDateString(),
        status: mapStatus(doc.status),
      }));

      setDocuments(transformedDocs);
    } catch (err) {
      console.error('Failed to load documents:', err);
      setError('Failed to load documents. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleUpload = async (file: File) => {
    try {
      setError(null);
      await DocumentsApiService.uploadDocument(file, file.name);
      
      // Reload documents after successful upload
      await loadDocuments();
      setShowUpload(false);
    } catch (err) {
      console.error('Failed to upload document:', err);
      setError('Failed to upload document. Please try again.');
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || doc.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesType;
  });

  return (
    <div className="documents">
      <div className="documents-header">
        <h1>Documents</h1>
        <button className="btn-primary" onClick={() => setShowUpload(true)}>
          Upload Document
        </button>
      </div>

      {error && (
        <div className="error-message" style={{ 
          padding: '1rem', 
          backgroundColor: '#fee', 
          borderRadius: '4px', 
          color: '#c00',
          marginBottom: '1rem' 
        }}>
          {error}
        </div>
      )}

      <div className="documents-search">
        <input
          type="text"
          placeholder="Search documents..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="filter-select"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="">All Types</option>
          <option value="pdf">PDF</option>
          <option value="docx">Word</option>
          <option value="xlsx">Excel</option>
        </select>
      </div>

      <div className="documents-list">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
            Loading documents...
          </div>
        ) : (
          <DocumentList documents={filteredDocuments} />
        )}
      </div>

      {showUpload && (
        <DocumentUpload
          onUpload={handleUpload}
          onClose={() => setShowUpload(false)}
        />
      )}
    </div>
  );
};

export default Documents;
