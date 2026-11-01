import React, { useState } from 'react';
import { ArrowRight, Trash2, ShieldCheck, Tag, Check, X } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';
import { useCart } from '../hooks/useCart';
import { CheckoutModal } from './CheckoutModal';
import './CartSummary.css';

export const CartSummary = ({ onOpenClearConfirm }) => {
  const {
    totalItems,
    subtotal,
    shipping,
    discountAmount,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    totalPrice
  } = useCart();

  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [promoInput, setPromoInput] = useState('');

  const freeShippingThreshold = 999;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput);
    if (res.success) {
      setPromoInput('');
    }
  };

  const handleQuickApply = (code) => {
    applyPromoCode(code);
  };

  return (
    <div className="cart-summary-card">
      <h3 className="summary-title">Summary</h3>

      {/* Free Shipping Progress Indicator */}
      <div className="shipping-progress-container">
        <div className="shipping-progress-header">
          {subtotal >= freeShippingThreshold ? (
            <span className="free-shipping-unlocked">
              Free Standard Delivery Unlocked
            </span>
          ) : (
            <span className="free-shipping-needed">
              Add <strong>{formatCurrency(amountNeededForFreeShipping)}</strong> more for free delivery
            </span>
          )}
          <span className="progress-percentage">{progressPercent}%</span>
        </div>
        <div className="progress-bar-track">
          <div
            className={`progress-bar-fill ${progressPercent === 100 ? 'complete' : ''}`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="summary-rows">
        <div className="summary-row">
          <span className="row-label">Items ({totalItems})</span>
          <span className="row-value">{formatCurrency(subtotal)}</span>
        </div>

        {/* Promo discount row */}
        {discountAmount > 0 && appliedPromo && (
          <div className="summary-row discount-row">
            <span className="row-label discount-label">
              <Tag size={13} />
              <span>Promo ({appliedPromo.code})</span>
              <button
                type="button"
                className="remove-promo-btn"
                onClick={removePromoCode}
                title="Remove promo code"
                aria-label="Remove promo code"
              >
                <X size={12} />
              </button>
            </span>
            <span className="row-value discount-value">-{formatCurrency(discountAmount)}</span>
          </div>
        )}

        <div className="summary-row">
          <span className="row-label">Estimated Shipping</span>
          <span className="row-value">
            {shipping === 0 ? (
              <span className="free-shipping-tag">FREE</span>
            ) : (
              formatCurrency(shipping)
            )}
          </span>
        </div>

        <div className="summary-divider" />

        <div className="summary-row total-row">
          <span className="total-label">Total</span>
          <span className="total-amount">{formatCurrency(totalPrice)}</span>
        </div>
      </div>

      {/* Promo Code Input Form */}
      <div className="promo-section">
        {!appliedPromo ? (
          <>
            <form onSubmit={handleApplyPromo} className="promo-input-form">
              <input
                type="text"
                placeholder="Promo code (SAVE10)"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                className="promo-input"
                aria-label="Promo code"
              />
              <button type="submit" className="btn btn-secondary btn-sm apply-promo-btn">
                Apply
              </button>
            </form>
            <div className="quick-coupon-tags">
              <span className="quick-tag-label">Offers:</span>
              <button
                type="button"
                className="coupon-chip"
                onClick={() => handleQuickApply('SAVE10')}
              >
                SAVE10 (-10%)
              </button>
              <button
                type="button"
                className="coupon-chip"
                onClick={() => handleQuickApply('SUPER20')}
              >
                SUPER20 (-20%)
              </button>
            </div>
          </>
        ) : (
          <div className="promo-applied-badge">
            <Check size={14} className="check-icon" />
            <span>Code <strong>{appliedPromo.code}</strong> applied ({appliedPromo.label})</span>
          </div>
        )}
      </div>

      <div className="summary-actions">
        <button
          type="button"
          className="btn btn-primary btn-lg checkout-btn"
          onClick={() => setIsCheckoutModalOpen(true)}
          disabled={totalItems === 0}
        >
          <span>Checkout</span>
          <ArrowRight size={16} />
        </button>

        <button
          type="button"
          className="btn btn-danger-outline btn-sm clear-cart-btn"
          onClick={onOpenClearConfirm}
          disabled={totalItems === 0}
        >
          <Trash2 size={15} />
          <span>Clear Shopping Bag</span>
        </button>
      </div>

      <div className="security-badge">
        <ShieldCheck size={15} />
        <span>Secure Encrypted Checkout</span>
      </div>

      {/* Interactive Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
      />
    </div>
  );
};
