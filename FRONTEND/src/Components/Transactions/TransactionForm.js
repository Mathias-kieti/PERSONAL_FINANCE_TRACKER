import React, { useState } from 'react';

const TransactionForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    type: 'expense',
    category: '',
    amount: '',
    date: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.category || !formData.amount || !formData.date) return;
    onSubmit(formData);
    setFormData({ type: 'expense', category: '', amount: '', date: '' });
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
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Category"
          className="flex-1 border rounded-lg px-3 py-2 text-sm"
        />
      </div>
      <div className="flex gap-3">
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder="Amount"
          className="flex-1 border rounded-lg px-3 py-2 text-sm"
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-1/2 border rounded-lg px-3 py-2 text-sm"
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
