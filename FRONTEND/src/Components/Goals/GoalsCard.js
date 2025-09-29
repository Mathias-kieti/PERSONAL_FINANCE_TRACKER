
import React from 'react';

const GoalCard = ({ goal, onUpdate, onDelete }) => {
  const progress = Math.min((goal.saved / goal.target) * 100, 100);

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">{goal.title}</h2>
        <button
          onClick={() => onDelete(goal.id)}
          className="text-red-500 hover:text-red-700 text-sm"
        >
          Delete
        </button>
      </div>

      <p className="text-sm text-gray-600">
        Target: <span className="font-medium">KSH {goal.target}</span>
      </p>
      <p className="text-sm text-gray-600">
        Saved: <span className="font-medium">KSH {goal.saved}</span>
      </p>

      {/* Progress Bar */}
      <div className="mt-2 w-full bg-gray-200 rounded-full h-3">
        <div
          className="bg-green-500 h-3 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <p className="mt-1 text-sm text-gray-700">
        {progress.toFixed(1)}% achieved
      </p>
    </div>
  );
};

export default GoalCard;
