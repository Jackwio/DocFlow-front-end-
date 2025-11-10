import React from 'react';
import './TenantSettings.css';

const TenantSettings: React.FC = () => {
  const inboxes = [
    { id: 1, name: 'General Inbox', department: 'All Departments', documents: 1247, status: 'active' },
    { id: 2, name: 'HR Documents', department: 'Human Resources', documents: 356, status: 'active' },
    { id: 3, name: 'Finance Inbox', department: 'Finance', documents: 892, status: 'active' },
    { id: 4, name: 'Legal Contracts', department: 'Legal', documents: 234, status: 'active' }
  ];

  const usageStats = {
    documents: { current: 2847, limit: 10000, percentage: 28.5 },
    storage: { current: 24.5, limit: 100, unit: 'GB', percentage: 24.5 },
    rules: { current: 12, limit: 50, percentage: 24 },
    inboxes: { current: 4, limit: 10, percentage: 40 }
  };

  return (
    <div className="tenant-settings">
      <div className="page-header">
        <div className="header-content">
          <h1>⚙️ Tenant Settings</h1>
          <p className="subtitle">Manage your tenant configuration and usage</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary">
            <span>📊</span> View Usage Report
          </button>
          <button className="btn-primary">
            <span>⬆️</span> Upgrade Plan
          </button>
        </div>
      </div>

      <div className="settings-container">
        <div className="settings-main">
          {/* Usage Overview */}
          <div className="usage-section">
            <h2>📊 Plan Usage Overview</h2>
            <div className="usage-grid">
              <div className="usage-card">
                <div className="usage-header">
                  <span className="usage-icon">📄</span>
                  <h3>Documents</h3>
                </div>
                <div className="usage-stats">
                  <div className="usage-numbers">
                    <span className="current">{usageStats.documents.current.toLocaleString()}</span>
                    <span className="separator">/</span>
                    <span className="limit">{usageStats.documents.limit.toLocaleString()}</span>
                  </div>
                  <div className="usage-bar">
                    <div className="usage-fill" style={{ width: `${usageStats.documents.percentage}%` }}></div>
                  </div>
                  <div className="usage-label">{usageStats.documents.percentage}% used</div>
                </div>
              </div>

              <div className="usage-card">
                <div className="usage-header">
                  <span className="usage-icon">💾</span>
                  <h3>Storage</h3>
                </div>
                <div className="usage-stats">
                  <div className="usage-numbers">
                    <span className="current">{usageStats.storage.current} {usageStats.storage.unit}</span>
                    <span className="separator">/</span>
                    <span className="limit">{usageStats.storage.limit} {usageStats.storage.unit}</span>
                  </div>
                  <div className="usage-bar">
                    <div className="usage-fill" style={{ width: `${usageStats.storage.percentage}%` }}></div>
                  </div>
                  <div className="usage-label">{usageStats.storage.percentage}% used</div>
                </div>
              </div>

              <div className="usage-card">
                <div className="usage-header">
                  <span className="usage-icon">📋</span>
                  <h3>Classification Rules</h3>
                </div>
                <div className="usage-stats">
                  <div className="usage-numbers">
                    <span className="current">{usageStats.rules.current}</span>
                    <span className="separator">/</span>
                    <span className="limit">{usageStats.rules.limit}</span>
                  </div>
                  <div className="usage-bar">
                    <div className="usage-fill" style={{ width: `${usageStats.rules.percentage}%` }}></div>
                  </div>
                  <div className="usage-label">{usageStats.rules.percentage}% used</div>
                </div>
              </div>

              <div className="usage-card">
                <div className="usage-header">
                  <span className="usage-icon">📥</span>
                  <h3>Inboxes</h3>
                </div>
                <div className="usage-stats">
                  <div className="usage-numbers">
                    <span className="current">{usageStats.inboxes.current}</span>
                    <span className="separator">/</span>
                    <span className="limit">{usageStats.inboxes.limit}</span>
                  </div>
                  <div className="usage-bar">
                    <div className="usage-fill" style={{ width: `${usageStats.inboxes.percentage}%` }}></div>
                  </div>
                  <div className="usage-label">{usageStats.inboxes.percentage}% used</div>
                </div>
              </div>
            </div>
          </div>

          {/* Inbox Management */}
          <div className="inboxes-section">
            <div className="section-header">
              <h2>📥 Inbox Management</h2>
              <button className="btn-add">
                <span>+</span> Create New Inbox
              </button>
            </div>
            <div className="inboxes-list">
              {inboxes.map((inbox) => (
                <div key={inbox.id} className="inbox-card">
                  <div className="inbox-info">
                    <div className="inbox-name">
                      <span className="inbox-icon">📥</span>
                      <h3>{inbox.name}</h3>
                      <span className={`status-badge ${inbox.status}`}>{inbox.status}</span>
                    </div>
                    <div className="inbox-meta">
                      <span className="meta-item">
                        <span className="icon">🏢</span>
                        {inbox.department}
                      </span>
                      <span className="meta-item">
                        <span className="icon">📄</span>
                        {inbox.documents.toLocaleString()} documents
                      </span>
                    </div>
                  </div>
                  <div className="inbox-actions">
                    <button className="btn-icon">⚙️ Configure</button>
                    <button className="btn-icon">📊 Analytics</button>
                    <button className="btn-icon">⋮</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* General Settings */}
          <div className="general-settings-section">
            <h2>🔧 General Settings</h2>
            <div className="settings-grid">
              <div className="setting-card">
                <div className="setting-header">
                  <h3>📅 Document Retention</h3>
                  <button className="btn-edit">Edit</button>
                </div>
                <div className="setting-content">
                  <div className="setting-row">
                    <label>Default Retention Period</label>
                    <div className="input-group">
                      <input type="number" value="90" readOnly />
                      <span className="input-suffix">days</span>
                    </div>
                  </div>
                  <div className="setting-row">
                    <label>Maximum Retention (Plan Limit)</label>
                    <span className="value-display">365 days</span>
                  </div>
                  <p className="setting-note">Documents older than the retention period will be automatically deleted</p>
                </div>
              </div>

              <div className="setting-card">
                <div className="setting-header">
                  <h3>📁 File Size Limits</h3>
                  <button className="btn-edit">Edit</button>
                </div>
                <div className="setting-content">
                  <div className="setting-row">
                    <label>Maximum File Size</label>
                    <div className="input-group">
                      <input type="number" value="50" readOnly />
                      <span className="input-suffix">MB</span>
                    </div>
                  </div>
                  <div className="setting-row">
                    <label>Plan Maximum</label>
                    <span className="value-display">100 MB</span>
                  </div>
                  <p className="setting-note">Limit individual file upload size to control storage costs</p>
                </div>
              </div>

              <div className="setting-card">
                <div className="setting-header">
                  <h3>🔒 Privacy Mode</h3>
                  <label className="toggle-switch">
                    <input type="checkbox" />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div className="setting-content">
                  <p className="setting-description">
                    <strong>Strict Privacy Mode:</strong> When enabled, text extraction results will not be stored to reduce sensitive information risk.
                  </p>
                  <div className="warning-box">
                    <span className="warning-icon">⚠️</span>
                    <p>Enabling this may impact search and classification accuracy</p>
                  </div>
                </div>
              </div>

              <div className="setting-card">
                <div className="setting-header">
                  <h3>🏷️ Custom Tags</h3>
                  <button className="btn-edit">Manage Tags</button>
                </div>
                <div className="setting-content">
                  <div className="tags-preview">
                    <span className="tag-chip" style={{ background: '#e3f2fd', color: '#1565c0' }}>Financial</span>
                    <span className="tag-chip" style={{ background: '#f3e5f5', color: '#6a1b9a' }}>Legal</span>
                    <span className="tag-chip" style={{ background: '#e8f5e9', color: '#2e7d32' }}>Approved</span>
                    <span className="tag-chip" style={{ background: '#fff3e0', color: '#e65100' }}>Urgent</span>
                    <span className="more-tags">+8 more</span>
                  </div>
                  <p className="setting-note">Configure custom tag colors and names for better visual organization</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="settings-sidebar">
          <div className="sidebar-section">
            <h3>💳 Current Plan</h3>
            <div className="plan-info">
              <div className="plan-badge">Professional</div>
              <div className="plan-price">$99/month</div>
              <div className="plan-renewal">Renews on Jan 15, 2026</div>
            </div>
            <button className="btn-upgrade">Upgrade to Enterprise</button>
          </div>

          <div className="sidebar-section">
            <h3>⚡ Quick Actions</h3>
            <div className="quick-actions">
              <button className="quick-action-btn">
                <span>📧</span> Invite Team Members
              </button>
              <button className="quick-action-btn">
                <span>🔑</span> API Keys
              </button>
              <button className="quick-action-btn">
                <span>🔔</span> Notifications
              </button>
              <button className="quick-action-btn">
                <span>📖</span> Documentation
              </button>
            </div>
          </div>

          <div className="sidebar-section">
            <h3>📞 Support</h3>
            <p className="support-text">Need help with configuration?</p>
            <button className="btn-support">Contact Support</button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default TenantSettings;
