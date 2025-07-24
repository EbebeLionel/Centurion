import './ModelDetail.css';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../Header_space/Header';
import FloatingCartButton from '../FloatingCartButton/FloatingCartButton';
import { ModelItem, getAllModels, formatPrice, downloadModelFile, getFileSizeDisplay } from '../../utils/modelsStore';
import { cartStore } from '../../utils/cartStore';

const ModelDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [model, setModel] = useState<ModelItem | null>(null);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load model data
  useEffect(() => {
    if (id) {
      const allModels = getAllModels();
      const foundModel = allModels.find(m => m.id === id);
      setModel(foundModel || null);
      setLoading(false);
    }
  }, [id]);

  // Subscribe to cart changes
  useEffect(() => {
    const updateCartCount = () => {
      setCartItemCount(cartStore.getTotalItemCount());
    };

    updateCartCount();
    const unsubscribe = cartStore.subscribe(updateCartCount);
    return unsubscribe;
  }, []);

  // Navigation handler
  const handleHeaderNavigation = (path: string) => {
    navigate(path);
  };

  // Handle download
  const handleDownload = async () => {
    if (!model || !model.modelFile) {
      alert('Model file not available for download');
      return;
    }

    setIsDownloading(true);
    try {
      await downloadModelFile(model);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download model file. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (model) {
      cartStore.addToCart(model);
    }
  };

  // Handle back navigation
  const handleBack = () => {
    navigate('/models');
  };

  // Loading state
  if (loading) {
    return (
      <>
        <Header onNavigate={handleHeaderNavigation} />
        <FloatingCartButton cartItemCount={cartItemCount} />
        <div className="model-detail-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading model details...</p>
          </div>
        </div>
      </>
    );
  }

  // Model not found
  if (!model) {
    return (
      <>
        <Header onNavigate={handleHeaderNavigation} />
        <FloatingCartButton cartItemCount={cartItemCount} />
        <div className="model-detail-container">
          <div className="not-found-container">
            <div className="not-found-icon">😕</div>
            <h2>Model Not Found</h2>
            <p>The model you're looking for doesn't exist or has been removed.</p>
            <button className="back-button" onClick={handleBack}>
              ← Back to Models
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header onNavigate={handleHeaderNavigation} />
      <FloatingCartButton cartItemCount={cartItemCount} />
      
      <div className="model-detail-container">
        {/* Back button */}
        <div className="navigation-controls">
          <button className="back-button" onClick={handleBack}>
            ← Back to Models
          </button>
        </div>

        {/* Main content block */}
        <div className="model-detail-block">
          {/* Left section - 80% width - Model Image */}
          <div className="model-image-section">
            <div className="image-wrapper">
              <img src={model.image} alt={model.name} className="model-detail-image" />
              
              {/* Overlay badges */}
              <div className="image-badges">
                {model.isUserUploaded && (
                  <div className="user-uploaded-badge">
                    <span>Your Upload</span>
                  </div>
                )}
                
                {model.isModelCompressed && (
                  <div className="compression-badge">
                    <span>🗜️ Compressed</span>
                  </div>
                )}
              </div>

              {/* Price overlay */}
              <div className="price-overlay">
                <span className="price-large">{formatPrice(model.price)}</span>
              </div>
            </div>
          </div>

          {/* Right section - 20% width - Model Info */}
          <div className="model-info-section">
            {/* Model name header */}
            <div className="model-header">
              <h1 className="model-title">{model.name}</h1>
            </div>

            {/* Model details */}
            <div className="model-details">
              {/* Categories */}
              {model.categories && model.categories.length > 0 && (
                <div className="detail-item">
                  <label>Categories:</label>
                  <div className="categories-list">
                    {model.categories.map((category, index) => (
                      <span key={index} className="category-tag">
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* File information */}
              {model.modelFileName && (
                <div className="detail-item">
                  <label>File:</label>
                  <span className="file-name">{model.modelFileName}</span>
                </div>
              )}

              {/* File size */}
              {model.modelFileSize && (
                <div className="detail-item">
                  <label>Size:</label>
                  <span className="file-size">{getFileSizeDisplay(model)}</span>
                </div>
              )}

              {/* Upload date */}
              <div className="detail-item">
                <label>Added:</label>
                <span className="upload-date">
                  {new Date(model.dateAdded).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="action-buttons">
              {/* Download button */}
              <button 
                className={`download-button ${!model.modelFile ? 'disabled' : ''}`}
                onClick={handleDownload}
                disabled={!model.modelFile || isDownloading}
              >
                <span className="button-icon">📥</span>
                <span className="button-text">
                  {isDownloading ? 'Downloading...' : 'Download Model'}
                </span>
              </button>

              {/* Add to cart button */}
              <button 
                className={`cart-button ${cartStore.isInCart(model.id) ? 'in-cart' : ''}`}
                onClick={handleAddToCart}
              >
                <span className="button-icon">
                  {cartStore.isInCart(model.id) ? '✓' : '🛒'}
                </span>
                <span className="button-text">
                  {cartStore.isInCart(model.id) ? 'In Cart' : 'Add to Cart'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModelDetail;