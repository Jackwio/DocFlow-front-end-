import React, { useState } from 'react';
import PageLayout from '../components/PageLayout';
import { mockInboxes, mockRules, mockTenantSettings } from '../utils/mockData';

const TenantSettings: React.FC = () => {
  const [inboxes] = useState(mockInboxes);
  const [rules] = useState(mockRules);
  const [settings, setSettings] = useState(mockTenantSettings);

  const formatBytes = (bytes: number) => {
    if (bytes < 1073741824) return (bytes / 1048576).toFixed(2) + ' MB';
    return (bytes / 1073741824).toFixed(2) + ' GB';
  };

  const usagePercentage = (settings.storageUsed / settings.storageLimit) * 100;
  const docPercentage = (settings.documentCount / settings.documentLimit) * 100;

  return (
    <PageLayout title="Tenant Settings">
      <h2 className="section-title">Tenant Configuration</h2>

      <div className="info-grid">
        <div className="info-card">
          <h4>📦 Storage Used</h4>
          <p>{formatBytes(settings.storageUsed)}</p>
          <div className="progress-bar" style={{ marginTop: '10px' }}>
            <div
              className="progress-fill"
              style={{ width: `${usagePercentage}%` }}
            ></div>
          </div>
          <span style={{ fontSize: '0.85rem', color: '#666', marginTop: '5px', display: 'block' }}>
            {usagePercentage.toFixed(1)}% of {formatBytes(settings.storageLimit)}
          </span>
        </div>
        <div className="info-card">
          <h4>📄 Documents</h4>
          <p>{settings.documentCount.toLocaleString()}</p>
          <div className="progress-bar" style={{ marginTop: '10px' }}>
            <div
              className="progress-fill"
              style={{ width: `${docPercentage}%` }}
            ></div>
          </div>
          <span style={{ fontSize: '0.85rem', color: '#666', marginTop: '5px', display: 'block' }}>
            {docPercentage.toFixed(1)}% of {settings.documentLimit.toLocaleString()} limit
          </span>
        </div>
        <div className="info-card">
          <h4>📅 Retention Days</h4>
          <p>{settings.retentionDays}</p>
        </div>
        <div className="info-card">
          <h4>📁 Max File Size</h4>
          <p>{formatBytes(settings.maxFileSize)}</p>
        </div>
        <div className="info-card">
          <h4>🤖 AI Features</h4>
          <p style={{ color: settings.aiEnabled ? '#155724' : '#721c24' }}>
            {settings.aiEnabled ? 'Enabled' : 'Disabled'}
          </p>
        </div>
      </div>

      <h2 className="section-title" style={{ marginTop: '40px' }}>
        Inbox Management
      </h2>

      <div style={{ marginBottom: '20px' }}>
        <button className="action-button">+ Create New Inbox</button>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Inbox Name</th>
            <th>Department</th>
            <th>Status</th>
            <th>Documents</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {inboxes.map((inbox) => (
            <tr key={inbox.id}>
              <td>{inbox.name}</td>
              <td>{inbox.department}</td>
              <td>
                <span className={`status-badge status-${inbox.status}`}>
                  {inbox.status.charAt(0).toUpperCase() + inbox.status.slice(1)}
                </span>
              </td>
              <td>{inbox.documentCount}</td>
              <td>
                <button className="action-button">Edit</button>
                <button className="action-button secondary">
                  {inbox.status === 'active' ? 'Disable' : 'Enable'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="section-title" style={{ marginTop: '40px' }}>
        Classification Rules
      </h2>

      <div style={{ marginBottom: '20px' }}>
        <button className="action-button">+ Create New Rule</button>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Priority</th>
            <th>Rule Name</th>
            <th>Status</th>
            <th>Conditions</th>
            <th>Tags</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rules.map((rule) => (
            <tr key={rule.id}>
              <td>
                <strong>#{rule.priority}</strong>
              </td>
              <td>{rule.name}</td>
              <td>
                <span className={`status-badge status-${rule.enabled ? 'active' : 'disabled'}`}>
                  {rule.enabled ? 'Enabled' : 'Disabled'}
                </span>
              </td>
              <td>
                {rule.conditions.fileNamePattern && (
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>
                    Pattern: {rule.conditions.fileNamePattern}
                  </div>
                )}
                {rule.conditions.mimeType && (
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>
                    Type: {rule.conditions.mimeType}
                  </div>
                )}
              </td>
              <td>
                {rule.actions.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </td>
              <td>
                <button className="action-button">Edit</button>
                <button className="action-button secondary">
                  {rule.enabled ? 'Disable' : 'Enable'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        style={{
          marginTop: '40px',
          padding: '20px',
          background: '#fff3cd',
          borderRadius: '8px',
          borderLeft: '4px solid #ffc107',
        }}
      >
        <h3 style={{ marginTop: 0, color: '#856404' }}>⚙️ Configuration Options</h3>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <button className="action-button">Update Retention Policy</button>
          <button className="action-button">Adjust File Size Limit</button>
          <button
            className="action-button"
            style={{
              background: settings.aiEnabled ? '#dc3545' : '#28a745',
            }}
            onClick={() => setSettings({ ...settings, aiEnabled: !settings.aiEnabled })}
          >
            {settings.aiEnabled ? 'Disable' : 'Enable'} AI Features
          </button>
          <button className="action-button secondary">Export Configuration</button>
        </div>
      </div>
    </PageLayout>
  );
};

export default TenantSettings;
