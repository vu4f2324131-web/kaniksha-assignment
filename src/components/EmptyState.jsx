import React from 'react';
import { PackageSearch, ShoppingBag, AlertCircle } from 'lucide-react';
import './EmptyState.css';

export const EmptyState = ({
  type = 'no-results', // 'no-results' | 'empty-cart' | 'not-found'
  title,
  message,
  actionLabel,
  onAction
}) => {
  const getIcon = () => {
    switch (type) {
      case 'empty-cart':
        return <ShoppingBag size={48} className="empty-icon cart-icon" />;
      case 'not-found':
        return <AlertCircle size={48} className="empty-icon not-found-icon" />;
      case 'no-results':
      default:
        return <PackageSearch size={48} className="empty-icon search-icon" />;
    }
  };

  const defaultTitles = {
    'no-results': 'No products found',
    'empty-cart': 'Your shopping cart is empty',
    'not-found': 'Product not found'
  };

  const defaultMessages = {
    'no-results': 'We couldn\'t find any products matching your search criteria. Try adjusting your filters or search terms.',
    'empty-cart': 'Looks like you haven\'t added any items to your cart yet. Explore our catalog to find great deals!',
    'not-found': 'The product you are looking for might have been removed or does not exist.'
  };

  return (
    <div className="empty-state-container fade-in">
      <div className="empty-icon-wrapper">{getIcon()}</div>
      <h3 className="empty-title">{title || defaultTitles[type]}</h3>
      <p className="empty-message">{message || defaultMessages[type]}</p>
      {actionLabel && onAction && (
        <button type="button" className="btn btn-primary btn-md empty-action-btn" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
};
