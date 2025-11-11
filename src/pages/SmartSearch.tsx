import React, { useState } from 'react';
import PageLayout from '../components/PageLayout';
import { mockDocuments } from '../utils/mockData';

const SmartSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [documents] = useState(mockDocuments);

  const allTags = Array.from(
    new Set(documents.flatMap((doc) => doc.tags))
  );

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      searchTerm === '' ||
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.every((tag) => doc.tags.includes(tag));

    const matchesStatus =
      selectedStatus === 'all' || doc.status === selectedStatus;

    return matchesSearch && matchesTags && matchesStatus;
  });

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <PageLayout title="Smart Search">
      <h2 className="section-title">Search & Filter Documents</h2>

      <div style={{ marginBottom: '30px' }}>
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="🔍 Search by name or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 20px',
              fontSize: '1rem',
              borderRadius: '8px',
              border: '2px solid #ddd',
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 600 }}>
            Filter by Status:
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #ddd',
              fontSize: '1rem',
              minWidth: '200px',
            }}
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Classified">Classified</option>
            <option value="Routed">Routed</option>
            <option value="Failed">Failed</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 600 }}>
            Filter by Tags:
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className="tag"
                style={{
                  cursor: 'pointer',
                  border: 'none',
                  opacity: selectedTags.includes(tag) ? 1 : 0.5,
                  transform: selectedTags.includes(tag) ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                {tag} {selectedTags.includes(tag) ? '✓' : ''}
              </button>
            ))}
          </div>
        </div>
      </div>

      <h2 className="section-title">
        Search Results ({filteredDocuments.length})
      </h2>

      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Uploaded</th>
            <th>Inbox</th>
            <th>Uploader</th>
            <th>Tags</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredDocuments.map((doc) => (
            <tr key={doc.id}>
              <td>{doc.name}</td>
              <td>
                <span className={`status-badge status-${doc.status.toLowerCase()}`}>
                  {doc.status}
                </span>
              </td>
              <td>{formatDate(doc.uploadDate)}</td>
              <td>{doc.inbox}</td>
              <td>{doc.uploader}</td>
              <td>
                {doc.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </td>
              <td>
                <button className="action-button">View</button>
                <button className="action-button">Download</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredDocuments.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          <p style={{ fontSize: '1.2rem' }}>No documents found matching your criteria</p>
        </div>
      )}
    </PageLayout>
  );
};

export default SmartSearch;
