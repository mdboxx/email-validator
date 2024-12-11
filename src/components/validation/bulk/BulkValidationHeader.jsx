import { FiUpload, FiDownload, FiSettings } from 'react-icons/fi';
import { cn } from '../../../utils/cn';

export default function BulkValidationHeader({ onImport, onExport, onSettings }) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Bulk Email Validation
        </h1>
        <p className="mt-1 text-gray-600 dark:text-gray-300">
          Upload and validate multiple email addresses at once
        </p>
      </div>
      <div className="flex space-x-3">
        <button
          onClick={onImport}
          className={cn(
            "flex items-center space-x-2 px-4 py-2 rounded-lg",
            "bg-blue-500 text-white hover:bg-blue-600"
          )}
        >
          <FiUpload className="w-4 h-4" />
          <span>Import</span>
        </button>
        <button
          onClick={onExport}
          className={cn(
            "flex items-center space-x-2 px-4 py-2 rounded-lg",
            "border border-gray-300 hover:bg-gray-50",
            "dark:border-gray-600 dark:hover:bg-gray-800"
          )}
        >
          <FiDownload className="w-4 h-4" />
          <span>Export</span>
        </button>
        <button
          onClick={onSettings}
          className={cn(
            "flex items-center space-x-2 px-4 py-2 rounded-lg",
            "border border-gray-300 hover:bg-gray-50",
            "dark:border-gray-600 dark:hover:bg-gray-800"
          )}
        >
          <FiSettings className="w-4 h-4" />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
}