import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Get stored role from localStorage if user is not yet loaded
  const storedRole = localStorage.getItem('role');
  const userRole = user?.role || storedRole;
  const isInstructorUser = userRole === 'instructor';

  // Redirect user to correct dashboard (only on root dashboards)
  useEffect(() => {
    if (!loading && userRole) {
      if (location.pathname === '/dashboard' && isInstructorUser) {
        navigate('/instructor-dashboard', { replace: true });
      }
      if (location.pathname === '/instructor-dashboard' && !isInstructorUser) {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [userRole, loading, location.pathname, navigate, isInstructorUser]);

  // Sync user role to localStorage for persistence across refreshes
  useEffect(() => {
    if (userRole && localStorage.getItem('role') !== userRole) {
      localStorage.setItem('role', userRole);
      window.dispatchEvent(new CustomEvent('role:update', { detail: { role: userRole } }));
    }
  }, [userRole]);

  // While loading auth state
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

  // Restrict access based on required role
  if (!loading && requiredRole === 'instructor' && userRole !== 'instructor') {
    return <Navigate to="/dashboard" replace />;
  }

  // Authorized → render protected content
  return children;
};

export default ProtectedRoute;
