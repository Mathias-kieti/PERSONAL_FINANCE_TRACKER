import React, { useState, useEffect } from 'react';
import GoalsForm from './GoalsForm';
import GoalsCard from './GoalsCard';

const GoalsManager = () => {
  const [goals, setGoals] = useState([]); // Fixed variable name - was 'goal'

  // Get token from localStorage
  const getToken = () => {
    return localStorage.getItem('token');
  };

  // Fetch goals from backend on mount
  useEffect(() => {
    const token = getToken();
    
    fetch('http://localhost:5000/api/goal', {
      headers: {
        'Authorization': `Bearer ${token}` // ✅ Add authorization header
      }
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Fetched goals:", data);
        setGoals(data); 
      })
      .catch((err) => console.error('Error fetching goals:', err));
  }, []);

  const addGoal = (goalData) => {
    const token = getToken();
    
    fetch('http://localhost:5000/api/goal', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // ✅ Add authorization header
      },
      body: JSON.stringify(goalData),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((newGoal) => {
        console.log("Created goal:", newGoal);
        setGoals(prevGoals => [...prevGoals, newGoal]); // ✅ Fixed state update
      })
      .catch((err) => console.error('Error adding goal:', err));
  };

  const updateGoal = (id, updatedGoal) => {
    const token = getToken();
    
    fetch(`http://localhost:5000/api/goal/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // ✅ Add authorization header
      },
      body: JSON.stringify(updatedGoal),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((savedGoal) => {
        console.log("Updated goal:", savedGoal);
        setGoals(prevGoals =>
          prevGoals.map((goal) =>
            goal._id === id ? savedGoal : goal
          )
        );
      })
      .catch((err) => console.error('Error updating goal:', err));
  };

  const deleteGoal = (id) => {
    const token = getToken();
    
    fetch(`http://localhost:5000/api/goal/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}` // ✅ Add authorization header
      }
    })
      .then(() => {
        setGoals(prevGoals => prevGoals.filter((goal) => goal._id !== id));
      })
      .catch((err) => console.error('Error deleting goal:', err));
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">My Goals</h1>

      {/* Add Goal Form */}
      <GoalsForm onAddGoal={addGoal} />

      {/* Goal List */}
      <div className="mt-6 grid gap-4">
        {goals.length > 0 ? (
          goals.map((goal) => (
            <GoalsCard
              key={goal._id}  
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