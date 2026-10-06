import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { bookingService } from '../services/api';

const BookingForm = ({ experience, onBookingSuccess }) => {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Tomorrow's date in YYYY-MM-DD
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateStr = tomorrow.toISOString().split('T')[0];

  const [date, setDate] = useState(minDateStr);
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(false);

  const estimatedTotal = (experience?.price || 0) * guests;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      showToast('Please log in to book this experience', 'info');
      navigate('/login', { state: { from: location } });
      return;
    }

    if (experience.guide?._id === user?.id || experience.guide === user?.id) {
      showToast('Guides cannot book their own experience', 'error');
      return;
    }

    try {
      setLoading(true);
      const res = await bookingService.create({
        experienceId: experience._id,
        date,
        guests: Number(guests)
      });

      if (res.data.success) {
        showToast('🎉 Booking confirmed! Payment is due at the venue.', 'success');
        if (onBookingSuccess) {
          onBookingSuccess(res.data.booking);
        } else {
          navigate('/my-bookings');
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create booking';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-widget-sticky" id="booking-widget">
      <div className="price-highlight-banner">
        <div>
          <span style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--secondary)' }}>
            ${experience.price}
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}> / person</span>
        </div>
        <span className="badge badge-success">Pay at Venue</span>
      </div>

      <form onSubmit={handleSubmit} id="booking-form">
        <div className="form-group">
          <label className="form-label" htmlFor="booking-date">
            📅 Select Date
          </label>
          <input
            id="booking-date"
            type="date"
            min={minDateStr}
            className="form-input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className="form-label" htmlFor="booking-guests">
              👥 Number of Guests
            </label>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Max: {experience.maxGroupSize}
            </span>
          </div>
          <input
            id="booking-guests"
            type="number"
            min="1"
            max={experience.maxGroupSize}
            className="form-input"
            value={guests}
            onChange={(e) => setGuests(Math.max(1, Math.min(experience.maxGroupSize, Number(e.target.value))))}
            required
          />
        </div>

        {/* Pricing Summary */}
        <div className="pricing-summary">
          <div className="price-row">
            <span>${experience.price} × {guests} {guests === 1 ? 'guest' : 'guests'}</span>
            <span>${estimatedTotal}</span>
          </div>
          <div className="price-row">
            <span>Platform & Booking fee</span>
            <span style={{ color: 'var(--success)', fontWeight: '600' }}>Free ($0)</span>
          </div>
          <div className="price-row total">
            <span>Total to pay at venue</span>
            <span>${estimatedTotal}</span>
          </div>
        </div>

        <div className="pay-at-venue-note">
          <span>ℹ️</span>
          <span>No credit card needed today. Pay directly to your guide upon arrival.</span>
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-lg"
          style={{ width: '100%' }}
          disabled={loading}
          id="btn-confirm-booking"
        >
          {loading ? 'Confirming...' : isAuthenticated ? 'Confirm Booking' : 'Log In to Book'}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
