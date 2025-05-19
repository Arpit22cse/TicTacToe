import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { AuthContextType, AuthState, LoginCredentials, SignupCredentials } from '../types/auth';
import { authApi } from '../services/api';
import { User } from 'lucide-react';

// Initial state
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: true,
  isLoading: true,
  error: null,
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Actions
type AuthAction =
  | { type: 'LOGIN_REQUEST' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: any; token: string } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'SIGNUP_REQUEST' }
  | { type: 'SIGNUP_SUCCESS'; payload: { user: any; token: string } }
  | { type: 'SIGNUP_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'AUTH_CHECKED'; payload: { user: any } | null };

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_REQUEST':
    case 'SIGNUP_REQUEST':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
    case 'SIGNUP_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };
    case 'LOGIN_FAILURE':
    case 'SIGNUP_FAILURE':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        error: null,
      };
    case 'AUTH_CHECKED':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: !!action.payload,
        user: action.payload?.user || null,
      };
    default:
      return state;
  }
};

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        dispatch({ type: 'AUTH_CHECKED', payload: null });
        return;
      }

      try {
        const userData = await authApi.getCurrentUser(token);
        dispatch({ type: 'AUTH_CHECKED', payload: { user: userData } });
      } catch (error) {
        localStorage.removeItem('token');
        dispatch({ type: 'AUTH_CHECKED', payload: null });
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: 'LOGIN_REQUEST' });
    try {
      const userData = await authApi.login(credentials);
      //console.log(userData.user+"  "+userData.token);
      localStorage.setItem('token', userData.token);
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user:userData.user, token:userData.token } });
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: (error as Error).message });
      throw error;
    }
  };

  // Signup function
  const signup = async (credentials: SignupCredentials) => {
    dispatch({ type: 'SIGNUP_REQUEST' });
    try {
      const { user, token } = await authApi.signup(credentials);
      localStorage.setItem('token', token);
      dispatch({ type: 'SIGNUP_SUCCESS', payload: { user, token } });
    } catch (error) {
      dispatch({ type: 'SIGNUP_FAILURE', payload: (error as Error).message });
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};