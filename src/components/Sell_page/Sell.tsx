// Sell.tsx - Updated with compression support
import './Sell_dec.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header_space/Header';
import {
  ModelItem,
  getUserModels,
  addModel,
  removeModel,
  formatPrice,
  convertImageToBase64,
  convertModelFileToBase64,
  validateModelFile,
  downloadModelFile,
  getFileSizeDisplay,
  estimateStorageSize
} from '../../utils/modelsStore';
import { getAllFlatCategories, getCategorySuggestions } from '../../utils/categoryTree';
import { isCompressionAvailable, formatFileSize } from '../../utils/fileCompressionUtils';

interface SoldItem {
  id: string;
  name: string;
  price: number;
  image: string;
  dateSold: string;
  buyer: string;
}

const Sell: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'upload' | 'on-sale' | 'sold'>('upload');
  
  // Form state
  const [modelName, setModelName] = useState('');
  const [modelPrice, setModelPrice] = useState('');
  const [modelImage, setModelImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [modelFile, setModelFile] = useState<File | null>(null);
  const [modelFileInfo, setModelFileInfo] = useState<string>('');
  const [fileProcessingStatus, setFileProcessingStatus] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [customCategory, setCustomCategory] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingModel, setEditingModel] = useState<ModelItem | null>(null);

  // Compression status
  const [compressionAvailable] = useState(isCompressionAvailable());

  // Get all available categories from the tree structure
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<string[]>([]);
  const [categorySearchTerm, setCategorySearchTerm] = useState('');

  // Load all categories from the tree
  useEffect(() => {
    const categories = getAllFlatCategories();
    setAllCategories(categories);
    setFilteredCategories(categories);
  }, []);

  // Filter categories based on search term
  useEffect(() => {
    if (!categorySearchTerm.trim()) {
      setFilteredCategories(allCategories);
    } else {
      const suggestions = getCategorySuggestions(categorySearchTerm, 50);
      setFilteredCategories(suggestions);
    }
  }, [categorySearchTerm, allCategories]);

  // Models state
  const [onSaleModels, setOnSaleModels] = useState<ModelItem[]>([]);

  // Load user models on component mount
  useEffect(() => {
    const userModels = getUserModels();
    setOnSaleModels(userModels);
  }, []);

  const [soldItems] = useState<SoldItem[]>([
    {
      id: '3',
      name: 'Space Knight',
      price: 45.00,
      image: 'https://cdn.cgdream.ai/_next/image?url=https%3A%2F%2Fapi.cgdream.ai%2Frails%2Factive_storage%2Fblobs%2Fredirect%2FeyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBd3o2RHc9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ%3D%3D--e841dadb0a84741279ef91f43d295a93b7ac8872%2F5b40bece-9d79-404b-95a8-72adb5b7f2b5_0.png&w=512&q=90',
      dateSold: '2024-01-18',
      buyer: 'User123'
    },
    {
      id: '4',
      name: 'Mystic Castle',
      price: 15.50,
      image: 'https://cdn.cgdream.ai/_next/image?url=https%3A%2F%2Fapi.cgdream.ai%2Frails%2Factive_storage%2Fblobs%2Fredirect%2FeyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBellTSFE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ%3D%3D--6904d1220f4631d3d2e9eb52c1a3cfd06ca3f5ee%2Fd27b80ff-c651-4559-b212-a93ee354dcc1_0.png&w=512&q=90',
      dateSold: '2024-01-22',
      buyer: 'Designer456'
    }
  ]);

  // Calculate total earnings
  const totalEarnings = soldItems.reduce((total, item) => total + item.price, 0);

  // Header navigation handler
  const handleHeaderNavigation = (path: string) => {
    navigate(path);
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setModelImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setErrors(prev => ({ ...prev, image: '' }));
    }
  };

  // Handle 3D model file upload
  const handleModelFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validation = validateModelFile(file);
      if (validation.isValid) {
        setModelFile(file);
        
        const sizeInfo = `${file.name} (${formatFileSize(file.size)})`;
        const storageEstimate = estimateStorageSize(file);
        setModelFileInfo(sizeInfo);
        setFileProcessingStatus(storageEstimate);
        
        setErrors(prev => ({ 
          ...prev, 
          modelFile: validation.error || '' // Show warning if any
        }));
      } else {
        setErrors(prev => ({ ...prev, modelFile: validation.error || 'Invalid file' }));
        // Reset the file input
        e.target.value = '';
      }
    }
  };

  // Handle category selection
  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else if (prev.length < 5) {
        return [...prev, category];
      }
      return prev;
    });
    setErrors(prev => ({ ...prev, categories: '' }));
  };

  // Handle category search
  const handleCategorySearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategorySearchTerm(e.target.value);
  };

  // Clear category search
  const clearCategorySearch = () => {
    setCategorySearchTerm('');
  };

  // Handle custom category addition
  const handleCustomCategoryAdd = () => {
    const trimmedCategory = customCategory.trim();
    if (trimmedCategory && !selectedCategories.includes(trimmedCategory) && selectedCategories.length < 5) {
      setSelectedCategories(prev => [...prev, trimmedCategory]);
      setCustomCategory('');
      setErrors(prev => ({ ...prev, categories: '' }));
    }
  };

  // Handle custom category input
  const handleCustomCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomCategory(e.target.value);
  };

  // Handle custom category key press
  const handleCustomCategoryKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCustomCategoryAdd();
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: {[key: string]: string} = {};
    
    // Validation
    if (!modelName.trim()) {
      newErrors.name = 'Model name is required';
    } else if (modelName.length > 23) {
      newErrors.name = 'Model name cannot exceed 23 characters';
    }
    
    if (!modelPrice.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(Number(modelPrice)) || Number(modelPrice) < 0) {
      newErrors.price = 'Please enter a valid price (0 or greater)';
    }
    
    if (!modelImage && !editingModel) {
      newErrors.image = 'Model image is required';
    }

    if (!modelFile && !editingModel) {
      newErrors.modelFile = '3D model file is required';
    }

    if (selectedCategories.length < 3) {
      newErrors.categories = 'Please select at least 3 categories';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      setFileProcessingStatus('Processing file...');
      
      try {
        if (editingModel) {
          // Editing existing model
          const updatedModel = {
            ...editingModel,
            name: modelName,
            price: Number(modelPrice),
            categories: selectedCategories,
            category: selectedCategories[0].toLowerCase()
          };
          
          // Update image if new one provided
          if (modelImage) {
            updatedModel.image = await convertImageToBase64(modelImage);
          }
          
          // Update model file if new one provided
          if (modelFile) {
            setFileProcessingStatus('Compressing file...');
            const fileResult = await convertModelFileToBase64(modelFile);
            updatedModel.modelFile = fileResult.data;
            updatedModel.modelFileName = modelFile.name;
            updatedModel.modelFileSize = fileResult.originalSize;
            updatedModel.modelFinalSize = fileResult.finalSize;
            updatedModel.isModelCompressed = fileResult.isCompressed;
            updatedModel.compressionRatio = fileResult.compressionRatio;
          }
          
          // Update in models store
          const { updateModel } = await import('../../utils/modelsStore');
          const updateSuccess = updateModel(editingModel.id, updatedModel);
          
          if (updateSuccess) {
            // Update local state
            setOnSaleModels(prev => prev.map(model =>
              model.id === editingModel.id ? updatedModel : model
            ));
            
            // Reset form and editing state
            setEditingModel(null);
            alert('Model updated successfully!');
          } else {
            throw new Error('Failed to update model');
          }
        } else {
          // Creating new model
          setFileProcessingStatus('Processing image...');
          const imageBase64 = await convertImageToBase64(modelImage!);
          
          setFileProcessingStatus('Compressing model file...');
          const fileResult = await convertModelFileToBase64(modelFile!);
          
          const newModel = addModel({
            name: modelName,
            price: Number(modelPrice),
            image: imageBase64,
            modelFile: fileResult.data,
            modelFileName: modelFile!.name,
            modelFileSize: fileResult.originalSize,
            modelFinalSize: fileResult.finalSize,
            isModelCompressed: fileResult.isCompressed,
            compressionRatio: fileResult.compressionRatio,
            category: selectedCategories[0].toLowerCase(),
            categories: selectedCategories
          });
          
          // Update local state
          setOnSaleModels(prev => [...prev, newModel]);
          
          // Show success message with compression info
          let successMessage = 'Model uploaded successfully!';
          if (fileResult.isCompressed && fileResult.compressionRatio) {
            successMessage += ` File compressed by ${fileResult.compressionRatio.toFixed(1)}%.`;
          }
          alert(successMessage);
        }
        
        // Reset form
        setModelName('');
        setModelPrice('');
        setModelImage(null);
        setImagePreview('');
        setModelFile(null);
        setModelFileInfo('');
        setFileProcessingStatus('');
        setSelectedCategories([]);
        setCustomCategory('');
        
        // Switch to on-sale tab to show the model
        setActiveTab('on-sale');
        
      } catch (error) {
        console.error('Error saving model:', error);
        alert('Failed to save model. Please try again.');
      } finally {
        setIsSubmitting(false);
        setFileProcessingStatus('');
      }
    }
  };

  // Handle model editing
  const handleEditModel = (model: ModelItem) => {
    setEditingModel(model);
    setModelName(model.name);
    setModelPrice(model.price.toString());
    setImagePreview(model.image);
    setSelectedCategories(model.categories || [model.category]);
    setActiveTab('upload');
  };

  // Handle model removal
  const handleRemoveModel = (id: string) => {
    if (window.confirm('Are you sure you want to remove this model?')) {
      if (removeModel(id)) {
        setOnSaleModels(prev => prev.filter(model => model.id !== id));
        alert('Model removed successfully!');
      } else {
        alert('Failed to remove model. Please try again.');
      }
    }
  };

  // Handle model download
  const handleDownloadModel = async (model: ModelItem) => {
    try {
      setFileProcessingStatus('Preparing download...');
      await downloadModelFile(model);
      setFileProcessingStatus('');
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download model file.');
      setFileProcessingStatus('');
    }
  };

  return (
    <>
      <Header onNavigate={handleHeaderNavigation} />
      
      <div className="sell-page">
        <div className="sell-container">
          {/* Page Header */}
          <div className="sell-header">
            <h1 className="sell-title">Sell Your 3D Models</h1>
            <p className="sell-subtitle">Share your creativity with the world and earn from your talent</p>
            {!compressionAvailable && (
              <div className="compression-warning">
                <span>⚠️ File compression not available. Large files may have slower upload times.</span>
              </div>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="sell-tabs">
            <button 
              className={`tab-button ${activeTab === 'upload' ? 'active' : ''}`}
              onClick={() => setActiveTab('upload')}
            >
              <span className="tab-icon">📤</span>
              Upload Model
            </button>
            <button 
              className={`tab-button ${activeTab === 'on-sale' ? 'active' : ''}`}
              onClick={() => setActiveTab('on-sale')}
            >
              <span className="tab-icon">🏷️</span>
              On Sale
            </button>
            <button 
              className={`tab-button ${activeTab === 'sold' ? 'active' : ''}`}
              onClick={() => setActiveTab('sold')}
            >
              <span className="tab-icon">💰</span>
              Sales History
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {/* Upload Tab */}
            {activeTab === 'upload' && (
              <div className="upload-section">
                <div className="upload-card">
                  <div className="card-decoration-ring"></div>
                  <div className="card-glow-effect"></div>
                  
                  <form onSubmit={handleSubmit} className="upload-form">
                    {/* Model Name Input */}
                    <div className="form-group">
                      <label htmlFor="modelName" className="form-label">
                        Model Name <span className="required">*</span>
                      </label>
                      <div className="input-wrapper">
                        <input
                          type="text"
                          id="modelName"
                          value={modelName}
                          onChange={(e) => setModelName(e.target.value)}
                          className={`form-input ${errors.name ? 'error' : ''}`}
                          placeholder="Enter model name (max 23 characters)"
                          maxLength={23}
                        />
                        <span className="character-count">{modelName.length}/23</span>
                      </div>
                      {errors.name && <span className="error-message">{errors.name}</span>}
                    </div>

                    {/* Price Input */}
                    <div className="form-group">
                      <label htmlFor="modelPrice" className="form-label">
                        Price (USD) <span className="required">*</span>
                      </label>
                      <div className="input-wrapper">
                        <span className="currency-symbol">$</span>
                        <input
                          type="number"
                          id="modelPrice"
                          value={modelPrice}
                          onChange={(e) => setModelPrice(e.target.value)}
                          className={`form-input price-input ${errors.price ? 'error' : ''}`}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div className="price-hint">
                        {modelPrice === '0' || modelPrice === '' ? 'Set to 0 for free models' : `Price: ${formatPrice(Number(modelPrice))}`}
                      </div>
                      {errors.price && <span className="error-message">{errors.price}</span>}
                    </div>

                    {/* Category Selection */}
                    <div className="form-group">
                      <label className="form-label">
                        Categories <span className="required">*</span>
                        <span className="category-hint">(Select 3 to 5 from any category tree)</span>
                      </label>
                      
                      {/* Category Search */}
                      <div className="category-search-container">
                        <input
                          type="text"
                          value={categorySearchTerm}
                          onChange={handleCategorySearch}
                          placeholder="Search categories..."
                          className="category-search-input"
                        />
                        {categorySearchTerm && (
                          <button
                            type="button"
                            onClick={clearCategorySearch}
                            className="clear-category-search"
                          >
                            ×
                          </button>
                        )}
                      </div>

                      {/* Categories Container */}
                      <div className="categories-container">
                        {filteredCategories.slice(0, 20).map((category) => (
                          <div key={category} className="category-item">
                            <input
                              type="checkbox"
                              id={category}
                              checked={selectedCategories.includes(category)}
                              onChange={() => handleCategoryChange(category)}
                              disabled={!selectedCategories.includes(category) && selectedCategories.length >= 5}
                              className="category-checkbox"
                            />
                            <label htmlFor={category} className="category-label">
                              {category}
                            </label>
                          </div>
                        ))}
                      </div>

                      {/* Show message if too many categories to display */}
                      {filteredCategories.length > 20 && (
                        <div className="category-limit-message">
                          Showing first 20 categories. Use search to find specific categories.
                        </div>
                      )}

                      {/* Custom Category Input */}
                      <div className="custom-category-section">
                        <div className="custom-category-input-group">
                          <input
                            type="text"
                            value={customCategory}
                            onChange={handleCustomCategoryChange}
                            onKeyPress={handleCustomCategoryKeyPress}
                            placeholder="Add custom category..."
                            className="custom-category-input"
                            disabled={selectedCategories.length >= 5}
                          />
                          <button
                            type="button"
                            onClick={handleCustomCategoryAdd}
                            disabled={!customCategory.trim() || selectedCategories.length >= 5}
                            className="add-category-btn"
                          >
                            Add
                          </button>
                        </div>
                      </div>

                      {/* Selected Categories Display */}
                      {selectedCategories.length > 0 && (
                        <div className="selected-categories">
                          <span className="selected-label">Selected ({selectedCategories.length}/5):</span>
                          <div className="selected-tags">
                            {selectedCategories.map((category, index) => (
                              <span key={index} className="selected-tag">
                                {category}
                                <button
                                  type="button"
                                  onClick={() => handleCategoryChange(category)}
                                  className="remove-tag"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {errors.categories && <span className="error-message">{errors.categories}</span>}
                    </div>

                    {/* Image Upload */}
                    <div className="form-group">
                      <label htmlFor="modelImage" className="form-label">
                        Model Image <span className="required">*</span>
                      </label>
                      <div className="image-upload-area">
                        {imagePreview ? (
                          <>
                            <div className="image-preview">
                              <img src={imagePreview} alt="Model preview" className="preview-image" />
                            </div>
                            <button
                              type="button"
                              className="remove-image"
                              onClick={() => {
                                setModelImage(null);
                                setImagePreview('');
                                // Reset the file input to allow re-uploading the same file
                                const fileInput = document.getElementById('modelImage') as HTMLInputElement;
                                if (fileInput) {
                                  fileInput.value = '';
                                }
                              }}
                            >
                              ✕
                            </button>
                          </>
                        ) : (
                          <label htmlFor="modelImage" className="upload-placeholder">
                            <div className="upload-icon">📷</div>
                            <div className="upload-text">
                              <span className="upload-main">Click to upload image</span>
                              <span className="upload-sub">PNG, JPG up to 10MB</span>
                            </div>
                          </label>
                        )}
                        <input
                          type="file"
                          id="modelImage"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="file-input"
                        />
                      </div>
                      {errors.image && <span className="error-message">{errors.image}</span>}
                    </div>

                    {/* 3D Model File Upload */}
                    <div className="form-group">
                      <label htmlFor="modelFile" className="form-label">
                        3D Model File <span className="required">*</span>
                      </label>
                      <div className="model-file-upload-area">
                        {modelFileInfo ? (
                          <div className="model-file-info">
                            <div className="file-info-content">
                              <div className="file-icon">📁</div>
                              <div className="file-details">
                                <div className="file-name">{modelFileInfo}</div>
                                <div className="file-status">
                                  {fileProcessingStatus || 'Ready to upload'}
                                </div>
                              </div>
                            </div>
                            <button
                              type="button"
                              className="remove-file"
                              onClick={() => {
                                setModelFile(null);
                                setModelFileInfo('');
                                setFileProcessingStatus('');
                                // Reset the file input
                                const fileInput = document.getElementById('modelFile') as HTMLInputElement;
                                if (fileInput) {
                                  fileInput.value = '';
                                }
                              }}
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <label htmlFor="modelFile" className="file-upload-placeholder">
                            <div className="upload-icon">🎯</div>
                            <div className="upload-text">
                              <span className="upload-main">Click to upload 3D model</span>
                              <span className="upload-sub">
                                OBJ, FBX, GLTF, GLB, DAE, 3DS, BLEND, STL, PLY
                                {compressionAvailable && <><br />Files over 50MB will be compressed</>}
                              </span>
                            </div>
                          </label>
                        )}
                        <input
                          type="file"
                          id="modelFile"
                          accept=".obj,.fbx,.gltf,.glb,.dae,.3ds,.blend,.stl,.ply"
                          onChange={handleModelFileUpload}
                          className="file-input"
                        />
                      </div>
                      {errors.modelFile && <span className="error-message">{errors.modelFile}</span>}
                    </div>

                    {/* Submit Button */}
                    <div className="form-actions">
                      <button type="submit" className="submit-button" disabled={isSubmitting}>
                        <span className="button-content">
                          <span className="button-icon">{editingModel ? '✏️' : '🚀'}</span>
                          <span className="button-text">
                            {isSubmitting ?
                              (fileProcessingStatus || (editingModel ? 'Updating...' : 'Uploading...')) :
                              (editingModel ? 'Update Model' : 'List Model for Sale')
                            }
                          </span>
                        </span>
                        <div className="button-shine"></div>
                      </button>
                      
                      {editingModel && (
                        <button
                          type="button"
                          className="cancel-button"
                          onClick={() => {
                            setEditingModel(null);
                            setModelName('');
                            setModelPrice('');
                            setModelImage(null);
                            setImagePreview('');
                            setModelFile(null);
                            setModelFileInfo('');
                            setFileProcessingStatus('');
                            setSelectedCategories([]);
                            setCustomCategory('');
                            setErrors({});
                          }}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* On Sale Tab */}
            {activeTab === 'on-sale' && (
              <div className="models-section">
                <div className="section-header">
                  <h2>Your Models On Sale</h2>
                  <div className="models-count">{onSaleModels.length} models listed</div>
                </div>
                
                {onSaleModels.length > 0 ? (
                  <div className="models-grid">
                    {onSaleModels.map((model) => (
                      <div key={model.id} className="model-card">
                        <div className="model-card-glow"></div>
                        <div className="model-image-container">
                          <img src={model.image} alt={model.name} className="model-image" />
                          <div className="price-badge">{formatPrice(model.price)}</div>
                          {model.isModelCompressed && (
                            <div className="compression-badge">
                              🗜️ Compressed
                            </div>
                          )}
                        </div>
                        <div className="model-info">
                          <h3 className="model-name">{model.name}</h3>
                          <div className="model-meta">
                            <span className="date-added">Added: {new Date(model.dateAdded).toLocaleDateString()}</span>
                            <div className="file-size-info">
                              {getFileSizeDisplay(model)}
                            </div>
                          </div>
                        </div>
                        <div className="model-actions">
                          <button
                            className="action-button edit"
                            onClick={() => handleEditModel(model)}
                          >
                            Edit
                          </button>
                          <button
                            className="action-button download"
                            onClick={() => handleDownloadModel(model)}
                            disabled={!model.modelFile}
                          >
                            Download
                          </button>
                          <button
                            className="action-button remove"
                            onClick={() => handleRemoveModel(model.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon">📦</div>
                    <h3>No models on sale</h3>
                    <p>Upload your first model to start selling!</p>
                    <button 
                      className="empty-action-button"
                      onClick={() => setActiveTab('upload')}
                    >
                      Upload Model
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Sold Tab */}
            {activeTab === 'sold' && (
              <div className="sales-section">
                <div className="sales-header">
                  <div className="earnings-card">
                    <div className="earnings-icon">💎</div>
                    <div className="earnings-info">
                      <div className="earnings-amount">${totalEarnings.toFixed(2)}</div>
                      <div className="earnings-label">Total Earnings</div>
                    </div>
                  </div>
                  <div className="sales-stats">
                    <div className="stat-item">
                      <div className="stat-number">{soldItems.length}</div>
                      <div className="stat-label">Models Sold</div>
                    </div>
                  </div>
                </div>

                {soldItems.length > 0 ? (
                  <div className="sales-list">
                    <h3>Recent Sales</h3>
                    {soldItems.map((item) => (
                      <div key={item.id} className="sale-item">
                        <div className="sale-image">
                          <img src={item.image} alt={item.name} />
                        </div>
                        <div className="sale-details">
                          <div className="sale-name">{item.name}</div>
                          <div className="sale-meta">
                            <span className="sale-buyer">Sold to: {item.buyer}</span>
                            <span className="sale-date">{new Date(item.dateSold).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="sale-price">{formatPrice(item.price)}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon">📊</div>
                    <h3>No sales yet</h3>
                    <p>Start selling your models to see your sales history here!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sell;