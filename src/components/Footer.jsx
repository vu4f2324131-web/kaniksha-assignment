import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import './Footer.css';

const CURRENT_YEAR = new Date().getFullYear();

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-main">
        <div className="footer-col brand-col">
          <div className="footer-logo">
            <ShoppingBag size={18} />
            <span>ShopEase</span>
          </div>
          <p className="footer-desc">
            Carefully curated everyday essentials across electronics, apparel, home, and personal care.
          </p>
        </div>

        <div className="footer-col">
          <h5 className="footer-heading">Catalog</h5>
          <ul className="footer-links">
            <li><Link to="/">All Products</Link></li>
            <li><Link to="/cart">Shopping Bag</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h5 className="footer-heading">Categories</h5>
          <ul className="footer-links">
            <li><Link to="/?category=Electronics">Electronics</Link></li>
            <li><Link to="/?category=Fashion">Fashion</Link></li>
            <li><Link to="/?category=Home%20%26%20Living">Home & Living</Link></li>
            <li><Link to="/?category=Accessories">Accessories</Link></li>
            <li><Link to="/?category=Beauty">Beauty</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h5 className="footer-heading">Customer Care</h5>
          <ul className="footer-links">
            <li><span className="footer-text-link">Shipping & Delivery</span></li>
            <li><span className="footer-text-link">Returns & Refunds</span></li>
            <li><span className="footer-text-link">Track Order</span></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container bottom-content">
          <p>© {CURRENT_YEAR} ShopEase. All rights reserved.</p>
          <div className="footer-bottom-links">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
