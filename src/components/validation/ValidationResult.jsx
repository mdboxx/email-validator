import { motion } from 'framer-motion';
import { FiCheck, FiX } from 'react-icons/fi';
import { cn } from '../../utils/cn';

export function ValidationResult({ result }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        "mt-4 p-4 rounded-lg",
        result.isValid ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20"
      )}
    >
      <div className="flex items-center space-x-2">
        {result.isValid ? (
          <FiCheck className="text-green-500" />
        ) : (
          <FiX className="text-red-500" />
        )}
        <span className={cn(
          "font-medium",
          result.isValid ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"
        )}>
          {result.isValid ? 'Valid email address' : 'Invalid email address'}
        </span>
      </div>
      {!result.isValid && result.errors?.length > 0 && (
        <ul className="mt-2 space-y-1 text-sm text-red-600 dark:text-red-400">
          {result.errors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}