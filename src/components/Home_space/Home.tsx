import './Home_dec.css';
import React, { useState, useEffect } from 'react';
import Header from '../Header_space/Header';
import FloatingCartButton from '../FloatingCartButton/FloatingCartButton';
import { useNavigate } from 'react-router-dom';
import { cartStore } from '../../utils/cartStore';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  
  // Navigation items array - easily add/remove items here
  const navigationItems = [
    { id: 'characters', label: 'Characters', href: '#characters' },
    { id: 'architecture', label: 'Architecture', href: '#architecture' },
    { id: 'vehicles', label: 'Vehicles', href: '#vehicles' },
    { id: 'swords', label: 'Swords', href: '#swords' },
  ];

  const infoOneUrl = "https://cdn.cgdream.ai/_next/image?url=https%3A%2F%2Fapi.cgdream.ai%2Frails%2Factive_storage%2Fblobs%2Fredirect%2FeyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBOUUyRnc9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ%3D%3D--26c712540287369ed6fd9952c7e66e9e75622a53%2Fe4c4bd12-274f-450c-9f76-e85fa39d9e91_0.png&w=512&q=95";
  const infoTwoUrl = "https://cdn.cgdream.ai/_next/image?url=https%3A%2F%2Fapi.cgdream.ai%2Frails%2Factive_storage%2Fblobs%2Fredirect%2FeyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBeWk2Q3c9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ%3D%3D--7bef2e8bb229bee100524674b8d679849965a36c%2F6955ae1d-eba5-4c1f-8f4a-8247ecfa5347_0.png&w=512&q=90";
  const colOneUrl = "https://cdn.cgdream.ai/_next/image?url=https%3A%2F%2Fapi.cgdream.ai%2Frails%2Factive_storage%2Fblobs%2Fredirect%2FeyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBd3o2RHc9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ%3D%3D--e841dadb0a84741279ef91f43d295a93b7ac8872%2F5b40bece-9d79-404b-95a8-72adb5b7f2b5_0.png&w=512&q=90";
  const colTwoUrl = "https://cdn.cgdream.ai/_next/image?url=https%3A%2F%2Fapi.cgdream.ai%2Frails%2Factive_storage%2Fblobs%2Fredirect%2FeyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBellTSFE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ%3D%3D--6904d1220f4631d3d2e9eb52c1a3cfd06ca3f5ee%2Fd27b80ff-c651-4559-b212-a93ee354dcc1_0.png&w=512&q=90";
  const colThreeUrl = "https://cdn.cgdream.ai/_next/image?url=https%3A%2F%2Fapi.cgdream.ai%2Frails%2Factive_storage%2Fblobs%2Fredirect%2FeyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBMmt6SlE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ%3D%3D--c936eb592cade01150d5032353bf6877de2eaf47%2Fd22006f6-d457-4aff-8872-2d094fb7500f_0.png&w=512&q=90";
  
  // Handle "Get started" button click - navigate to signup
  const handleGetStartedClick = (): void => {
    navigate('/signup');
  }

  const handleNavClick = (href: string): void => {
    console.log(`Navigating to: ${href}`);
    setIsCategoryMenuOpen(false);
  }

  const toggleCategoryMenu = (): void => {
    setIsCategoryMenuOpen(!isCategoryMenuOpen);
  }

  // Custom navigation function for Header
  const handleHeaderNavigation = (path: string) => {
    navigate(path);
  }

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
  
  return (
    <>
      <Header onNavigate={handleHeaderNavigation} />
      <FloatingCartButton cartItemCount={cartItemCount} />
      <section className="intro-pic">
        <div className="intro-title-overlay">
          <h1 className="intro-main-title">CENTURION</h1>
          <p className="intro-subtitle">Where Dreams Become Reality</p>
        </div>
      </section>

      <main>
        <section>
          <div className="parent-content">
            <div className="second-nav">
              {/* Desktop Navigation */}
              <ul className="desktop-nav-list">
                {navigationItems.map((item) => (
                  <li key={item.id}>
                    <a 
                      href={item.href} 
                      onClick={() => handleNavClick(item.href)}
                      className="nav-item"
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
                        onClick={() => handleNavClick(item.href)}
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
            
            <div className="info1 container">
              <div className="info1-text">
                <h1>Where imagination meets reality</h1>
                <p>
                  CENTURION is an interactive mind-blowing application that
                  utilizes cutting-edge AI technology to transform your creative visions into stunning 3D models. 
                  Experience the future of digital art creation where every idea becomes a masterpiece. 
                  Our advanced algorithms analyze your concepts and bring them to life with unprecedented detail and realism.
                </p>
              </div>
              <div className="enhanced-image-container">
                <div className="image-decoration-ring"></div>
                <div className="image-glow-effect"></div>
                <img
                  src={infoOneUrl}
                  alt="Ninja"
                  className="info1-image enhanced-image"
                />
                <div className="image-border-frame"></div>
                <div className="floating-particles"></div>
              </div>
            </div>

            <div className="info2 container">
              <div className="enhanced-image-container">
                <div className="image-decoration-ring blue"></div>
                <div className="image-glow-effect blue"></div>
                <img
                  src={infoTwoUrl}
                  alt="3D object"
                  className="info2-image enhanced-image"
                />
                <div className="image-border-frame blue"></div>
                <div className="floating-particles blue"></div>
              </div>
              <div className="info2-text">
                <h1>Custom 3D model enthusiast?</h1>
                <p>
                  Join thousands of creators who have revolutionized their workflow with CENTURION. 
                  Perfect for games, architecture, and VR experiences. 
                  Achieve professional results in minutes, not hours.
                </p>
                <button className="GS-button" id="GS-btn" onClick={handleGetStartedClick}>
                  Get started
                </button>
              </div>
            </div>

            <div className="info3 container2">
              <div className="info3-text">
                <h1>3D Model Marketplace</h1>
                <p>
                  Choose from a variety of 3D models for use in architecture,
                  gaming, VR, advertisement, 3D printing, animation
                </p>
              </div>

              <div className="info3-content1">
                <div className="marketplace-box">
                  <div className="box-decoration-ring"></div>
                  <div className="box-glow-effect"></div>
                  <img
                    src={colOneUrl}
                    alt="video game"
                    className="info3-image1 marketplace-image"
                  />
                  <div className="box-content">
                    <p className="info3-p1">Buy 3D models for your video games</p>
                  </div>
                  <div className="box-border-frame"></div>
                  <div className="box-floating-elements"></div>
                </div>
              </div>

              <div className="info3-content2">
                <div className="marketplace-box">
                  <div className="box-decoration-ring purple"></div>
                  <div className="box-glow-effect purple"></div>
                  <img
                    src={colTwoUrl}
                    alt="3D model"
                    className="info3-image2 marketplace-image"
                  />
                  <div className="box-content">
                    <p className="info3-p2">Buy 3D models for your 3D printing</p>
                  </div>
                  <div className="box-border-frame purple"></div>
                  <div className="box-floating-elements purple"></div>
                </div>
              </div>

              <div className="info3-content3">
                <div className="marketplace-box">
                  <div className="box-decoration-ring green"></div>
                  <div className="box-glow-effect green"></div>
                  <img
                    src={colThreeUrl}
                    alt="architecture"
                    className="info3-image3 marketplace-image"
                  />
                  <div className="box-content">
                    <p className="info3-p3">Buy 3D models for your architecture</p>
                  </div>
                  <div className="box-border-frame green"></div>
                  <div className="box-floating-elements green"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;