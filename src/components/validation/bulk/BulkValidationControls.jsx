import { FiPause, FiPlay, FiX, FiSettings } from 'react-icons/fi';
import { cn } from '../../../utils/cn';

export default function BulkValidationControls({ 
  isValidating,
  isPaused,
  onPause,
  onResume,
  onStop,
  onSettings
}) {
  return (
    <div className="flex justify-end space-x-3">
      {isValidating && (
        <>
          <button
            onClick={isPaused ? onResume : onPause}
            className={cn(
              "flex items-center space-x-2 px-4 py-2 rounded-lg",
              "border border-gray-300 hover:bg-gray-50",
              "dark:border-gray-600 dark:hover:bg-gray-800"
            )}
          >
            {isPaused ? (
              <>
                <FiPlay className="w-4 h-4" />
                <span>Resume</span>
              </>
            ) : (
              <>
                <FiPause className="w-4 h-4" />
                <span>Pause</span>
              </>
            )}
          </button>
          <button
            onClick={onStop}
            className={cn(
              "flex items-center space-x-2 px-4 py-2 rounded-lg",
              "bg-red-500 text-white hover:bg-red-600"
            )}
          >
            <FiX className="w-4 h-4" />
            <span>Stop</span>
          </button>
        </>
      )}
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
  );
}