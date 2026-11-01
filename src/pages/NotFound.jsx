import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EmptyState } from '../components/EmptyState';
import './NotFound.css';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="container not-found-page fade-in">
      <EmptyState
        type="not-found"
        title="404 - Page Not Found"
        message="The page you are looking for does not exist or has been moved. Check the URL or click below to return home."
        actionLabel="Go to Homepage"
        onAction={() => navigate('/')}
      />
    </div>
  );
};
