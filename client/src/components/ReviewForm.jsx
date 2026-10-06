import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { reviewService } from '../services/api';

const ReviewForm = ({ experienceId, onReviewAdded }) => {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAuthenticated) {
    return (
      <div className="empty-state" style={{ padding: '2rem 1rem', margin: '1rem 0' }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Have you taken this tour? Log in to leave a verified review.
        </p>
        <Link to="/login" className="btn btn-outline btn-sm">
          Log In to Review
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!comment.trim()) {
      setErrorMsg('Please write a brief comment sharing your experience.');
      return;
    }

    try {
      setLoading(true);
      const res = await reviewService.add({
        experienceId,
        rating,
        comment: comment.trim()
      });

      if (res.data.success) {
        showToast('Thank you! Your review has been published.', 'success');
        setComment('');
        setRating(5);
        if (onReviewAdded) {
          onReviewAdded(res.data.review);
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not submit review.';
      setErrorMsg(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }} id="review-form">
      <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--secondary)' }}>
        Leave a Review
      </h4>

      {errorMsg && (
        <div style={{ padding: '0.75rem', backgroundColor: 'var(--danger-light)', color: 'var(--danger)', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.9rem' }}>
          {errorMsg}
        </div>
      )}

      {/* Star Selector */}
      <div className="form-group">
        <label className="form-label">Your Rating</label>
        <div className="star-rating-select">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
              style={{
                color: (hoverRating || rating) >= star ? 'var(--accent)' : '#CBD5E1',
                cursor: 'pointer',
                transition: 'transform 0.1s ease',
                display: 'inline-block'
              }}
            >
              ★
            </span>
          ))}
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginLeft: '0.5rem', alignSelf: 'center' }}>
            ({rating} of 5 stars)
          </span>
        </div>
      </div>

      {/* Comment */}
      <div className="form-group">
        <label className="form-label" htmlFor="review-comment">Your Feedback</label>
        <textarea
          id="review-comment"
          className="form-textarea"
          rows={3}
          placeholder="What made this experience memorable? How was your local guide?"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        ></textarea>
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-sm"
        disabled={loading}
        id="btn-submit-review"
      >
        {loading ? 'Submitting...' : 'Post Review'}
      </button>
    </form>
  );
};

export default ReviewForm;
