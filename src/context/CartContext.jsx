import React, { useReducer, useEffect, useState, useMemo } from 'react';
import { cartReducer, CART_ACTIONS } from '../reducers/cartReducer';
import { getEnrichedCartItems, calculateTotalItems, calculateSubtotal, calculateShipping } from '../utils/cartUtils';
import { productService } from '../data/productService';
import { PROMO_CODES } from '../constants/promoCodes';
import { CartContext } from './cartContextDef';

const STORAGE_KEY = 'shopease_cart_v1';
const PROMO_STORAGE_KEY = 'shopease_promo_v1';
const WISHLIST_STORAGE_KEY = 'shopease_wishlist_v1';

/**
 * Safely loads and validates initial cart items from localStorage
 */
const getInitialCartState = () => {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (!rawData) return { items: [] };
    const parsed = JSON.parse(rawData);
    if (!Array.isArray(parsed)) return { items: [] };

    const validItems = parsed.filter(
      (item) => item && typeof item === 'object' && item.id && Number(item.quantity) > 0
    );

    return { items: validItems };
  } catch (error) {
    console.error('Failed to parse cart state from localStorage:', error);
    return { items: [] };
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, null, getInitialCartState);
  const [toastMessage, setToastMessage] = useState(null);
  const [appliedPromo, setAppliedPromo] = useState(() => {
    try {
      const saved = localStorage.getItem(PROMO_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Wishlist state
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Helper for displaying temporary toast notifications
  const showToast = (message, type = 'info') => {
    setToastMessage({ message, type, id: Date.now() });
  };

  const hideToast = () => {
    setToastMessage(null);
  };

  // Sync state.items to localStorage on state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch (error) {
      console.error('Failed to save cart state to localStorage:', error);
    }
  }, [state.items]);

  // Sync promo code
  useEffect(() => {
    try {
      if (appliedPromo) {
        localStorage.setItem(PROMO_STORAGE_KEY, JSON.stringify(appliedPromo));
      } else {
        localStorage.removeItem(PROMO_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Failed to save promo code:', error);
    }
  }, [appliedPromo]);

  // Sync wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch (error) {
      console.error('Failed to save wishlist:', error);
    }
  }, [wishlist]);

  // Wishlist actions
  const toggleWishlist = (productId) => {
    const idStr = String(productId);
    setWishlist((prev) => {
      const exists = prev.includes(idStr);
      if (exists) {
        showToast('Removed from saved items', 'info');
        return prev.filter((id) => id !== idStr);
      } else {
        showToast('Saved to your wishlist', 'success');
        return [...prev, idStr];
      }
    });
  };

  const isWishlisted = (productId) => wishlist.includes(String(productId));

  // Derived calculations
  const enrichedItems = useMemo(() => getEnrichedCartItems(state.items), [state.items]);
  const totalItems = useMemo(() => calculateTotalItems(state.items), [state.items]);
  const subtotal = useMemo(() => calculateSubtotal(enrichedItems), [enrichedItems]);
  const shipping = useMemo(() => calculateShipping(subtotal), [subtotal]);

  // Discount calculation
  const discountAmount = useMemo(() => {
    if (!appliedPromo || subtotal === 0) return 0;
    if (appliedPromo.minSubtotal && subtotal < appliedPromo.minSubtotal) return 0;

    if (appliedPromo.flatDiscount) {
      return Math.min(appliedPromo.flatDiscount, subtotal);
    }
    if (appliedPromo.discountPercent) {
      return Math.round((subtotal * appliedPromo.discountPercent) / 100);
    }
    return 0;
  }, [appliedPromo, subtotal]);

  const totalPrice = Math.max(0, subtotal - discountAmount) + shipping;

  // Promo code actions
  const applyPromoCode = (inputCode) => {
    const normalized = (inputCode || '').trim().toUpperCase();
    if (!normalized) return { success: false, message: 'Please enter a coupon code' };

    const promo = PROMO_CODES[normalized];
    if (!promo) {
      showToast(`Invalid coupon code "${normalized}"`, 'warning');
      return { success: false, message: 'Invalid coupon code' };
    }

    if (promo.minSubtotal && subtotal < promo.minSubtotal) {
      const msg = `Code requires minimum order of ₹${promo.minSubtotal.toLocaleString('en-IN')}`;
      showToast(msg, 'warning');
      return { success: false, message: msg };
    }

    setAppliedPromo(promo);
    showToast(`Promo "${promo.code}" applied! You saved on this order.`, 'success');
    return { success: true };
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    showToast('Promo code removed', 'info');
  };

  // Action Dispatchers with intelligent validation
  const addToCart = (id, quantity = 1) => {
    const product = productService.getProductById(id);
    if (!product || product.stock <= 0) {
      showToast('This item is currently out of stock', 'warning');
      return false;
    }

    const existing = state.items.find((item) => String(item.id) === String(id));
    const currentQty = existing ? existing.quantity : 0;
    const remainingStock = product.stock - currentQty;

    if (remainingStock <= 0) {
      showToast(`All available units (${product.stock}) are already in your bag!`, 'warning');
      return false;
    }

    const qtyToAdd = Math.min(Number(quantity) || 1, remainingStock);
    dispatch({ type: CART_ACTIONS.ADD_TO_CART, payload: { id, quantity: qtyToAdd } });

    if (qtyToAdd < quantity) {
      showToast(`Added ${qtyToAdd} items (maximum stock reached)`, 'info');
    } else {
      showToast(`Added ${qtyToAdd > 1 ? `${qtyToAdd} items` : 'item'} to bag`, 'success');
    }
    return true;
  };

  const removeFromCart = (id) => {
    dispatch({ type: CART_ACTIONS.REMOVE_FROM_CART, payload: id });
    showToast('Item removed from bag', 'info');
  };

  const increaseQuantity = (id) => {
    const product = productService.getProductById(id);
    const item = state.items.find((i) => String(i.id) === String(id));
    if (product && item && item.quantity >= product.stock) {
      showToast(`Maximum stock limit of ${product.stock} reached for this item`, 'warning');
      return;
    }
    dispatch({ type: CART_ACTIONS.INCREASE_QUANTITY, payload: id });
  };

  const decreaseQuantity = (id) => {
    dispatch({ type: CART_ACTIONS.DECREASE_QUANTITY, payload: id });
  };

  const updateQuantity = (id, quantity) => {
    dispatch({ type: CART_ACTIONS.UPDATE_QUANTITY, payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
    setAppliedPromo(null);
    showToast('Shopping bag cleared', 'info');
  };

  const contextValue = {
    cartItems: state.items,
    enrichedItems,
    totalItems,
    subtotal,
    shipping,
    discountAmount,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    totalPrice,
    toastMessage,
    showToast,
    hideToast,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    updateQuantity,
    clearCart,
    wishlist,
    toggleWishlist,
    isWishlisted,
    wishlistCount: wishlist.length
  };

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
};
