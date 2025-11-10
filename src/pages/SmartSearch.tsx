import React from 'react';
import './SmartSearch.css';

const SmartSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedFilters, setSelectedFilters] = React.useState<string[]>([]);

  const searchResults = [
    {
      id: 1,
      name: 'Financial Report Q4 2024.pdf',
      type: 'Financial',
      content: 'The fourth quarter financial report shows a 15% increase in revenue...',
      date: '2025-11-08',
      tags: ['Finance', 'Q4', 'Report'],
      relevance: 98
    },
    {
      id: 2,
      name: 'Budget Proposal 2025.xlsx',
      type: 'Financial',
      content: 'Proposed budget allocation for fiscal year 2025 with detailed breakdown...',
      date: '2025-11-05',
      tags: ['Finance', 'Budget', '2025'],
      relevance: 95
    },
    {
      id: 3,
      name: 'Employee Benefits Overview.pdf',
      type: 'HR',
      content: 'Comprehensive overview of employee benefits including health insurance...',
      date: '2025-10-28',
      tags: ['HR', 'Benefits', 'Policy'],
      relevance: 87
    },
    {
      id: 4,
      name: 'Marketing Campaign Analysis.pptx',
      type: 'Marketing',
      content: 'Analysis of Q3 marketing campaign performance and ROI metrics...',
      date: '2025-10-25',
      tags: ['Marketing', 'Analysis', 'Q3'],
      relevance: 82
    }
  ];

  const filters = {
    documentTypes: ['Financial', 'HR', 'Legal', 'Marketing', 'Technical', 'Project'],
    dateRanges: ['Today', 'Last 7 days', 'Last 30 days', 'Last 3 months', 'Last year'],
    tags: ['Finance', 'HR', 'Marketing', 'Q1', 'Q2', 'Q3', 'Q4', 'Report', 'Policy', 'Budget'],
    fileTypes: ['PDF', 'Word', 'Excel', 'PowerPoint', 'Images']
  };

  const savedSearches = [
    { name: 'Financial Reports Q4', count: 42 },
    { name: 'HR Policies 2025', count: 28 },
    { name: 'Pending Approvals', count: 15 },
    { name: 'Contracts Expiring Soon', count: 8 }
  ];

  return (
    <div className="smart-search">
      <div className="page-header">
        <div className="header-content">
          <h1>🔍 Smart Search</h1>
          <p className="subtitle">Find documents easily with powerful search and filters</p>
        </div>
      </div>

      <div className="search-container">
        <div className="search-main">
          <div className="search-box-wrapper">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search by name, content, tags, or metadata..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button className="btn-search">Search</button>
            </div>
            <div className="search-suggestions">
              <span className="suggestion-label">Try:</span>
              <button className="suggestion-chip">"financial report"</button>
              <button className="suggestion-chip">status:pending</button>
              <button className="suggestion-chip">type:pdf</button>
              <button className="suggestion-chip">tag:Q4</button>
            </div>
          </div>

          <div className="search-features">
            <div className="feature-item">
              <span className="feature-icon">🎯</span>
              <div className="feature-text">
                <strong>Smart Matching</strong>
                <p>AI-powered relevance ranking</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📝</span>
              <div className="feature-text">
                <strong>Full-Text Search</strong>
                <p>Search within document content</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🏷️</span>
              <div className="feature-text">
                <strong>Tag Search</strong>
                <p>Find by tags and metadata</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">⚡</span>
              <div className="feature-text">
                <strong>Instant Results</strong>
                <p>Lightning-fast search engine</p>
              </div>
            </div>
          </div>

          <div className="active-filters">
            {selectedFilters.length > 0 && (
              <>
                <span className="filters-label">Active Filters:</span>
                {selectedFilters.map((filter) => (
                  <span key={filter} className="filter-chip">
                    {filter}
                    <button
                      className="remove-filter"
                      onClick={() => setSelectedFilters(selectedFilters.filter(f => f !== filter))}
                    >
                      ×
                    </button>
                  </span>
                ))}
                <button
                  className="clear-filters"
                  onClick={() => setSelectedFilters([])}
                >
                  Clear all
                </button>
              </>
            )}
          </div>

          <div className="search-results">
            <div className="results-header">
              <h3>Search Results ({searchResults.length})</h3>
              <select className="sort-select">
                <option>Sort by: Relevance</option>
                <option>Sort by: Date (Newest)</option>
                <option>Sort by: Name (A-Z)</option>
                <option>Sort by: File Size</option>
              </select>
            </div>

            <div className="results-list">
              {searchResults.map((result) => (
                <div key={result.id} className="result-card">
                  <div className="result-header">
                    <div className="result-title">
                      <span className="result-icon">📄</span>
                      <h4>{result.name}</h4>
                    </div>
                    <div className="relevance-badge">
                      {result.relevance}% match
                    </div>
                  </div>
                  <div className="result-content">
                    <p className="result-excerpt">{result.content}</p>
                  </div>
                  <div className="result-meta">
                    <span className="meta-item">
                      <span className="meta-icon">📁</span>
                      {result.type}
                    </span>
                    <span className="meta-item">
                      <span className="meta-icon">📅</span>
                      {result.date}
                    </span>
                    <div className="result-tags">
                      {result.tags.map((tag) => (
                        <span key={tag} className="tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="result-actions">
                    <button className="action-btn">👁️ View</button>
                    <button className="action-btn">↓ Download</button>
                    <button className="action-btn">🔗 Share</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="search-sidebar">
          <div className="sidebar-section">
            <h3>⚙️ Filters</h3>
            
            <div className="filter-group">
              <h4>Document Type</h4>
              {filters.documentTypes.map((type) => (
                <label key={type} className="filter-checkbox">
                  <input type="checkbox" />
                  <span>{type}</span>
                </label>
              ))}
            </div>

            <div className="filter-group">
              <h4>Date Range</h4>
              {filters.dateRanges.map((range) => (
                <label key={range} className="filter-radio">
                  <input type="radio" name="dateRange" />
                  <span>{range}</span>
                </label>
              ))}
            </div>

            <div className="filter-group">
              <h4>File Type</h4>
              {filters.fileTypes.map((type) => (
                <label key={type} className="filter-checkbox">
                  <input type="checkbox" />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <h3>💾 Saved Searches</h3>
            <div className="saved-searches">
              {savedSearches.map((search, index) => (
                <div key={index} className="saved-search-item">
                  <div className="saved-search-name">{search.name}</div>
                  <div className="saved-search-count">{search.count}</div>
                </div>
              ))}
            </div>
            <button className="btn-save-search">+ Save Current Search</button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default SmartSearch;
