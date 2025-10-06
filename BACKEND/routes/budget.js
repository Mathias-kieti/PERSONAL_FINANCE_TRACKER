const express = require('express');
const { body } = require('express-validator');
const {
  createBudget,
  getBudgets,
  getBudgetsWithSpending,
  getBudget,
  updateBudget,
  deleteBudget,
  getBudgetSummary
} = require('../Controllers/budgetController');
const { authenticateToken } = require('../Middleware/auth');

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Validation rules
const budgetValidation = [
  body('category')
    .notEmpty()
    .isIn([
      'food', 'transportation', 'utilities', 'entertainment', 
      'healthcare', 'shopping', 'education', 'travel', 'housing',
      'insurance', 'debt', 'personal_care', 'gifts', 'charity', 'other'
    ])
    .withMessage('Valid category is required'),
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0'),
  body('period')
    .isIn(['weekly', 'monthly', 'quarterly', 'yearly'])
    .withMessage('Period must be weekly, monthly, quarterly, or yearly'),
  body('alertThresholds.warning')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Warning threshold must be between 0 and 100'),
  body('alertThresholds.danger')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Danger threshold must be between 0 and 100')
];

// Routes
router.get('/summary', getBudgetSummary);
router.get('/with-spending', getBudgetsWithSpending);
router.get('/', getBudgets);
router.get('/:id', getBudget);
router.post('/', budgetValidation, createBudget);
router.put('/:id', budgetValidation, updateBudget);
router.delete('/:id', deleteBudget);

module.exports = router;