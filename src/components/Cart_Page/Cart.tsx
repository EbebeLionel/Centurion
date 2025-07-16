import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header_space/Header';
import { cartStore, CartItem, formatPrice } from '../../utils/cartStore';
import './Cart_dec.css';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const handleHeaderNavigation = (path: string) => {
    navigate(path);
  };

  // Subscribe to cart changes
  useEffect(() => {
    const updateCart = () => {
      setCartItems(cartStore.getCartItems());
    };

    // Set initial cart items
    updateCart();

    // Subscribe to changes
    const unsubscribe = cartStore.subscribe(updateCart);

    // Cleanup
    return unsubscribe;
  }, []);

  // Handle item removal
  const handleRemoveItem = (itemId: string) => {
    cartStore.removeFromCart(itemId);
  };

  // Handle quantity change
  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    cartStore.updateQuantity(itemId, newQuantity);
  };

  // Calculate total price
  const totalPrice = cartStore.getTotalPrice();
  const totalItems = cartStore.getTotalItemCount();

  return (
    <>
      <Header onNavigate={handleHeaderNavigation} />
      <main className="cart-main">
        <section className="cart-container">
          <h1 className="cart-title">Shopping Cart</h1>
          <div className="cart-content">
            {cartItems.length === 0 ? (
              <div className="empty-cart">
                <div className="empty-cart-icon">🛒</div>
                <h2>Your cart is empty</h2>
                <p>Add some 3D models to your cart to get started</p>
                <button
                  className="browse-models-btn"
                  onClick={() => navigate('/models')}
                >
                  Browse Models
                </button>
              </div>
            ) : (
              <div className="cart-items-container">
                <div className="cart-summary">
                  <h2>Cart Summary</h2>
                  <p>{totalItems} item{totalItems !== 1 ? 's' : ''} • Total: {formatPrice(totalPrice)}</p>
                </div>
                
                <div className="cart-items">
                  {cartItems.map((item) => (
                    <div key={item.id} className="cart-item">
                      <div className="cart-item-image">
                        <img src={item.image} alt={item.name} />
                      </div>
                      
                      <div className="cart-item-details">
                        <h3 className="cart-item-name">{item.name}</h3>
                        <p className="cart-item-price">{formatPrice(item.price)} each</p>
                        
                        <div className="cart-item-quantity">
                          <label>Quantity:</label>
                          <div className="quantity-controls">
                            <button
                              className="quantity-btn"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>
                            <span className="quantity-value">{item.quantity}</span>
                            <button
                              className="quantity-btn"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                        
                        <p className="cart-item-subtotal">
                          Subtotal: {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                      
                      <div className="cart-item-actions">
                        <button
                          className="remove-item-btn"
                          onClick={() => handleRemoveItem(item.id)}
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polyline points="3,6 5,6 21,6"></polyline>
                            <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="cart-actions">
                  <button
                    className="continue-shopping-btn"
                    onClick={() => navigate('/models')}
                  >
                    Continue Shopping
                  </button>
                  <button
                    className="checkout-btn"
                    onClick={() => alert('Checkout functionality not implemented yet')}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
};

export default Cart;