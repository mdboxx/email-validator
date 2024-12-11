import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useBulkValidation } from '../../../hooks/useBulkValidation';
import BulkValidationHeader from './BulkValidationHeader';
import BulkValidationDropzone from './BulkValidationDropzone';
import BulkValidationProgress from './BulkValidationProgress';
import BulkValidationControls from './BulkValidationControls';
import ValidationSettings from '../ValidationSettings';
import toast from 'react-hot-toast';

export default function BulkValidator() {
  const [showSettings, setShowSettings] = useState(false);
  const [acceptedFiles, setAcceptedFiles] = useState([]);
  const { 
    startValidation,
    stopValidation,
    pauseValidation,
    resumeValidation,
    isValidating,
    isPaused,
    progress,
    stats
  } = useBulkValidation();

  const handleDrop = useCallback(async (files) => {
    if (files.length > 0) {
      setAcceptedFiles(files);
      try {
        await startValidation(files[0]);
        toast.success('File uploaded successfully');
      } catch (error) {
        toast.error(error.message || 'Failed to process file');
        setAcceptedFiles([]);
      }
    }
  }, [startValidation]);

  const handleRemoveFile = useCallback(() => {
    setAcceptedFiles([]);
    stopValidation();
  }, [stopValidation]);

  const handleExport = useCallback(() => {
    if (stats.total === 0) {
      toast.error('No results to export');
      return;
    }
    toast.success('Export started');
  }, [stats.total]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <BulkValidationHeader
        onImport={() => document.querySelector('input[type="file"]').click()}
        onExport={handleExport}
        onSettings={() => setShowSettings(!showSettings)}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        {showSettings ? (
          <ValidationSettings onClose={() => setShowSettings(false)} />
        ) : (
          <>
            <BulkValidationDropzone
              onDrop={handleDrop}
              isValidating={isValidating}
              acceptedFiles={acceptedFiles}
              onRemoveFile={handleRemoveFile}
            />

            {isValidating && (
              <BulkValidationProgress
                stats={stats}
                progress={progress}
                isPaused={isPaused}
              />
            )}

            <BulkValidationControls
              isValidating={isValidating}
              isPaused={isPaused}
              onPause={pauseValidation}
              onResume={resumeValidation}
              onStop={stopValidation}
              onSettings={() => setShowSettings(true)}
            />
          </>
        )}
      </motion.div>
    </div>
  );
}