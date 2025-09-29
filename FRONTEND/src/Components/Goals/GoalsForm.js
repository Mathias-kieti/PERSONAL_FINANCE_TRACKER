
import React, { useState } from 'react';

const GoalForm = ({ onAddGoal }) => {
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !target) return;

    const newGoal = {
      title,
      target: Number(target),
      saved: 0, // default saved amount is 0
    };

    onAddGoal(newGoal);
    setTitle('');
    setTarget('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow p-4 rounded-lg flex gap-4 items-end"
    >
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700">Goal Title</label>
        <input
          type="text"
          placeholder="e.g., Vacation, Car, Emergency Fund"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Target Amount</label>
        <input
          type="number"
          placeholder="e.g., 50000"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
        />
      </div>
      <button
        type="submit"
        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
      >
        Add Goal
      </button>
    </form>
  );
};

export default GoalForm;

