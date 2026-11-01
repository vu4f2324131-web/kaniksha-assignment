import { useContext } from 'react';
import { CartContext } from '../context/cartContextDef';

/**
 * Custom hook to access CartContext state and actions
 * @returns {Object} Cart context value
 */
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
