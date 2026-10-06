import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('tourist');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters long', 'error');
      return;
    }

    try {
      setLoading(true);
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        role
      });

      showToast(`Welcome to LocalGuide, ${name}!`, 'success');
      if (role === 'admin') {
        navigate('/admin-dashboard');
      } else if (role === 'guide') {
        navigate('/guide-dashboard');
      } else {
        navigate('/experiences');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container container" style={{ maxWidth: '520px' }}>
      <div className="info-card" style={{ padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🧭</div>
          <h1 className="page-title" style={{ fontSize: '1.75rem' }}>Join LocalGuide</h1>
          <p className="page-subtitle" style={{ fontSize: '0.95rem' }}>
            Book intimate tours or host your own local experiences
          </p>
        </div>

        <form onSubmit={handleSubmit} id="register-form">
          {/* Role Selection */}
          <div className="form-group">
            <label className="form-label">Account Role:</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
              <button
                type="button"
                className={`btn ${role === 'tourist' ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '0.75rem 0.5rem', flexDirection: 'column', gap: '0.2rem' }}
                onClick={() => setRole('tourist')}
              >
                <span style={{ fontSize: '1.25rem' }}>🎒</span>
                <span style={{ fontWeight: '700', fontSize: '0.85rem' }}>Tourist</span>
              </button>

              <button
                type="button"
                className={`btn ${role === 'guide' ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '0.75rem 0.5rem', flexDirection: 'column', gap: '0.2rem' }}
                onClick={() => setRole('guide')}
              >
                <span style={{ fontSize: '1.25rem' }}>🗺️</span>
                <span style={{ fontWeight: '700', fontSize: '0.85rem' }}>Guide</span>
              </button>

              <button
                type="button"
                className={`btn ${role === 'admin' ? 'btn-danger' : 'btn-outline'}`}
                style={{ padding: '0.75rem 0.5rem', flexDirection: 'column', gap: '0.2rem' }}
                onClick={() => setRole('admin')}
              >
                <span style={{ fontSize: '1.25rem' }}>🛡️</span>
                <span style={{ fontWeight: '700', fontSize: '0.85rem' }}>Admin</span>
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-name">Full Name</label>
            <input
              id="register-name"
              type="text"
              className="form-input"
              placeholder="e.g. Maria Santos"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-email">Email Address</label>
            <input
              id="register-email"
              type="email"
              className="form-input"
              placeholder="maria@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-password">Password (min 6 characters)</label>
            <input
              id="register-password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={loading}
            id="register-submit-btn"
          >
            {loading ? 'Creating account...' : `Sign Up as ${role === 'guide' ? 'Guide' : 'Traveler'}`}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '700' }}>
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
