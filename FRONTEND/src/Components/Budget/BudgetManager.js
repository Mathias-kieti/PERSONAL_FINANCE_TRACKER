import React, { useState } from 'react';
import BudgetForm from './BudgetForm';
import BudgetProgress from './BudgetProgress';

const BudgetManager = () => {
  const [budgets, setBudgets] = useState([]);

  const addBudget = (newBudget) => {
    setBudgets((prev) => [...prev, { ...newBudget, _id: Date.now().toString() }]);
  };

  return (
    <div className="space-y-6">
      <BudgetForm onSubmit={addBudget} />

      <div className="space-y-3">
        {budgets.length === 0 ? (
          <p className="text-gray-500 text-center">No budgets set yet</p>
        ) : (
          budgets.map((budget) => (
            <BudgetProgress key={budget._id} budget={budget} />
          ))
        )}
      </div>
    </div>
  );
};

export default BudgetManager;
