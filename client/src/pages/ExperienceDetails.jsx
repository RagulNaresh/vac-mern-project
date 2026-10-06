import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import BookingForm from '../components/BookingForm';
import ReviewCard from '../components/ReviewCard';
import ReviewForm from '../components/ReviewForm';
import { experienceService, reviewService } from '../services/api';

const ExperienceDetails = () => {
  const { id } = useParams();
  const [experience, setExperience] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchExperienceAndReviews = async () => {
    try {
      setLoading(true);
      const [expRes, revRes] = await Promise.all([
        experienceService.getById(id),
        reviewService.getByExperience(id)
      ]);

      if (expRes.data.success) {
        setExperience(expRes.data.experience);
        if (expRes.data.experience.images && expRes.data.experience.images.length > 0) {
          setSelectedImage(expRes.data.experience.images[0]);
        }
      }
      if (revRes.data.success) {
        setReviews(revRes.data.reviews);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load experience details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperienceAndReviews();
  }, [id]);

  const handleReviewAdded = (newReview) => {
    // Add review to list and refresh experience rating
    setReviews((prev) => [newReview, ...prev]);
    // Refresh experience details to get new avgRating and numReviews
    experienceService.getById(id).then((res) => {
      if (res.data.success) setExperience(res.data.experience);
    });
  };

  if (loading) {
    return (
      <div className="page-container container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error || !experience) {
    return (
      <div className="page-container container">
        <div className="empty-state">
          <div className="empty-icon">⚠️</div>
          <div className="empty-title">Experience Not Found</div>
          <p className="empty-desc">{error || "The requested experience doesn't exist or has been removed."}</p>
          <Link to="/experiences" className="btn btn-primary">
            Back to Experiences
          </Link>
        </div>
      </div>
    );
  }

  const {
    title,
    description,
    category,
    location,
    price,
    duration,
    maxGroupSize,
    images,
    avgRating,
    numReviews,
    guide
  } = experience;

  return (
    <div className="page-container container">
      {/* Breadcrumb Navigation */}
      <nav style={{ marginBottom: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        <Link to="/" style={{ color: 'var(--text-muted)' }}>Home</Link>
        <span style={{ margin: '0 0.5rem' }}>/</span>
        <Link to={`/experiences?category=${encodeURIComponent(category)}`} style={{ color: 'var(--text-muted)' }}>
          {category}
        </Link>
        <span style={{ margin: '0 0.5rem' }}>/</span>
        <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{title}</span>
      </nav>

      {/* Main Title Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.5rem' }}>
          <span className="badge badge-primary">{category}</span>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            📍 {location}
          </span>
        </div>
        <h1 className="page-title" style={{ fontSize: '2.4rem' }}>{title}</h1>
      </div>

      {/* Two Column Layout: Left Content & Right Sticky Booking Widget */}
      <div className="details-layout">
        {/* Left Column: Media & Story */}
        <div>
          {/* Main Gallery Image */}
          <div className="gallery-container">
            <img
              src={selectedImage || images[0] || '/uploads/rome-colosseum.svg'}
              alt={title}
              className="gallery-main-img"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500"><rect width="800" height="500" fill="%230F172A"/><text x="50%" y="50%" fill="white" font-size="28" text-anchor="middle" dominant-baseline="middle">LocalGuide Experience</text></svg>';
              }}
            />
          </div>

          {/* Multiple Image Thumbnails if present */}
          {images && images.length > 1 && (
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  style={{
                    border: selectedImage === img ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    padding: 0,
                    width: '80px',
                    height: '55px',
                    cursor: 'pointer'
                  }}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}

          {/* Key Specs Strip */}
          <div className="specs-strip">
            <div className="spec-item">
              <span className="spec-label">Duration</span>
              <span className="spec-value">⏱️ {duration}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Group Limit</span>
              <span className="spec-value">👥 Up to {maxGroupSize} guests</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Rating</span>
              <span className="spec-value" style={{ color: 'var(--secondary)' }}>
                ★ {avgRating > 0 ? avgRating.toFixed(1) : 'New'} ({numReviews})
              </span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Host Guide</span>
              <span className="spec-value">👤 {guide?.name || 'Local Guide'}</span>
            </div>
          </div>

          {/* Experience Description */}
          <div className="info-card">
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--secondary)' }}>
              About This Experience
            </h2>
            <div style={{ whiteSpace: 'pre-line', color: 'var(--text-main)', fontSize: '1.05rem', lineHeight: '1.75' }}>
              {description}
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '2rem 0' }} />

            {/* Meet Your Guide */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: '800'
                }}
              >
                {guide?.name ? guide.name[0] : 'G'}
              </div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--secondary)' }}>
                  Hosted by {guide?.name}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Verified Local Host • Speaks English & Local Language
                </div>
              </div>
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="info-card" id="reviews-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--secondary)' }}>
                  Traveler Reviews
                </h3>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  {reviews.length} authentic community review{reviews.length === 1 ? '' : 's'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '1.25rem', fontWeight: '800' }}>
                <span style={{ color: 'var(--accent)' }}>★</span>
                <span>{avgRating > 0 ? avgRating.toFixed(1) : 'No reviews yet'}</span>
              </div>
            </div>

            {/* Review Cards List */}
            {reviews.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', margin: '1rem 0' }}>
                No reviews yet. Be the first traveler to book and review this experience!
              </p>
            ) : (
              <div>
                {reviews.map((rev) => (
                  <ReviewCard key={rev._id} review={rev} />
                ))}
              </div>
            )}

            {/* Add Review Form */}
            <ReviewForm experienceId={experience._id} onReviewAdded={handleReviewAdded} />
          </div>
        </div>

        {/* Right Column: Sticky Booking Widget */}
        <aside>
          <BookingForm experience={experience} />
        </aside>
      </div>
    </div>
  );
};

export default ExperienceDetails;
