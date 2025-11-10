import React from 'react';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">📄</div>
          <div className="stat-content">
            <h3>Total Documents</h3>
            <p className="stat-number">0</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>Pending Approval</h3>
            <p className="stat-number">0</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Completed</h3>
            <p className="stat-number">0</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Active Users</h3>
            <p className="stat-number">0</p>
          </div>
        </div>
      </div>
      <div className="dashboard-section">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          <p className="no-data">No recent activity</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
