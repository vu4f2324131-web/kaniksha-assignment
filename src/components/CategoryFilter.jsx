import React from 'react';
import './CategoryFilter.css';

export const CategoryFilter = ({
  categories = [],
  selectedCategory = 'All',
  onSelectCategory,
  categoryCounts = {}
}) => {
  return (
    <div className="category-filter-container" role="group" aria-label="Filter by category">
      <button
        type="button"
        className={`category-pill ${selectedCategory === 'All' ? 'active' : ''}`}
        onClick={() => onSelectCategory('All')}
      >
        <span>All Items</span>
        {categoryCounts['All'] !== undefined && (
          <span className="category-count">({categoryCounts['All']})</span>
        )}
      </button>

      {categories.map((cat) => (
        <button
          key={cat}
          type="button"
          className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
          onClick={() => onSelectCategory(cat)}
        >
          <span>{cat}</span>
          {categoryCounts[cat] !== undefined && (
            <span className="category-count">({categoryCounts[cat]})</span>
          )}
        </button>
      ))}
    </div>
  );
};
