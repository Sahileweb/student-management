import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, CheckSquare, LogOut, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

export default function Sidebar() {
  const location = useLocation();
  const { role, logout } = useAuth();

  const adminNavItems: NavItem[] = [
    { name: 'Students', path: '/admin/dashboard', icon: <Users className="w-5 h-5" /> },
    { name: 'Tasks', path: '/admin/tasks', icon: <CheckSquare className="w-5 h-5" /> },
  ];

  const studentNavItems: NavItem[] = [
    { name: 'Home', path: '/student/dashboard', icon: <Home className="w-5 h-5" /> },
  ];

  const navItems = role === 'admin' ? adminNavItems : studentNavItems;

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col fixed left-0 top-0">
      
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">
          {role === 'admin' ? 'Admin Console' : 'Student Portal'}
        </h1>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              location.pathname === item.path
                ? 'bg-blue-50 text-blue-600 font-medium'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* Logout Only */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>

    </div>
  );
}
