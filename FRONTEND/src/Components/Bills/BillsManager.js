import React, { useState, useEffect } from 'react';
import { billAPI } from '../../services/api';
import BillForm from './BillsForm';
import BillCard from './BillsCard';
import { Bell, Plus, AlertCircle, Calendar, TrendingUp } from 'lucide-react';

const BillsManager = () => {
  const [bills, setBills] = useState([]);
  const [upcomingBills, setUpcomingBills] = useState([]);
  const [overdueBills, setOverdueBills] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBill, setEditingBill] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBillsData();
  }, []);

  const fetchBillsData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [billsRes, upcomingRes, overdueRes, statsRes] = await Promise.all([
        billAPI.getAll(),
        billAPI.getUpcoming(30),
        billAPI.getAll({ isPaid: false }),
        billAPI.getAll()
      ]);

      setBills(billsRes.data.bills || []);
      setUpcomingBills(upcomingRes.data.bills || []);
      
      // Filter overdue bills
      const today = new Date();
      const overdue = (billsRes.data.bills || []).filter(bill => 
        !bill.isPaid && new Date(bill.dueDate) < today
      );
      setOverdueBills(overdue);

      // Calculate stats
      const allBills = billsRes.data.bills || [];
      setStats({
        totalBills: allBills.length,
        totalAmount: allBills.reduce((sum, b) => sum + b.amount, 0),
        paidCount: allBills.filter(b => b.isPaid).length,
        unpaidCount: allBills.filter(b => !b.isPaid).length,
        overdueCount: overdue.length,
        upcomingAmount: (upcomingRes.data.bills || []).reduce((sum, b) => sum + b.amount, 0)
      });

    } catch (err) {
      console.error('Error fetching bills:', err);
      setError('Failed to load bills. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBill = () => {
    setEditingBill(null);
    setShowForm(true);
  };

  const handleEditBill = (bill) => {
    setEditingBill(bill);
    setShowForm(true);
  };

  const handleDeleteBill = async (billId) => {
    if (!window.confirm('Are you sure you want to delete this bill?')) return;

    try {
      await billAPI.delete(billId);
      await fetchBillsData();
    } catch (err) {
      console.error('Error deleting bill:', err);
      setError('Failed to delete bill. Please try again.');
    }
  };

  const handleMarkAsPaid = async (billId) => {
    try {
      const bill = bills.find(b => b._id === billId);
      if (!bill) {
        console.error('Bill not found');
        setError('Bill not found. Please try again.');
        return;
      }

      console.log('Marking bill as paid:', bill.name, 'Amount:', bill.amount);
      await billAPI.markAsPaid(billId, bill.amount);
      await fetchBillsData();
      
      console.log('Bill marked as paid successfully');
    } catch (err) {
      console.error('Error marking bill as paid:', err);
      setError('Failed to mark bill as paid. Please try again.');
    }
  };

  const handleFormSubmit = async (billData) => {
    try {
      if (editingBill) {
        await billAPI.update(editingBill._id, billData);
      } else {
        await billAPI.create(billData);
      }
      
      setShowForm(false);
      setEditingBill(null);
      await fetchBillsData();
    } catch (err) {
      console.error('Error saving bill:', err);
      throw err;
    }
  };

  const getFilteredBills = () => {
    switch (activeTab) {
      case 'upcoming':
        return upcomingBills;
      case 'overdue':
        return overdueBills;
      case 'paid':
        return bills.filter(b => b.isPaid);
      case 'unpaid':
        return bills.filter(b => !b.isPaid);
      default:
        return bills;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading bills...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Bell className="text-blue-600" size={32} />
              Bill Manager
            </h1>
            <p className="text-gray-600 mt-2">Track and manage your recurring bills</p>
          </div>
          <button
            onClick={handleAddBill}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            <Plus size={20} />
            Add Bill
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-800">{error}</p>
            <button
              onClick={() => setError('')}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </div>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Total Bills</h3>
                <Calendar className="text-blue-500" size={24} />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.totalBills}</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Total Amount</h3>
                <span className="text-green-500" size={24}>Ksh</span> 
              </div>
              <p className="text-3xl font-bold text-gray-900">
                ksh. {stats.totalAmount.toFixed(2)}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Upcoming (30 days)</h3>
                <TrendingUp className="text-yellow-500" size={24} />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                Ksh. {stats.upcomingAmount.toFixed(2)}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Overdue</h3>
                <AlertCircle className="text-red-500" size={24} />
              </div>
              <p className="text-3xl font-bold text-red-600">{stats.overdueCount}</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-6">
          <div className="flex flex-wrap gap-2 p-4 border-b border-gray-200">
            {[
              { id: 'all', label: 'All Bills', count: bills.length },
              { id: 'upcoming', label: 'Upcoming', count: upcomingBills.length },
              { id: 'overdue', label: 'Overdue', count: overdueBills.length },
              { id: 'unpaid', label: 'Unpaid', count: bills.filter(b => !b.isPaid).length },
              { id: 'paid', label: 'Paid', count: bills.filter(b => b.isPaid).length }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Bills List */}
          <div className="p-6">
            {getFilteredBills().length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getFilteredBills().map(bill => (
                  <BillCard
                    key={bill._id}
                    bill={bill}
                    onEdit={handleEditBill}
                    onDelete={handleDeleteBill}
                    onMarkAsPaid={handleMarkAsPaid}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Bell size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 text-lg mb-2">No bills found</p>
                <p className="text-gray-500 text-sm mb-4">
                  {activeTab === 'all' 
                    ? 'Start by adding your first bill'
                    : `No ${activeTab} bills at the moment`
                  }
                </p>
                {activeTab === 'all' && (
                  <button
                    onClick={handleAddBill}
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={20} />
                    Add Your First Bill
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bill Form Modal */}
        {showForm && (
          <BillForm
            bill={editingBill}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingBill(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default BillsManager;