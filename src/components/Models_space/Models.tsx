import './Models_dec.css';
import Header from '../Header_space/Header';
import FloatingCartButton from '../FloatingCartButton/FloatingCartButton';
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ModelItem, getAllModels, formatPrice } from '../../utils/modelsStore';
import { cartStore } from '../../utils/cartStore';

const Models: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [models, setModels] = useState<ModelItem[]>([]);
  const [cartItemCount, setCartItemCount] = useState(0);

  // Navigation items array - same as Home page
  const navigationItems = [
    { id: 'characters', label: 'Characters', href: '#characters' },
    { id: 'architecture', label: 'Architecture', href: '#architecture' },
    { id: 'vehicles', label: 'Vehicles', href: '#vehicles' },
    { id: 'swords', label: 'Swords', href: '#swords' },
  ];

  // Load models and get search query from URL params on component mount
  useEffect(() => {
    const allModels = getAllModels();
    setModels(allModels);
    
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      setSearch(searchQuery);
    }
  }, [searchParams]);

  // Subscribe to cart changes
  useEffect(() => {
    const updateCartCount = () => {
      setCartItemCount(cartStore.getTotalItemCount());
    };

    // Set initial count
    updateCartCount();

    // Subscribe to changes
    const unsubscribe = cartStore.subscribe(updateCartCount);

    // Cleanup
    return unsubscribe;
  }, []);

  // Custom navigation function for Header
  const handleHeaderNavigation = (path: string) => {
    navigate(path);
  };

  // Handle search input changes and update URL
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearch = e.target.value;
    setSearch(newSearch);
    
    // Update URL params
    if (newSearch.trim()) {
      setSearchParams({ search: newSearch });
    } else {
      setSearchParams({});
    }
  };

  // Handle category navigation
  const handleCategoryClick = (category: string, e: React.MouseEvent) => {
    e.preventDefault();
    console.log(`Filtering by category: ${category}`);
    setIsCategoryMenuOpen(false); // Close mobile menu after clicking
  };

  const toggleCategoryMenu = (): void => {
    setIsCategoryMenuOpen(!isCategoryMenuOpen);
  };

  // Filter models based on search
  const filteredModels = models.filter((model) =>
    model.name.toLowerCase().includes(search.toLowerCase())
  );

  // Handle model click (for future individual model pages)
  const handleModelClick = (model: ModelItem, e: React.MouseEvent) => {
    e.preventDefault();
    console.log(`Clicked on model: ${model.name}`);
    // Future: navigate to individual model page
    // navigate(`/models/${model.id}`);
  };

  // Handle add to cart
  const handleAddToCart = (model: ModelItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    cartStore.addToCart(model);
    console.log(`Added to cart: ${model.name}`);
  };

  return (
    <>
      <Header onNavigate={handleHeaderNavigation} />
      <FloatingCartButton cartItemCount={cartItemCount} />
      <main>
        <section>
          <div className="parent-content-new-tab">
            {/* Search Field 
            <div className="search-bar-models">
              <input
                type="text"
                placeholder="Search models..."
                value={search}
                onChange={handleSearchChange}
              />
            </div>*/}

            <div className="second-nav">
              {/* Desktop Navigation */}
              <ul className="desktop-nav-list">
                {navigationItems.map((item) => (
                  <li key={item.id}>
                    <a 
                      href={item.href} 
                      onClick={(e) => handleCategoryClick(item.id, e)}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>

              {/* Mobile Menu Button */}
              <div className="mobile-category-nav">
                <button 
                  className={`category-menu-toggle ${isCategoryMenuOpen ? 'active' : ''}`}
                  onClick={toggleCategoryMenu}
                  aria-label="Toggle categories menu"
                >
                  <span className="menu-text">Categories</span>
                  <svg className="menu-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="6,9 12,15 18,9"></polyline>
                  </svg>
                </button>

                {/* Mobile Dropdown Menu */}
                <div className={`mobile-category-menu ${isCategoryMenuOpen ? 'open' : ''}`}>
                  <div className="mobile-category-items">
                    {navigationItems.map((item) => (
                      <a 
                        key={item.id}
                        href={item.href} 
                        onClick={(e) => handleCategoryClick(item.id, e)}
                        className="mobile-nav-item"
                      >
                        <span className="mobile-nav-text">{item.label}</span>
                        <svg className="nav-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <polyline points="9,18 15,12 9,6"></polyline>
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="gallery">
              {filteredModels.map((model) => (
                <div className="pointer-react" key={model.id}>
                  <div className="image-container">
                    <a
                      href="#"
                      onClick={(e) => handleModelClick(model, e)}
                    >
                      <img src={model.image} alt={model.name} />
                    </a>
                    <div className="overlay"></div>
                    <div className="price-box">
                      <span className="price">{formatPrice(model.price)}</span>
                    </div>
                    <button
                      className={`add-to-cart-button ${cartStore.isInCart(model.id) ? 'in-cart' : ''}`}
                      onClick={(e) => handleAddToCart(model, e)}
                    >
                      {cartStore.isInCart(model.id) ? '✓ In Cart' : '🛒 Add to Cart'}
                    </button>
                    {model.isUserUploaded && (
                      <div className="user-uploaded-badge">
                        <span>Your Upload</span>
                      </div>
                    )}
                  </div>
                  <div className="title">
                    <h3>{model.name}</h3>
                  </div>
                </div>
              ))}
              
              {/* Show message when no results found */}
              {filteredModels.length === 0 && search && (
                <div style={{
                  textAlign: 'center',
                  padding: '40px',
                  width: '100%',
                  fontFamily: '"Karla", sans-serif',
                  fontSize: '18px',
                  color: '#666'
                }}>
                  No models found for "{search}". Try a different search term.
                </div>
              )}
              
              {/* Show message when no models at all */}
              {models.length === 0 && !search && (
                <div style={{
                  textAlign: 'center',
                  padding: '40px',
                  width: '100%',
                  fontFamily: '"Karla", sans-serif',
                  fontSize: '18px',
                  color: '#666'
                }}>
                  No models available. Upload some models to get started!
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Models;