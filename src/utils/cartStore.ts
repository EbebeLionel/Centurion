import { ModelItem } from './modelsStore';

export interface CartItem extends ModelItem {
  quantity: number;
  addedAt: Date;
}

class CartStore {
  private cartItems: CartItem[] = [];
  private listeners: Array<() => void> = [];

  // Subscribe to cart changes
  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Notify all listeners of changes
  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  // Add item to cart
  addToCart(model: ModelItem): void {
    const existingItemIndex = this.cartItems.findIndex(item => item.id === model.id);
    
    if (existingItemIndex !== -1) {
      // If item already exists, increase quantity
      this.cartItems[existingItemIndex].quantity += 1;
    } else {
      // Add new item to cart
      const cartItem: CartItem = {
        ...model,
        quantity: 1,
        addedAt: new Date()
      };
      this.cartItems.push(cartItem);
    }
    
    this.notifyListeners();
  }

  // Remove item from cart
  removeFromCart(modelId: string): void {
    this.cartItems = this.cartItems.filter(item => item.id !== modelId);
    this.notifyListeners();
  }

  // Update item quantity
  updateQuantity(modelId: string, quantity: number): void {
    const itemIndex = this.cartItems.findIndex(item => item.id === modelId);
    if (itemIndex !== -1) {
      if (quantity <= 0) {
        this.removeFromCart(modelId);
      } else {
        this.cartItems[itemIndex].quantity = quantity;
        this.notifyListeners();
      }
    }
  }

  // Get all cart items
  getCartItems(): CartItem[] {
    return [...this.cartItems];
  }

  // Get total item count
  getTotalItemCount(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  // Get total price
  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // Clear cart
  clearCart(): void {
    this.cartItems = [];
    this.notifyListeners();
  }

  // Check if item is in cart
  isInCart(modelId: string): boolean {
    return this.cartItems.some(item => item.id === modelId);
  }

  // Get item quantity in cart
  getItemQuantity(modelId: string): number {
    const item = this.cartItems.find(item => item.id === modelId);
    return item ? item.quantity : 0;
  }
}

// Create singleton instance
export const cartStore = new CartStore();

// Helper function to format price
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
};