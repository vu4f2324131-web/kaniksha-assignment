import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productService } from '../data/productService';
import { useCart } from '../hooks/useCart';
import { formatCurrency } from '../utils/formatCurrency';
import { RatingStars } from '../components/RatingStars';
import { QuantitySelector } from '../components/QuantitySelector';
import { ProductCard } from '../components/ProductCard';
import { EmptyState } from '../components/EmptyState';
import {
  ImageOff,
  ShieldCheck,
  Truck,
  RefreshCw,
  ChevronRight,
  Heart,
  ChevronDown
} from 'lucide-react';
import './ProductDetails.css';

export const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems, toggleWishlist, isWishlisted } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [imgError, setImgError] = useState(false);
  const [prevId, setPrevId] = useState(id);

  // Accordion state
  const [openAccordion, setOpenAccordion] = useState('shipping');

  const toggleAccordion = (section) => {
    setOpenAccordion((prev) => (prev === section ? null : section));
  };

  // Directly retrieve product synchronously
  const product = useMemo(() => productService.getProductById(id), [id]);
  const relatedProducts = useMemo(
    () => (product ? productService.getRelatedProducts(product.category, product.id, 4) : []),
    [product]
  );

  // Reset state during render if route id changes
  if (prevId !== id) {
    setPrevId(id);
    setQuantity(1);
    setImgError(false);
  }

  // Scroll window to top whenever route id changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (!product) {
    return (
      <div className="container" style={{ padding: '3rem 0' }}>
        <EmptyState
          type="not-found"
          title="Product Not Found"
          message="The product you are looking for doesn't exist or has been removed from our catalog."
          actionLabel="Return to Catalog"
          onAction={() => navigate('/')}
        />
      </div>
    );
  }

  const { name, description, price, category, rating, image, stock } = product;

  // Cart & stock calculations
  const cartItem = cartItems.find((item) => String(item.id) === String(id));
  const currentInCart = cartItem ? cartItem.quantity : 0;
  const isOutOfStock = stock <= 0;
  const remainingStockForCart = Math.max(0, stock - currentInCart);
  const isMaxStockInCart = remainingStockForCart <= 0;
  const isLowStock = stock > 0 && stock <= 3;
  const isFavorite = isWishlisted(id);

  const handleAddToCart = () => {
    if (isOutOfStock || isMaxStockInCart) return;
    const added = addToCart(id, quantity);
    if (added) {
      setQuantity(1);
    }
  };

  return (
    <div className="container product-details-page">
      {/* Breadcrumbs */}
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/" className="breadcrumb-link">Catalog</Link>
        <ChevronRight size={14} className="breadcrumb-separator" />
        <Link to={`/?category=${encodeURIComponent(category)}`} className="breadcrumb-link">
          {category}
        </Link>
        <ChevronRight size={14} className="breadcrumb-separator" />
        <span className="breadcrumb-current" aria-current="page">{name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="product-details-grid">
        {/* Left Column: Image Showcase */}
        <div className="details-image-section">
          <div className="details-image-container">
            {!imgError && image ? (
              <img
                src={image}
                alt={name}
                className="details-image"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="details-image-fallback">
                <ImageOff size={40} />
                <span>Image unavailable</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Editorial Product Information */}
        <div className="details-info-section">
          <div className="details-category-label">{category}</div>
          <h1 className="details-title">{name}</h1>

          <div className="details-rating-row">
            <RatingStars rating={rating} />
            <span className="rating-text">{rating} / 5.0 (Customer Verified)</span>
          </div>

          <div className="details-price-row">
            <span className="details-price">{formatCurrency(price)}</span>
            <span className="details-tax-note">Inclusive of all taxes</span>
            <span className={`stock-pill ${isOutOfStock ? 'out-of-stock' : 'in-stock'}`}>
              {isOutOfStock ? 'Sold Out' : isLowStock ? `Only ${stock} remaining` : 'In Stock'}
            </span>
          </div>

          <p className="details-description">{description}</p>

          <div className="details-divider" />

          {/* Quantity & Actions */}
          <div className="details-purchase-row">
            <div className="quantity-wrapper">
              <label className="field-label">Quantity</label>
              <QuantitySelector
                quantity={isMaxStockInCart ? 0 : quantity}
                stock={Math.max(1, remainingStockForCart)}
                onIncrease={() => setQuantity((q) => Math.min(q + 1, remainingStockForCart))}
                onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
                onChange={(val) => setQuantity(Math.min(val, remainingStockForCart))}
                disabled={isOutOfStock || isMaxStockInCart}
                size="large"
              />
            </div>

            <button
              type="button"
              className="btn btn-primary btn-lg add-to-bag-btn"
              onClick={handleAddToCart}
              disabled={isOutOfStock || isMaxStockInCart}
            >
              {isOutOfStock
                ? 'Sold Out'
                : isMaxStockInCart
                ? 'All Available Stock in Bag'
                : `Add to Bag • ${formatCurrency(price * quantity)}`}
            </button>

            <button
              type="button"
              className={`details-wishlist-btn ${isFavorite ? 'active' : ''}`}
              onClick={() => toggleWishlist(id)}
              title={isFavorite ? 'Saved in wishlist' : 'Save to wishlist'}
              aria-label={isFavorite ? 'Remove from wishlist' : 'Save to wishlist'}
            >
              <Heart size={18} className={isFavorite ? 'heart-filled' : ''} />
            </button>
          </div>

          {currentInCart > 0 && (
            <div className="in-cart-note">
              <span>{currentInCart} unit(s) currently in your bag.</span>
              <Link to="/cart" className="view-bag-link">
                View Bag & Checkout →
              </Link>
            </div>
          )}

          {/* Product Specifications & Retail Accordions */}
          <div className="product-accordions">
            {/* Accordion 1: Shipping */}
            <div className="accordion-item">
              <button
                type="button"
                className="accordion-trigger"
                onClick={() => toggleAccordion('shipping')}
                aria-expanded={openAccordion === 'shipping'}
              >
                <div className="accordion-title-wrap">
                  <Truck size={16} />
                  <span>Shipping & Delivery</span>
                </div>
                <ChevronDown size={16} className={`accordion-chevron ${openAccordion === 'shipping' ? 'open' : ''}`} />
              </button>
              {openAccordion === 'shipping' && (
                <div className="accordion-content fade-in">
                  <p>
                    Free standard delivery on orders above ₹999. In-stock orders placed before 2:00 PM IST dispatch the same business day with tracking. Expected arrival is 2–4 business days.
                  </p>
                </div>
              )}
            </div>

            {/* Accordion 2: Details & Specs */}
            <div className="accordion-item">
              <button
                type="button"
                className="accordion-trigger"
                onClick={() => toggleAccordion('details')}
                aria-expanded={openAccordion === 'details'}
              >
                <div className="accordion-title-wrap">
                  <ShieldCheck size={16} />
                  <span>Authenticity & Quality Guarantee</span>
                </div>
                <ChevronDown size={16} className={`accordion-chevron ${openAccordion === 'details' ? 'open' : ''}`} />
              </button>
              {openAccordion === 'details' && (
                <div className="accordion-content fade-in">
                  <p>
                    100% genuine guaranteed. Sourced directly from certified brand distributors. Includes full manufacturer warranty where applicable. SKU: <code>{id}</code>.
                  </p>
                </div>
              )}
            </div>

            {/* Accordion 3: Returns */}
            <div className="accordion-item">
              <button
                type="button"
                className="accordion-trigger"
                onClick={() => toggleAccordion('returns')}
                aria-expanded={openAccordion === 'returns'}
              >
                <div className="accordion-title-wrap">
                  <RefreshCw size={16} />
                  <span>30-Day Hassle-Free Returns</span>
                </div>
                <ChevronDown size={16} className={`accordion-chevron ${openAccordion === 'returns' ? 'open' : ''}`} />
              </button>
              {openAccordion === 'returns' && (
                <div className="accordion-content fade-in">
                  <p>
                    If you are not completely satisfied with your purchase, return it in original condition and packaging within 30 days of delivery for a full refund or exchange.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="related-products-section">
          <div className="related-header">
            <h2 className="related-title">You might also like</h2>
            <Link to={`/?category=${encodeURIComponent(category)}`} className="see-all-link">
              View all {category} →
            </Link>
          </div>
          <div className="related-grid">
            {relatedProducts.map((relProduct) => (
              <ProductCard key={relProduct.id} product={relProduct} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
