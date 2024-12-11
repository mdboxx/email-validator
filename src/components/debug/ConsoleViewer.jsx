import { motion } from 'framer-motion';
import { FiDownload, FiTrash2, FiFilter } from 'react-icons/fi';
import { useLogger } from '../../utils/logger';
import { cn } from '../../utils/cn';
import { useState, useCallback, useRef, useEffect } from 'react';

export default function ConsoleViewer() {
  const { logs, clearLogs } = useLogger();
  const [filter, setFilter] = useState('all');
  const [autoScroll, setAutoScroll] = useState(true);
  const consoleEndRef = useRef(null);

  const filteredLogs = logs.filter(log => {
    if (filter === 'all') return true;
    return log.level === filter;
  });

  const downloadLogs = useCallback(() => {
    const content = JSON.stringify(logs, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [logs]);

  useEffect(() => {
    if (autoScroll && consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [filteredLogs, autoScroll]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Console Logs</h3>
        <div className="flex space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-md border-gray-300 dark:border-gray-600 text-sm"
          >
            <option value="all">All Logs</option>
            <option value="error">Errors</option>
            <option value="warn">Warnings</option>
            <option value="info">Info</option>
            <option value="debug">Debug</option>
          </select>
          <button
            onClick={downloadLogs}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            title="Download Logs"
          >
            <FiDownload className="w-5 h-5" />
          </button>
          <button
            onClick={clearLogs}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            title="Clear Logs"
          >
            <FiTrash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-gray-500">
          Showing {filteredLogs.length} of {logs.length} logs
        </div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={autoScroll}
            onChange={(e) => setAutoScroll(e.target.checked)}
            className="rounded border-gray-300 dark:border-gray-600"
          />
          <span className="text-sm">Auto-scroll</span>
        </label>
      </div>

      <div 
        className="h-96 overflow-y-auto bg-gray-50 dark:bg-gray-900 rounded-lg p-4 font-mono text-sm"
      >
        {filteredLogs.map((log, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "mb-1 break-all",
              log.level === 'error' && "text-red-500",
              log.level === 'warn' && "text-yellow-500",
              log.level === 'info' && "text-blue-500",
              log.level === 'debug' && "text-gray-500"
            )}
          >
            <span className="opacity-50">[{new Date(log.timestamp).toLocaleTimeString()}]</span>{' '}
            <span className="font-bold">{log.level.toUpperCase()}</span>{' '}
            {log.message}
            {log.details && (
              <div className="ml-6 mt-1 text-xs opacity-75 whitespace-pre-wrap">
                {log.details}
              </div>
            )}
          </motion.div>
        ))}
        <div ref={consoleEndRef} />
        {filteredLogs.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 py-4">
            No logs to display
          </div>
        )}
      </div>
    </div>
  );
}