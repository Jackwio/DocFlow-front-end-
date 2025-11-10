import React from 'react';
import './AIFeatures.css';

const AIFeatures: React.FC = () => {
  const documents = [
    {
      id: 1,
      name: 'Marketing_Proposal_2025.pdf',
      suggestedTags: ['Marketing', 'Proposal', '2025', 'Strategy'],
      summary: 'Comprehensive marketing strategy proposal for Q1 2025 focusing on digital channels and social media expansion...',
      confidence: 95
    },
    {
      id: 2,
      name: 'Contract_Agreement.docx',
      suggestedTags: ['Legal', 'Contract', 'Vendor', 'Agreement'],
      summary: 'Service agreement contract between company and vendor outlining terms, payment schedule, and deliverables...',
      confidence: 92
    }
  ];

  const aiSettings = [
    { name: 'Auto-Classification', enabled: true, description: 'Automatically classify documents based on content' },
    { name: 'Tag Suggestions', enabled: true, description: 'AI-powered tag recommendations' },
    { name: 'Content Summarization', enabled: true, description: 'Generate document summaries' },
    { name: 'Entity Extraction', enabled: false, description: 'Extract names, dates, and key information' },
    { name: 'Language Detection', enabled: true, description: 'Detect document language automatically' }
  ];

  return (
    <div className="ai-features">
      <div className="page-header">
        <div className="header-content">
          <h1>🤖 AI Features</h1>
          <p className="subtitle">Intelligent document processing and automation</p>
        </div>
        <div className="header-actions">
          <button className="btn-danger">
            <span>🛑</span> Emergency AI Shutdown
          </button>
        </div>
      </div>

      <div className="ai-container">
        <div className="ai-main">
          {/* AI Status */}
          <div className="ai-status-section">
            <div className="status-card active">
              <div className="status-icon">🟢</div>
              <div className="status-content">
                <h2>AI Systems Active</h2>
                <p>All AI features are operational and processing documents</p>
              </div>
              <button className="btn-toggle-ai">Disable All AI</button>
            </div>
          </div>

          {/* AI-Powered Documents */}
          <div className="ai-documents-section">
            <div className="section-header">
              <h2>🎯 AI-Powered Document Processing</h2>
              <button className="btn-process">Process Pending Documents</button>
            </div>
            <div className="documents-list">
              {documents.map((doc) => (
                <div key={doc.id} className="document-card">
                  <div className="doc-header">
                    <div className="doc-info">
                      <span className="doc-icon">📄</span>
                      <h3>{doc.name}</h3>
                    </div>
                    <div className="confidence-badge">
                      <span className="confidence-icon">🎯</span>
                      {doc.confidence}% confidence
                    </div>
                  </div>
                  
                  <div className="ai-section">
                    <h4>🏷️ Suggested Tags</h4>
                    <div className="tags-container">
                      {doc.suggestedTags.map((tag, index) => (
                        <div key={index} className="suggested-tag">
                          <span className="tag-text">{tag}</span>
                          <button className="btn-apply">✓ Apply</button>
                        </div>
                      ))}
                    </div>
                    <button className="btn-apply-all">Apply All Tags</button>
                  </div>

                  <div className="ai-section">
                    <h4>📝 AI Summary</h4>
                    <div className="summary-box">
                      <p>{doc.summary}</p>
                      <button className="btn-full-summary">View Full Summary</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Settings */}
          <div className="ai-settings-section">
            <h2>⚙️ AI Feature Configuration</h2>
            <div className="settings-grid">
              {aiSettings.map((setting, index) => (
                <div key={index} className="setting-card">
                  <div className="setting-header">
                    <div className="setting-info">
                      <h3>{setting.name}</h3>
                      <p>{setting.description}</p>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" checked={setting.enabled} readOnly />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Controls */}
          <div className="emergency-section">
            <div className="emergency-card">
              <div className="emergency-icon">🚨</div>
              <div className="emergency-content">
                <h3>Emergency AI Controls</h3>
                <p>In case of compliance concerns or unexpected behavior, you can immediately disable all AI features with one click. This action:</p>
                <ul>
                  <li>Stops all AI processing immediately</li>
                  <li>Disables auto-classification and tag suggestions</li>
                  <li>Prevents new AI-powered operations</li>
                  <li>Logs the shutdown event in audit records</li>
                </ul>
                <button className="btn-emergency">🛑 Emergency AI Shutdown</button>
              </div>
            </div>
          </div>
        </div>

        <aside className="ai-sidebar">
          <div className="sidebar-section">
            <h3>📊 AI Usage Statistics</h3>
            <div className="stats-list">
              <div className="stat-row">
                <span className="stat-label">Documents Classified</span>
                <span className="stat-value">2,847</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Tags Suggested</span>
                <span className="stat-value">8,542</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Tags Applied</span>
                <span className="stat-value">7,123</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Summaries Generated</span>
                <span className="stat-value">1,456</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Accuracy Rate</span>
                <span className="stat-value">94.2%</span>
              </div>
            </div>
          </div>

          <div className="sidebar-section">
            <h3>⚡ Quick Actions</h3>
            <div className="quick-actions">
              <button className="quick-action-btn">
                <span>📊</span> View AI Report
              </button>
              <button className="quick-action-btn">
                <span>🔄</span> Retrain Models
              </button>
              <button className="quick-action-btn">
                <span>📖</span> AI Documentation
              </button>
            </div>
          </div>

          <div className="sidebar-section">
            <h3>💡 AI Tips</h3>
            <div className="tips-list">
              <div className="tip-item">
                <span className="tip-icon">💡</span>
                <p>Review and apply suggested tags to improve AI accuracy over time</p>
              </div>
              <div className="tip-item">
                <span className="tip-icon">⚡</span>
                <p>AI summaries help quickly understand document content</p>
              </div>
              <div className="tip-item">
                <span className="tip-icon">🎯</span>
                <p>Higher confidence scores indicate more reliable predictions</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AIFeatures;
