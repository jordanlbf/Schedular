// Cart storage service for local cart management
import { Cart, CartItem } from '../types';

export class CartStorage {
  private static readonly CART_KEY = 'shopping_cart';
  private static readonly CART_ID_KEY = 'active_cart_id';

  static saveCart(cart: Cart): void {
    localStorage.setItem(this.CART_KEY, JSON.stringify(cart));
    localStorage.setItem(this.CART_ID_KEY, cart.id);
  }

  static getCart(): Cart | null {
    const cartStr = localStorage.getItem(this.CART_KEY);
    if (!cartStr) return null;

    try {
      return JSON.parse(cartStr);
    } catch {
      return null;
    }
  }

  static getCartId(): string | null {
    return localStorage.getItem(this.CART_ID_KEY);
  }

  static clearCart(): void {
    localStorage.removeItem(this.CART_KEY);
    localStorage.removeItem(this.CART_ID_KEY);
  }

  static addItemToLocalCart(item: CartItem): void {
    const cart = this.getCart();
    if (!cart) return;

    const existingItemIndex = cart.items.findIndex(i => i.productId === item.productId);
    
    if (existingItemIndex >= 0) {
      cart.items[existingItemIndex].quantity += item.quantity;
      cart.items[existingItemIndex].subtotal = 
        cart.items[existingItemIndex].quantity * cart.items[existingItemIndex].unitPrice;
    } else {
      cart.items.push(item);
    }

    cart.updatedAt = new Date();
    this.saveCart(cart);
  }

  static removeItemFromLocalCart(itemId: string): void {
    const cart = this.getCart();
    if (!cart) return;

    cart.items = cart.items.filter(item => item.id !== itemId);
    cart.updatedAt = new Date();
    this.saveCart(cart);
  }

  static updateItemQuantity(itemId: string, quantity: number): void {
    const cart = this.getCart();
    if (!cart) return;

    const item = cart.items.find(i => i.id === itemId);
    if (item) {
      item.quantity = quantity;
      item.subtotal = quantity * item.unitPrice;
      cart.updatedAt = new Date();
      this.saveCart(cart);
    }
  }

  static syncWithServer(serverCart: Cart): void {
    this.saveCart(serverCart);
  }
}
