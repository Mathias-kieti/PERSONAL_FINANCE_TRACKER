const { validationResult } = require('express-validator');

/**
 * Middleware to handle validation errors from express-validator
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path || error.param,
        message: error.msg,
        value: error.value
      }))
    });
  }
  
  next();
};

/**
 * Middleware to sanitize user input
 */
const sanitizeInput = (req, res, next) => {
  // Remove potentially dangerous characters from all string inputs
  const sanitize = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === 'string') {
        // Remove script tags and other potentially dangerous HTML
        obj[key] = obj[key]
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
          .trim();
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitize(obj[key]);
      }
    }
  };

  if (req.body) sanitize(req.body);
  if (req.query) sanitize(req.query);
  if (req.params) sanitize(req.params);

  next();
};

/**
 * Middleware to validate MongoDB ObjectId
 */
const validateObjectId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];
    
    // MongoDB ObjectId regex pattern
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;
    
    if (!objectIdPattern.test(id)) {
      return res.status(400).json({
        message: `Invalid ${paramName} format`,
        error: 'INVALID_OBJECT_ID'
      });
    }
    
    next();
  };
};

/**
 * Middleware to validate date range
 */
const validateDateRange = (req, res, next) => {
  const { startDate, endDate } = req.query;
  
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Check if dates are valid
    if (isNaN(start.getTime())) {
      return res.status(400).json({
        message: 'Invalid start date format',
        error: 'INVALID_START_DATE'
      });
    }
    
    if (isNaN(end.getTime())) {
      return res.status(400).json({
        message: 'Invalid end date format',
        error: 'INVALID_END_DATE'
      });
    }
    
    // Check if start date is before end date
    if (start > end) {
      return res.status(400).json({
        message: 'Start date must be before end date',
        error: 'INVALID_DATE_RANGE'
      });
    }
  }
  
  next();
};

/**
 * Middleware to validate pagination parameters
 */
const validatePagination = (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  
  // Validate page
  if (page < 1) {
    return res.status(400).json({
      message: 'Page number must be greater than 0',
      error: 'INVALID_PAGE'
    });
  }
  
  // Validate limit
  if (limit < 1 || limit > 100) {
    return res.status(400).json({
      message: 'Limit must be between 1 and 100',
      error: 'INVALID_LIMIT'
    });
  }
  
  // Add validated values to request
  req.pagination = {
    page,
    limit,
    skip: (page - 1) * limit
  };
  
  next();
};

/**
 * Middleware to validate file uploads
 */
const validateFileUpload = (allowedTypes = [], maxSize = 5 * 1024 * 1024) => {
  return (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({
        message: 'No file uploaded',
        error: 'NO_FILE'
      });
    }
    
    // Check file type
    if (allowedTypes.length > 0 && !allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        message: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
        error: 'INVALID_FILE_TYPE'
      });
    }
    
    // Check file size
    if (req.file.size > maxSize) {
      return res.status(400).json({
        message: `File size exceeds maximum limit of ${maxSize / 1024 / 1024}MB`,
        error: 'FILE_TOO_LARGE'
      });
    }
    
    next();
  };
};

/**
 * Middleware to validate amount (positive number)
 */
const validateAmount = (fieldName = 'amount') => {
  return (req, res, next) => {
    const amount = req.body[fieldName];
    
    if (amount === undefined || amount === null) {
      return res.status(400).json({
        message: `${fieldName} is required`,
        error: 'AMOUNT_REQUIRED'
      });
    }
    
    const numAmount = parseFloat(amount);
    
    if (isNaN(numAmount)) {
      return res.status(400).json({
        message: `${fieldName} must be a valid number`,
        error: 'INVALID_AMOUNT'
      });
    }
    
    if (numAmount <= 0) {
      return res.status(400).json({
        message: `${fieldName} must be greater than 0`,
        error: 'AMOUNT_TOO_LOW'
      });
    }
    
    // Convert to number and round to 2 decimal places
    req.body[fieldName] = Math.round(numAmount * 100) / 100;
    
    next();
  };
};

/**
 * Middleware to validate enum values
 */
const validateEnum = (fieldName, allowedValues) => {
  return (req, res, next) => {
    const value = req.body[fieldName] || req.query[fieldName];
    
    if (value && !allowedValues.includes(value.toLowerCase())) {
      return res.status(400).json({
        message: `Invalid ${fieldName}. Allowed values: ${allowedValues.join(', ')}`,
        error: 'INVALID_ENUM_VALUE'
      });
    }
    
    // Convert to lowercase if present
    if (req.body[fieldName]) {
      req.body[fieldName] = req.body[fieldName].toLowerCase();
    }
    if (req.query[fieldName]) {
      req.query[fieldName] = req.query[fieldName].toLowerCase();
    }
    
    next();
  };
};

/**
 * Middleware to validate email format
 */
const validateEmail = (fieldName = 'email') => {
  return (req, res, next) => {
    const email = req.body[fieldName];
    
    if (!email) {
      return res.status(400).json({
        message: 'Email is required',
        error: 'EMAIL_REQUIRED'
      });
    }
    
    // Email regex pattern
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailPattern.test(email)) {
      return res.status(400).json({
        message: 'Invalid email format',
        error: 'INVALID_EMAIL'
      });
    }
    
    // Convert to lowercase
    req.body[fieldName] = email.toLowerCase().trim();
    
    next();
  };
};

/**
 * Middleware to validate password strength
 */
const validatePassword = (fieldName = 'password') => {
  return (req, res, next) => {
    const password = req.body[fieldName];
    
    if (!password) {
      return res.status(400).json({
        message: 'Password is required',
        error: 'PASSWORD_REQUIRED'
      });
    }
    
    // Password requirements
    const minLength = 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    
    const errors = [];
    
    if (password.length < minLength) {
      errors.push(`Password must be at least ${minLength} characters long`);
    }
    if (!hasUpperCase) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!hasLowerCase) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!hasNumber) {
      errors.push('Password must contain at least one number');
    }
    
    if (errors.length > 0) {
      return res.status(400).json({
        message: 'Password does not meet requirements',
        errors,
        error: 'WEAK_PASSWORD'
      });
    }
    
    next();
  };
};

/**
 * Middleware to limit request body size
 */
const limitBodySize = (maxSize = '10mb') => {
  return (req, res, next) => {
    const contentLength = req.headers['content-length'];
    
    if (contentLength) {
      const sizeMB = parseInt(contentLength) / (1024 * 1024);
      const maxSizeMB = parseInt(maxSize);
      
      if (sizeMB > maxSizeMB) {
        return res.status(413).json({
          message: `Request body too large. Maximum size is ${maxSize}`,
          error: 'BODY_TOO_LARGE'
        });
      }
    }
    
    next();
  };
};

/**
 * Middleware to validate required fields
 */
const validateRequiredFields = (fields = []) => {
  return (req, res, next) => {
    const missingFields = [];
    
    fields.forEach(field => {
      // Check if field exists in body, query, or params
      const value = req.body[field] || req.query[field] || req.params[field];
      
      if (value === undefined || value === null || value === '') {
        missingFields.push(field);
      }
    });
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        message: 'Missing required fields',
        missingFields,
        error: 'MISSING_REQUIRED_FIELDS'
      });
    }
    
    next();
  };
};

module.exports = {
  handleValidationErrors,
  sanitizeInput,
  validateObjectId,
  validateDateRange,
  validatePagination,
  validateFileUpload,
  validateAmount,
  validateEnum,
  validateEmail,
  validatePassword,
  limitBodySize,
  validateRequiredFields
};