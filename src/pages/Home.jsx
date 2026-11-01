import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { productService } from '../data/productService';
import { ProductGrid } from '../components/ProductGrid';
import { SearchBar } from '../components/SearchBar';
import { CategoryFilter } from '../components/CategoryFilter';
import { SortDropdown } from '../components/SortDropdown';
import { EmptyState } from '../components/EmptyState';
import { useCart } from '../hooks/useCart';
import { formatCurrency } from '../utils/formatCurrency';
import {
  ArrowDown,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  RotateCcw,
  ShieldCheck,
  Truck,
  RefreshCw,
  Heart,
  ShoppingCart,
  ImageOff
} from 'lucide-react';
import './Home.css';

const HERO_SLIDES = [
  {
    id: 'prod-101',
    tag: 'Autumn / Winter Audio',
    title: 'Pristine sound, engineered for pure focus.',
    subtitle: 'Active noise cancellation with 30-hour battery life and ultra-soft memory foam ear cushions for all-day comfort.',
    category: 'Electronics',
    categoryTarget: 'Electronics',
    ctaText: 'Explore Audio'
  },
  {
    id: 'prod-111',
    tag: 'Ergonomic Workspace',
    title: 'Dynamic posture support for the modern office.',
    subtitle: 'Breathable high-back mesh support with 3D adjustable armrests and synchronized tilt-lock mechanism for deep focus.',
    category: 'Home & Living',
    categoryTarget: 'Home & Living',
    ctaText: 'Explore Workspace'
  },
  {
    id: 'prod-106',
    tag: 'Sustainable Wardrobe',
    title: 'Timeless vintage denim, woven to last.',
    subtitle: 'Crafted from 100% heavy-duty organic cotton with antique brass closures, tailored fit, and all-season versatility.',
    category: 'Fashion',
    categoryTarget: 'Fashion',
    ctaText: 'Explore Apparel'
  }
];

export const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const catalogRef = useRef(null);
  const { wishlist, toggleWishlist, isWishlisted, addToCart, cartItems } = useCart();

  // Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [inStockOnly, setInStockOnly] = useState(false);

  // Hero interactive state
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [slideImgError, setSlideImgError] = useState(false);

  // Synchronous product service queries
  const products = useMemo(() => productService.getAllProducts(), []);
  const categories = useMemo(() => productService.getCategories(), []);

  // Map slide products
  const currentSlide = HERO_SLIDES[currentSlideIndex];
  const slideProduct = useMemo(
    () => products.find((p) => p.id === currentSlide.id) || products[0],
    [products, currentSlide.id]
  );

  // Cart item for the slide product
  const slideCartItem = cartItems.find((i) => String(i.id) === String(slideProduct?.id));
  const slideInCartQty = slideCartItem ? slideCartItem.quantity : 0;
  const isSlideProductFavorite = slideProduct ? isWishlisted(slideProduct.id) : false;

  // Next / Previous slide handlers
  const handleNextSlide = useCallback(() => {
    setSlideImgError(false);
    setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const handlePrevSlide = useCallback(() => {
    setSlideImgError(false);
    setCurrentSlideIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  const handleSelectSlide = (index) => {
    setSlideImgError(false);
    setCurrentSlideIndex(index);
  };

  // Autoplay timer with pause support
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      handleNextSlide();
    }, 6500);

    return () => clearInterval(timer);
  }, [isAutoPlaying, handleNextSlide]);

  // Check if viewing wishlist
  const isViewingWishlist = searchParams.get('wishlist') === 'true';

  // Derive selected category from searchParams
  const selectedCategory = searchParams.get('category') || 'All';

  // Compute product count per category
  const categoryCounts = useMemo(() => {
    const counts = { All: products.length };
    categories.forEach((cat) => {
      counts[cat] = products.filter((p) => p.category === cat).length;
    });
    return counts;
  }, [products, categories]);

  // Sync category change with URL params
  const handleCategorySelect = (category) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('wishlist');
    if (category === 'All') {
      nextParams.delete('category');
    } else {
      nextParams.set('category', category);
    }
    setSearchParams(nextParams);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSortBy('default');
    setInStockOnly(false);
    const nextParams = new URLSearchParams();
    setSearchParams(nextParams);
  };

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleHeroCategoryJump = (categoryName) => {
    handleCategorySelect(categoryName);
    scrollToCatalog();
  };

  const handleQuickAddSlideProduct = (e) => {
    e.preventDefault();
    if (!slideProduct) return;
    addToCart(slideProduct.id, 1);
  };

  // Filter & sort
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Wishlist filter
    if (isViewingWishlist) {
      result = result.filter((p) => wishlist.includes(String(p.id)));
    }

    // Search filter
    const trimmed = searchTerm.trim().toLowerCase();
    if (trimmed) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(trimmed) ||
          p.description.toLowerCase().includes(trimmed) ||
          p.category.toLowerCase().includes(trimmed)
      );
    }

    // Category filter
    if (selectedCategory !== 'All' && !isViewingWishlist) {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // In-stock only
    if (inStockOnly) {
      result = result.filter((p) => p.stock > 0);
    }

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'default':
      default:
        break;
    }

    return result;
  }, [products, searchTerm, selectedCategory, inStockOnly, sortBy, isViewingWishlist, wishlist]);

  const hasActiveFilters =
    searchTerm.trim() !== '' ||
    selectedCategory !== 'All' ||
    sortBy !== 'default' ||
    inStockOnly ||
    isViewingWishlist;

  return (
    <div className="home-page">
      {/* Interactive Editorial Hero Showcase */}
      <section
        className="hero-section"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
        aria-label="Editorial Showcase"
      >
        <div className="container hero-container">
          {/* Top Story Tabs Navigation */}
          <div className="hero-tabs-bar">
            <div className="hero-story-tabs" role="tablist">
              {HERO_SLIDES.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  role="tab"
                  aria-selected={currentSlideIndex === index}
                  className={`story-tab-btn ${currentSlideIndex === index ? 'active' : ''}`}
                  onClick={() => handleSelectSlide(index)}
                >
                  <span className="tab-number">0{index + 1}</span>
                  <span className="tab-label">{slide.category}</span>
                </button>
              ))}
            </div>

            <div className="hero-slide-controls">
              <button
                type="button"
                className="slide-ctrl-btn"
                onClick={handlePrevSlide}
                aria-label="Previous story"
                title="Previous slide"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                className="slide-ctrl-btn play-pause-btn"
                onClick={() => setIsAutoPlaying((prev) => !prev)}
                aria-label={isAutoPlaying ? 'Pause autoplay' : 'Resume autoplay'}
                title={isAutoPlaying ? 'Pause autoplay' : 'Play slideshow'}
              >
                {isAutoPlaying ? <Pause size={13} /> : <Play size={13} />}
              </button>
              <button
                type="button"
                className="slide-ctrl-btn"
                onClick={handleNextSlide}
                aria-label="Next story"
                title="Next slide"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="hero-grid">
            {/* Left Content */}
            <div className="hero-content fade-in" key={currentSlide.id}>
              <span className="hero-kicker">{currentSlide.tag}</span>
              <h1 className="hero-title">{currentSlide.title}</h1>
              <p className="hero-subtitle">{currentSlide.subtitle}</p>

              <div className="hero-cta-group">
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => handleHeroCategoryJump(currentSlide.categoryTarget)}
                >
                  <span>{currentSlide.ctaText}</span>
                  <ArrowRight size={16} />
                </button>
                <button className="btn btn-secondary btn-lg" onClick={scrollToCatalog}>
                  <span>Browse All ({products.length})</span>
                  <ArrowDown size={15} />
                </button>
              </div>

              <div className="hero-perks-row">
                <span className="hero-perk-item">✓ Free Express Delivery ₹999+</span>
                <span className="hero-perk-item">✓ 100% Genuine Guaranteed</span>
                <span className="hero-perk-item">✓ 30-Day Hassle-Free Returns</span>
              </div>
            </div>

            {/* Right Interactive Featured Showcase Card */}
            {slideProduct && (
              <div className="hero-showcase-wrapper fade-in" key={`card-${slideProduct.id}`}>
                <div className="hero-showcase-card">
                  <div className="showcase-image-box">
                    <Link to={`/products/${slideProduct.id}`} tabIndex={-1} aria-hidden="true">
                      {!slideImgError && slideProduct.image ? (
                        <img
                          src={slideProduct.image}
                          alt={slideProduct.name}
                          className="showcase-img"
                          onError={() => setSlideImgError(true)}
                        />
                      ) : (
                        <div className="showcase-img-fallback">
                          <ImageOff size={32} />
                          <span>Image unavailable</span>
                        </div>
                      )}
                    </Link>
                    <span className="showcase-badge">Spotlight Item</span>

                    <button
                      type="button"
                      className={`showcase-wishlist-btn ${isSlideProductFavorite ? 'active' : ''}`}
                      onClick={() => toggleWishlist(slideProduct.id)}
                      title={isSlideProductFavorite ? 'Saved in wishlist' : 'Save to wishlist'}
                      aria-label="Save item to wishlist"
                    >
                      <Heart size={16} className={isSlideProductFavorite ? 'heart-filled' : ''} />
                    </button>
                  </div>

                  <div className="showcase-meta">
                    <div className="showcase-category">{slideProduct.category}</div>
                    <h4 className="showcase-title">
                      <Link to={`/products/${slideProduct.id}`}>{slideProduct.name}</Link>
                    </h4>

                    <div className="showcase-price-row">
                      <div className="showcase-price-wrap">
                        <span className="showcase-price">{formatCurrency(slideProduct.price)}</span>
                        <span className="showcase-stock-note">
                          {slideProduct.stock <= 5 ? `Only ${slideProduct.stock} left` : 'In Stock'}
                        </span>
                      </div>

                      <div className="showcase-actions-group">
                        <button
                          type="button"
                          className="btn btn-primary btn-sm showcase-quick-add"
                          onClick={handleQuickAddSlideProduct}
                          disabled={slideProduct.stock <= 0}
                        >
                          <ShoppingCart size={14} />
                          <span>{slideInCartQty > 0 ? `In Bag (${slideInCartQty})` : 'Quick Add'}</span>
                        </button>
                        <Link
                          to={`/products/${slideProduct.id}`}
                          className="btn btn-secondary btn-sm showcase-details-btn"
                        >
                          <span>Details</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Category Jump Bar */}
          <div className="hero-quick-categories">
            <span className="quick-cat-label">Explore by Department:</span>
            <div className="quick-cat-list">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`quick-cat-chip ${selectedCategory === cat && !isViewingWishlist ? 'active' : ''}`}
                  onClick={() => handleHeroCategoryJump(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Highlights Strip */}
      <section className="container trust-strip">
        <div className="trust-grid">
          <div className="trust-item">
            <Truck size={18} className="trust-icon" />
            <div>
              <strong>Free Standard Delivery</strong>
              <p>On orders above ₹999 across India</p>
            </div>
          </div>
          <div className="trust-item">
            <ShieldCheck size={18} className="trust-icon" />
            <div>
              <strong>Authentic Guarantee</strong>
              <p>100% verified original brand products</p>
            </div>
          </div>
          <div className="trust-item">
            <RefreshCw size={18} className="trust-icon" />
            <div>
              <strong>Hassle-Free Returns</strong>
              <p>30-day inspection and return policy</p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Catalog Section */}
      <section className="container catalog-section" ref={catalogRef}>
        {/* Wishlist Active Notification */}
        {isViewingWishlist && (
          <div className="wishlist-banner">
            <div className="wishlist-banner-content">
              <Heart size={16} className="wishlist-banner-icon" />
              <span>Viewing your saved wishlist items ({filteredProducts.length})</span>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={handleClearFilters}>
              View All Products
            </button>
          </div>
        )}

        {/* Controls Bar: Search, Filter, Sort */}
        <div className="catalog-controls">
          <div className="controls-top-row">
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <div className="controls-right-group">
              <label className="instock-checkbox-label">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                />
                <span>In stock only</span>
              </label>
              <SortDropdown sortBy={sortBy} onSortChange={setSortBy} />
            </div>
          </div>

          {!isViewingWishlist && (
            <div className="controls-bottom-row">
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={handleCategorySelect}
                categoryCounts={categoryCounts}
              />
            </div>
          )}
        </div>

        {/* Results Meta */}
        <div className="catalog-meta">
          <span className="results-count">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
            {selectedCategory !== 'All' && !isViewingWishlist && ` in ${selectedCategory}`}
          </span>

          {hasActiveFilters && (
            <button className="btn btn-outline btn-sm clear-filters-btn" onClick={handleClearFilters}>
              <RotateCcw size={13} />
              <span>Reset filters</span>
            </button>
          )}
        </div>

        {/* Catalog Body States */}
        {filteredProducts.length > 0 ? (
          <ProductGrid products={filteredProducts} />
        ) : (
          <EmptyState
            type="no-results"
            title={isViewingWishlist ? "No saved items in your wishlist" : "No matching products found"}
            message={
              isViewingWishlist
                ? "Click the heart icon on any product to save it to your wishlist for later."
                : `We couldn't find any products matching "${searchTerm || selectedCategory}". Try checking for typos or resetting your filters.`
            }
            actionLabel={isViewingWishlist ? "Explore Catalog" : "Reset filters"}
            onAction={handleClearFilters}
          />
        )}
      </section>
    </div>
  );
};
