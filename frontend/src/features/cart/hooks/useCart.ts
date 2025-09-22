// Cart hook for managing cart state and operations
import { useState, useEffect, useCallback } from 'react';
import { Cart, CartItem, CartTotals, CartState } from '../types';
import { CartAPI } from '../services/cart.api';
import { CartStorage } from '../services/cart.storage';

export const useCart = () => {
  const [cartState, setCartState] = useState<CartState>({
    cart: null,
    isLoading: false,
    error: null,
  });

  // Load cart on mount
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = useCallback(async () => {
    setCartState(prev => ({ ...prev, isLoading: true }));

    try {
      // Try to get cart from server first
      const cartId = CartStorage.getCartId();
      let cart: Cart;

      if (cartId) {
        cart = await CartAPI.getCart(cartId);
      } else {
        // Create new cart if none exists
        cart = await CartAPI.createCart();
      }

      CartStorage.syncWithServer(cart);
      setCartState({
        cart,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      // Fall back to local cart if server fails
      const localCart = CartStorage.getCart();
      setCartState({
        cart: localCart,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load cart',
      });
    }
  }, []);

  const addItem = useCallback(async (item: Omit<CartItem, 'id' | 'subtotal'>) => {
    if (!cartState.cart) return;

    setCartState(prev => ({ ...prev, isLoading: true }));

    try {
      const updatedCart = await CartAPI.addItem(cartState.cart.id, item);
      CartStorage.syncWithServer(updatedCart);
      
      setCartState({
        cart: updatedCart,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setCartState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to add item',
      }));
    }
  }, [cartState.cart]);

  const updateItem = useCallback(async (itemId: string, updates: Partial<CartItem>) => {
    if (!cartState.cart) return;

    setCartState(prev => ({ ...prev, isLoading: true }));

    try {
      const updatedCart = await CartAPI.updateItem(cartState.cart.id, itemId, updates);
      CartStorage.syncWithServer(updatedCart);
      
      setCartState({
        cart: updatedCart,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setCartState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to update item',
      }));
    }
  }, [cartState.cart]);

  const removeItem = useCallback(async (itemId: string) => {
    if (!cartState.cart) return;

    setCartState(prev => ({ ...prev, isLoading: true }));

    try {
      const updatedCart = await CartAPI.removeItem(cartState.cart.id, itemId);
      CartStorage.syncWithServer(updatedCart);
      
      setCartState({
        cart: updatedCart,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setCartState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to remove item',
      }));
    }
  }, [cartState.cart]);

  const clearCart = useCallback(async () => {
    if (!cartState.cart) return;

    setCartState(prev => ({ ...prev, isLoading: true }));

    try {
      const clearedCart = await CartAPI.clearCart(cartState.cart.id);
      CartStorage.syncWithServer(clearedCart);
      
      setCartState({
        cart: clearedCart,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setCartState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to clear cart',
      }));
    }
  }, [cartState.cart]);

  const getTotals = useCallback(async (): Promise<CartTotals | null> => {
    if (!cartState.cart) return null;

    try {
      return await CartAPI.calculateTotals(cartState.cart.id);
    } catch (error) {
      console.error('Failed to calculate totals:', error);
      return null;
    }
  }, [cartState.cart]);

  const applyDiscount = useCallback(async (discountCode: string) => {
    if (!cartState.cart) return;

    setCartState(prev => ({ ...prev, isLoading: true }));

    try {
      const updatedCart = await CartAPI.applyDiscount(cartState.cart.id, discountCode);
      CartStorage.syncWithServer(updatedCart);
      
      setCartState({
        cart: updatedCart,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setCartState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Invalid discount code',
      }));
      throw error;
    }
  }, [cartState.cart]);

  const setCustomer = useCallback(async (customerId: string) => {
    if (!cartState.cart) return;

    setCartState(prev => ({ ...prev, isLoading: true }));

    try {
      const updatedCart = await CartAPI.setCustomer(cartState.cart.id, customerId);
      CartStorage.syncWithServer(updatedCart);
      
      setCartState({
        cart: updatedCart,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setCartState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to set customer',
      }));
    }
  }, [cartState.cart]);

  return {
    ...cartState,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    getTotals,
    applyDiscount,
    setCustomer,
    refreshCart: loadCart,
  };
};
