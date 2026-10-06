import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingService } from '../services/api';
import { useToast } from '../context/ToastContext';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const { showToast } = useToast();

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await bookingService.getMyBookings();
      if (res.data.success) {
        setBookings(res.data.bookings);
      }
    } catch (err) {
      showToast('Failed to load your bookings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      setCancellingId(bookingId);
      const res = await bookingService.cancel(bookingId);
      if (res.data.success) {
        showToast('Booking cancelled successfully', 'info');
        // Update local state
        setBookings((prev) =>
          prev.map((b) => (b._id === bookingId ? { ...b, status: 'cancelled' } : b))
        );
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to cancel booking';
      showToast(msg, 'error');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="page-container container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 className="page-title">My Bookings</h1>
          <p className="page-subtitle">Track your upcoming tours and past reservations</p>
        </div>
        <Link to="/experiences" className="btn btn-outline btn-sm">
          Book New Experience
        </Link>
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : bookings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎒</div>
          <div className="empty-title">No bookings yet</div>
          <p className="empty-desc">
            You haven't reserved any local tours. Explore our handpicked experiences and book your first adventure today!
          </p>
          <Link to="/experiences" className="btn btn-primary">
            Explore Experiences
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {bookings.map((b) => {
            const exp = b.experience;
            const bookingDate = new Date(b.date).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });

            return (
              <div
                key={b._id}
                className="info-card"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '140px 1fr auto',
                  gap: '1.5rem',
                  alignItems: 'center',
                  padding: '1.5rem',
                  marginBottom: 0
                }}
              >
                {/* Thumbnail image */}
                <div
                  style={{
                    width: '140px',
                    height: '95px',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    backgroundColor: '#E2E8F0'
                  }}
                >
                  <img
                    src={exp?.images?.[0] || '/uploads/rome-colosseum.svg'}
                    alt={exp?.title || 'Tour'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                {/* Details */}
                <div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span
                      className={`badge ${
                        b.status === 'confirmed' ? 'badge-success' : 'badge-danger'
                      }`}
                    >
                      {b.status}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      📍 {exp?.location || 'Local Tour'}
                    </span>
                  </div>

                  <Link to={`/experiences/${exp?._id}`}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--secondary)', marginBottom: '0.5rem' }}>
                      {exp?.title || 'Experience'}
                    </h3>
                  </Link>

                  <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    <span>📅 <strong>{bookingDate}</strong></span>
                    <span>👥 {b.guests} {b.guests === 1 ? 'Guest' : 'Guests'}</span>
                    {exp?.guide?.name && <span>Host: {exp.guide.name}</span>}
                  </div>
                </div>

                {/* Price and Actions */}
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-end' }}>
                  <div>
                    <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--secondary)' }}>
                      ${b.totalPrice}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: '600' }}>
                      Pay at venue
                    </div>
                  </div>

                  {b.status === 'confirmed' && (
                    <button
                      onClick={() => handleCancelBooking(b._id)}
                      className="btn btn-danger-outline btn-sm"
                      disabled={cancellingId === b._id}
                    >
                      {cancellingId === b._id ? 'Cancelling...' : 'Cancel Booking'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
