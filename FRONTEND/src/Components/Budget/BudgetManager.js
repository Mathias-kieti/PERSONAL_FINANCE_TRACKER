import React, { useState, useEffect } from 'react';
import BudgetForm from './BudgetForm';
import BudgetProgress from './BudgetProgress';

const BudgetManager = () => {
  const [budgets, setBudgets] = useState([]);

  // Get token from localStorage
  const getToken = () => {
    return localStorage.getItem('token');
  };

  // Fetch budgets from backend WITH spending data
  const fetchBudgets = async () => {
    try {
      const token = getToken();
      
      // ✅ Use the endpoint that includes spending data
      const response = await fetch('http://localhost:5000/api/budget/with-spending', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('🔍 DEBUG - Fetch budgets response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('🔍 DEBUG - Full backend response:', result);
        
        // Extract budgets from nested response
        const budgetsArray = result.data?.budgets || [];
        console.log('🔍 DEBUG - Budgets with spending:', budgetsArray);
        
        setBudgets(budgetsArray);
      } else {
        console.error('Failed to fetch budgets, status:', response.status);
        setBudgets([]);
      }
    } catch (error) {
      console.error('Error fetching budgets:', error);
      setBudgets([]);
    }
  };

  // Add budget to backend
  const addBudget = async (budgetData) => {
    try {
      const token = getToken();
      
      if (!token) {
        console.error('❌ No token found - user not authenticated');
        alert('Please log in first');
        return;
      }

      // ✅ FIXED: Format data to match backend requirements
      const backendData = {
        category: budgetData.category.toLowerCase(), // Backend expects lowercase
        amount: Number(budgetData.amount),
        period: 'monthly', // Required field - default to monthly
        startDate: new Date().toISOString(), // Required field
        // endDate will be auto-calculated by backend
        alertThresholds: {
          warning: 80, // Default values
          danger: 95
        },
        isActive: true,
        autoRenew: true
      };

      console.log('🔍 DEBUG - Sending budget:', backendData);

      const response = await fetch('http://localhost:5000/api/budget', {
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
        
        // Extract budget from nested response
        const newBudget = result.data?.budget;
        console.log('✅ Budget saved successfully:', newBudget);
        
        // Refresh the budgets list to get the new budget with spending data
        fetchBudgets();
        alert('Budget saved successfully!');
      } else {
        const errorText = await response.text();
        console.error('❌ Backend error response:', errorText);
        
        let errorMessage = 'Failed to save budget';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
          
          // Show validation errors if any
          if (errorData.errors) {
            errorMessage += '\n' + errorData.errors.map(err => err.msg).join('\n');
          }
        } catch (e) {
          errorMessage = errorText || errorMessage;
        }
        
        console.error('❌ Failed to add budget:', errorMessage);
        alert('Error: ' + errorMessage);
      }
    } catch (error) {
      console.error('❌ Network error adding budget:', error);
      alert('Network error: ' + error.message);
    }
  };

  // Delete budget from backend
  const deleteBudget = async (id) => {
    try {
      const token = getToken();
      
      const response = await fetch(`http://localhost:5000/api/budget/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setBudgets(prev => prev.filter(budget => budget._id !== id));
        console.log('✅ Budget deleted successfully');
      } else {
        console.error('❌ Failed to delete budget');
      }
    } catch (error) {
      console.error('❌ Error deleting budget:', error);
    }
  };

  // Fetch budgets on component mount
  useEffect(() => {
    fetchBudgets();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Budget Manager</h1>
      
      <BudgetForm onSubmit={addBudget} />

      <div className="space-y-3">
        {!budgets || budgets.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No budgets set yet</p>
        ) : (
          budgets.map((budget) => (
            <BudgetProgress 
              key={budget._id} 
              budget={budget} 
              onDelete={() => deleteBudget(budget._id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default BudgetManager;