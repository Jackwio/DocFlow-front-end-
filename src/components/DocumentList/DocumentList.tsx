import React, { useState, useEffect } from 'react';
import { Document, DocumentStatus } from '../../types/Document';
import DocumentCard from '../DocumentCard/DocumentCard';
import './DocumentList.css';

const DocumentList: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    // Simulate loading documents from an API
    // In a real application, this would be an API call
    const mockDocuments: Document[] = [
      {
        id: '1',
        title: 'Project Proposal',
        description: 'Initial project proposal document for Q1 2025',
        fileName: 'proposal.pdf',
        fileSize: 1024000,
        fileType: 'application/pdf',
        status: DocumentStatus.APPROVED,
        uploadedAt: new Date('2025-01-15'),
        updatedAt: new Date('2025-01-20'),
        uploadedBy: 'John Doe'
      },
      {
        id: '2',
        title: 'Budget Report',
        description: 'Annual budget report and financial projections',
        fileName: 'budget-2025.xlsx',
        fileSize: 512000,
        fileType: 'application/vnd.ms-excel',
        status: DocumentStatus.IN_REVIEW,
        uploadedAt: new Date('2025-02-01'),
        updatedAt: new Date('2025-02-03'),
        uploadedBy: 'Jane Smith'
      },
      {
        id: '3',
        title: 'Meeting Notes',
        description: 'Weekly team meeting notes and action items',
        fileName: 'meeting-notes.docx',
        fileSize: 256000,
        fileType: 'application/msword',
        status: DocumentStatus.DRAFT,
        uploadedAt: new Date('2025-02-10'),
        updatedAt: new Date('2025-02-10'),
        uploadedBy: 'Alice Johnson'
      }
    ];

    setTimeout(() => {
      setDocuments(mockDocuments);
      setLoading(false);
    }, 500);
  }, []);

  const filteredDocuments = documents.filter(doc => {
    if (filter === 'all') return true;
    return doc.status.toLowerCase().replace(' ', '-') === filter;
  });

  const handleViewDocument = (id: string) => {
    console.log('View document:', id);
    // In a real application, this would navigate to the document detail page
  };

  return (
    <div className="document-list">
      <div className="document-list-header">
        <h2>Documents</h2>
        <div className="filter-controls">
          <label htmlFor="status-filter">Filter by status:</label>
          <select
            id="status-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="status-filter"
          >
            <option value="all">All</option>
            <option value="draft">Draft</option>
            <option value="in-review">In Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading documents...</div>
      ) : filteredDocuments.length === 0 ? (
        <div className="no-documents">No documents found</div>
      ) : (
        <div className="document-list-content">
          {filteredDocuments.map(doc => (
            <DocumentCard
              key={doc.id}
              document={doc}
              onView={handleViewDocument}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentList;
