import { useState } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiPause, FiPlay, FiX } from 'react-icons/fi';
import { useBulkValidation } from '../../hooks/useBulkValidation';
import { cn } from '../../utils/cn';

export default function BulkValidator() {
  const [isPaused, setIsPaused] = useState(false);
  const { 
    startValidation,
    stopValidation,
    isValidating,
    progress,
    stats,
    togglePause
  } = useBulkValidation();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/plain': ['.txt']
    },
    onDrop: async (files) => {
      await startValidation(files[0]);
    }
  });

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer",
          "transition-colors duration-200 ease-in-out",
          isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300",
          isValidating && "pointer-events-none opacity-50"
        )}
      >
        <input {...getInputProps()} />
        <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          {isDragActive ? "Drop the file here" : "Drag & drop a file, or click to select"}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Supports CSV, Excel, and Text files
        </p>
      </div>

      {isValidating && (
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
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => togglePause()}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                {isPaused ? <FiPlay /> : <FiPause />}
              </button>
              <button
                onClick={() => stopValidation()}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <FiX />
              </button>
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
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-sm font-medium text-green-700">Valid</div>
              <div className="text-2xl font-bold text-green-800">{stats.valid}</div>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <div className="text-sm font-medium text-red-700">Invalid</div>
              <div className="text-2xl font-bold text-red-800">{stats.invalid}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-gray-700">Remaining</div>
              <div className="text-2xl font-bold text-gray-800">
                {stats.total - stats.processed}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}