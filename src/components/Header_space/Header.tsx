import React, { useState, useEffect } from 'react';
import './Header_dec.css';

interface HeaderProps {
  onNavigate?: (path: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      console.log(`Navigate to ${path}`);
    }
    setIsMenuOpen(false);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      handleNavigate(`/models?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Backdrop for mobile menu */}
      {isMenuOpen && <div className="menu-backdrop" onClick={() => setIsMenuOpen(false)} />}
      
      <header className={`modern-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-container">
          {/* Logo Section with animated elements */}
          <div className="logo-section" onClick={() => handleNavigate('/home')}>
            <div className="logo-wrapper">
              <img
                className="logo-icon"
                src="https://cdn-icons-png.flaticon.com/128/16066/16066544.png"
                alt="CENTURION"
              />
              <div className="logo-glow"></div>
            </div>
            <div className="brand-text">
              <h1 className="logo-text">CENTURION</h1>
              <span className="brand-subtitle">3D Platform</span>
            </div>
          </div>

          {/* Enhanced Search Bar */}
          <div className="search-section">
            <div className={`search-container ${isSearchFocused ? 'focused' : ''}`}>
              <div className="search-icon-wrapper">
                <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </div>
              <input
                className="search-input"
                type="search"
                placeholder="Search 3D models..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              {searchQuery && (
                <button className="search-clear" onClick={() => setSearchQuery('')}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            <a className="nav-item" onClick={() => handleNavigate('/models')}>
              <span className="nav-text">3D Models</span>
              <div className="nav-indicator"></div>
            </a>
            <a className="nav-item login-nav" onClick={() => handleNavigate('/login')}>
              <img
                className="login-icon"
                src="https://cdn-icons-png.flaticon.com/128/64/64572.png"
                alt="Login"
              />
              <span className="login-text">Log in</span>
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className={`menu-toggle ${isMenuOpen ? 'active' : ''}`} 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
          <div className="mobile-menu-header">
            <div className="menu-brand">
              <img
                src="https://cdn-icons-png.flaticon.com/128/16066/16066544.png"
                alt="CENTURION"
                className="menu-logo"
              />
              <span>CENTURION</span>
            </div>
            <button className="menu-close" onClick={toggleMenu}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <nav className="mobile-nav">
            <a className="mobile-nav-item" onClick={() => handleNavigate('/models')}>
              <div className="mobile-nav-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polygon points="12,2 2,7 12,12 22,7 12,2"></polygon>
                  <polyline points="2,17 12,22 22,17"></polyline>
                  <polyline points="2,12 12,17 22,12"></polyline>
                </svg>
              </div>
              <span>3D Models</span>
              <svg className="nav-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="9,18 15,12 9,6"></polyline>
              </svg>
            </a>
            
            <a className="mobile-nav-item" onClick={() => handleNavigate('/login')}>
              <div className="mobile-nav-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <span>Log in</span>
              <svg className="nav-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="9,18 15,12 9,6"></polyline>
              </svg>
            </a>
          </nav>

          <div className="mobile-menu-footer">
            <div className="social-links">
              <span>Follow us</span>
              <div className="social-icons">
                <div className="social-icon">📧</div>
                <div className="social-icon">🐦</div>
                <div className="social-icon">💼</div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;