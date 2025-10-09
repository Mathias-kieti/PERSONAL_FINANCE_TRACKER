import React, { useState, useEffect } from 'react';

const TransactionForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    type: 'expense',
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    goalId: '' 
  });

  const [goals, setGoals] = useState([]); 
  const [loadingGoals, setLoadingGoals] = useState(true);
  const [error, setError] = useState('');

  // Categories arrays
  const expenseCategories = [
    'food', 'transportation', 'utilities', 'entertainment', 
    'healthcare', 'shopping', 'education', 'travel', 'housing',
    'insurance', 'debt', 'personal_care', 'gifts', 'charity', 'other'
  ];

  const incomeCategories = [
    'salary', 'freelance', 'business', 'investment', 'bonus', 
    'rental', 'dividend', 'interest', 'refund', 'other'
  ];

  const categories = formData.type === 'income' ? incomeCategories : expenseCategories;

  // Get token from localStorage
  const getToken = () => {
    return localStorage.getItem('token');
  };

  // Fetch goals for the dropdown
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        setLoadingGoals(true);
        setError('');
        const token = getToken();
        
        if (!token) {
          setError('No authentication token found');
          setLoadingGoals(false);
          return;
        }

        console.log('🔍 Fetching goals for transaction form...');
        
        const response = await fetch('http://localhost:5000/api/goal', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('📡 Goals API Response status:', response.status);

        if (response.ok) {
          const data = await response.json();
          console.log('✅ Goals API Response data:', data);
          
          // Handle different response formats safely
          let goalsArray = [];
          
          if (Array.isArray(data)) {
            goalsArray = data;
          } else if (data && typeof data === 'object') {
            if (Array.isArray(data.data)) {
              goalsArray = data.data;
            } else if (Array.isArray(data.goals)) {
              goalsArray = data.goals;
            } else {
              goalsArray = Object.values(data).filter(item => 
                item && typeof item === 'object' && item.name !== undefined
              );
            }
          }
          
          console.log(`✅ Processed ${goalsArray.length} goals:`, goalsArray);
        
          if (!Array.isArray(goalsArray)) {
            goalsArray = [];
          }
          
          setGoals(goalsArray);
          
          if (goalsArray.length === 0) {
            setError('No goals found. Please create goals first.');
          }
        } else {
          const errorText = await response.text();
          console.error('❌ Goals API Error:', errorText);
          setError(`Failed to load goals: ${response.status}`);
        }
      } catch (err) {
        console.error('❌ Network error fetching goals:', err);
        setError('Network error loading goals. Check if backend is running.');
      } finally {
        setLoadingGoals(false);
      }
    };

    fetchGoals();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.category || !formData.amount || !formData.date) {
      alert('Please fill in all fields');
      return;
    }

    // ✅ FIXED: Create base object without goalId
    const submissionData = {
      type: formData.type,
      category: formData.category,
      amount: Number(formData.amount),
      date: formData.date,
      description: formData.category
    };

    // ✅ ONLY add goalId if it has a value (not empty string)
    if (formData.goalId && formData.goalId.trim() !== '') {
      submissionData.goalId = formData.goalId;
    }

    console.log('🎯 [DEBUG] Submitting transaction with goalId:', formData.goalId || 'None', 'Full data:', submissionData);
    onSubmit(submissionData);
    
    // Reset form
    setFormData({
      type: 'expense',
      category: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      goalId: '' 
    });
  };

  const safeGoals = Array.isArray(goals) ? goals : [];

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-lg shadow space-y-3"
    >
      <div className="flex gap-3">
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-1/3 border rounded-lg px-3 py-2 text-sm"
          required
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="flex-1 border rounded-lg px-3 py-2 text-sm"
          required
        >
          <option value="">Select Category</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')}
            </option>
          ))}
        </select>
      </div>
      
      <div className="flex gap-3">
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder="Amount (required)"
          className="flex-1 border rounded-lg px-3 py-2 text-sm"
          required
          min="0.01"
          step="0.01"
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-1/2 border rounded-lg px-3 py-2 text-sm"
          required
        />
      </div>

      {/* Goal Selection Dropdown */}
      <div>
        <select
          name="goalId"
          value={formData.goalId}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 text-sm"
          disabled={loadingGoals}
        >
          <option value="">-- Allocate to Goal (Optional) --</option>
          {loadingGoals ? (
            <option value="" disabled>Loading goals...</option>
          ) : error ? (
            <option value="" disabled>Error: {error}</option>
          ) : safeGoals.length === 0 ? (
            <option value="" disabled>No goals found. Create goals first.</option>
          ) : (
            safeGoals.map(goal => (
              <option key={goal._id} value={goal._id}>
                {goal.name} - Target: KSH {goal.targetAmount?.toLocaleString()}
              </option>
            ))
          )}
        </select>
        
        {/* Debug info */}
        <div className="text-xs text-gray-400 mt-1">
          Status: {loadingGoals ? 'Loading...' : error ? `Error: ${error}` : `Found ${safeGoals.length} goals`}
        </div>
      </div>
      
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
        disabled={loadingGoals}
      >
        {loadingGoals ? 'Loading...' : 'Add Transaction'}
      </button>
    </form>
  );
};

export default TransactionForm;