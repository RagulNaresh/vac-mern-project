import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Experiences from './pages/Experiences';
import ExperienceDetails from './pages/ExperienceDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import MyBookings from './pages/MyBookings';
import GuideDashboard from './pages/GuideDashboard';
import AdminDashboard from './pages/AdminDashboard';

const NotFound = () => (
  <div className="page-container container" style={{ textAlign: 'center', padding: '6rem 0' }}>
    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🧭</div>
    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--secondary)' }}>404 - Page Not Found</h1>
    <p style={{ color: 'var(--text-muted)', margin: '1rem 0 2rem' }}>
      The scenic trail you are looking for doesn't exist or has moved.
    </p>
    <Link to="/" className="btn btn-primary">
      Return Home
    </Link>
  </div>
);

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/experiences" element={<Experiences />} />
          <Route path="/experiences/:id" element={<ExperienceDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes: Authenticated Users */}
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes: Guides & Admins */}
          <Route
            path="/guide-dashboard"
            element={
              <ProtectedRoute allowedRoles={['guide', 'admin']}>
                <GuideDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes: Admins only */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* 404 Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
