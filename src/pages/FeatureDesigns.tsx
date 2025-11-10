import React from 'react';
import DocumentManagement from './DocumentManagement';
import EasyUpload from './EasyUpload';
import SmartSearch from './SmartSearch';
import StatusTracking from './StatusTracking';
import './FeatureDesigns.css';

const FeatureDesigns: React.FC = () => {
  const [activeView, setActiveView] = React.useState<'home' | 'document-management' | 'easy-upload' | 'smart-search' | 'status-tracking'>('home');

  const features = [
    {
      id: 'document-management',
      title: 'Document Management',
      icon: '📄',
      description: 'Organize and manage all your documents in one place'
    },
    {
      id: 'easy-upload',
      title: 'Easy Upload',
      icon: '🔥',
      description: 'Upload documents quickly and securely'
    },
    {
      id: 'smart-search',
      title: 'Smart Search',
      icon: '🔍',
      description: 'Find documents easily with powerful search and filters'
    },
    {
      id: 'status-tracking',
      title: 'Status Tracking',
      icon: '✅',
      description: 'Track document approval status in real-time'
    }
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'document-management':
        return <DocumentManagement />;
      case 'easy-upload':
        return <EasyUpload />;
      case 'smart-search':
        return <SmartSearch />;
      case 'status-tracking':
        return <StatusTracking />;
      default:
        return (
          <div className="feature-designs-home">
            <div className="home-header">
              <h1>Welcome to DocFlow</h1>
              <p className="home-subtitle">Your comprehensive document management solution</p>
            </div>
            
            <div className="features-grid">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className="feature-card"
                  onClick={() => setActiveView(feature.id as any)}
                >
                  <div className="feature-icon">{feature.icon}</div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                  <button className="view-btn">View Design →</button>
                </div>
              ))}
            </div>

            <div className="design-note">
              <h3>📐 Design Mockups</h3>
              <p>
                These are design mockups for the 4 main features of DocFlow. Click on any card above to view the detailed design for each feature.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="feature-designs">
      {activeView !== 'home' && (
        <div className="back-button-container">
          <button className="back-button" onClick={() => setActiveView('home')}>
            ← Back to Features
          </button>
        </div>
      )}
      {renderContent()}
    </div>
  );
};

export default FeatureDesigns;
