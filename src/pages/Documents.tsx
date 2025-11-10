import React, { useState } from 'react';
import DocumentList from '../components/documents/DocumentList';
import DocumentUpload from '../components/documents/DocumentUpload';
import './Documents.css';

// Sample data - in a real app, this would come from an API
const sampleDocuments = [
  {
    id: '1',
    name: 'Project Proposal.pdf',
    type: 'pdf',
    size: '2.5 MB',
    uploadedBy: 'John Doe',
    uploadedAt: '2025-11-10',
    status: 'approved' as const,
  },
  {
    id: '2',
    name: 'Budget Report.xlsx',
    type: 'xlsx',
    size: '1.8 MB',
    uploadedBy: 'Jane Smith',
    uploadedAt: '2025-11-09',
    status: 'pending' as const,
  },
  {
    id: '3',
    name: 'Meeting Notes.docx',
    type: 'docx',
    size: '450 KB',
    uploadedBy: 'Bob Johnson',
    uploadedAt: '2025-11-08',
    status: 'approved' as const,
  },
];

const Documents: React.FC = () => {
  const [documents, setDocuments] = useState(sampleDocuments);
  const [showUpload, setShowUpload] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');

  const handleUpload = (file: File) => {
    // In a real app, you would upload the file to a server here
    const newDocument = {
      id: String(documents.length + 1),
      name: file.name,
      type: file.name.split('.').pop() || 'unknown',
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      uploadedBy: 'Current User',
      uploadedAt: new Date().toISOString().split('T')[0],
      status: 'pending' as const,
    };
    setDocuments([...documents, newDocument]);
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
        <DocumentList documents={filteredDocuments} />
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
