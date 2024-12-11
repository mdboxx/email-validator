import React from 'react';
import SingleEmailValidator from '../components/validation/SingleEmailValidator';

export default function SingleValidation() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Single Email Validation
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Validate a single email address with real-time feedback
          </p>
        </div>

        <SingleEmailValidator />
      </div>
    </div>
  );
}