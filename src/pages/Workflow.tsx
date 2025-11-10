import React from 'react';
import './Workflow.css';

const Workflow: React.FC = () => {
  return (
    <div className="workflow">
      <div className="workflow-header">
        <h1>Workflow</h1>
        <button className="btn-primary">Create Workflow</button>
      </div>
      <div className="workflow-view">
        <div className="no-workflow">
          <p>🔄</p>
          <p>No workflows configured yet. Create your first workflow to manage document approval processes.</p>
        </div>
      </div>
    </div>
  );
};

export default Workflow;
