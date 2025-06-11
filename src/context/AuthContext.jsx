import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserProfile, loginUser, registerUser } from '../services/api';

// Create the context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const userData = await getUserProfile();

          // Ensure role is stored in localStorage
          if (userData && userData.role) {
            localStorage.setItem('role', userData.role);
          } else {
            const storedRole = localStorage.getItem('role');
            if (storedRole && userData) {
              userData.role = storedRole;
            }
          }

          setUser(userData);
          setLoading(false);
        } catch (err) {
          console.error('Error verifying auth token:', err);
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          setToken(null);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, [token]);

  const clearAuthStorage = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('authTimestamp');
  };

  // Login function
  const login = async (email, password) => {
    try {
      localStorage.removeItem('roleSyncError');
      setError(null);
      const response = await loginUser({ email, password });
      const { token, user } = response;

      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role);

      window.dispatchEvent(new CustomEvent('auth:login', {
        detail: {
          token,
          user,
          redirectPath: user.role === 'instructor' ? '/instructor-dashboard' : '/dashboard'
        }
      }));

      setToken(token);
      setUser(user);

      return {
        user,
        redirectPath: user.role === 'instructor' ? '/instructor-dashboard' : '/dashboard'
      };
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  // Signup function
  const signup = async (userData) => {
    try {
      setError(null);
      const response = await registerUser(userData);
      const { token, user } = response;

      localStorage.setItem('token', token);
      if (user && user.role) {
        localStorage.setItem('role', user.role);
      }

      setToken(token);
      setUser(user);

      const redirectPath = user.role === 'instructor' ? '/instructor-dashboard' : '/dashboard';
      return { user, redirectPath };
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
      throw err;
    }
  };

  // Role re-verification every 5 minutes
  useEffect(() => {
    const verifyRole = async () => {
      try {
        const userData = await getUserProfile();
        if (userData?.role !== localStorage.getItem('role')) {
          console.warn('Role mismatch detected, updating local storage');
          localStorage.setItem('role', userData.role);
          setUser(prev => ({ ...prev, role: userData.role }));
        }
      } catch (err) {
        console.error('Role verification failed:', err);
        localStorage.setItem('roleSyncError', err.message);
      }
    };

    const interval = setInterval(verifyRole, 300000); // 5 minutes
    return () => clearInterval(interval);
  }, [token]);

  const logout = () => {
    clearAuthStorage();
    setToken(null);
    setUser(null);
  };

  const isInstructor = () => {
    if (user && user.role) {
      return user.role === 'instructor';
    }
    const storedRole = localStorage.getItem('role');
    return storedRole === 'instructor';
  };

  const value = {
    user,
    token,
    loading,
    error,
    login,
    signup,
    logout,
    isInstructor
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
