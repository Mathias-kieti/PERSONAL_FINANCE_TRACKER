import React, { useState, useEffect } from 'react';
import TransactionForm from './TransactionForm';
import TransactionItem from './TransactionItem';

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);

  // Get token from localStorage
  const getToken = () => {
    return localStorage.getItem('token');
  };

  // Fetch transactions from backend
  const fetchTransactions = async () => {
    try {
      const token = getToken();
      const response = await fetch('http://localhost:5000/api/transaction', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('🔍 DEBUG - Fetch response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('🔍 DEBUG - Full backend response:', result);
        
        // ✅ Extract transactions from the nested response
        const transactionsArray = result.data.transactions || [];
        console.log('🔍 DEBUG - Transactions array:', transactionsArray);
        
        setTransactions(transactionsArray);
      } else {
        console.error('Failed to fetch transactions, status:', response.status);
        setTransactions([]);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setTransactions([]);
    }
  };

  // Add transaction to backend
  const addTransaction = async (transactionData) => {
    try {
      const token = getToken();
      
      if (!token) {
        console.error('❌ No token found - user not authenticated');
        alert('Please log in first');
        return;
      }

      // Format the data for backend
      const backendData = {
        type: transactionData.type,
        category: transactionData.category,
        amount: Number(transactionData.amount),
        date: transactionData.date,
        description: transactionData.category
      };

      console.log('🔍 DEBUG - Sending transaction:', backendData);

      const response = await fetch('http://localhost:5000/api/transaction', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(backendData),
      });

      console.log('🔍 DEBUG - POST response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('🔍 DEBUG - Full backend response:', result);
        
        // ✅ Extract transaction from the nested response
        const newTransaction = result.data.transaction;
        console.log('✅ Transaction saved successfully:', newTransaction);
        
        setTransactions(prev => [...prev, newTransaction]);
        alert('Transaction saved successfully!');
      } else {
        const errorText = await response.text();
        console.error('❌ Backend error response:', errorText);
        
        let errorMessage = 'Failed to save transaction';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          errorMessage = errorText || errorMessage;
        }
        
        console.error('❌ Failed to add transaction:', errorMessage);
        alert('Error: ' + errorMessage);
      }
    } catch (error) {
      console.error('❌ Network error adding transaction:', error);
      alert('Network error: ' + error.message);
    }
  };

  // Delete transaction from backend
  const deleteTransaction = async (id) => {
    try {
      const token = getToken();
      
      const response = await fetch(`http://localhost:5000/api/transaction/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setTransactions(prev => prev.filter(tx => tx._id !== id));
        console.log('✅ Transaction deleted successfully');
      } else {
        console.error('❌ Failed to delete transaction');
      }
    } catch (error) {
      console.error('❌ Error deleting transaction:', error);
    }
  };

  // Fetch transactions on component mount
  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Transactions</h1>
      
      <TransactionForm onSubmit={addTransaction} />

      <div className="space-y-3">
        {!transactions || transactions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No transactions yet</p>
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