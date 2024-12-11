import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiX, FiLoader } from 'react-icons/fi';
import { validateEmail } from '../../services/api';
import { ValidationResult } from './ValidationResult';
import { ValidationDetails } from './ValidationDetails';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';
import { logger } from '../../utils/logger';

export default function SingleEmailValidator() {
  const [email, setEmail] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [result, setResult] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsValidating(true);
    setResult(null);
    
    try {
      logger.info('Starting email validation:', email);
      const validationResult = await validateEmail(email);
      
      setResult(validationResult);
      
      if (validationResult.isValid) {
        toast.success('Email validation successful');
        logger.info('Email validation successful:', email);
      } else {
        toast.error('Email validation failed');
        logger.error('Email validation failed:', validationResult.details);
      }
    } catch (error) {
      logger.error('Email validation error:', error);
      toast.error(error.message || 'Validation failed');
      setResult({
        isValid: false,
        errors: [error.message || 'Validation failed'],
        details: { error: error.message }
      });
    } finally {
      setIsValidating(false);
    }
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
            className={cn(
              "w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500",
              "transition-all duration-200 ease-in-out",
              "dark:bg-gray-800 dark:border-gray-700 dark:text-white",
              result?.isValid && "border-green-500",
              result?.isValid === false && "border-red-500"
            )}
          />
          <AnimatePresence>
            {(isValidating || result) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {isValidating ? (
                  <FiLoader className="animate-spin text-gray-400" />
                ) : result?.isValid ? (
                  <FiCheck className="text-green-500" />
                ) : (
                  <FiX className="text-red-500" />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isValidating || !isValidEmail(email)}
            className={cn(
              "flex-1 px-4 py-2 rounded-lg text-white font-medium",
              "transition-all duration-200 ease-in-out",
              "bg-blue-500 hover:bg-blue-600",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "dark:bg-blue-600 dark:hover:bg-blue-700"
            )}
          >
            {isValidating ? 'Validating...' : 'Validate Email'}
          </button>

          {result && (
            <button
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              className={cn(
                "px-4 py-2 rounded-lg border",
                "hover:bg-gray-50 dark:hover:bg-gray-800",
                "transition-colors duration-200",
                "dark:border-gray-700"
              )}
            >
              {showDetails ? 'Hide Details' : 'Show Details'}
            </button>
          )}
        </div>
      </form>

      <AnimatePresence>
        {result && (
          <ValidationResult result={result} />
        )}
        {result && showDetails && (
          <ValidationDetails result={result} />
        )}
      </AnimatePresence>
    </div>
  );
}