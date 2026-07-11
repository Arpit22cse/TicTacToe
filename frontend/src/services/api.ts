import { LoginCredentials, SignupCredentials, User } from '../types/auth';
import { Room } from '../types/game';

// Replace with your API base URL
const API_BASE_URL = 'https://backend-6qxr.onrender.com';

// Helper for handling API responses
const handleResponse = async (response: Response) => {
  const data = await response.json();
  
  if (response.status!==200) {
    throw new Error(data.message || 'Something went wrong');
  }
  
  return data;
};

// Authentication APIs
export const authApi = {
  login: async (credentials: LoginCredentials) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    return handleResponse(response);
  },
  
  signup: async (credentials: SignupCredentials) => {
    const response = await fetch(`${API_BASE_URL}/signIn`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    return handleResponse(response);
  },
  
  getCurrentUser: async (token: string) => {
    
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return handleResponse(response);
  },
};

// Game APIs
export const gameApi = {
  getRooms: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/rooms`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return handleResponse(response);
  },
  
  createRoom: async (name: string, token: string) => {
    const response = await fetch(`${API_BASE_URL}/rooms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });
    
    return handleResponse(response);
  },
  
  joinRoom: async (roomId: string, token: string) => {
    const response = await fetch(`${API_BASE_URL}/rooms/${roomId}/join`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return handleResponse(response);
  },
  
  joinRandomRoom: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/rooms/random/join`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return handleResponse(response);
  },
};