import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, CreditCard, Banknote, Smartphone, PackageCheck, Loader2 } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';
import { useCart } from '../hooks/useCart';
import './CheckoutModal.css';

export const CheckoutModal = ({ isOpen, onClose }) => {
  const { totalPrice, totalItems, clearCart } = useCart();

  const [step, setStep] = useState('form'); // 'form' | 'processing' | 'success'
  const [formData, setFormData] = useState({
    name: 'Nikhil Kumar',
    email: 'nikhil@example.com',
    phone: '+91 98765 43210',
    address: 'Flat 402, Sunshine Heights, MG Road',
    city: 'Bengaluru',
    pincode: '560001',
    paymentMethod: 'upi'
  });
  const [orderId, setOrderId] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    setStep('processing');

    setTimeout(() => {
      const generatedId = `SE-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderId(generatedId);
      setStep('success');
      clearCart();
    }, 1200);
  };

  const handleFinish = () => {
    setStep('form');
    onClose();
  };

  return (
    <div className="checkout-backdrop fade-in" onClick={step === 'processing' ? undefined : onClose}>
      <div
        className="checkout-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-modal-title"
      >
        {/* Header */}
        <div className="checkout-modal-header">
          <div className="checkout-header-title-box">
            <h3 id="checkout-modal-title">
              {step === 'success' ? 'Order Confirmed!' : 'Express Checkout'}
            </h3>
            <span className="checkout-header-subtitle">
              {step === 'success'
                ? 'Thank you for shopping with ShopEase'
                : `Review and complete your order (${totalItems} items)`}
            </span>
          </div>
          {step !== 'processing' && (
            <button className="checkout-close-btn" onClick={onClose} aria-label="Close checkout">
              <X size={18} />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="checkout-modal-body">
          {step === 'processing' && (
            <div className="processing-state fade-in">
              <Loader2 size={48} className="spinner-rotate" />
              <h4>Processing Your Order...</h4>
              <p>Securely confirming payment and generating your invoice.</p>
            </div>
          )}

          {step === 'success' && (
            <div className="success-state fade-in">
              <div className="success-icon-badge">
                <CheckCircle2 size={48} />
              </div>
              <h4>Order Successfully Placed!</h4>
              <p className="order-id-label">
                Order ID: <strong>{orderId}</strong>
              </p>
              <div className="success-details-card">
                <div className="success-row">
                  <span>Delivery to:</span>
                  <strong>{formData.name}, {formData.city} ({formData.pincode})</strong>
                </div>
                <div className="success-row">
                  <span>Payment Mode:</span>
                  <strong style={{ textTransform: 'uppercase' }}>{formData.paymentMethod}</strong>
                </div>
                <div className="success-row">
                  <span>Amount Paid:</span>
                  <strong className="text-primary">{formatCurrency(totalPrice)}</strong>
                </div>
                <div className="success-row">
                  <span>Estimated Delivery:</span>
                  <strong className="text-success">In 2 - 3 business days</strong>
                </div>
              </div>
              <p className="confirmation-email-hint">
                A confirmation receipt has been sent to <strong>{formData.email}</strong>
              </p>
              <button className="btn btn-primary btn-lg continue-shop-btn" onClick={handleFinish}>
                <PackageCheck size={18} />
                <span>Continue Shopping</span>
              </button>
            </div>
          )}

          {step === 'form' && (
            <form onSubmit={handleSubmitOrder} className="checkout-form">
              {/* Shipping Address */}
              <div className="form-section">
                <h4 className="section-title">1. Shipping Address</h4>
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label htmlFor="name">Full Name</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group full-width">
                    <label htmlFor="address">Street Address</label>
                    <input
                      id="address"
                      name="address"
                      type="text"
                      required
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      required
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="pincode">PIN Code</label>
                    <input
                      id="pincode"
                      name="pincode"
                      type="text"
                      required
                      pattern="[0-9]{6}"
                      value={formData.pincode}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="form-section">
                <h4 className="section-title">2. Select Payment Method</h4>
                <div className="payment-options-grid">
                  <label className={`payment-card ${formData.paymentMethod === 'upi' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={formData.paymentMethod === 'upi'}
                      onChange={handleChange}
                    />
                    <Smartphone size={20} className="payment-icon" />
                    <div>
                      <strong>Instant UPI</strong>
                      <span>Google Pay, PhonePe, Paytm</span>
                    </div>
                  </label>

                  <label className={`payment-card ${formData.paymentMethod === 'card' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleChange}
                    />
                    <CreditCard size={20} className="payment-icon" />
                    <div>
                      <strong>Credit / Debit Card</strong>
                      <span>Visa, Mastercard, RuPay</span>
                    </div>
                  </label>

                  <label className={`payment-card ${formData.paymentMethod === 'cod' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleChange}
                    />
                    <Banknote size={20} className="payment-icon" />
                    <div>
                      <strong>Cash on Delivery</strong>
                      <span>Pay cash upon arrival</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Mini Price Summary */}
              <div className="checkout-summary-bar">
                <div className="summary-left">
                  <span>Total Payable Amount</span>
                  <h3>{formatCurrency(totalPrice)}</h3>
                </div>
                <button type="submit" className="btn btn-primary btn-lg place-order-btn">
                  <span>Place Order ({formatCurrency(totalPrice)})</span>
                </button>
              </div>

              <div className="checkout-security-notice">
                <ShieldCheck size={16} />
                <span>256-bit encrypted secure SSL demo transaction</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
