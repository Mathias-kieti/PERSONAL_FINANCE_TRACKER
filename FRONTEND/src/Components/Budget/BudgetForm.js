import React, { useState } from 'react';

const BudgetForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.category || !formData.amount) return;
    onSubmit({ ...formData, amount: parseFloat(formData.amount), spent: 0 });
    setFormData({ category: '', amount: '' });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-lg shadow space-y-3"
    >
      <input
        type="text"
        name="category"
        value={formData.category}
        onChange={handleChange}
        placeholder="Budget Category"
        className="w-full border rounded-lg px-3 py-2 text-sm"
      />
      <input
        type="number"
        name="amount"
        value={formData.amount}
        onChange={handleChange}
        placeholder="Budget Amount"
        className="w-full border rounded-lg px-3 py-2 text-sm"
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
