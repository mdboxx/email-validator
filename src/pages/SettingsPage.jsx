import { motion } from 'framer-motion';
import ValidationSettings from '../components/validation/ValidationSettings';
import ConsoleViewer from '../components/debug/ConsoleViewer';

export default function SettingsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Configure validation rules and application preferences
          </p>
        </div>

        <ValidationSettings />

        <div>
          <h2 className="text-lg font-semibold mb-4">Debug Console</h2>
          <ConsoleViewer />
        </div>
      </motion.div>
    </div>
  );
}