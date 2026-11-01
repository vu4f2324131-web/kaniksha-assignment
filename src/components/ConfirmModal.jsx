import React, { useEffect } from 'react';
import { X, AlertCircle, ShoppingBag } from 'lucide-react';
import './ConfirmModal.css';

export const ConfirmModal = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'danger'
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop fade-in" onClick={onCancel}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal-header">
          <div className={`modal-icon-badge ${variant}`}>
            {variant === 'danger' ? <AlertCircle size={22} /> : <ShoppingBag size={22} />}
          </div>
          <button className="modal-close-btn" onClick={onCancel} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <h3 className="modal-title">{title}</h3>
          <p className="modal-message">{message}</p>
        </div>

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            className={`btn ${variant === 'danger' ? 'btn-danger' : 'btn-primary'}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
