import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import './ErrorMessage.css';

export const ErrorMessage = ({ message = 'Something went wrong while loading data.', onRetry }) => {
  return (
    <div className="error-message-container fade-in" role="alert">
      <AlertTriangle size={36} className="error-icon" />
      <h4 className="error-title">Error Loading Data</h4>
      <p className="error-desc">{message}</p>
      {onRetry && (
        <button type="button" className="btn btn-secondary btn-sm" onClick={onRetry}>
          <RefreshCw size={14} />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
};
