import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Read role from localStorage as fallback
  const storedRole = localStorage.getItem('role');
  const userRole = user?.role || storedRole;
  const isInstructorUser = userRole === 'instructor';

  // Handle role-based redirects (once user is available or fallback role exists)
  useEffect(() => {
    if (!loading && userRole) {
      if (isInstructorUser && location.pathname === '/dashboard') {
        navigate('/instructor-dashboard', { replace: true });
      }

      if (!isInstructorUser && location.pathname === '/instructor-dashboard') {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [userRole, loading, location.pathname, navigate, isInstructorUser]);

  // Sync role to localStorage for global access
  useEffect(() => {
    if (userRole && localStorage.getItem('role') !== userRole) {
      localStorage.setItem('role', userRole);
      window.dispatchEvent(new CustomEvent('role:update', { detail: { role: userRole } }));
    }
  }, [userRole]);

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  // Not logged in
  if (!user && !storedRole) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role restriction (e.g. instructor-only route)
  if (requiredRole === 'instructor' && userRole !== 'instructor') {
    return <Navigate to="/dashboard" replace />;
  }

  // Authorized
  return children;
};

export default ProtectedRoute;
