import React from 'react';
import './Documents.css';

const Documents: React.FC = () => {
  return (
    <div className="documents">
      <div className="documents-header">
        <h1>Documents</h1>
        <button className="btn-primary">Upload Document</button>
      </div>
      <div className="documents-search">
        <input
          type="text"
          placeholder="Search documents..."
          className="search-input"
        />
        <select className="filter-select">
          <option value="">All Types</option>
          <option value="pdf">PDF</option>
          <option value="doc">Word</option>
          <option value="xls">Excel</option>
        </select>
      </div>
      <div className="documents-list">
        <div className="no-documents">
          <p>📄</p>
          <p>No documents yet. Upload your first document to get started.</p>
        </div>
      </div>
    </div>
  );
};

export default Documents;
