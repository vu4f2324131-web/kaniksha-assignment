import { describe, it, expect } from 'vitest';
import {
  calculateTotalItems,
  calculateSubtotal,
  calculateShipping,
  getEnrichedCartItems
} from '../utils/cartUtils';
import { formatCurrency } from '../utils/formatCurrency';

describe('cartUtils', () => {
  it('should calculate total item count as sum of quantities', () => {
    const rawItems = [
      { id: 'prod-101', quantity: 3 },
      { id: 'prod-102', quantity: 2 }
    ];
    expect(calculateTotalItems(rawItems)).toBe(5);
  });

  it('should handle empty or malformed items when calculating total item count', () => {
    expect(calculateTotalItems([])).toBe(0);
    expect(calculateTotalItems(null)).toBe(0);
    expect(calculateTotalItems([{ id: 'a', quantity: -1 }])).toBe(0);
  });

  it('should enrich raw cart items with product details and subtotal', () => {
    const rawItems = [{ id: 'prod-101', quantity: 2 }];
    const enriched = getEnrichedCartItems(rawItems);

    expect(enriched).toHaveLength(1);
    expect(enriched[0].name).toBe('Wireless Noise-Canceling Headphones');
    expect(enriched[0].price).toBe(8999);
    expect(enriched[0].lineSubtotal).toBe(17998);
  });

  it('should calculate subtotal correctly', () => {
    const enriched = [
      { lineSubtotal: 2000 },
      { lineSubtotal: 1500 }
    ];
    expect(calculateSubtotal(enriched)).toBe(3500);
  });

  it('should calculate shipping fee correctly (Free over 999)', () => {
    expect(calculateShipping(0)).toBe(0);
    expect(calculateShipping(500)).toBe(99);
    expect(calculateShipping(999)).toBe(0);
    expect(calculateShipping(1500)).toBe(0);
  });

  it('should format INR currency properly', () => {
    expect(formatCurrency(1299)).toContain('1,299');
    expect(formatCurrency(0)).toContain('0');
  });
});
