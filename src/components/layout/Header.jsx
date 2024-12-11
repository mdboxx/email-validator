import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { FiMoon, FiSun } from 'react-icons/fi';

export default function Header({ onMenuClick }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-gray-800 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Email Cleaning Service
          </h1>
          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
            by MDBOX
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}