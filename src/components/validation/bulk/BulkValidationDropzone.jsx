import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { FiUploadCloud, FiFile, FiX } from 'react-icons/fi';
import { cn } from '../../../utils/cn';

export default function BulkValidationDropzone({ onDrop, isValidating, acceptedFiles, onRemoveFile }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    disabled: isValidating
  });

  return (
    <div className="space-y-4">
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
        <FiUploadCloud className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          {isDragActive ? "Drop the file here" : "Drag & drop a file, or click to select"}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Supports CSV, Excel, and Text files
        </p>
      </div>

      {acceptedFiles?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FiFile className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">{acceptedFiles[0].name}</p>
                <p className="text-xs text-gray-500">
                  {(acceptedFiles[0].size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            {!isValidating && (
              <button
                onClick={onRemoveFile}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              >
                <FiX className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}