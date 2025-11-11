import React from 'react';
import './ComplianceAudit.css';

const ComplianceAudit: React.FC = () => {
  const auditLogs = [
    { id: 1, timestamp: '2025-11-10 14:23:15', user: 'john.smith@company.com', action: 'Document Uploaded', target: 'Contract_2025.pdf', ip: '192.168.1.45' },
    { id: 2, timestamp: '2025-11-10 14:15:08', user: 'sarah.j@company.com', action: 'Document Approved', target: 'Budget_Proposal.xlsx', ip: '192.168.1.67' },
    { id: 3, timestamp: '2025-11-10 13:42:31', user: 'system', action: 'Auto Classification', target: 'Invoice_Q4.pdf', ip: 'internal' },
    { id: 4, timestamp: '2025-11-10 13:18:52', user: 'admin@company.com', action: 'User Permission Changed', target: 'emily.davis@company.com', ip: '192.168.1.10' },
    { id: 5, timestamp: '2025-11-10 12:55:14', user: 'michael.c@company.com', action: 'Document Deleted', target: 'Old_Report.docx', ip: '192.168.1.89' }
  ];

  const retentionPolicies = [
    { name: 'Financial Documents', period: 7, unit: 'years', documentsAffected: 892, nextCleanup: '2026-01-15' },
    { name: 'HR Records', period: 5, unit: 'years', documentsAffected: 356, nextCleanup: '2026-02-01' },
    { name: 'General Documents', period: 90, unit: 'days', documentsAffected: 1599, nextCleanup: '2025-11-12' }
  ];

  const privacySettings = [
    { name: 'Text Extraction Storage', enabled: true, description: 'Store extracted text for search' },
    { name: 'Metadata Indexing', enabled: true, description: 'Index document metadata' },
    { name: 'Content Analysis', enabled: false, description: 'AI-powered content analysis' },
    { name: 'Audit Log Retention', enabled: true, description: 'Keep detailed audit logs' }
  ];

  return (
    <div className="compliance-audit">
      <div className="page-header">
        <div className="header-content">
          <h1>🛡️ Compliance & Audit</h1>
          <p className="subtitle">Monitor compliance and manage audit records</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary">
            <span>📊</span> Generate Report
          </button>
          <button className="btn-primary">
            <span>⬇️</span> Export Audit Logs
          </button>
        </div>
      </div>

      <div className="compliance-container">
        <div className="compliance-main">
          {/* Audit Log Section */}
          <div className="audit-log-section">
            <div className="section-header">
              <h2>📋 Audit Logs</h2>
              <div className="header-controls">
                <input type="date" className="date-filter" />
                <select className="filter-select">
                  <option>All Actions</option>
                  <option>Document Upload</option>
                  <option>Document Approved</option>
                  <option>User Permission</option>
                  <option>System Actions</option>
                </select>
                <button className="btn-filter">🔍 Search</button>
              </div>
            </div>
            <div className="audit-table">
              <table>
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>User</th>
                    <th>Action</th>
                    <th>Target</th>
                    <th>IP Address</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log) => (
                    <tr key={log.id}>
                      <td className="timestamp">{log.timestamp}</td>
                      <td className="user">{log.user}</td>
                      <td>
                        <span className="action-badge">{log.action}</span>
                      </td>
                      <td className="target">{log.target}</td>
                      <td className="ip">{log.ip}</td>
                      <td>
                        <button className="btn-view">View Details</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="table-footer">
              <span className="results-count">Showing 5 of 12,847 records</span>
              <div className="pagination">
                <button className="page-btn">←</button>
                <button className="page-btn active">1</button>
                <button className="page-btn">2</button>
                <button className="page-btn">3</button>
                <button className="page-btn">→</button>
              </div>
            </div>
          </div>

          {/* Export Section */}
          <div className="export-section">
            <h2>📤 Audit Export</h2>
            <div className="export-card">
              <div className="export-header">
                <div className="export-icon">📊</div>
                <div className="export-info">
                  <h3>Generate Audit Report</h3>
                  <p>Export audit logs with digital signature for compliance verification</p>
                </div>
              </div>
              <div className="export-options">
                <div className="option-row">
                  <label>Date Range</label>
                  <div className="date-range">
                    <input type="date" defaultValue="2025-11-01" />
                    <span>to</span>
                    <input type="date" defaultValue="2025-11-10" />
                  </div>
                </div>
                <div className="option-row">
                  <label>Export Format</label>
                  <div className="format-options">
                    <label className="radio-option">
                      <input type="radio" name="format" value="csv" defaultChecked />
                      <span>CSV</span>
                    </label>
                    <label className="radio-option">
                      <input type="radio" name="format" value="json" />
                      <span>JSON</span>
                    </label>
                    <label className="radio-option">
                      <input type="radio" name="format" value="pdf" />
                      <span>PDF Report</span>
                    </label>
                  </div>
                </div>
                <div className="option-row">
                  <label className="checkbox-option">
                    <input type="checkbox" defaultChecked />
                    <span>Include digital signature (SHA-256 hash)</span>
                  </label>
                </div>
                <div className="option-row">
                  <label className="checkbox-option">
                    <input type="checkbox" defaultChecked />
                    <span>Include verification certificate</span>
                  </label>
                </div>
              </div>
              <button className="btn-export">
                <span>⬇️</span> Generate & Download Export
              </button>
            </div>
          </div>

          {/* Retention Policies */}
          <div className="retention-section">
            <div className="section-header">
              <h2>📅 Document Retention Policies</h2>
              <button className="btn-add">+ Add Policy</button>
            </div>
            <div className="policies-list">
              {retentionPolicies.map((policy, index) => (
                <div key={index} className="policy-card">
                  <div className="policy-info">
                    <h3>{policy.name}</h3>
                    <div className="policy-details">
                      <div className="detail-item">
                        <span className="label">Retention Period:</span>
                        <span className="value">{policy.period} {policy.unit}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Documents Affected:</span>
                        <span className="value">{policy.documentsAffected.toLocaleString()}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Next Cleanup:</span>
                        <span className="value">{policy.nextCleanup}</span>
                      </div>
                    </div>
                  </div>
                  <div className="policy-actions">
                    <button className="btn-icon">⚙️ Edit</button>
                    <button className="btn-icon">🗑️ Delete</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="retention-note">
              <span className="note-icon">ℹ️</span>
              <p>Documents will be automatically deleted when they exceed their retention period. This action is irreversible and will be logged in audit records.</p>
            </div>
          </div>
        </div>

        <aside className="compliance-sidebar">
          <div className="sidebar-section">
            <h3>🔒 Privacy Settings</h3>
            <div className="privacy-list">
              {privacySettings.map((setting, index) => (
                <div key={index} className="privacy-item">
                  <div className="privacy-header">
                    <span className="privacy-name">{setting.name}</span>
                    <label className="toggle-switch">
                      <input type="checkbox" checked={setting.enabled} readOnly />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                  <p className="privacy-description">{setting.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <h3>📊 Compliance Status</h3>
            <div className="compliance-stats">
              <div className="stat-item">
                <div className="stat-icon success">✓</div>
                <div className="stat-content">
                  <span className="stat-label">Audit Logs</span>
                  <span className="stat-value">Enabled</span>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon success">✓</div>
                <div className="stat-content">
                  <span className="stat-label">Data Retention</span>
                  <span className="stat-value">Configured</span>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon success">✓</div>
                <div className="stat-content">
                  <span className="stat-label">Privacy Mode</span>
                  <span className="stat-value">Active</span>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon warning">⚠</div>
                <div className="stat-content">
                  <span className="stat-label">Last Export</span>
                  <span className="stat-value">15 days ago</span>
                </div>
              </div>
            </div>
          </div>

          <div className="sidebar-section">
            <h3>⚡ Quick Actions</h3>
            <div className="quick-actions">
              <button className="quick-action-btn">
                <span>📥</span> Import Audit Logs
              </button>
              <button className="quick-action-btn">
                <span>🔍</span> Verify Export
              </button>
              <button className="quick-action-btn">
                <span>🗑️</span> Manual Cleanup
              </button>
              <button className="quick-action-btn">
                <span>📖</span> Compliance Guide
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ComplianceAudit;
