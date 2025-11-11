import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const features = [
    {
      title: 'Document Management',
      description: 'Organize and manage all your documents in one place',
      icon: '📄',
      path: '/documents',
    },
    {
      title: 'Easy Upload',
      description: 'Upload documents quickly and securely',
      icon: '🔥',
      path: '/upload',
    },
    {
      title: 'Smart Search',
      description: 'Find documents easily with powerful search and filters',
      icon: '🔍',
      path: '/search',
    },
    {
      title: 'Status Tracking',
      description: 'Track document approval status in real-time',
      icon: '✅',
      path: '/status',
    },
    {
      title: 'Tenant Settings',
      description: 'Manage configuration, inboxes, and usage monitoring',
      icon: '⚙️',
      path: '/settings',
    },
    {
      title: 'Compliance & Audit',
      description: 'Monitor compliance and manage audit records',
      icon: '🛡️',
      path: '/compliance',
    },
    {
      title: 'AI Features',
      description: 'Intelligent document processing and automation',
      icon: '🤖',
      path: '/ai',
    },
  ];

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome to DocFlow</h1>
        <p>Your comprehensive document management solution</p>
      </header>

      <div className="feature-cards-grid">
        {features.map((feature) => (
          <Link
            key={feature.path}
            to={feature.path}
            className="feature-card"
          >
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
