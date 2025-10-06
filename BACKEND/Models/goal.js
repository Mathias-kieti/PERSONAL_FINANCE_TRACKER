const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Goal name is required'],
    trim: true,
    maxLength: [100, 'Goal name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxLength: [500, 'Description cannot exceed 500 characters']
  },
  targetAmount: {
    type: Number,
    required: [true, 'Target amount is required'],
    min: [0.01, 'Target amount must be greater than 0']
  },
  currentAmount: {
    type: Number,
    default: 0,
    min: [0, 'Current amount cannot be negative']
  },
  category: {
    type: String,
    enum: ['emergency_fund', 'vacation', 'house', 'car', 'education', 'retirement', 'debt_payoff', 'investment', 'other'],
    default: 'other'
  },
  deadline: {
    type: Date
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'paused', 'cancelled'],
    default: 'active'
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringAmount: {
    type: Number,
    min: 0
  },
  recurringFrequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly']
  },
  milestones: [{
    amount: {
      type: Number,
      required: true
    },
    description: String,
    achieved: {
      type: Boolean,
      default: false
    },
    achievedDate: Date
  }],
  completedDate: Date,
  notes: {
    type: String,
    maxLength: [1000, 'Notes cannot exceed 1000 characters']
  }
}, {
  timestamps: true
});

// Virtual for progress percentage
goalSchema.virtual('progressPercentage').get(function() {
  return (this.currentAmount / this.targetAmount) * 100;
});

// Virtual for remaining amount
goalSchema.virtual('remainingAmount').get(function() {
  return this.targetAmount - this.currentAmount;
});

// Virtual for days remaining
goalSchema.virtual('daysRemaining').get(function() {
  if (!this.deadline) return null;
  const today = new Date();
  const deadline = new Date(this.deadline);
  const diffTime = deadline - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Indexes
goalSchema.index({ user: 1, status: 1 });
goalSchema.index({ user: 1, deadline: 1 });
goalSchema.index({ user: 1, priority: -1 });

// Pre-save middleware to auto-complete goal
goalSchema.pre('save', function(next) {
  if (this.currentAmount >= this.targetAmount && this.status === 'active') {
    this.status = 'completed';
    if (!this.completedDate) {
      this.completedDate = new Date();
    }
  }
  next();
});

// Static method to get user's active goals
goalSchema.statics.getActiveGoals = function(userId) {
  return this.find({ user: userId, status: 'active' })
    .sort({ priority: -1, deadline: 1 });
};

// Static method to get goal statistics
goalSchema.statics.getGoalStats = function(userId) {
  return this.aggregate([
    { $match: { user: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalTarget: { $sum: '$targetAmount' },
        totalCurrent: { $sum: '$currentAmount' }
      }
    }
  ]);
};

// Instance method to add contribution
goalSchema.methods.addContribution = function(amount) {
  this.currentAmount += amount;
  
  // Check and update milestones
  this.milestones.forEach(milestone => {
    if (!milestone.achieved && this.currentAmount >= milestone.amount) {
      milestone.achieved = true;
      milestone.achievedDate = new Date();
    }
  });
  
  return this.save();
};

module.exports = mongoose.model('Goal', goalSchema);