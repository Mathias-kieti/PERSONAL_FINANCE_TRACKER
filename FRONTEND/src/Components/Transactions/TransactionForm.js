import React, { useState } from 'react';

const TransactionForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    type: 'expense',
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
  });

  // Allowed categories from your schema
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

    const submissionData = {
      ...formData,
      amount: Number(formData.amount),
      description: formData.category
    };

    console.log('Submitting transaction:', submissionData);
    onSubmit(submissionData);
    
    // Reset form but keep type and date
    setFormData({
      type: 'expense',
      category: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
    });
  };

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
      
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Add Transaction
      </button>
    </form>
  );
};

export default TransactionForm;