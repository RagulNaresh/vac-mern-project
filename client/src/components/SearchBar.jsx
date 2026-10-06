import React from 'react';

const SearchBar = ({ keyword, onChange, onSubmit, placeholder = 'Search experiences, cities, or activities...' }) => {
  return (
    <form onSubmit={onSubmit} className="search-bar" id="search-bar-form">
      <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>🔍</span>
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={keyword}
        onChange={(e) => onChange(e.target.value)}
        id="search-input"
      />
      {keyword && (
        <button
          type="button"
          onClick={() => onChange('')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '1.1rem' }}
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
      <button type="submit" className="btn btn-primary btn-sm" id="search-submit-btn">
        Search
      </button>
    </form>
  );
};

export default SearchBar;
