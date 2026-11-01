/**
 * Format numeric value to INR currency string using en-IN locale
 * @param {number} amount
 * @returns {string} Formatted INR currency string (e.g., "₹1,299")
 */
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0';
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};
