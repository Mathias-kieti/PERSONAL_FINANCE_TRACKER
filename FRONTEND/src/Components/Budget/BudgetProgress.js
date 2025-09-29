import React from 'react';

const BudgetProgress = ({ budget }) => {
  const percentage = (budget.spent / budget.amount) * 100;
  const statusColor =
    percentage >= 100
      ? 'bg-red-500'
      : percentage >= 80
      ? 'bg-yellow-500'
      : 'bg-green-500';

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium text-gray-800 capitalize">
          {budget.category}
        </span>
        <span className="text-sm text-gray-600">
          ${budget.spent.toFixed(2)} / ${budget.amount.toFixed(2)}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${statusColor}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 mt-1">
        {percentage.toFixed(1)}% used
      </p>
    </div>
  );
};

export default BudgetProgress;
