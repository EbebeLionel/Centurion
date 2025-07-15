import './Models_dec.css';
import Header from '../Header_space/Header';
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const items = [
  {
    id: 1,
    name: "Malenia",
    img: "https://tse3.mm.bing.net/th?id=OIP.uIDEAgOeB1feLJ4hBcZRJQHaEK&pid=Api&P=0&h=220",
    category: "characters",
    price: "$24.99"
  },
  {
    id: 2,
    name: "Radahn",
    img: "https://tse2.mm.bing.net/th?id=OIP.5p1oE1izcBrr6kqPaB755AHaEK&pid=Api&P=0&h=220",
    category: "characters",
    price: "$29.99"
  },
  {
    id: 3,
    name: "Goku",
    img: "https://tse2.mm.bing.net/th?id=OIP.RvZBJb7M19bnds9w5pH4ugHaE5&pid=Api&P=0&h=220",
    category: "characters",
    price: "$19.99"
  },
  {
    id: 4,
    name: "Vegeta",
    img: "https://tse2.mm.bing.net/th?id=OIP.6kFD8fmxtr0I65f5eIeywgHaGL&pid=Api&P=0&h=220",
    category: "characters",
    price: "$19.99"
  },
  {
    id: 5,
    name: "Tarnished",
    img: "https://tse2.mm.bing.net/th/id/OIP.eEOuN7GvsAgX8ndZPcPXaQHaDt?pid=Api&P=0&h=220",
    category: "characters",
    price: "$22.99"
  }
];

const Models: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

  // Navigation items array - same as Home page
  const navigationItems = [
    { id: 'characters', label: 'Characters', href: '#characters' },
    { id: 'architecture', label: 'Architecture', href: '#architecture' },
    { id: 'vehicles', label: 'Vehicles', href: '#vehicles' },
    { id: 'swords', label: 'Swords', href: '#swords' },
  ];

  // Get search query from URL params on component mount
  useEffect(() => {
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      setSearch(searchQuery);
    }
  }, [searchParams]);

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

  // Filter items based on search
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  // Handle model click (for future individual model pages)
  const handleModelClick = (item: typeof items[0], e: React.MouseEvent) => {
    e.preventDefault();
    console.log(`Clicked on model: ${item.name}`);
    // Future: navigate to individual model page
    // navigate(`/models/${item.id}`);
  };

  return (
    <>
      <Header onNavigate={handleHeaderNavigation} />
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
              {filteredItems.map((item) => (
                <div className="pointer-react" key={item.id}>
                  <a
                    href="#"
                    onClick={(e) => handleModelClick(item, e)}
                  >
                    <img src={item.img} alt={item.name} />
                  </a>
                  <div className="overlay"></div>
                  <div className="price-box">
                    <span className="price">{item.price}</span>
                  </div>
                  <div className="title">
                    <h3>{item.name}</h3>
                  </div>
                </div>
              ))}
              
              {/* Show message when no results found */}
              {filteredItems.length === 0 && search && (
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
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Models;