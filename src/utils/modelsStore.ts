// modelsStore.ts - Updated with compression support
import { processFileForStorage, createDownloadBlob, formatFileSize, debugFileData } from './fileCompressionUtils';

// Shared data store for models
export interface ModelItem {
  id: string;
  name: string;
  price: number;
  image: string;
  modelFile?: string; // Base64 string or compressed data for 3D model file
  modelFileName?: string; // Original filename of the 3D model
  modelFileSize?: number; // Original file size in bytes
  modelFinalSize?: number; // Final storage size in bytes (after compression)
  isModelCompressed?: boolean; // Whether the model file is compressed
  compressionRatio?: number; // Compression ratio if compressed
  dateAdded: string;
  category: string;
  categories?: string[]; // Optional array for multiple categories
  isUserUploaded: boolean;
}

const MODELS_STORAGE_KEY = 'centurion_models';

// Default models (existing hardcoded ones)
const defaultModels: ModelItem[] = [
  {
    id: 'default-1',
    name: "Malenia",
    image: "https://tse3.mm.bing.net/th?id=OIP.uIDEAgOeB1feLJ4hBcZRJQHaEK&pid=Api&P=0&h=220",
    category: "characters",
    categories: ["Character", "Boss", "Fantasy", "Woman", "Elden ring"],
    price: 24.99,
    dateAdded: '2024-01-01',
    isUserUploaded: false
  },
  {
    id: 'default-2',
    name: "Radahn",
    image: "https://tse2.mm.bing.net/th?id=OIP.5p1oE1izcBrr6kqPaB755AHaEK&pid=Api&P=0&h=220",
    category: "characters",
    categories: ["Character", "Boss", "Warrior", "Elden Ring", "Warlord"],
    price: 29.99,
    dateAdded: '2024-01-02',
    isUserUploaded: false
  },
  {
    id: 'default-3',
    name: "Goku",
    image: "https://tse2.mm.bing.net/th?id=OIP.RvZBJb7M19bnds9w5pH4ugHaE5&pid=Api&P=0&h=220",
    category: "characters",
    categories: ["Character", "Humanoid", "Warrior", "Saiyan", "Dragon ball"],
    price: 19.99,
    dateAdded: '2024-01-03',
    isUserUploaded: false
  },
  {
    id: 'default-4',
    name: "Vegeta",
    image: "https://tse2.mm.bing.net/th?id=OIP.6kFD8fmxtr0I65f5eIeywgHaGL&pid=Api&P=0&h=220",
    category: "characters",
    categories: ["Character", "Humanoid", "Warrior", "Saiyan", "Dragon ball"],
    price: 19.99,
    dateAdded: '2024-01-04',
    isUserUploaded: false
  },
  {
    id: 'default-5',
    name: "Tarnished",
    image: "https://tse2.mm.bing.net/th/id/OIP.eEOuN7GvsAgX8ndZPcPXaQHaDt?pid=Api&P=0&h=220",
    category: "characters",
    categories: ["Character", "Humanoid", "Warrior", "Elden ring", "Elden Lord"],
    price: 22.99,
    dateAdded: '2024-01-05',
    isUserUploaded: false
  }
];

// Get all models (default + user uploaded)
export const getAllModels = (): ModelItem[] => {
  try {
    const storedModels = localStorage.getItem(MODELS_STORAGE_KEY);
    const userModels = storedModels ? JSON.parse(storedModels) : [];
    return [...defaultModels, ...userModels];
  } catch (error) {
    console.error('Error loading models:', error);
    return defaultModels;
  }
};

// Get only user uploaded models
export const getUserModels = (): ModelItem[] => {
  try {
    const storedModels = localStorage.getItem(MODELS_STORAGE_KEY);
    return storedModels ? JSON.parse(storedModels) : [];
  } catch (error) {
    console.error('Error loading user models:', error);
    return [];
  }
};

// Add a new model
export const addModel = (model: Omit<ModelItem, 'id' | 'dateAdded' | 'isUserUploaded'>): ModelItem => {
  const newModel: ModelItem = {
    ...model,
    id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    dateAdded: new Date().toISOString(),
    isUserUploaded: true
  };

  try {
    const userModels = getUserModels();
    const updatedModels = [...userModels, newModel];
    localStorage.setItem(MODELS_STORAGE_KEY, JSON.stringify(updatedModels));
    return newModel;
  } catch (error) {
    console.error('Error saving model:', error);
    throw new Error('Failed to save model');
  }
};

// Remove a model (only user uploaded ones)
export const removeModel = (id: string): boolean => {
  try {
    const userModels = getUserModels();
    const updatedModels = userModels.filter(model => model.id !== id);
    localStorage.setItem(MODELS_STORAGE_KEY, JSON.stringify(updatedModels));
    return true;
  } catch (error) {
    console.error('Error removing model:', error);
    return false;
  }
};

// Update a model (only user uploaded ones)
export const updateModel = (id: string, updates: Partial<ModelItem>): boolean => {
  try {
    const userModels = getUserModels();
    const modelIndex = userModels.findIndex(model => model.id === id);
    
    if (modelIndex === -1) {
      return false;
    }

    userModels[modelIndex] = { ...userModels[modelIndex], ...updates };
    localStorage.setItem(MODELS_STORAGE_KEY, JSON.stringify(userModels));
    return true;
  } catch (error) {
    console.error('Error updating model:', error);
    return false;
  }
};

// Format price for display
export const formatPrice = (price: number): string => {
  return price === 0 ? 'Free' : `$${price.toFixed(2)}`;
};

// Convert image file to base64 string for storage
export const convertImageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Convert 3D model file to base64 string with compression support
export const convertModelFileToBase64 = async (file: File): Promise<{
  data: string;
  originalSize: number;
  finalSize: number;
  isCompressed: boolean;
  compressionRatio?: number;
}> => {
  try {
    const result = await processFileForStorage(file);
    
    return {
      data: result.data,
      originalSize: result.originalSize,
      finalSize: result.finalSize,
      isCompressed: result.isCompressed,
      compressionRatio: result.compressionRatio
    };
  } catch (error) {
    console.error('Error processing model file:', error);
    throw new Error('Failed to process model file');
  }
};

// Download model file (handles both compressed and uncompressed)
export const downloadModelFile = async (model: ModelItem): Promise<void> => {
  if (!model.modelFile || !model.modelFileName) {
    throw new Error('Model file not available for download');
  }

  try {
    // Debug file data
    debugFileData(model.modelFile, model.modelFileName);
    
    console.log('Creating download blob...');
    const blob = await createDownloadBlob(model.modelFile, model.modelFileName);
    
    console.log('Blob created successfully:', {
      size: blob.size,
      type: blob.type
    });
    
    // Verify blob has content
    if (blob.size === 0) {
      throw new Error('Generated file is empty - file may be corrupted');
    }
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = model.modelFileName;
    
    // Add to DOM temporarily to trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    URL.revokeObjectURL(url);
    
    console.log('Download initiated successfully');
  } catch (error) {
    console.error('Error downloading model file:', error);
    throw new Error(`Failed to download model file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Get file size display text
export const getFileSizeDisplay = (model: ModelItem): string => {
  if (!model.modelFileSize) return 'Unknown size';
  
  const originalSize = formatFileSize(model.modelFileSize);
  
  if (model.isModelCompressed && model.modelFinalSize && model.compressionRatio) {
    const finalSize = formatFileSize(model.modelFinalSize);
    return `${originalSize} (compressed to ${finalSize}, ${model.compressionRatio.toFixed(1)}% reduction)`;
  }
  
  return originalSize;
};

// Validate 3D model file format
export const validateModelFile = (file: File): { isValid: boolean; error?: string } => {
  const allowedExtensions = ['.obj', '.fbx', '.gltf', '.glb', '.dae', '.3ds', '.blend', '.stl', '.ply'];
  
  const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  
  if (!allowedExtensions.includes(fileExtension)) {
    return {
      isValid: false,
      error: `Unsupported file format. Allowed formats: ${allowedExtensions.join(', ')}`
    };
  }
  
  // Additional size validation (warn for very large files)
  const maxRecommendedSize = 500 * 1024 * 1024; // 500MB
  if (file.size > maxRecommendedSize) {
    return {
      isValid: true,
      error: `Warning: File is very large (${formatFileSize(file.size)}). Upload may take a while and compression will be applied.`
    };
  }
  
  return { isValid: true };
};

// Estimate storage requirements
export const estimateStorageSize = (file: File): string => {
  const sizeMB = file.size / (1024 * 1024);
  
  if (sizeMB <= 50) {
    return `Estimated storage: ~${formatFileSize(file.size)} (no compression)`;
  } else {
    // Rough compression estimate (varies by file type)
    const estimatedCompression = 0.3; // Assume 30% of original size
    const estimatedSize = file.size * estimatedCompression;
    return `Estimated storage: ~${formatFileSize(estimatedSize)} (compressed from ${formatFileSize(file.size)})`;
  }
};