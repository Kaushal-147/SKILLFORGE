import React, { useState, useEffect, useRef } from 'react';
import './Header.css';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

function Navbar() {
  const { darkMode, setDarkMode } = useTheme();
  const { user, logout, isInstructor } = useAuth();
  const instructor = isInstructor() || user?.role === 'instructor';
  const location = useLocation();
  const navigate = useNavigate();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [modalStage, setModalStage] = useState('loading');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const sliderRef = useRef(null);
  const [sliderStyle, setSliderStyle] = useState({ opacity: 0 });

  const isDashboardActive =
    location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/instructor-dashboard');

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  const handleLogout = () => {
    logout();
    setShowLogoutModal(true);
    setSliderStyle({ opacity: 0 });
    setIsMobileMenuOpen(false);
  };

  const handleModalOk = () => {
    setShowLogoutModal(false);
    navigate('/');
  };

  const updateSlider = () => {
    const activeEl = document.querySelector('.nav-link.active');
    if (activeEl && sliderRef.current && activeEl.offsetWidth > 0) {
      const rect = activeEl.getBoundingClientRect();
      const parentRect = activeEl.parentElement.getBoundingClientRect();
      setSliderStyle({
        left: `${rect.left - parentRect.left}px`,
        width: `${rect.width}px`,
        transition: 'all 0.3s ease',
        position: 'absolute',
        bottom: '-2px',
        height: '2px',
        backgroundColor: '#0040c1',
        borderRadius: '2px',
        opacity: 1,
      });
    } else if (location.pathname === '/login' || location.pathname === '/signup') {
      setSliderStyle({ opacity: 0 });
    }
  };

  // Update slider on location change
  useEffect(() => {
    const waitForActive = () => {
      const activeEl = document.querySelector('.nav-link.active');
      if (activeEl) {
        updateSlider();
      } else {
        setTimeout(waitForActive, 25);
      }
    };
    waitForActive();
  }, [location.pathname]);

  // Update on window resize
  useEffect(() => {
    const handleResize = () => requestAnimationFrame(updateSlider);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // OAuth redirect logic
  useEffect(() => {
    if (localStorage.getItem('oauthRedirect') === 'true') {
      localStorage.removeItem('oauthRedirect');
      setTimeout(updateSlider, 10);
    }
  }, []);

  // Update slider after user login
  useEffect(() => {
    if (user) setTimeout(updateSlider, 50);
  }, [user]);

  // Logout modal stages
  useEffect(() => {
    if (showLogoutModal) {
      setModalStage('loading');
      const timer = setTimeout(() => setModalStage('success'), 1000);
      return () => clearTimeout(timer);
    }
  }, [showLogoutModal]);

  // Prevent body scroll on mobile menu open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
  }, [isMobileMenuOpen]);

  const handleMobileLinkClick = () => {
    toggleMobileMenu();
    updateSlider();
  };

  return (
    <div>
      <nav className={`navbar${darkMode ? ' dark-navbar' : ''}`}>
        <div className="nav-content">
          {/* Logo */}
          <div className="logo-group">
            {darkMode ? (
              <div className="logo-circle-dark font-bold">SF</div>
            ) : (
              <div className="logo-circle">SF</div>
            )}
            <span className="logo-text">SKILLFORGE</span>
          </div>

          {/* Desktop Links */}
          <div className="nav-links desktop-nav-links" style={{ position: 'relative' }}>
            <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Home
            </NavLink>
            {!instructor && (
              <NavLink to="/courses" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Courses
              </NavLink>
            )}
            {user && (
              <NavLink
                to={instructor ? '/instructor-dashboard' : '/dashboard'}
                className={({ isActive }) => (isActive || isDashboardActive ? 'nav-link active' : 'nav-link')}
              >
                Dashboard
              </NavLink>
            )}
            <NavLink to="/about" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              About
            </NavLink>
            <div ref={sliderRef} style={sliderStyle} />
          </div>

          {/* Actions */}
          <div className="nav-actions">
            <div className="nav-actions-row desktop-only-actions">
              <div
                className={`toggle-switch${darkMode ? ' toggled' : ''}`}
                onClick={() => setDarkMode(prev => !prev)}
              >
                <div className="toggle-track">
                  <div className="toggle-thumb" />
                </div>
                <span className="toggle-label">{darkMode ? 'Dark' : 'Light'}</span>
              </div>
              {user ? (
                <button className="login-btn" onClick={handleLogout}>Logout</button>
              ) : location.pathname === '/login' ? (
                <Link to="/signup"><button className="login-btn">Signup</button></Link>
              ) : (
                <Link to="/login"><button className="login-btn">Login</button></Link>
              )}
            </div>

            {/* Mobile controls */}
            <div className="mobile-nav-bar-controls">
              <div
                className={`toggle-switch mobile-header-toggle${darkMode ? ' toggled' : ''}`}
                onClick={() => setDarkMode(prev => !prev)}
              >
                <div className="toggle-track">
                  <div className="toggle-thumb" />
                </div>
              </div>
              <button
                className={`hamburger-menu${isMobileMenuOpen ? ' open' : ''}`}
                onClick={toggleMobileMenu}
              >
                <span className="hamburger-bar" />
                <span className="hamburger-bar" />
                <span className="hamburger-bar" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav Links */}
        <div className={`mobile-nav-links${darkMode ? ' dark-mode' : ''}${isMobileMenuOpen ? ' open' : ''}`}>
          <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={handleMobileLinkClick}>
            Home
          </NavLink>
          {!instructor && (
            <NavLink to="/courses" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={handleMobileLinkClick}>
              Courses
            </NavLink>
          )}
          {user && (
            <NavLink
              to={instructor ? '/instructor-dashboard' : '/dashboard'}
              className={({ isActive }) => (isActive || isDashboardActive ? 'nav-link active' : 'nav-link')}
              onClick={handleMobileLinkClick}
            >
              Dashboard
            </NavLink>
          )}
          <NavLink to="/about" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={handleMobileLinkClick}>
            About
          </NavLink>
          <div className="mobile-actions-wrapper">
            {user ? (
              <button className="login-btn mobile-logout-btn" onClick={handleLogout}>
                Logout
              </button>
            ) : location.pathname === '/login' ? (
              <Link to="/signup"><button className="login-btn">Signup</button></Link>
            ) : (
              <Link to="/login"><button className="login-btn">Login</button></Link>
            )}
          </div>
        </div>
      </nav>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="logout-modal-overlay">
          <div className="logout-modal-content">
            {modalStage === 'loading' ? (
              <div className="spinner" />
            ) : (
              <svg className="check-icon" viewBox="0 0 24 24">
                <path fill="currentColor" d="M9 16.17l-3.59-3.59L4 14l5 5 12-12-1.41-1.42z" />
              </svg>
            )}
            <p>Logout successful</p>
            <button className="logout-modal-ok-btn" onClick={handleModalOk} disabled={modalStage !== 'success'}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
