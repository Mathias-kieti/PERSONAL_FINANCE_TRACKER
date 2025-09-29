const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: 'Access token required', error: 'NO_TOKEN' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123'); // default secret
    const user = await User.findById(decoded.userId).select('-password');

    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Invalid or expired token', error: 'INVALID_TOKEN' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    if (error.name === 'JsonWebTokenError') return res.status(401).json({ message: 'Invalid token format', error: 'MALFORMED_TOKEN' });
    if (error.name === 'TokenExpiredError') return res.status(401).json({ message: 'Token has expired', error: 'EXPIRED_TOKEN' });
    res.status(500).json({ message: 'Authentication server error', error: 'AUTH_SERVER_ERROR' });
  }
};

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'secret123', { expiresIn: '7d' });
};

module.exports = {
  authenticateToken,
  generateToken
};
