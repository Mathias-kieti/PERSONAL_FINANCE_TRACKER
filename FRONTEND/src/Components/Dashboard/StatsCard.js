import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, Target } from 'lucide-react';

const StatsCards = ({ stats }) => {
  const cards = [
    {
      title: 'Total Balance',
      value: `$${stats.balance || 0}`,
      icon: DollarSign,
      color: 'bg-blue-600',
    },
    {
      title: 'Income',
      value: `$${stats.income || 0}`,
      icon: TrendingUp,
      color: 'bg-green-600',
    },
    {
      title: 'Expenses',
      value: `$${stats.expenses || 0}`,
      icon: TrendingDown,
      color: 'bg-red-600',
    },
    {
      title: 'Goals Progress',
      value: `${stats.goals || 0}%`,
      icon: Target,
      color: 'bg-purple-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="bg-white p-4 rounded-lg shadow flex items-center gap-4"
          >
            <div className={`${card.color} p-3 rounded-full`}>
              <Icon size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{card.title}</p>
              <p className="text-lg font-semibold text-gray-900">{card.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;
