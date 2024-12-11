import { motion } from 'framer-motion';
import { FiCheck, FiX, FiClock } from 'react-icons/fi';
import { cn } from '../../../utils/cn';

export default function BulkValidationProgress({ stats, progress, isPaused }) {
  const formatDuration = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return minutes > 0 ? `${minutes}m ${seconds % 60}s` : `${seconds}s`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <div className="text-sm font-medium">Progress</div>
          <div className="text-xs text-gray-500">
            {stats.processed} / {stats.total} emails processed
            {stats.estimatedTimeRemaining && (
              <span className="ml-2 flex items-center text-gray-400">
                <FiClock className="w-3 h-3 mr-1" />
                {formatDuration(stats.estimatedTimeRemaining)} remaining
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-blue-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-3 bg-green-50 rounded-lg dark:bg-green-900/20">
          <div className="text-sm font-medium text-green-700 dark:text-green-300">Valid</div>
          <div className="text-2xl font-bold text-green-800 dark:text-green-200">
            {stats.valid}
          </div>
        </div>
        <div className="p-3 bg-red-50 rounded-lg dark:bg-red-900/20">
          <div className="text-sm font-medium text-red-700 dark:text-red-300">Invalid</div>
          <div className="text-2xl font-bold text-red-800 dark:text-red-200">
            {stats.invalid}
          </div>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg dark:bg-gray-800">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Remaining</div>
          <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            {stats.total - stats.processed}
          </div>
        </div>
      </div>

      {isPaused && (
        <div className="text-center py-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <span className="text-sm text-yellow-700 dark:text-yellow-300">
            Validation is paused
          </span>
        </div>
      )}
    </motion.div>
  );
}