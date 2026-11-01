import { productService } from '../data/productService';

export const CART_ACTIONS = {
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  INCREASE_QUANTITY: 'INCREASE_QUANTITY',
  DECREASE_QUANTITY: 'DECREASE_QUANTITY',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  SET_CART: 'SET_CART'
};

export const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_TO_CART: {
      const { id, quantity = 1 } = action.payload || {};
      if (!id) return state;

      const product = productService.getProductById(id);
      if (!product || product.stock <= 0) return state;

      const existingIndex = state.items.findIndex((item) => String(item.id) === String(id));

      if (existingIndex > -1) {
        const existingItem = state.items[existingIndex];
        const newQty = Math.min(existingItem.quantity + Math.max(1, Number(quantity)), product.stock);

        const updatedItems = [...state.items];
        updatedItems[existingIndex] = { ...existingItem, quantity: newQty };
        return { ...state, items: updatedItems };
      } else {
        const initialQty = Math.min(Math.max(1, Number(quantity)), product.stock);
        return {
          ...state,
          items: [...state.items, { id, quantity: initialQty }]
        };
      }
    }

    case CART_ACTIONS.REMOVE_FROM_CART: {
      const idToRemove = action.payload;
      return {
        ...state,
        items: state.items.filter((item) => String(item.id) !== String(idToRemove))
      };
    }

    case CART_ACTIONS.INCREASE_QUANTITY: {
      const idToInc = action.payload;
      const product = productService.getProductById(idToInc);
      if (!product) return state;

      return {
        ...state,
        items: state.items.map((item) => {
          if (String(item.id) === String(idToInc)) {
            const nextQty = Math.min(item.quantity + 1, product.stock);
            return { ...item, quantity: nextQty };
          }
          return item;
        })
      };
    }

    case CART_ACTIONS.DECREASE_QUANTITY: {
      const idToDec = action.payload;
      return {
        ...state,
        items: state.items.map((item) => {
          if (String(item.id) === String(idToDec)) {
            const nextQty = Math.max(1, item.quantity - 1);
            return { ...item, quantity: nextQty };
          }
          return item;
        })
      };
    }

    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { id: idToUpdate, quantity: targetQty } = action.payload || {};
      const product = productService.getProductById(idToUpdate);
      if (!product) return state;

      const validQty = Math.max(1, Math.min(Number(targetQty) || 1, product.stock));

      return {
        ...state,
        items: state.items.map((item) => {
          if (String(item.id) === String(idToUpdate)) {
            return { ...item, quantity: validQty };
          }
          return item;
        })
      };
    }

    case CART_ACTIONS.CLEAR_CART: {
      return {
        ...state,
        items: []
      };
    }

    case CART_ACTIONS.SET_CART: {
      const newItems = Array.isArray(action.payload) ? action.payload : [];
      return {
        ...state,
        items: newItems
      };
    }

    default:
      return state;
  }
};
