import React from 'react';
import { Search, X } from 'lucide-react';
import './SearchBar.css';

export const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="search-bar">
      <Search size={18} className="search-icon" aria-hidden="true" />
      <input
        type="text"
        className="search-input"
        placeholder="Search products by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        aria-label="Search products"
      />
      {searchTerm && (
        <button
          type="button"
          className="clear-search-btn"
          onClick={() => setSearchTerm('')}
          aria-label="Clear search input"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};
