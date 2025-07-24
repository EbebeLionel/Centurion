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

// Authentication interfaces
interface LoginRequest {
  username: string;
  password: string;
}

interface SignUpRequest {
  username: string;
  password: string;
  email: string;
  gender?: string;
}

interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
    gender?: string;
  };
}

interface UserProfile {
  user: {
    id: number;
    username: string;
    email: string;
    gender?: string;
    created_at: string;
  };
}

// Authentication functions
export const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Login failed');
  }

  const data = await response.json();
  
  // Store token in localStorage
  if (data.token) {
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  }

  return data;
};

export const signUp = async (userData: SignUpRequest): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Sign up failed');
  }

  const data = await response.json();
  
  // Store token in localStorage
  if (data.token) {
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  }

  return data;
};

export const getUserProfile = async (): Promise<UserProfile> => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(`${API_BASE_URL}/api/profile`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get user profile');
  }

  return await response.json();
};

export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
};

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('authToken');
  return !!token;
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

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