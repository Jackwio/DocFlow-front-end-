import React from 'react';
import './StatusTracking.css';

const StatusTracking: React.FC = () => {
  const documents = [
    {
      id: 1,
      name: 'Annual Budget Proposal 2025',
      type: 'Financial',
      submittedDate: '2025-11-08',
      status: 'pending',
      currentStep: 2,
      totalSteps: 4,
      approvers: [
        { name: 'John Smith', role: 'Manager', status: 'approved', date: '2025-11-08' },
        { name: 'Sarah Johnson', role: 'Director', status: 'pending', date: null },
        { name: 'Michael Chen', role: 'VP Finance', status: 'waiting', date: null },
        { name: 'Lisa Anderson', role: 'CFO', status: 'waiting', date: null }
      ]
    },
    {
      id: 2,
      name: 'New Hire Contract - Alex Brown',
      type: 'HR',
      submittedDate: '2025-11-07',
      status: 'approved',
      currentStep: 3,
      totalSteps: 3,
      approvers: [
        { name: 'Emily Davis', role: 'HR Manager', status: 'approved', date: '2025-11-07' },
        { name: 'Robert Wilson', role: 'Department Head', status: 'approved', date: '2025-11-08' },
        { name: 'Jennifer Lee', role: 'HR Director', status: 'approved', date: '2025-11-09' }
      ]
    },
    {
      id: 3,
      name: 'Vendor Agreement - TechCorp',
      type: 'Legal',
      submittedDate: '2025-11-06',
      status: 'rejected',
      currentStep: 2,
      totalSteps: 3,
      approvers: [
        { name: 'David Kim', role: 'Procurement', status: 'approved', date: '2025-11-06' },
        { name: 'Amanda White', role: 'Legal Counsel', status: 'rejected', date: '2025-11-07' },
        { name: 'Tom Martinez', role: 'VP Operations', status: 'waiting', date: null }
      ]
    },
    {
      id: 4,
      name: 'Q4 Marketing Campaign Plan',
      type: 'Marketing',
      submittedDate: '2025-11-05',
      status: 'in-review',
      currentStep: 1,
      totalSteps: 2,
      approvers: [
        { name: 'Jessica Taylor', role: 'Marketing Manager', status: 'in-review', date: null },
        { name: 'Chris Brown', role: 'CMO', status: 'waiting', date: null }
      ]
    }
  ];

  const statistics = [
    { label: 'Total Documents', value: 156, icon: '📄', color: '#4299e1' },
    { label: 'Pending Approval', value: 42, icon: '⏳', color: '#ed8936' },
    { label: 'Approved', value: 98, icon: '✅', color: '#48bb78' },
    { label: 'Rejected', value: 16, icon: '❌', color: '#f56565' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'status-approved';
      case 'pending': return 'status-pending';
      case 'rejected': return 'status-rejected';
      case 'in-review': return 'status-in-review';
      case 'waiting': return 'status-waiting';
      default: return '';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return '✅ Approved';
      case 'pending': return '⏳ Pending';
      case 'rejected': return '❌ Rejected';
      case 'in-review': return '👀 In Review';
      case 'waiting': return '⏸️ Waiting';
      default: return status;
    }
  };

  return (
    <div className="status-tracking">
      <div className="page-header">
        <div className="header-content">
          <h1>✅ Status Tracking</h1>
          <p className="subtitle">Track document approval status in real-time</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary">
            <span>⚙️</span> Filters
          </button>
          <button className="btn-secondary">
            <span>📊</span> Export Report
          </button>
        </div>
      </div>

      <div className="statistics-grid">
        {statistics.map((stat) => (
          <div key={stat.label} className="stat-card" style={{ borderLeftColor: stat.color }}>
            <div className="stat-icon" style={{ background: `${stat.color}20` }}>
              {stat.icon}
            </div>
            <div className="stat-content">
              <div className="stat-value" style={{ color: stat.color }}>{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="tracking-container">
        <div className="tracking-main">
          <div className="documents-list">
            <div className="list-header">
              <h3>Documents in Workflow</h3>
              <select className="filter-select">
                <option>All Status</option>
                <option>Pending</option>
                <option>In Review</option>
                <option>Approved</option>
                <option>Rejected</option>
              </select>
            </div>

            {documents.map((doc) => (
              <div key={doc.id} className="tracking-card">
                <div className="card-header">
                  <div className="doc-info">
                    <h4>{doc.name}</h4>
                    <div className="doc-metadata">
                      <span className="doc-type">{doc.type}</span>
                      <span className="doc-date">📅 {doc.submittedDate}</span>
                    </div>
                  </div>
                  <div className={`status-badge ${getStatusColor(doc.status)}`}>
                    {getStatusText(doc.status)}
                  </div>
                </div>

                <div className="progress-section">
                  <div className="progress-header">
                    <span>Approval Progress</span>
                    <span className="progress-text">
                      Step {doc.currentStep} of {doc.totalSteps}
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${(doc.currentStep / doc.totalSteps) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="approval-timeline">
                  {doc.approvers.map((approver, index) => (
                    <div key={index} className="timeline-item">
                      <div className={`timeline-dot ${getStatusColor(approver.status)}`}>
                        {approver.status === 'approved' && '✓'}
                        {approver.status === 'rejected' && '✗'}
                        {approver.status === 'in-review' && '👀'}
                        {(approver.status === 'pending' || approver.status === 'waiting') && index + 1}
                      </div>
                      <div className="timeline-content">
                        <div className="approver-info">
                          <div className="approver-name">{approver.name}</div>
                          <div className="approver-role">{approver.role}</div>
                        </div>
                        <div className={`approver-status ${getStatusColor(approver.status)}`}>
                          {getStatusText(approver.status)}
                          {approver.date && (
                            <span className="status-date"> • {approver.date}</span>
                          )}
                        </div>
                      </div>
                      {index < doc.approvers.length - 1 && (
                        <div className="timeline-line"></div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="card-actions">
                  <button className="action-btn">👁️ View Details</button>
                  <button className="action-btn">💬 Add Comment</button>
                  <button className="action-btn">📧 Remind Approver</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="tracking-sidebar">
          <div className="sidebar-section">
            <h3>🔔 Recent Activity</h3>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon approved">✓</div>
                <div className="activity-content">
                  <div className="activity-text">
                    <strong>Jennifer Lee</strong> approved <em>New Hire Contract</em>
                  </div>
                  <div className="activity-time">2 mins ago</div>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon rejected">✗</div>
                <div className="activity-content">
                  <div className="activity-text">
                    <strong>Amanda White</strong> rejected <em>Vendor Agreement</em>
                  </div>
                  <div className="activity-time">1 hour ago</div>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon pending">⏳</div>
                <div className="activity-content">
                  <div className="activity-text">
                    <strong>You</strong> submitted <em>Budget Proposal</em>
                  </div>
                  <div className="activity-time">3 hours ago</div>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon approved">✓</div>
                <div className="activity-content">
                  <div className="activity-text">
                    <strong>Robert Wilson</strong> approved <em>Contract</em>
                  </div>
                  <div className="activity-time">5 hours ago</div>
                </div>
              </div>
            </div>
          </div>

          <div className="sidebar-section">
            <h3>📈 This Week</h3>
            <div className="weekly-stats">
              <div className="weekly-stat">
                <span className="weekly-label">Submitted</span>
                <span className="weekly-value">12</span>
              </div>
              <div className="weekly-stat">
                <span className="weekly-label">Approved</span>
                <span className="weekly-value">8</span>
              </div>
              <div className="weekly-stat">
                <span className="weekly-label">Avg. Time</span>
                <span className="weekly-value">2.5 days</span>
              </div>
            </div>
          </div>

          <div className="sidebar-section">
            <h3>⚡ Quick Actions</h3>
            <div className="quick-actions">
              <button className="quick-action-btn">
                <span>📤</span> Submit New Document
              </button>
              <button className="quick-action-btn">
                <span>🔍</span> View All Pending
              </button>
              <button className="quick-action-btn">
                <span>📊</span> Download Report
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default StatusTracking;
