import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiUpload, 
  FiServer, 
  FiSettings, 
  FiList,
  FiBarChart2 
} from 'react-icons/fi';
import { cn } from '../../utils/cn';

export default function Sidebar({ open, setOpen }) {
  const location = useLocation();
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: FiHome },
    { name: 'Single Validation', href: '/validate', icon: FiList },
    { name: 'Bulk Validation', href: '/bulk', icon: FiUpload },
    { name: 'Results', href: '/results', icon: FiBarChart2 },
    { name: 'SMTP Servers', href: '/smtp', icon: FiServer },
    { name: 'Settings', href: '/settings', icon: FiSettings }
  ];

  return (
    <div className={`${open ? 'block' : 'hidden'} md:block`}>
      <div className="flex flex-col w-64 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Email Cleaning Service
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">by MDBOX</p>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <nav className="px-4 py-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                  location.pathname === item.href
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                    : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}