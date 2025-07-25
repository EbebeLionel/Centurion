import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FloatingCartButton.css';

interface FloatingCartButtonProps {
  cartItemCount?: number;
}

const FloatingCartButton: React.FC<FloatingCartButtonProps> = ({ cartItemCount = 0 }) => {
  const navigate = useNavigate();

  const handleCartClick = () => {
    navigate('/cart');
  };

  return (
    <button className="floating-cart-button" onClick={handleCartClick} aria-label="View cart">
      <div className="cart-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
      </div>
      <span className="cart-text">Cart</span>
      {cartItemCount > 0 && (
        <div className="cart-badge">
          <span>{cartItemCount > 99 ? '99+' : cartItemCount}</span>
        </div>
      )}
    </button>
  );
};

export default FloatingCartButton;