const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');

// Placeholder routers to avoid errors if routes aren't ready yet
const transactionRoutes = express.Router();
const budgetRoutes = express.Router();
const goalRoutes = express.Router();
const billRoutes = express.Router();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- DATABASE CONNECTION ---
mongoose.connect('mongodb://127.0.0.1:27017/financeDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// --- ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/bills', billRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Finance Tracker API is running!', 
    timestamp: new Date().toISOString() 
  });
});

// --- ERROR HANDLER ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// --- 404 HANDLER ---
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 API Health: http://localhost:${PORT}/api/health`);
});
