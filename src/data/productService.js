import productsData from './products.json';

/**
 * Service to interact with product data
 */
export const productService = {
  /**
   * Get all available products
   * @returns {Array} List of products
   */
  getAllProducts: () => {
    return productsData || [];
  },

  /**
   * Get product by unique ID
   * @param {string|number} id
   * @returns {Object|null} Found product or null
   */
  getProductById: (id) => {
    if (!id) return null;
    return productsData.find((p) => String(p.id) === String(id)) || null;
  },

  /**
   * Get list of unique product categories
   * @returns {Array<string>} Array of category names
   */
  getCategories: () => {
    const categories = new Set(productsData.map((p) => p.category));
    return Array.from(categories);
  },

  /**
   * Get related products from the same category excluding the current product
   * @param {string} category
   * @param {string|number} currentId
   * @param {number} limit - max number of products to return
   * @returns {Array} List of related products
   */
  getRelatedProducts: (category, currentId, limit = 4) => {
    if (!category) return [];
    return productsData
      .filter((p) => p.category === category && String(p.id) !== String(currentId))
      .slice(0, limit);
  }
};
