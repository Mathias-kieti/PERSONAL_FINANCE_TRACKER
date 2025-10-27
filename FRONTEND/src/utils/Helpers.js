/**
 * Generate a random ID
 */
export const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

/**
 * Sort an array of objects by key
 */
export const sortByKey = (array, key, ascending = true) => {
  return array.sort((a, b) => {
    if (a[key] < b[key]) return ascending ? -1 : 1;
    if (a[key] > b[key]) return ascending ? 1 : -1;
    return 0;
  });
};

/**
 * Format number as currency
 */
export const formatCurrency = (amount, currency = 'KES') => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency,
  }).format(amount);
};

/**
 * Check if a date is in the future
 */
export const isFutureDate = (date) => {
  return new Date(date) > new Date();
};
