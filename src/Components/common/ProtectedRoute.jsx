import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// A wrapper for routes that should only be accessible to authenticated users
// and optionally only to users with specific roles
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading, isInstructor } = useAuth();
  const location = useLocation();

  if (loading) {
    // Show loading state while checking authentication
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  // If no user is logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If a specific role is required, check if user has that role
  if (requiredRole === 'instructor' && !isInstructor()) {
    // Redirect to dashboard if trying to access instructor-only pages
    return <Navigate to="/dashboard" replace />;
  }

  // If authenticated and role requirements are met, render the children
  return children;
};

export default ProtectedRoute; 