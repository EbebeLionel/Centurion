import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAllCategoryNamesForDisplay } from '../../utils/categoryTree';
import { isAuthenticated, getCurrentUser, logout } from '../../utils/apiService';
import UserAvatar from '../UserAvatar/UserAvatar';
import './Header_dec.css';

interface HeaderProps {
  onNavigate?: (path: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userAuthenticated, setUserAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      const user = getCurrentUser();
      setUserAuthenticated(authenticated);
      setCurrentUser(user);
    };
    
    checkAuth();
    
    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = () => {
      checkAuth();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Generate search suggestions
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const searchTerm = searchQuery.toLowerCase();
    const categoryNames = getAllCategoryNamesForDisplay();
    
    // Filter category names that match the search term
    const suggestions = categoryNames
      .filter((category: string) => category.toLowerCase().includes(searchTerm))
      .slice(0, 5); // Limit to 5 suggestions
    setSearchSuggestions(suggestions);
    setShowSuggestions(suggestions.length > 0 && isSearchFocused);
  }, [searchQuery, isSearchFocused]);

  const handleNavigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      navigate(path);
    }
    setIsMenuOpen(false);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      handleNavigate(`/models?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
    }
  };

  // Handle search suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    handleNavigate(`/models?search=${encodeURIComponent(suggestion)}`);
    setShowSuggestions(false);
  };

  // Handle search input focus
  const handleSearchFocus = () => {
    setIsSearchFocused(true);
    if (searchSuggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  // Handle search input blur
  const handleSearchBlur = () => {
    setIsSearchFocused(false);
    // Delay hiding suggestions to allow clicks
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setUserAuthenticated(false);
    setCurrentUser(null);
    setShowUserMenu(false);
    handleNavigate('/home');
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
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
                type="text"
                placeholder="Search 3D models or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              {searchQuery && (
                <button className="search-clear" onClick={() => {
                  console.log('Header: Clear button clicked, current searchQuery:', searchQuery);
                  setSearchQuery('');
                  console.log('Header: Navigating to clean /models URL');
                  handleNavigate('/models');
                }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
              
              {/* Search Suggestions */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="search-suggestions">
                  {searchSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      className="search-suggestion-item"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <svg className="suggestion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M12 1v6m0 6v6"></path>
                        <path d="M1 12h6m6 0h6"></path>
                      </svg>
                      <span className="suggestion-text">{suggestion}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            <a className={`nav-item ${location.pathname === '/models' ? 'active' : ''}`} onClick={() => handleNavigate('/models')}>
              <span className="nav-text">3D Models</span>
              <div className="nav-indicator"></div>
            </a>
            <a className={`nav-item ${location.pathname === '/sell' ? 'active' : ''}`} onClick={() => handleNavigate('/sell')}>
              <span className="nav-text">Sell</span>
              <div className="nav-indicator"></div>
            </a>
            <a className={`nav-item ${location.pathname.startsWith('/settings') ? 'active' : ''}`} onClick={() => handleNavigate('/settings')}>
              <span className="nav-text">Settings</span>
              <div className="nav-indicator"></div>
            </a>
            
            {/* Conditional rendering for login/user avatar */}
            {userAuthenticated && currentUser ? (
              <div className="user-avatar-section" style={{ position: 'relative' }}>
                <div onClick={toggleUserMenu} style={{ cursor: 'pointer' }}>
                  <UserAvatar 
                    username={currentUser.username || currentUser.name || currentUser.email} 
                    size={44} 
                  />
                </div>
                
                {/* User dropdown menu */}
                {showUserMenu && (
                  <div className="user-dropdown">
                    <div className="user-info">
                      <div className="user-name">{currentUser.username || currentUser.name}</div>
                      <div className="user-email">{currentUser.email}</div>
                    </div>
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item" onClick={() => { handleNavigate('/settings'); setShowUserMenu(false); }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M12 1v6m0 6v6m9-9h-6m-6 0H3"></path>
                      </svg>
                      Settings
                    </button>
                    <button className="dropdown-item logout-item" onClick={handleLogout}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16,17 21,12 16,7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <a className={`nav-item login-nav ${location.pathname === '/login' ? 'active' : ''}`} onClick={() => handleNavigate('/login')}>
                <img
                  className="login-icon"
                  src="https://cdn-icons-png.flaticon.com/128/64/64572.png"
                  alt="Login"
                />
                <span className="login-text">Log in</span>
              </a>
            )}
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

            <a className="mobile-nav-item" onClick={() => handleNavigate('/sell')}>
              <div className="mobile-nav-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
              </div>
              <span>Sell</span>
              <svg className="nav-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="9,18 15,12 9,6"></polyline>
              </svg>
            </a>

            <a className="mobile-nav-item" onClick={() => handleNavigate('/settings')}>
              <div className="mobile-nav-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="m12 1 0 6m0 6 0 6"></path>
                  <path d="m9 12-7 0m6 0 14 0"></path>
                  <path d="m9 12 7 0"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M12 1v6m0 6v6m9-9h-6m-6 0H3"></path>
                </svg>
              </div>
              <span>Settings</span>
              <svg className="nav-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="9,18 15,12 9,6"></polyline>
              </svg>
            </a>
            
            {/* Mobile menu user section */}
            {userAuthenticated && currentUser ? (
              <a className="mobile-nav-item" onClick={() => handleNavigate('/settings')}>
                <div className="mobile-nav-icon-avatar">
                  <UserAvatar 
                    username={currentUser.username || currentUser.name || currentUser.email} 
                    size={32} 
                  />
                </div>
                <span>{currentUser.username || currentUser.name}</span>
                <svg className="nav-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="9,18 15,12 9,6"></polyline>
                </svg>
              </a>
            ) : (
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
            )}
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