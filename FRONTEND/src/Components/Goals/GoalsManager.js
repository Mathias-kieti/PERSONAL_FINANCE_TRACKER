
import React, { useState } from 'react';
import GoalsForm from './GoalsForm';
import GoalsCard from './GoalsCard';

const GoalsManager = () => {
  const [goals, setGoals] = useState([
    // Example mock data
    { id: 1, title: 'Buy a Car', target: 500000, saved: 150000 },
    { id: 2, title: 'Emergency Fund', target: 200000, saved: 50000 },
  ]);

  const addGoal = (goal) => {
    setGoals([...goals, { ...goal, id: Date.now() }]);
  };

  const updateGoal = (id, updatedGoal) => {
    setGoals(goals.map((goal) => (goal.id === id ? updatedGoal : goal)));
  };

  const deleteGoal = (id) => {
    setGoals(goals.filter((goal) => goal.id !== id));
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">My Goals</h1>

      {/* Add Goal Form */}
      <GoalForm onAddGoal={addGoal} />

      {/* Goal List */}
      <div className="mt-6 grid gap-4">
        {goals.length > 0 ? (
          goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onUpdate={updateGoal}
              onDelete={deleteGoal}
            />
          ))
        ) : (
          <p className="text-gray-600">No goals yet. Start by adding one above.</p>
        )}
      </div>
    </div>
  );
};

export default GoalsManager;

