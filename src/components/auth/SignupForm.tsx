import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { SignupCredentials } from '../../types/auth';

const SignupForm: React.FC = () => {
  const navigate = useNavigate();
  const { signup, isLoading, error } = useAuth();
  
  const [formData, setFormData] = useState<SignupCredentials>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [validationErrors, setValidationErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error when user types
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };
  
  const validateForm = (): boolean => {
    const errors: {
      username?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};
    
    if (!formData.username) {
      errors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.confirmPassword !== formData.password) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      console.log(formData);
      await signup(formData);
      navigate('/');
    } catch (err) {
      // Error is handled by the context and displayed through the error prop
      console.error('Signup failed:', err);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Input
          type="text"
          name="username"
          label="Username"
          placeholder="Choose a username"
          value={formData.username}
          onChange={handleChange}
          error={validationErrors.username}
          leftIcon={<User size={18} />}
          fullWidth
          autoComplete="username"
          required
        />
        
        <Input
          type="email"
          name="email"
          label="Email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          error={validationErrors.email}
          leftIcon={<Mail size={18} />}
          fullWidth
          autoComplete="email"
          required
        />
        
        <Input
          type="password"
          name="password"
          label="Password"
          placeholder="Create a password"
          value={formData.password}
          onChange={handleChange}
          error={validationErrors.password}
          leftIcon={<Lock size={18} />}
          fullWidth
          autoComplete="new-password"
          required
        />
        
        <Input
          type="password"
          name="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={validationErrors.confirmPassword}
          leftIcon={<Lock size={18} />}
          fullWidth
          autoComplete="new-password"
          required
        />
      </div>
      
      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isLoading}
        fullWidth
        className="mt-6"
      >
        Create Account
      </Button>
      
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-purple-600 hover:text-purple-800 font-medium"
          >
            Sign in
          </button>
        </p>
      </div>
    </form>
  );
};

export default SignupForm;