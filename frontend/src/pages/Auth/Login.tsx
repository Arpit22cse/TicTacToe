import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout';
import LoginForm from '../../components/auth/LoginForm';
import { useAuth } from '../../contexts/AuthContext';

const Login: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Redirect if already logged in
  if (isAuthenticated && !isLoading) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <AuthLayout 
      title="Welcome back" 
      subtitle="Sign in to continue to Tic Tac Toe"
    >
      <LoginForm />
    </AuthLayout>
  );
};

export default Login;