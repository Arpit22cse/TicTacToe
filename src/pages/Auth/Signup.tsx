import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout';
import SignupForm from '../../components/auth/SignupForm';
import { useAuth } from '../../contexts/AuthContext';

const Signup: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Redirect if already logged in
  if (isAuthenticated && !isLoading) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <AuthLayout 
      title="Create an account" 
      subtitle="Join Tic Tac Toe and start playing"
    >
      <SignupForm />
    </AuthLayout>
  );
};

export default Signup;