import { useState } from 'react';
import { motion } from 'framer-motion';
import FileDropzone from '../components/import/FileDropzone';
import ValidationSettings from '../components/validation/ValidationSettings';
import ResultsGrid from '../components/results/ResultsGrid';
import { useEmailStore } from '../stores/emailStore';

export default function Home() {
  const [isValidating, setIsValidating] = useState(false);
  const emails = useEmailStore((state) => state.emails);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Email Validation Tool
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Upload your email list or enter emails manually for validation
          </p>
        </div>

        <FileDropzone />
        <ValidationSettings />
        
        {emails.length > 0 && (
          <div className="mt-8">
            <ResultsGrid />
          </div>
        )}
      </motion.div>
    </div>
  );
}