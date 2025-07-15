import './Home_dec.css';
import React, { useState, useEffect } from 'react';
import Header from '../Header_space/Header';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
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
  
  // Animation effect on component mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

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
  
  return (
    <>
      <Header onNavigate={handleHeaderNavigation} />
      
      <section className="intro-pic">
        <div className="intro-overlay"></div>
        <div className="intro-content">
          <div className="intro-particles"></div>
          <h1 className="intro-title">
            <span className="intro-title-line">Welcome to</span>
            <span className="intro-title-main">CENTURION</span>
            <span className="intro-title-subtitle">3D Platform</span>
          </h1>
          <p className="intro-description">
            Unleash the power of AI-driven 3D model creation
          </p>
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
            
            {/* Info Section 1 - Where imagination meets reality */}
            <div className={`info1 container ${isVisible ? 'animate-in' : ''}`}>
              <div className="info1-text">
                <div className="text-decoration">
                  <div className="floating-icon">✨</div>
                </div>
                <h1>Where imagination meets reality</h1>
                <p>
                  CENTURION is an interactive mind-blowing application that
                  utilizes AI to fashion images into stunning 3D models
                </p>
                <div className="feature-highlights">
                  <div className="feature-item">
                    <div className="feature-icon">🎨</div>
                    <span>AI-Powered Creation</span>
                  </div>
                  <div className="feature-item">
                    <div className="feature-icon">⚡</div>
                    <span>Lightning Fast</span>
                  </div>
                  <div className="feature-item">
                    <div className="feature-icon">🔥</div>
                    <span>Professional Quality</span>
                  </div>
                </div>
              </div>
              <div className="info1-image-container">
                <div className="image-glow"></div>
                <img
                  src={infoOneUrl}
                  alt="Ninja"
                  className="info1-image"
                />
                <div className="image-frame"></div>
              </div>
            </div>

            {/* Info Section 2 - Custom 3D model enthusiast */}
            <div className={`info2 container ${isVisible ? 'animate-in-delay' : ''}`}>
              <div className="info2-image-container">
                <div className="image-glow-blue"></div>
                <img
                  src={infoTwoUrl}
                  alt="3D object"
                  className="info2-image"
                />
                <div className="image-frame-blue"></div>
              </div>
              <div className="info2-text">
                <div className="text-decoration-right">
                  <div className="floating-icon-blue">🚀</div>
                </div>
                <h1>Custom 3D model enthusiast?</h1>
                <p>Join thousands of creators who are already transforming their ideas into reality</p>
                <div className="button-container">
                  <button className="GS-button" id="GS-btn" onClick={handleGetStartedClick}>
                    <span className="button-text">Get started</span>
                    <div className="button-glow"></div>
                    <svg className="button-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polyline points="9,18 15,12 9,6"></polyline>
                    </svg>
                  </button>
                </div>
                <div className="stats-container">
                  <div className="stat-item">
                    <div className="stat-number">10K+</div>
                    <div className="stat-label">Happy Users</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">50K+</div>
                    <div className="stat-label">Models Created</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Section 3 - 3D Model Marketplace */}
            <div className={`info3 container2 ${isVisible ? 'animate-in-late' : ''}`}>
              <div className="info3-header">
                <div className="info3-text">
                  <div className="marketplace-decoration">
                    <div className="floating-icon-purple">🛍️</div>
                  </div>
                  <h1>3D Model Marketplace</h1>
                  <p>
                    Choose from a variety of premium 3D models for use in architecture,
                    gaming, VR, advertisement, 3D printing, and animation
                  </p>
                  <div className="marketplace-stats">
                    <div className="marketplace-stat">
                      <span className="stat-icon">📦</span>
                      <span>1000+ Models</span>
                    </div>
                    <div className="marketplace-stat">
                      <span className="stat-icon">⭐</span>
                      <span>Premium Quality</span>
                    </div>
                    <div className="marketplace-stat">
                      <span className="stat-icon">💎</span>
                      <span>Exclusive Designs</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="info3-grid">
                <div className="info3-content1 marketplace-card">
                  <div className="card-glow"></div>
                  <div className="card-image-container">
                    <img
                      src={colOneUrl}
                      alt="video game"
                      className="info3-image1"
                    />
                    <div className="card-overlay">
                      <div className="card-icon">🎮</div>
                    </div>
                  </div>
                  <div className="card-content">
                    <h3>Gaming Assets</h3>
                    <p className="info3-p1">Premium 3D models for your video games and interactive experiences</p>
                    <div className="card-features">
                      <span className="feature-tag">Game Ready</span>
                      <span className="feature-tag">Optimized</span>
                    </div>
                  </div>
                </div>

                <div className="info3-content2 marketplace-card">
                  <div className="card-glow"></div>
                  <div className="card-image-container">
                    <img
                      src={colTwoUrl}
                      alt="3D model"
                      className="info3-image2"
                    />
                    <div className="card-overlay">
                      <div className="card-icon">🖨️</div>
                    </div>
                  </div>
                  <div className="card-content">
                    <h3>3D Printing</h3>
                    <p className="info3-p2">High-quality models optimized for 3D printing and prototyping</p>
                    <div className="card-features">
                      <span className="feature-tag">Print Ready</span>
                      <span className="feature-tag">Detailed</span>
                    </div>
                  </div>
                </div>

                <div className="info3-content3 marketplace-card">
                  <div className="card-glow"></div>
                  <div className="card-image-container">
                    <img
                      src={colThreeUrl}
                      alt="architecture"
                      className="info3-image3"
                    />
                    <div className="card-overlay">
                      <div className="card-icon">🏗️</div>
                    </div>
                  </div>
                  <div className="card-content">
                    <h3>Architecture</h3>
                    <p className="info3-p3">Professional architectural models for visualization and design</p>
                    <div className="card-features">
                      <span className="feature-tag">Professional</span>
                      <span className="feature-tag">Realistic</span>
                    </div>
                  </div>
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