import React, { useState } from 'react';
import PageLayout from '../components/PageLayout';
import { mockDocuments, mockAISuggestions, mockTenantSettings } from '../utils/mockData';

const AIFeatures: React.FC = () => {
  const [documents] = useState(mockDocuments.slice(0, 3)); // Only documents with AI suggestions
  const [suggestions] = useState(mockAISuggestions);
  const [aiEnabled] = useState(mockTenantSettings.aiEnabled);

  const getSuggestionForDoc = (docId: string) => {
    return suggestions.find((s) => s.documentId === docId);
  };

  const applySuggestion = (docId: string) => {
    alert(`AI suggestions applied for document ${docId}`);
  };

  const generateSummary = (docId: string) => {
    alert(`Generating summary for document ${docId}...`);
  };

  return (
    <PageLayout title="AI Features">
      <div
        style={{
          padding: '15px 20px',
          background: aiEnabled ? '#d4edda' : '#f8d7da',
          borderRadius: '8px',
          marginBottom: '30px',
          borderLeft: `4px solid ${aiEnabled ? '#28a745' : '#dc3545'}`,
        }}
      >
        <h3 style={{ margin: '0 0 5px 0', color: aiEnabled ? '#155724' : '#721c24' }}>
          {aiEnabled ? '✅ AI Features Enabled' : '❌ AI Features Disabled'}
        </h3>
        <p style={{ margin: 0, color: aiEnabled ? '#155724' : '#721c24', fontSize: '0.95rem' }}>
          {aiEnabled
            ? 'AI-powered document classification and analysis are active'
            : 'AI features are currently disabled by tenant administrator'}
        </p>
      </div>

      <h2 className="section-title">AI-Powered Document Analysis</h2>

      {documents.map((doc) => {
        const suggestion = getSuggestionForDoc(doc.id);
        if (!suggestion) return null;

        return (
          <div
            key={doc.id}
            style={{
              padding: '25px',
              background: '#f8f9fa',
              borderRadius: '12px',
              marginBottom: '20px',
              border: '1px solid #dee2e6',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem' }}>
                  📄 {doc.name}
                </h3>
                <div style={{ marginBottom: '15px' }}>
                  <span style={{ fontSize: '0.9rem', color: '#666' }}>
                    Confidence: {(suggestion.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
              <div
                className="progress-bar"
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  background: '#e9ecef',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#667eea',
                  }}
                >
                  {(suggestion.confidence * 100).toFixed(0)}%
                </div>
              </div>
            </div>

            <div style={{ marginTop: '20px' }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#333' }}>
                🏷️ Suggested Tags
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {suggestion.suggestedTags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {suggestion.summary && (
              <div style={{ marginTop: '20px' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#333' }}>
                  📝 AI-Generated Summary
                </h4>
                <p
                  style={{
                    margin: 0,
                    padding: '15px',
                    background: 'white',
                    borderRadius: '8px',
                    color: '#333',
                    lineHeight: '1.6',
                  }}
                >
                  {suggestion.summary}
                </p>
              </div>
            )}

            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
              <button
                className="action-button"
                onClick={() => applySuggestion(doc.id)}
                disabled={!aiEnabled}
              >
                ✓ Apply Suggestions
              </button>
              <button
                className="action-button secondary"
                onClick={() => generateSummary(doc.id)}
                disabled={!aiEnabled}
              >
                🔄 Regenerate Summary
              </button>
              <button className="action-button secondary">View Details</button>
            </div>
          </div>
        );
      })}

      <div
        style={{
          marginTop: '40px',
          padding: '25px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '12px',
          color: 'white',
        }}
      >
        <h3 style={{ marginTop: 0 }}>🤖 AI Capabilities</h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginTop: '20px',
          }}
        >
          <div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem' }}>
              🏷️ Auto-Tagging
            </h4>
            <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.9 }}>
              Automatically suggest relevant tags based on document content
            </p>
          </div>
          <div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem' }}>
              📝 Summarization
            </h4>
            <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.9 }}>
              Generate concise summaries of document contents
            </p>
          </div>
          <div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem' }}>
              🎯 Classification
            </h4>
            <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.9 }}>
              Intelligent document type and category detection
            </p>
          </div>
          <div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem' }}>
              🔒 Privacy-Safe
            </h4>
            <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.9 }}>
              Can be disabled instantly for compliance requirements
            </p>
          </div>
        </div>
      </div>

      <div className="info-grid" style={{ marginTop: '30px' }}>
        <div className="info-card">
          <h4>Documents Analyzed</h4>
          <p>{suggestions.length}</p>
        </div>
        <div className="info-card">
          <h4>Avg. Confidence</h4>
          <p>
            {(
              (suggestions.reduce((sum, s) => sum + s.confidence, 0) /
                suggestions.length) *
              100
            ).toFixed(0)}
            %
          </p>
        </div>
        <div className="info-card">
          <h4>Tags Suggested</h4>
          <p>
            {suggestions.reduce((sum, s) => sum + s.suggestedTags.length, 0)}
          </p>
        </div>
        <div className="info-card">
          <h4>AI Status</h4>
          <p style={{ color: aiEnabled ? '#155724' : '#721c24' }}>
            {aiEnabled ? 'Active' : 'Inactive'}
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default AIFeatures;
