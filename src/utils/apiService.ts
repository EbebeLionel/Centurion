// API Service for handling file uploads and backend communication

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

interface UploadResponse {
  message: string;
  file: {
    filename: string;
    originalName: string;
    path: string;
    size: number;
    mimetype: string;
  };
}

interface CompleteUploadResponse {
  message: string;
  files: {
    modelFile: {
      filename: string;
      originalName: string;
      path: string;
      size: number;
      mimetype: string;
    } | null;
    imageFile: {
      filename: string;
      originalName: string;
      path: string;
      size: number;
      mimetype: string;
    } | null;
  };
}

export const uploadModelFile = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('modelFile', file);

  const response = await fetch(`${API_BASE_URL}/api/upload-model`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to upload model file');
  }

  return await response.json();
};

export const uploadImageFile = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('imageFile', file);

  const response = await fetch(`${API_BASE_URL}/api/upload-image`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to upload image file');
  }

  return await response.json();
};

export const uploadCompleteModel = async (
  modelFile: File,
  imageFile: File
): Promise<CompleteUploadResponse> => {
  const formData = new FormData();
  formData.append('modelFile', modelFile);
  formData.append('imageFile', imageFile);

  const response = await fetch(`${API_BASE_URL}/api/upload-complete-model`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to upload files');
  }

  return await response.json();
};

export const checkServerHealth = async (): Promise<{ status: string; message: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    return await response.json();
  } catch (error) {
    throw new Error('Server is not responding');
  }
};

export {};