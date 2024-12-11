import { motion } from 'framer-motion';
import { FiCheck, FiX, FiInfo } from 'react-icons/fi';
import { cn } from '../../utils/cn';

export function ValidationDetails({ result }) {
  const validationTypes = {
    syntax: 'Basic format check',
    domain: 'Domain validation',
    smtp: 'Mail server check'
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-4 space-y-4"
    >
      <div className="grid gap-3">
        {Object.entries(result.details || {}).map(([type, details]) => (
          <div
            key={type}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium capitalize">{type}</span>
              <div className="group relative">
                <FiInfo className="w-4 h-4 text-gray-400" />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  {validationTypes[type] || `${type} validation`}
                </div>
              </div>
            </div>
            <ValidationStatus status={details.valid} />
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function ValidationStatus({ status }) {
  return (
    <span
      className={cn(
        "flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium",
        status
          ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
          : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
      )}
    >
      {status ? 'Valid' : 'Invalid'}
      {status ? <FiCheck className="w-4 h-4 ml-1" /> : <FiX className="w-4 h-4 ml-1" />}
    </span>
  );
}