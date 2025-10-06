import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';

const BillForm = ({ bill, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    category: 'utilities',
    dueDate: '',
    frequency: 'monthly',
    description: '',
    reminderDays: 3,
    autoPayEnabled: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    { value: 'utilities', label: 'Utilities' },
    { value: 'housing', label: 'Housing' },
    { value: 'transportation', label: 'Transportation' },
    { value: 'insurance', label: 'Insurance' },
    { value: 'subscription', label: 'Subscription' },
    { value: 'loan', label: 'Loan' },
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'education', label: 'Education' },
    { value: 'internet', label: 'Internet' },
    { value: 'phone', label: 'Phone' },
    { value: 'other', label: 'Other' }
  ];

  const frequencies = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'bi-weekly', label: 'Bi-Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'semi-annually', label: 'Semi-Annually' },
    { value: 'yearly', label: 'Yearly' }
  ];

  useEffect(() => {
    if (bill) {
      setFormData({
        name: bill.name || '',
        amount: bill.amount || '',
        category: bill.category || 'utilities',
        dueDate: bill.dueDate ? new Date(bill.dueDate).toISOString().split('T')[0] : '',
        frequency: bill.frequency || 'monthly',
        description: bill.description || '',
        reminderDays: bill.reminderDays || 3,
        autoPayEnabled: bill.autoPayEnabled || false
      });
    }
  }, [bill]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Bill name is required');
      return false;
    }
    if (!formData.amount || formData.amount <= 0) {
      setError('Valid amount is required');
      return false;
    }
    if (!formData.dueDate) {
      setError('Due date is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save bill');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {bill ? 'Edit Bill' : 'Add New Bill'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Bill Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bill Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Electric Bill, Rent, Netflix"
              required
            />
          </div>

          {/* Amount and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  $
                </span>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  step="0.01"
                  min="0.01"
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Due Date and Frequency */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frequency <span className="text-red-500">*</span>
              </label>
              <select
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {frequencies.map(freq => (
                  <option key={freq.value} value={freq.value}>
                    {freq.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Reminder Days */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reminder (days before due date)
            </label>
            <input
              type="number"
              name="reminderDays"
              value={formData.reminderDays}
              onChange={handleChange}
              min="0"
              max="30"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="mt-1 text-sm text-gray-500">
              Get notified {formData.reminderDays} day(s) before the due date
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Add any additional notes..."
              maxLength="300"
            />
            <p className="mt-1 text-sm text-gray-500 text-right">
              {formData.description.length}/300
            </p>
          </div>

          {/* Auto Pay Toggle */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              id="autoPayEnabled"
              name="autoPayEnabled"
              checked={formData.autoPayEnabled}
              onChange={handleChange}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="autoPayEnabled" className="text-sm font-medium text-gray-700">
              Auto-pay enabled
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={20} />
                  {bill ? 'Update Bill' : 'Add Bill'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BillForm;