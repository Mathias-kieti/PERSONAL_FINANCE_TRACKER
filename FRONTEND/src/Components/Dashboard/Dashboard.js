import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { transactionAPI, budgetAPI, billAPI } from '../../services/api';
import { 
  DollarSign, TrendingUp, TrendingDown, Wallet, 
  AlertCircle, Calendar, ArrowUpRight, ArrowDownRight 
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [budgets, setBudgets] = useState([]);
  const [upcomingBills, setUpcomingBills] = useState([]);
  const [loading, setLoading] = useState(true);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, budgetsRes, billsRes] = await Promise.all([
        transactionAPI.getStats(),
        budgetAPI.getWithSpending(),
        billAPI.getUpcoming(7)
      ]);

      setStats(statsRes.data);
      setBudgets(budgetsRes.data.budgets || []);
      setUpcomingBills(billsRes.data.bills || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const summary = stats?.summary || { totalIncome: 0, totalExpenses: 0, balance: 0 };
  const expensesByCategory = stats?.expensesByCategory || [];
  const recentTransactions = stats?.recentTransactions || [];
  const monthlyTrends = stats?.monthlyTrends || [];

  // Format category data for pie chart
  const categoryChartData = expensesByCategory.map(item => ({
    name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
    value: item.total
  }));

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600 mt-2">Here's your financial overview</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Income Card */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-green-100 text-sm font-medium">Total Income</p>
                <h3 className="text-3xl font-bold mt-2">
                  ${summary.totalIncome.toFixed(2)}
                </h3>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <TrendingUp size={24} />
              </div>
            </div>
            <div className="flex items-center gap-2 text-green-100 text-sm">
              <ArrowUpRight size={16} />
              <span>From all sources</span>
            </div>
          </div>

          {/* Total Expenses Card */}
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-red-100 text-sm font-medium">Total Expenses</p>
                <h3 className="text-3xl font-bold mt-2">
                  ${summary.totalExpenses.toFixed(2)}
                </h3>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <TrendingDown size={24} />
              </div>
            </div>
            <div className="flex items-center gap-2 text-red-100 text-sm">
              <ArrowDownRight size={16} />
              <span>Total spending</span>
            </div>
          </div>

          {/* Balance Card */}
          <div className={`bg-gradient-to-br ${
            summary.balance >= 0 
              ? 'from-blue-500 to-blue-600' 
              : 'from-orange-500 to-orange-600'
          } rounded-xl shadow-lg p-6 text-white`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-blue-100 text-sm font-medium">Net Balance</p>
                <h3 className="text-3xl font-bold mt-2">
                  ${Math.abs(summary.balance).toFixed(2)}
                </h3>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <Wallet size={24} />
              </div>
            </div>
            <div className="flex items-center gap-2 text-blue-100 text-sm">
              <DollarSign size={16} />
              <span>{summary.balance >= 0 ? 'Positive' : 'Negative'} balance</span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Spending by Category */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Spending by Category
            </h3>
            {categoryChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                No expense data available
              </div>
            )}
          </div>

          {/* Monthly Trends */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Monthly Trends
            </h3>
            {monthlyTrends.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey={(item) => `${item._id.month}/${item._id.year}`} 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                  <Legend />
                  <Bar dataKey="income" fill="#10B981" name="Income" />
                  <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                No trend data available
              </div>
            )}
          </div>
        </div>

        {/* Budget Progress & Upcoming Bills */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Budget Progress */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Budget Overview
            </h3>
            {budgets.length > 0 ? (
              <div className="space-y-4">
                {budgets.slice(0, 3).map((budget) => (
                  <div key={budget._id} className="border-b border-gray-200 pb-4 last:border-0">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900 capitalize">
                        {budget.category}
                      </span>
                      <span className="text-sm text-gray-600">
                        ${budget.spent?.toFixed(2)} / ${budget.amount.toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          budget.percentage >= 100 
                            ? 'bg-red-500' 
                            : budget.percentage >= 80 
                            ? 'bg-yellow-500' 
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {budget.percentage.toFixed(1)}% used
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No budgets set yet. Create your first budget!
              </p>
            )}
          </div>

          {/* Upcoming Bills */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar size={20} />
              Upcoming Bills (Next 7 Days)
            </h3>
            {upcomingBills.length > 0 ? (
              <div className="space-y-3">
                {upcomingBills.map((bill) => (
                  <div 
                    key={bill._id} 
                    className="flex justify-between items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{bill.name}</p>
                      <p className="text-sm text-gray-600 capitalize">{bill.category}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Due: {new Date(bill.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-red-600">
                        ${bill.amount.toFixed(2)}
                      </p>
                      <span className="text-xs px-2 py-1 bg-yellow-200 text-yellow-800 rounded">
                        {bill.frequency}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No upcoming bills in the next 7 days
              </p>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Transactions
          </h3>
          {recentTransactions.length > 0 ? (
            <div className="space-y-2">
              {recentTransactions.map((transaction) => (
                <div 
                  key={transaction._id} 
                  className="flex justify-between items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'income' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {transaction.type === 'income' ? (
                        <TrendingUp size={20} />
                      ) : (
                        <TrendingDown size={20} />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 capitalize">
                        {transaction.category}
                      </p>
                      <p className="text-sm text-gray-600">{transaction.description}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className={`font-semibold ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No recent transactions
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;