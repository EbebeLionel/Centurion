import './Models_dec.css';
import Header from '../Header_space/Header';
import FloatingCartButton from '../FloatingCartButton/FloatingCartButton';
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ModelItem, getAllModels, formatPrice } from '../../utils/modelsStore';
import { cartStore } from '../../utils/cartStore';
import { isModelInCategory, searchByCategory, getAllCategoryNames } from '../../utils/categoryTree';

const Models: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [models, setModels] = useState<ModelItem[]>([]);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [filteredModels, setFilteredModels] = useState<ModelItem[]>([]);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Navigation items array - same as Home page
  const navigationItems = [
    { id: 'characters', label: 'Characters', href: '#characters' },
    { id: 'architecture', label: 'Architecture', href: '#architecture' },
    { id: 'vehicles', label: 'Vehicles', href: '#vehicles' },
    { id: 'swords', label: 'Swords', href: '#swords' },
    { id: 'warrior', label: 'Warrior', href: '#warrior' },
    { id: 'man', label: 'Man', href: '#man' },
    { id: 'woman', label: 'Woman', href: '#woman' },
  ];

  // Load models and get search query from URL params on component mount
  useEffect(() => {
    const allModels = getAllModels();
    setModels(allModels);
    
    const searchQuery = searchParams.get('search');
    console.log('Models: URL params changed, searchQuery:', searchQuery);
    console.log('Models: Current search state:', search);
    
    if (searchQuery) {
      console.log('Models: Setting search to:', searchQuery);
      setSearch(searchQuery);
    } else {
      console.log('Models: No search query in URL, clearing search');
      setSearch('');
    }
  }, [searchParams]);

  // Filter models based on search and category tree
  useEffect(() => {
    if (!search.trim()) {
      setFilteredModels(models);
      return;
    }

    const searchTerm = search.toLowerCase().trim();
    
    // First, try exact category match using tree structure
    const categoryMatches = models.filter(model => {
      const modelCategories = model.categories || [model.category];
      return isModelInCategory(modelCategories, searchTerm);
    });

    // If we found category matches, use those
    if (categoryMatches.length > 0) {
      setFilteredModels(categoryMatches);
      return;
    }

    // Otherwise, fall back to name-based search
    const nameMatches = models.filter(model =>
      model.name.toLowerCase().includes(searchTerm)
    );

    setFilteredModels(nameMatches);
  }, [models, search]);

  // Generate search suggestions
  useEffect(() => {
    if (!search.trim()) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const searchTerm = search.toLowerCase();
    const categoryNames = getAllCategoryNames();
    
    // Filter category names that match the search term
    const suggestions = categoryNames
      .filter(category => category.includes(searchTerm))
      .slice(0, 5); // Limit to 5 suggestions

    setSearchSuggestions(suggestions);
    setShowSuggestions(suggestions.length > 0);
  }, [search]);

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

  // Handle search suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setSearch(suggestion);
    setSearchParams({ search: suggestion });
    setShowSuggestions(false);
  };

  // Handle search input focus
  const handleSearchFocus = () => {
    if (searchSuggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  // Handle search input blur
  const handleSearchBlur = () => {
    // Delay hiding suggestions to allow clicks
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  // Handle category navigation
  const handleCategoryClick = (category: string, e: React.MouseEvent) => {
    e.preventDefault();
    console.log(`Filtering by category: ${category}`);
    
    // Map category IDs to proper category names from the category tree
    const categoryMap: { [key: string]: string } = {
      'characters': 'Character',
      'architecture': 'Architecture',
      'vehicles': 'Vehicle',
      'swords': 'Sword'
    };
    
    const searchTerm = categoryMap[category] || category;
    console.log(`Models: Setting search to category: ${searchTerm}`);
    
    // Set search state and update URL
    setSearch(searchTerm);
    setSearchParams({ search: searchTerm });
    setIsCategoryMenuOpen(false); // Close mobile menu after clicking
  };

  const toggleCategoryMenu = (): void => {
    setIsCategoryMenuOpen(!isCategoryMenuOpen);
  };

  // Get search results info
  const getSearchResultsInfo = () => {
    if (!search.trim()) {
      return `Showing ${filteredModels.length} models`;
    }
    
    const categoryNodes = searchByCategory(search);
    if (categoryNodes.length > 0) {
      return `Found ${filteredModels.length} models in "${search}" category`;
    }
    
    return `Found ${filteredModels.length} models matching "${search}"`;
  };

  // Handle model click - navigate to detail page
  const handleModelClick = (model: ModelItem, e: React.MouseEvent) => {
    e.preventDefault();
    console.log(`Navigating to model detail: ${model.name}`);
    navigate(`/models/${model.id}`);
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

            {/* Search Results Info */}
            {(search.trim() || filteredModels.length !== models.length) && (
              <div className="search-results-info">
                <span className="results-text">{getSearchResultsInfo()}</span>
                {search.trim() && (
                  <button
                    className="clear-search-btn"
                    onClick={() => {
                      console.log('Models: Clear search button clicked');
                      setSearch('');
                      setSearchParams({});
                      navigate('/models');
                    }}
                  >
                    ✕ Clear Search
                  </button>
                )}
              </div>
            )}


            <div className="gallery">
              {filteredModels.map((model) => (
                <div 
                  className="pointer-react" 
                  key={model.id}
                  onClick={(e) => handleModelClick(model, e)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="image-container">
                    <img src={model.image} alt={model.name} />
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
                <div className="no-results">
                  <div className="no-results-icon">🔍</div>
                  <h3>No models found</h3>
                  <p>No models found for "{search}". Try a different search term or category.</p>
                  <div className="search-suggestions-help">
                    <p>Try searching for categories like:</p>
                    <div className="category-examples">
                      <span>Character</span>
                      <span>Vehicle</span>
                      <span>Machinery</span>
                      <span>Weapons</span>
                      <span>Architecture</span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Show message when no models at all */}
              {models.length === 0 && !search && (
                <div className="no-results">
                  <div className="no-results-icon">📦</div>
                  <h3>No models available</h3>
                  <p>Upload some models to get started!</p>
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