import React from 'react';

const ReviewCard = ({ review }) => {
  const { user, rating, comment, createdAt } = review;

  const dateFormatted = new Date(createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="review-card" id={`review-card-${review._id}`}>
      <div className="review-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '0.85rem'
            }}
          >
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div>
            <div className="reviewer-name">{user?.name || 'Verified Traveler'}</div>
            <div className="review-date">{dateFormatted}</div>
          </div>
        </div>

        <div style={{ color: 'var(--accent)', fontWeight: '700', fontSize: '1rem' }}>
          {'★'.repeat(rating)}
          {'☆'.repeat(5 - rating)}
        </div>
      </div>

      <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: '1.5' }}>
        {comment}
      </p>
    </div>
  );
};

export default ReviewCard;
