import React, { useState } from 'react';
import TransactionItem from './TransactionItem';
import TransactionForm from './TransactionForm';

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);

  const addTransaction = (newTx) => {
    setTransactions((prev) => [
      ...prev,
      { ...newTx, _id: Date.now().toString() }, // temp id
    ]);
  };

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((tx) => tx._id !== id));
  };

  return (
    <div className="space-y-6">
      <TransactionForm onSubmit={addTransaction} />

      <div className="space-y-3">
        {transactions.length === 0 ? (
          <p className="text-gray-500 text-center">No transactions yet</p>
        ) : (
          transactions.map((tx) => (
            <TransactionItem
              key={tx._id}
              transaction={tx}
              onDelete={deleteTransaction}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TransactionList;
