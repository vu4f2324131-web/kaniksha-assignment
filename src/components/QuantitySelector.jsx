import React from 'react';
import { Plus, Minus } from 'lucide-react';
import './QuantitySelector.css';

export const QuantitySelector = ({
  quantity = 1,
  stock = 99,
  onIncrease,
  onDecrease,
  onChange,
  disabled = false,
  size = 'medium'
}) => {
  const isMin = quantity <= 1;
  const isMax = quantity >= stock;

  const handleInputChange = (e) => {
    if (!onChange) return;
    const val = parseInt(e.target.value, 10);
    if (isNaN(val)) return;
    const clampedVal = Math.max(1, Math.min(val, stock));
    onChange(clampedVal);
  };

  return (
    <div className={`quantity-selector ${size} ${disabled ? 'disabled' : ''}`}>
      <button
        type="button"
        className="qty-btn"
        onClick={onDecrease}
        disabled={disabled || isMin}
        aria-label="Decrease quantity"
        title={isMin ? 'Minimum quantity is 1' : 'Decrease quantity'}
      >
        <Minus size={14} />
      </button>

      {onChange ? (
        <input
          type="number"
          className="qty-input"
          value={quantity}
          onChange={handleInputChange}
          min={1}
          max={stock}
          disabled={disabled}
          aria-label="Product quantity"
        />
      ) : (
        <span className="qty-value" aria-label={`Quantity: ${quantity}`}>
          {quantity}
        </span>
      )}

      <button
        type="button"
        className="qty-btn"
        onClick={onIncrease}
        disabled={disabled || isMax}
        aria-label="Increase quantity"
        title={isMax ? `Maximum stock reached (${stock})` : 'Increase quantity'}
      >
        <Plus size={14} />
      </button>
    </div>
  );
};
