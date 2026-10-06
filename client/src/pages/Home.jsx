import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ExperienceCard from '../components/ExperienceCard';
import { experienceService } from '../services/api';

const CATEGORY_ITEMS = [
  { name: 'Culture & Heritage', icon: '🏛️', desc: 'Ancient monuments & local history' },
  { name: 'Food & Culinary', icon: '🍜', desc: 'Secret street food & cooking masterclasses' },
  { name: 'Nature & Adventure', icon: '🌲', desc: 'Breathtaking trails & scenic treks' },
  { name: 'Art & Craft', icon: '🎨', desc: 'Artisan workshops & architecture walks' },
  { name: 'Nightlife & Music', icon: '🎷', desc: 'Intimate canal jazz & hidden taverns' },
  { name: 'Wellness & Yoga', icon: '🧘', desc: 'Temple meditations & sound baths' }
];

const Home = () => {
  const [keyword, setKeyword] = useState('');
  const [featuredExperiences, setFeaturedExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await experienceService.getAll({ sort: 'rating' });
        if (res.data.success) {
          // Take top 4 or 6
          setFeaturedExperiences(res.data.experiences.slice(0, 6));
        }
      } catch (err) {
        console.error('Failed to load featured experiences', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/experiences?keyword=${encodeURIComponent(keyword.trim())}`);
    } else {
      navigate('/experiences');
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <span>✨</span>
              <span>Authentic Local Experiences • Zero Pre-Payment</span>
            </div>

            <h1 className="hero-title">
              Experience the world with passionate <span>local guides</span>.
            </h1>

            <p className="hero-subtitle">
              Skip generic bus tours. Immerse yourself in hidden alleys, ancient heritage, and regional cuisine with verified neighborhood insiders.
            </p>

            {/* Hero Search */}
            <form onSubmit={handleSearchSubmit} className="hero-search-wrapper" id="hero-search-form">
              <span style={{ fontSize: '1.25rem', paddingLeft: '0.75rem', color: '#64748B' }}>🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder="Where are you traveling? (e.g. Rome, Tokyo, Paris, Kyoto...)"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                id="hero-search-input"
              />
              <button type="submit" className="btn btn-primary btn-lg" id="hero-search-btn">
                Find Tours
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section style={{ padding: '4rem 0', backgroundColor: '#FFFFFF', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--secondary)' }}>
              Explore by Category
            </h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Handpicked themes curated for curious travelers
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem' }}>
            {CATEGORY_ITEMS.map((cat) => (
              <Link
                key={cat.name}
                to={`/experiences?category=${encodeURIComponent(cat.name)}`}
                style={{
                  padding: '1.5rem 1rem',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-main)',
                  textAlign: 'center',
                  transition: 'all var(--transition-fast)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{cat.icon}</div>
                <div style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--secondary)' }}>{cat.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>{cat.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Experiences */}
      <section className="page-container container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <div>
            <span className="badge badge-primary">Top Rated</span>
            <h2 className="page-title" style={{ marginTop: '0.5rem' }}>
              Featured Experiences
            </h2>
            <p className="page-subtitle">Highly rated local tours loved by community travelers</p>
          </div>
          <Link to="/experiences" className="btn btn-outline" id="view-all-experiences-link">
            Browse All Tours →
          </Link>
        </div>

        {loading ? (
          <div className="spinner"></div>
        ) : featuredExperiences.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🗺️</div>
            <div className="empty-title">No tours found</div>
            <div className="empty-desc">Check back soon for new local adventures.</div>
          </div>
        ) : (
          <div className="experience-grid">
            {featuredExperiences.map((exp) => (
              <ExperienceCard key={exp._id} experience={exp} />
            ))}
          </div>
        )}
      </section>

      {/* Trust & Guarantee Section */}
      <section style={{ backgroundColor: 'var(--bg-card-subtle)', padding: '4.5rem 0', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3rem' }}>
            <span className="badge badge-warning">Why Choose LocalGuide</span>
            <h2 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--secondary)', marginTop: '0.5rem' }}>
              A more intimate, honest way to travel
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
            <div className="info-card" style={{ marginBottom: 0 }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🤝</div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--secondary)' }}>
                Pay at Venue
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                No risky advance payments or hidden platform fees. Book your spot instantly and pay your local guide directly in cash or local currency when you meet.
              </p>
            </div>

            <div className="info-card" style={{ marginBottom: 0 }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🛡️</div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--secondary)' }}>
                Verified Local Guides
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Every guide is a resident archaeologist, culinary chef, or seasoned local who crafts their own tours and shares genuine neighborhood pride.
              </p>
            </div>

            <div className="info-card" style={{ marginBottom: 0 }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>👥</div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--secondary)' }}>
                Small Group Sizes
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Strict group maximums mean you can converse freely, ask questions, and explore delicate heritage spots without crowding.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Become a Guide CTA */}
      <section style={{ padding: '4rem 0', background: 'linear-gradient(135deg, #0F172A, #1E293B)', color: 'white', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '700px' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: '800', marginBottom: '1rem' }}>
            Passionate about your hometown?
          </h2>
          <p style={{ color: '#CBD5E1', fontSize: '1.1rem', marginBottom: '2rem' }}>
            Turn your local knowledge into an experience. Host walks, cooking classes, or bike tours on your own schedule.
          </p>
          <Link to="/register" className="btn btn-primary btn-lg" id="cta-become-guide-btn">
            Register as a Local Guide →
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
