import React from 'react';
import { ArrowUpCircle, ArrowDownCircle, Trash2 } from 'lucide-react';

const TransactionItem = ({ transaction, onDelete }) => {
  const isIncome = transaction.type === 'income';

  return (
    <div className="flex justify-between items-center bg-white shadow rounded-lg p-3">
      <div className="flex items-center gap-3">
        {isIncome ? (
          <ArrowUpCircle className="text-green-600" size={24} />
        ) : (
          <ArrowDownCircle className="text-red-600" size={24} />
        )}
        <div>
          <p className="font-medium text-gray-800">{transaction.category}</p>
          <p className="text-sm text-gray-500">{transaction.date}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <p
          className={`font-semibold ${
            isIncome ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {isIncome ? '+' : '-'}${transaction.amount}
        </p>
        <button
          onClick={() => onDelete(transaction._id)}
          className="text-gray-400 hover:text-red-600 transition-colors"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default TransactionItem;
