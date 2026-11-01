import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ImageOff, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';
import { QuantitySelector } from './QuantitySelector';
import { useCart } from '../hooks/useCart';
import './CartItem.css';

export const CartItem = ({ item }) => {
  const { increaseQuantity, decreaseQuantity, updateQuantity, removeFromCart } = useCart();
  const [imgError, setImgError] = useState(false);

  if (!item) return null;

  const { id, name, category, price, quantity, lineSubtotal, stock, image } = item;
  const isMaxStock = quantity >= stock;

  return (
    <div className="cart-item-card fade-in">
      {/* Thumbnail */}
      <div className="cart-item-image-wrapper">
        <Link to={`/products/${id}`}>
          {!imgError && image ? (
            <img
              src={image}
              alt={name}
              className="cart-item-image"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="cart-item-image-fallback">
              <ImageOff size={24} />
            </div>
          )}
        </Link>
      </div>

      {/* Details */}
      <div className="cart-item-details">
        <span className="badge badge-primary item-category-badge">{category}</span>
        <h4 className="cart-item-title">
          <Link to={`/products/${id}`}>{name}</Link>
        </h4>
        <div className="cart-item-unit-price">
          Unit price: <span>{formatCurrency(price)}</span>
        </div>
      </div>

      {/* Quantity Control */}
      <div className="cart-item-quantity">
        <QuantitySelector
          quantity={quantity}
          stock={stock}
          onIncrease={() => increaseQuantity(id)}
          onDecrease={() => decreaseQuantity(id)}
          onChange={(newQty) => updateQuantity(id, newQty)}
          size="medium"
        />
        {isMaxStock ? (
          <span className="stock-hint max-reached">
            <AlertCircle size={11} /> Max stock ({stock}) reached
          </span>
        ) : (
          <span className="stock-hint">Available: {stock} units</span>
        )}
      </div>

      {/* Line Subtotal */}
      <div className="cart-item-subtotal">
        <span className="subtotal-label">Subtotal</span>
        <span className="subtotal-amount">{formatCurrency(lineSubtotal)}</span>
      </div>

      {/* Remove Item Button */}
      <div className="cart-item-actions">
        <button
          type="button"
          className="btn btn-danger-outline btn-sm remove-item-btn"
          onClick={() => removeFromCart(id)}
          aria-label={`Remove ${name} from cart`}
          title="Remove item"
        >
          <Trash2 size={16} />
          <span className="remove-btn-text">Remove</span>
        </button>
      </div>
    </div>
  );
};
