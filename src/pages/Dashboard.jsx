import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiMail, FiUpload, FiList, FiSettings, FiArrowRight } from 'react-icons/fi';
import SingleEmailValidator from '../components/validation/SingleEmailValidator';
import { useEmailStore } from '../stores/emailStore';

export default function Dashboard() {
  const [showValidator, setShowValidator] = useState(false);
  const emails = useEmailStore((state) => state.emails);

  const features = [
    {
      title: 'Single Email Validation',
      description: 'Clean and validate individual email addresses with real-time feedback',
      icon: FiMail,
      link: '/validate',
      color: 'bg-blue-500'
    },
    {
      title: 'Bulk Validation',
      description: 'Upload and clean multiple emails at once',
      icon: FiUpload,
      link: '/bulk',
      color: 'bg-green-500'
    },
    {
      title: 'Validation Results',
      description: 'View and analyze cleaning results',
      icon: FiList,
      link: '/results',
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome to Email Cleaning Service
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Professional email list cleaning with comprehensive validation, including syntax checking, 
            domain validation, MX record verification, and more.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Powered by MDBOX
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-500">{emails.length}</div>
            <div className="text-sm text-gray-500">Total Processed</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-500">
              {emails.filter(e => e.isValid).length}
            </div>
            <div className="text-sm text-gray-500">Clean Emails</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-red-500">
              {emails.filter(e => !e.isValid).length}
            </div>
            <div className="text-sm text-gray-500">Issues Found</div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <Link
              key={feature.title}
              to={feature.link}
              className="group bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-all"
            >
              <div className={`${feature.color} text-white p-3 rounded-lg inline-block`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                {feature.description}
              </p>
              <div className="mt-4 flex items-center text-blue-500 group-hover:translate-x-1 transition-transform">
                Learn more <FiArrowRight className="ml-1" />
              </div>
            </Link>
          ))}
        </motion.div>

        {/* Quick Validation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Quick Email Cleaning
            </h2>
            <button
              onClick={() => setShowValidator(!showValidator)}
              className="text-blue-500 hover:text-blue-600"
            >
              {showValidator ? 'Hide' : 'Show'}
            </button>
          </div>
          
          {showValidator && <SingleEmailValidator />}
        </motion.div>
      </div>
    </div>
  );
}