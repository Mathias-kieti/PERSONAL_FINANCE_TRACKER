import React from 'react';
import { 
  Edit, Trash2, CheckCircle, Calendar, AlertCircle, 
  Clock, RefreshCw 
} from 'lucide-react';

const BillCard = ({ bill, onEdit, onDelete, onMarkAsPaid }) => {
  // Calculate days until due
  const getDaysUntilDue = () => {
    const today = new Date();
    const dueDate = new Date(bill.dueDate);
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilDue = getDaysUntilDue();
  const isOverdue = daysUntilDue < 0 && !bill.isPaid;
  const isDueSoon = daysUntilDue >= 0 && daysUntilDue <= 3 && !bill.isPaid;

  // Get status styling
  const getStatusColor = () => {
    if (bill.isPaid) return 'bg-green-100 text-green-800 border-green-200';
    if (isOverdue) return 'bg-red-100 text-red-800 border-red-200';
    if (isDueSoon) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-blue-100 text-blue-800 border-blue-200';
  };

  const getStatusText = () => {
    if (bill.isPaid) return 'Paid';
    if (isOverdue) return `Overdue by ${Math.abs(daysUntilDue)} day(s)`;
    if (isDueSoon) return `Due in ${daysUntilDue} day(s)`;
    if (daysUntilDue === 0) return 'Due today';
    return `Due in ${daysUntilDue} day(s)`;
  };

  const getCategoryIcon = () => {
    const icons = {
      utilities: '⚡',
      housing: '🏠',
      transportation: '🚗',
      insurance: '🛡️',
      subscription: '📺',
      loan: '💳',
      credit_card: '💳',
      healthcare: '🏥',
      education: '🎓',
      internet: '🌐',
      phone: '📱',
      other: '📄'
    };
    return icons[bill.category] || '📄';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const capitalizeFirst = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' ');
  };

  return (
    <div className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4 ${
      bill.isPaid ? 'border-green-500' : 
      isOverdue ? 'border-red-500' : 
      isDueSoon ? 'border-yellow-500' : 
      'border-blue-500'
    }`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{getCategoryIcon()}</div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{bill.name}</h3>
              <p className="text-sm text-gray-600 capitalize">
                {capitalizeFirst(bill.category)}
              </p>
            </div>
          </div>
          
          {/* Status Badge */}
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>

        {/* Amount */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-3xl font-bold text-gray-900">
            <span className="text-gray-600 text-2x1">Ksh</span> 
            {typeof bill.amount === 'number' ? bill.amount.toFixed(2) : bill.amount}
          </div>
          <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
            <RefreshCw size={14} />
            {capitalizeFirst(bill.frequency)}
          </p>
        </div>

        {/* Due Date Info */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Calendar size={16} />
            <span>Due: {formatDate(bill.dueDate)}</span>
          </div>
          {bill.description && (
            <p className="text-sm text-gray-600 mt-2">{bill.description}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {!bill.isPaid && (
            <button
              onClick={() => onMarkAsPaid(bill._id)}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
            >
              <CheckCircle size={16} />
              Mark Paid
            </button>
          )}
          <button
            onClick={() => onEdit(bill)}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <Edit size={16} />
            Edit
          </button>
          <button
            onClick={() => onDelete(bill._id)}
            className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillCard;