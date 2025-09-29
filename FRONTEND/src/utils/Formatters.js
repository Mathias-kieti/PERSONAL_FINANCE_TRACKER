// src/utils/formatters.js

import { format } from 'date-fns';

/**
 * Format date to readable string
 */
export const formatDate = (dateStr, pattern = 'dd MMM yyyy') => {
  if (!dateStr) return '';
  return format(new Date(dateStr), pattern);
};

/**
 * Calculate percentage progress
 */
export const calcProgress = (current, target) => {
  if (!target || target === 0) return 0;
  return Math.min(Math.round((current / target) * 100), 100);
};

/**
 * Format string to Title Case
 */
export const toTitleCase = (str) => {
  if (!str) return '';
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};
