import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully', 'info');
    navigate('/');
  };

  const getDashboardPath = () => {
    if (user?.role === 'admin') return '/admin-dashboard';
    if (user?.role === 'guide') return '/guide-dashboard';
    return '/my-bookings';
  };

  return (
    <header className="navbar">
      <div className="container navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand" id="nav-brand">
          <div className="brand-icon">🧭</div>
          <span>Local<span className="brand-highlight">Guide</span></span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="navbar-nav">
          <NavLink
            to="/experiences"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            id="nav-link-experiences"
          >
            Explore Experiences
          </NavLink>

          {isAuthenticated && (
            <>
              <NavLink
                to="/my-bookings"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                id="nav-link-my-bookings"
              >
                My Bookings
              </NavLink>

              {(user?.role === 'guide' || user?.role === 'admin') && (
                <NavLink
                  to="/guide-dashboard"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  id="nav-link-guide-dashboard"
                >
                  Guide Dashboard
                </NavLink>
              )}

              {user?.role === 'admin' && (
                <NavLink
                  to="/admin-dashboard"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  id="nav-link-admin-dashboard"
                >
                  Admin Panel
                </NavLink>
              )}
            </>
          )}
        </nav>

        {/* User Account Controls */}
        <div className="nav-user-menu">
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              {/* Highlighted Admin shortcut button */}
              {user?.role === 'admin' && (
                <Link
                  to="/admin-dashboard"
                  className="btn btn-danger btn-sm"
                  id="nav-btn-admin-panel"
                  title="Open Administrator Console"
                >
                  🛡️ Admin Panel
                </Link>
              )}

              {/* Clickable user profile badge */}
              <Link
                to={getDashboardPath()}
                className="user-badge-nav"
                style={{ textDecoration: 'none', cursor: 'pointer' }}
                title="Go to dashboard"
              >
                <span>👤</span>
                <span>{user?.name?.split(' ')[0]}</span>
                <span
                  className={`badge ${
                    user?.role === 'admin'
                      ? 'badge-danger'
                      : user?.role === 'guide'
                      ? 'badge-warning'
                      : 'badge-primary'
                  }`}
                >
                  {user?.role}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                className="btn btn-outline btn-sm"
                id="nav-btn-logout"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-outline btn-sm" id="nav-btn-login">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm" id="nav-btn-register">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
