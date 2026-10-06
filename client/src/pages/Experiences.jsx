import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ExperienceCard from '../components/ExperienceCard';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import { experienceService } from '../services/api';

const Experiences = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter states initialized from URL query params
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || '');

  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync state if URL query params change (e.g. clicking category link from Footer or Home)
  useEffect(() => {
    if (searchParams.get('keyword') !== null) setKeyword(searchParams.get('keyword') || '');
    if (searchParams.get('category') !== null) setCategory(searchParams.get('category') || '');
    if (searchParams.get('location') !== null) setLocation(searchParams.get('location') || '');
  }, [searchParams]);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const params = {};
      if (keyword.trim()) params.keyword = keyword.trim();
      if (category.trim()) params.category = category.trim();
      if (location.trim()) params.location = location.trim();
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (sort) params.sort = sort;

      const res = await experienceService.getAll(params);
      if (res.data.success) {
        setExperiences(res.data.experiences);
      }
    } catch (err) {
      console.error('Failed to fetch experiences', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, [category, sort]);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    fetchExperiences();
  };

  const handleResetFilters = () => {
    setKeyword('');
    setCategory('');
    setLocation('');
    setMinPrice('');
    setMaxPrice('');
    setSort('');
    setSearchParams({});
    // Trigger fresh load
    setTimeout(() => {
      experienceService.getAll({}).then((res) => {
        if (res.data.success) setExperiences(res.data.experiences);
      });
    }, 50);
  };

  return (
    <div className="page-container container">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Explore Local Experiences</h1>
        <p className="page-subtitle">
          Discover handpicked cultural walks, foodie crawls, and outdoor adventures
        </p>
      </div>

      {/* Search Input Bar */}
      <div style={{ marginBottom: '1.5rem' }}>
        <SearchBar
          keyword={keyword}
          onChange={setKeyword}
          onSubmit={handleSearchSubmit}
          placeholder="Search by tour title, description, or landmark..."
        />
      </div>

      {/* Filter & Sorting Controls */}
      <FilterBar
        category={category}
        setCategory={setCategory}
        location={location}
        setLocation={setLocation}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        sort={sort}
        setSort={setSort}
        onReset={handleResetFilters}
      />

      {/* Results Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ fontWeight: '700', color: 'var(--secondary)' }}>
          {!loading && (
            <span>
              Showing {experiences.length} {experiences.length === 1 ? 'experience' : 'experiences'}
              {category && ` in "${category}"`}
              {location && ` near "${location}"`}
            </span>
          )}
        </div>
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="spinner"></div>
      ) : experiences.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <div className="empty-title">No matching experiences</div>
          <p className="empty-desc">
            Try adjusting your search terms, removing filters, or clearing the price range.
          </p>
          <button onClick={handleResetFilters} className="btn btn-primary btn-sm">
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="experience-grid">
          {experiences.map((exp) => (
            <ExperienceCard key={exp._id} experience={exp} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Experiences;
