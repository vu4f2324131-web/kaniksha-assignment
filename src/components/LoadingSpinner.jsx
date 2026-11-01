import React from 'react';
import { Loader2 } from 'lucide-react';
import './LoadingSpinner.css';

export const LoadingSpinner = ({ label = 'Loading products...' }) => {
  return (
    <div className="loading-spinner-container">
      <Loader2 size={36} className="spinner-icon" />
      <span className="loading-label">{label}</span>
    </div>
  );
};
