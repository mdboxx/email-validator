import React from 'react';
import ResultsGrid from '../components/results/ResultsGrid';

export default function Results() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Validation Results
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            View and manage your validation results
          </p>
        </div>

        <ResultsGrid />
      </div>
    </div>
  );
}