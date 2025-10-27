import React, { useState } from 'react';

const GoalsForm = ({ onAddGoal }) => {
  const [name, setName] = useState(''); 
  const [targetAmount, setTargetAmount] = useState(''); 

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !targetAmount) return;

    const newGoal = {
      name: name.trim(),              
      targetAmount: Number(targetAmount), 
      currentAmount: 0,               
      category: 'other',             
      priority: 'medium'              
    };

    onAddGoal(newGoal);
    setName('');
    setTargetAmount('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow p-4 rounded-lg flex gap-4 items-end"
    >
      
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700">Goal Name</label>
        <input
          type="text"
          placeholder="e.g., Vacation, Car, Emergency Fund"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>

      
      <div>
        <label className="block text-sm font-medium text-gray-700">Target Amount</label>
        <input
          type="number"
          placeholder="e.g., 50000"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          required
          min="1"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
      >
        Add Goal
      </button>
    </form>
  );
};

export default GoalsForm;