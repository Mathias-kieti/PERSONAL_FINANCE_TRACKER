import React, { useState } from 'react';

const BudgetForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
  });

  // Valid categories from your backend
  const validCategories = [
    'food', 'transportation', 'utilities', 'entertainment', 
    'healthcare', 'shopping', 'education', 'travel', 'housing',
    'insurance', 'debt', 'personal_care', 'gifts', 'charity', 'other'
  ];

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.category || !formData.amount) return;
    
    // Send data with spent: 0 for frontend display
    onSubmit({ 
      ...formData, 
      amount: parseFloat(formData.amount), 
      spent: 0 
    });
    
    setFormData({ category: '', amount: '' });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-lg shadow space-y-3"
    >
      {/* Category Dropdown */}
      <select
        name="category"
        value={formData.category}
        onChange={handleChange}
        className="w-full border rounded-lg px-3 py-2 text-sm"
        required
      >
        <option value="">Select Category</option>
        {validCategories.map((category) => (
          <option key={category} value={category}>
            {category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')}
          </option>
        ))}
      </select>

      <input
        type="number"
        name="amount"
        value={formData.amount}
        onChange={handleChange}
        placeholder="Budget Amount"
        className="w-full border rounded-lg px-3 py-2 text-sm"
        required
        min="0.01"
        step="0.01"
      />
      
      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
      >
        Add Budget
      </button>
    </form>
  );
};

export default BudgetForm;