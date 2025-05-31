import { useLocation } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import React from 'react';

const AuthPage = () => {
  const location = useLocation();
  const isSignup = location.pathname === '/signup';

  return <AuthForm type={isSignup ? 'signup' : 'login'} />;
};

export default AuthPage; 