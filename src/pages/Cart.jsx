import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { CartItem } from '../components/CartItem';
import { CartSummary } from '../components/CartSummary';
import { EmptyState } from '../components/EmptyState';
import { ConfirmModal } from '../components/ConfirmModal';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import './Cart.css';

export const Cart = () => {
  const { enrichedItems, totalItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  const handleConfirmClear = () => {
    clearCart();
    setIsClearModalOpen(false);
  };

  if (!enrichedItems || enrichedItems.length === 0) {
    return (
      <div className="container cart-page">
        <div className="cart-header">
          <Link to="/" className="back-link">
            <ArrowLeft size={16} />
            <span>Continue Shopping</span>
          </Link>
        </div>

        <EmptyState
          type="empty-cart"
          title="Your Shopping Bag is Empty"
          message="You haven't added any items to your shopping bag yet. Explore our curated collections to find essentials."
          actionLabel="Explore Catalog"
          onAction={() => navigate('/')}
        />
      </div>
    );
  }

  return (
    <div className="container cart-page">
      {/* Top Header */}
      <div className="cart-header">
        <div className="cart-header-title">
          <ShoppingBag size={24} className="cart-header-icon" />
          <h1>Shopping Bag</h1>
          <span className="cart-items-count">({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
        </div>

        <Link to="/" className="back-link">
          <ArrowLeft size={16} />
          <span>Continue Shopping</span>
        </Link>
      </div>

      {/* Grid Layout: Items & Summary */}
      <div className="cart-layout-grid">
        {/* Left Column: Cart Items List */}
        <div className="cart-items-list">
          {enrichedItems.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        {/* Right Column: Order Summary */}
        <div className="cart-summary-wrapper">
          <CartSummary onOpenClearConfirm={() => setIsClearModalOpen(true)} />
        </div>
      </div>

      {/* Confirm Clear Cart Modal */}
      <ConfirmModal
        isOpen={isClearModalOpen}
        title="Empty your shopping bag?"
        message="Are you sure you want to remove all items from your bag? This action cannot be reversed."
        confirmLabel="Empty Bag"
        cancelLabel="Keep Items"
        variant="danger"
        onConfirm={handleConfirmClear}
        onCancel={() => setIsClearModalOpen(false)}
      />
    </div>
  );
};
