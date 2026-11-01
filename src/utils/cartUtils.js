import { productService } from '../data/productService';

/**
 * Enriches raw cart items [{ id, quantity }] with full product information
 * Handles missing/deleted products safely
 * @param {Array<{id: string|number, quantity: number}>} cartItems
 * @returns {Array<Object>} Enriched cart items with product details and subtotal
 */
export const getEnrichedCartItems = (cartItems = []) => {
  if (!Array.isArray(cartItems)) return [];

  return cartItems
    .map((item) => {
      if (!item || !item.id) return null;
      const product = productService.getProductById(item.id);
      if (!product) return null;

      // Ensure quantity is within valid range [1, product.stock]
      const validQuantity = Math.max(1, Math.min(Number(item.quantity) || 1, product.stock));
      const lineSubtotal = product.price * validQuantity;

      return {
        ...product,
        quantity: validQuantity,
        lineSubtotal
      };
    })
    .filter(Boolean);
};

/**
 * Calculates total number of units in the cart
 * @param {Array<{quantity: number}>} cartItems
 * @returns {number} Sum of quantities
 */
export const calculateTotalItems = (cartItems = []) => {
  if (!Array.isArray(cartItems)) return 0;
  return cartItems.reduce((total, item) => {
    const qty = Number(item?.quantity) || 0;
    return total + (qty > 0 ? qty : 0);
  }, 0);
};

/**
 * Calculates subtotal price of all cart items
 * @param {Array<Object>} enrichedItems - Enriched items with price and quantity
 * @returns {number} Total subtotal
 */
export const calculateSubtotal = (enrichedItems = []) => {
  if (!Array.isArray(enrichedItems)) return 0;
  return enrichedItems.reduce((total, item) => total + (item.lineSubtotal || 0), 0);
};

/**
 * Calculates shipping cost (Free for orders over ₹999 or empty cart)
 * @param {number} subtotal
 * @returns {number} Shipping fee in INR
 */
export const calculateShipping = (subtotal) => {
  if (subtotal === 0 || subtotal >= 999) return 0;
  return 99;
};
