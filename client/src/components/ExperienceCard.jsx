import React from 'react';
import { Link } from 'react-router-dom';

const ExperienceCard = ({ experience }) => {
  const {
    _id,
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

  // Fallback image if images array is empty
  const displayImage = images && images.length > 0 ? images[0] : '/uploads/rome-colosseum.svg';

  return (
    <article className="experience-card" id={`experience-card-${_id}`}>
      <Link to={`/experiences/${_id}`} className="card-image-box">
        <img
          src={displayImage}
          alt={title}
          className="card-image"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250"><rect width="400" height="250" fill="%230F172A"/><text x="50%" y="50%" fill="white" font-size="20" text-anchor="middle" dominant-baseline="middle">LocalGuide Experience</text></svg>';
          }}
        />
        <span className="card-category-pill">{category}</span>
      </Link>

      <div className="card-body">
        <div className="card-location">
          <span>📍</span>
          <span>{location}</span>
        </div>

        <Link to={`/experiences/${_id}`}>
          <h3 className="card-title">{title}</h3>
        </Link>

        <p className="card-description">{description}</p>

        <div className="card-meta">
          <span>⏱️ {duration}</span>
          <span>👥 Up to {maxGroupSize}</span>
          {guide?.name && (
            <span style={{ marginLeft: 'auto' }}>👤 {guide.name.split(' ')[0]}</span>
          )}
        </div>

        <div className="card-footer">
          <div className="price-tag">
            <span className="amount">${price}</span>
            <span className="unit">per person</span>
          </div>

          <div className="card-rating">
            <span className="star-icon">★</span>
            <span>{avgRating > 0 ? avgRating.toFixed(1) : 'New'}</span>
            {numReviews > 0 && (
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '400' }}>
                ({numReviews})
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default ExperienceCard;
