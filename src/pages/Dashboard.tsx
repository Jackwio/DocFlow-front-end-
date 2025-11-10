import React from 'react';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const navigate = (page: string) => {
    window.dispatchEvent(new CustomEvent('docflow:navigate', { detail: page }));
  };

  const features = [
    {
      id: 'document-management',
      title: 'Document Management',
      icon: '📄',
      description: 'Organize and manage all your documents in one place',
      color: '#e3f2fd'
    },
    {
      id: 'easy-upload',
      title: 'Easy Upload',
      icon: '🔥',
      description: 'Upload documents quickly and securely',
      color: '#fce4ec'
    },
    {
      id: 'smart-search',
      title: 'Smart Search',
      icon: '🔍',
      description: 'Find documents easily with powerful search and filters',
      color: '#e8f5e9'
    },
    {
      id: 'status-tracking',
      title: 'Status Tracking',
      icon: '✅',
      description: 'Track document approval status in real-time',
      color: '#fff3e0'
    }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome to DocFlow</h1>
        <p className="dashboard-subtitle">Your comprehensive document management solution</p>
      </div>
      
      <div className="features-grid">
        {features.map((feature) => (
          <div
            key={feature.id}
            className="feature-card"
            style={{ borderLeft: `4px solid ${feature.color}` }}
            onClick={() => navigate(feature.id)}
          >
            <div className="feature-icon">{feature.icon}</div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
            <button className="view-btn">View →</button>
          </div>
        ))}
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">📄</div>
          <div className="stat-content">
            <h3>Total Documents</h3>
            <p className="stat-number">156</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>Pending Approval</h3>
            <p className="stat-number">42</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Approved</h3>
            <p className="stat-number">98</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <h3>Uploaded Today</h3>
            <p className="stat-number">24</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
