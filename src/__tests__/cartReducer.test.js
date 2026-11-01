import { describe, it, expect } from 'vitest';
import { cartReducer, CART_ACTIONS } from '../reducers/cartReducer';

describe('cartReducer', () => {
  const initialState = { items: [] };

  it('should add a new item to cart', () => {
    const action = { type: CART_ACTIONS.ADD_TO_CART, payload: { id: 'prod-101', quantity: 2 } };
    const newState = cartReducer(initialState, action);

    expect(newState.items).toHaveLength(1);
    expect(newState.items[0]).toEqual({ id: 'prod-101', quantity: 2 });
  });

  it('should increase quantity if item already exists in cart', () => {
    const stateWithItem = { items: [{ id: 'prod-101', quantity: 1 }] };
    const action = { type: CART_ACTIONS.ADD_TO_CART, payload: { id: 'prod-101', quantity: 3 } };
    const newState = cartReducer(stateWithItem, action);

    expect(newState.items).toHaveLength(1);
    expect(newState.items[0].quantity).toBe(4);
  });

  it('should remove item from cart', () => {
    const stateWithItems = {
      items: [
        { id: 'prod-101', quantity: 2 },
        { id: 'prod-102', quantity: 1 }
      ]
    };
    const action = { type: CART_ACTIONS.REMOVE_FROM_CART, payload: 'prod-101' };
    const newState = cartReducer(stateWithItems, action);

    expect(newState.items).toHaveLength(1);
    expect(newState.items[0].id).toBe('prod-102');
  });

  it('should increase item quantity', () => {
    const state = { items: [{ id: 'prod-101', quantity: 2 }] };
    const action = { type: CART_ACTIONS.INCREASE_QUANTITY, payload: 'prod-101' };
    const newState = cartReducer(state, action);

    expect(newState.items[0].quantity).toBe(3);
  });

  it('should decrease item quantity but not go below 1', () => {
    const state = { items: [{ id: 'prod-101', quantity: 1 }] };
    const action = { type: CART_ACTIONS.DECREASE_QUANTITY, payload: 'prod-101' };
    const newState = cartReducer(state, action);

    expect(newState.items[0].quantity).toBe(1);
  });

  it('should clear all items from cart', () => {
    const state = { items: [{ id: 'prod-101', quantity: 2 }, { id: 'prod-102', quantity: 5 }] };
    const action = { type: CART_ACTIONS.CLEAR_CART };
    const newState = cartReducer(state, action);

    expect(newState.items).toEqual([]);
  });
});
