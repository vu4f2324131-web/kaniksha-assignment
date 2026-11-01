import React from 'react';
import { ProductCard } from './ProductCard';
import './ProductGrid.css';

export const ProductGrid = ({ products = [] }) => {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
