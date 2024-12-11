import React from 'react';
import BulkValidator from '../components/validation/BulkValidator';
import ResultsGrid from '../components/results/ResultsGrid';

export default function BulkValidation() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Bulk Email Validation
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Upload and validate multiple email addresses
          </p>
        </div>

        <BulkValidator />
        <ResultsGrid />
      </div>
    </div>
  );
}