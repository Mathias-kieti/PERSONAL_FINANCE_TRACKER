const express = require('express');
const { body } = require('express-validator');
const {
  createBill,
  getBills,
  getBill,
  updateBill,
  deleteBill,
  getUpcomingBills,
  getOverdueBills,
  markBillAsPaid,
  getBillStats
} = require('../Controllers/billController');
const { authenticateToken } = require('../Middleware/auth');

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Validation rules
const billValidation = [
  body('name')
    .notEmpty()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Bill name must be between 2 and 100 characters'),
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0'),
  body('category')
    .notEmpty()
    .isIn([
      'utilities', 'housing', 'transportation', 'insurance', 
      'subscription', 'loan', 'credit_card', 'healthcare', 
      'education', 'internet', 'phone', 'other'
    ])
    .withMessage('Valid category is required'),
  body('dueDate')
    .isISO8601()
    .withMessage('Valid due date is required'),
  body('frequency')
    .isIn(['weekly', 'bi-weekly', 'monthly', 'quarterly', 'semi-annually', 'yearly'])
    .withMessage('Valid frequency is required'),
  body('reminderDays')
    .optional()
    .isInt({ min: 0, max: 30 })
    .withMessage('Reminder days must be between 0 and 30')
];

// Routes
router.get('/stats', getBillStats);
router.get('/upcoming', getUpcomingBills);
router.get('/overdue', getOverdueBills);
router.get('/', getBills);
router.get('/:id', getBill);
router.post('/', billValidation, createBill);
router.put('/:id', billValidation, updateBill);
router.patch('/:id/paid', markBillAsPaid);
router.delete('/:id', deleteBill);

module.exports = router;