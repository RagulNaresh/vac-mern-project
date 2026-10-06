import React from 'react';

const CATEGORIES = [
  'All',
  'Culture & Heritage',
  'Food & Culinary',
  'Nature & Adventure',
  'Art & Craft',
  'Nightlife & Music',
  'Wellness & Yoga'
];

const FilterBar = ({
  category,
  setCategory,
  location,
  setLocation,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  sort,
  setSort,
  onReset
}) => {
  return (
    <div className="filter-panel" id="filter-panel">
      {/* Category Chips */}
      <div>
        <label className="form-label" style={{ display: 'block', marginBottom: '0.25rem' }}>
          Explore by Category
        </label>
        <div className="category-chips">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`category-chip ${category === cat || (cat === 'All' && !category) ? 'active' : ''}`}
              onClick={() => setCategory(cat === 'All' ? '' : cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.25rem 0' }} />

      {/* Advanced Filter Grid */}
      <div className="filter-grid">
        {/* Location Input */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" htmlFor="filter-location">
            City or Destination
          </label>
          <input
            id="filter-location"
            type="text"
            className="form-input"
            placeholder="e.g. Rome, Tokyo, Paris"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        {/* Price Range */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
            <label className="form-label" htmlFor="filter-min-price">Min Price ($)</label>
            <input
              id="filter-min-price"
              type="number"
              min="0"
              className="form-input"
              placeholder="0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
            <label className="form-label" htmlFor="filter-max-price">Max Price ($)</label>
            <input
              id="filter-max-price"
              type="number"
              min="0"
              className="form-input"
              placeholder="200"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </div>

        {/* Sort Dropdown */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" htmlFor="filter-sort">Sort By</label>
          <select
            id="filter-sort"
            className="form-select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="">Newest Added</option>
            <option value="rating">Highest Rated</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>

        {/* Reset Filters */}
        <div>
          <button
            type="button"
            className="btn btn-outline"
            style={{ width: '100%' }}
            onClick={onReset}
            id="filter-reset-btn"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
