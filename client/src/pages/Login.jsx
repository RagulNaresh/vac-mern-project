import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both email and password', 'error');
      return;
    }

    try {
      setLoading(true);
      const data = await login(email, password);
      showToast('Welcome back to LocalGuide!', 'success');

      if (location.state?.from?.pathname) {
        navigate(location.state.from.pathname, { replace: true });
      } else if (data?.user?.role === 'admin') {
        navigate('/admin-dashboard', { replace: true });
      } else if (data?.user?.role === 'guide') {
        navigate('/guide-dashboard', { replace: true });
      } else {
        navigate('/experiences', { replace: true });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Quick autofill buttons for testing convenience
  const fillCredentials = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="page-container container" style={{ maxWidth: '480px' }}>
      <div className="info-card" style={{ padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🧭</div>
          <h1 className="page-title" style={{ fontSize: '1.75rem' }}>Log In to LocalGuide</h1>
          <p className="page-subtitle" style={{ fontSize: '0.95rem' }}>
            Access your bookings, reviews, and guide dashboard
          </p>
        </div>

        {/* Demo Account Switcher */}
        <div style={{ backgroundColor: 'var(--bg-card-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            ⚡ Quick Demo Logins (Password: password123)
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => fillCredentials('alice@traveler.com')}
            >
              Tourist (Alice)
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => fillCredentials('marco.guide@localguide.com')}
            >
              Guide (Marco)
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => fillCredentials('admin@localguide.com')}
            >
              Admin (Elena)
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} id="login-form">
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              className="form-input"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={loading}
            id="login-submit-btn"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '700' }}>
            Sign up here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
