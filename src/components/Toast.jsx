import React, { useEffect } from 'react';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import './Toast.css';

export const Toast = () => {
  const { toastMessage, hideToast } = useCart();

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      hideToast();
    }, 3000);

    return () => clearTimeout(timer);
  }, [toastMessage, hideToast]);

  if (!toastMessage) return null;

  const { message, type = 'info' } = toastMessage;

  const renderIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={18} className="toast-icon success" />;
      case 'warning':
        return <AlertTriangle size={18} className="toast-icon warning" />;
      case 'info':
      default:
        return <Info size={18} className="toast-icon info" />;
    }
  };

  return (
    <div className={`toast-container toast-${type} fade-in`} role="alert">
      {renderIcon()}
      <span className="toast-message">{message}</span>
      <button className="toast-close" onClick={hideToast} aria-label="Close notification">
        <X size={14} />
      </button>
    </div>
  );
};
