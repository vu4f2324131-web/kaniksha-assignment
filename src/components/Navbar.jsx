import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { ShoppingBag, Heart } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import './Navbar.css';

export const Navbar = () => {
  const { totalItems, wishlistCount } = useCart();

  return (
    <>
      {/* Discreet Announcement Bar */}
      <div className="announcement-bar">
        <div className="container announcement-content">
          <span>Complimentary shipping on orders above ₹999 &nbsp;•&nbsp; Code <strong>SAVE10</strong> for 10% off</span>
        </div>
      </div>

      <header className="navbar-header">
        <div className="container navbar-container">
          {/* Brand Logo */}
          <Link to="/" className="brand-logo" aria-label="ShopEase Home">
            <ShoppingBag size={20} className="brand-icon" />
            <span className="brand-title">ShopEase</span>
          </Link>

          {/* Navigation Links */}
          <nav className="nav-links">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Catalog
            </NavLink>

            <Link
              to="/?wishlist=true"
              className="nav-link wishlist-link"
              title="Saved Items"
              aria-label={`Wishlist with ${wishlistCount} items`}
            >
              <Heart size={17} className={wishlistCount > 0 ? 'wishlist-active-icon' : ''} />
              <span className="nav-label-text">Saved</span>
              {wishlistCount > 0 && (
                <span className="wishlist-badge">{wishlistCount}</span>
              )}
            </Link>

            <NavLink
              to="/cart"
              className={({ isActive }) => `nav-link cart-nav-link ${isActive ? 'active' : ''}`}
              aria-label={`Shopping bag with ${totalItems} items`}
            >
              <span>Bag</span>
              {totalItems > 0 && (
                <span className="cart-count-pill">{totalItems}</span>
              )}
            </NavLink>
          </nav>
        </div>
      </header>
    </>
  );
};
