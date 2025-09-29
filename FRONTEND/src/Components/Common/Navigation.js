import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, CreditCard, Target, Wallet, FileText } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Transactions', path: '/transactions', icon: CreditCard },
    { name: 'Budget', path: '/budget', icon: Wallet },
    { name: 'Goals', path: '/goals', icon: Target },
    { name: 'Bills', path: '/bills', icon: FileText },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="flex gap-2 bg-white shadow-md p-2 rounded-lg">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive(item.path)
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Icon size={18} />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
};

export default Navigation;
