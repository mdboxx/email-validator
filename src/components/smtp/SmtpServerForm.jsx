import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSmtpStore } from '../../stores/smtpStore';
import { testSmtpConnection, saveSmtpServer } from '../../services/api';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';
import { FiServer, FiShield, FiUser, FiPlay } from 'react-icons/fi';
import { logger } from '../../utils/logger';

export default function SmtpServerForm() {
  const addServer = useSmtpStore((state) => state.addServer);
  const [formData, setFormData] = useState({
    host: '',
    port: '587',
    secure: false,
    auth: {
      user: '',
      pass: ''
    }
  });

  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    const toastId = toast.loading('Adding SMTP server...');

    try {
      // Log the configuration (without sensitive data)
      logger.info('Adding SMTP server:', {
        ...formData,
        auth: formData.auth.user ? { user: formData.auth.user } : undefined
      });

      const result = await saveSmtpServer(formData);
      
      if (result.success) {
        await addServer(formData);
        toast.success('SMTP server added successfully', { id: toastId });
        
        // Reset form
        setFormData({
          host: '',
          port: '587',
          secure: false,
          auth: {
            user: '',
            pass: ''
          }
        });
      } else {
        throw new Error(result.error || 'Failed to add SMTP server');
      }
    } catch (error) {
      logger.error('Failed to add SMTP server:', error);
      toast.error(error.message || 'Failed to add SMTP server', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleTest = async () => {
    if (testing) return;

    setTesting(true);
    const toastId = toast.loading('Testing SMTP connection...');

    try {
      // Log the test attempt (without sensitive data)
      logger.info('Testing SMTP connection:', {
        ...formData,
        auth: formData.auth.user ? { user: formData.auth.user } : undefined
      });

      const result = await testSmtpConnection(formData);
      
      if (result.success) {
        toast.success('SMTP connection test successful', { id: toastId });
        logger.info('SMTP connection test successful');
      } else {
        throw new Error(result.error || 'Connection test failed');
      }
    } catch (error) {
      logger.error('SMTP test error:', error);
      toast.error(error.message || 'SMTP connection test failed', { id: toastId });
    } finally {
      setTesting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('auth.')) {
      const authField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        auth: {
          ...prev.auth,
          [authField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-2">
            <div className="flex items-center space-x-2">
              <FiServer className="text-gray-400" />
              <span>Host</span>
            </div>
          </label>
          <input
            type="text"
            name="host"
            value={formData.host}
            onChange={handleChange}
            placeholder="smtp.example.com"
            className={cn(
              "w-full rounded-lg border-gray-300 dark:border-gray-600",
              "focus:ring-2 focus:ring-blue-500"
            )}
            required
            disabled={loading || testing}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Port</label>
          <input
            type="number"
            name="port"
            value={formData.port}
            onChange={handleChange}
            placeholder="587"
            className={cn(
              "w-full rounded-lg border-gray-300 dark:border-gray-600",
              "focus:ring-2 focus:ring-blue-500"
            )}
            required
            disabled={loading || testing}
          />
        </div>
      </div>

      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="secure"
            checked={formData.secure}
            onChange={handleChange}
            className="rounded border-gray-300 dark:border-gray-600 text-blue-500"
            disabled={loading || testing}
          />
          <div className="flex items-center space-x-2">
            <FiShield className="text-gray-400" />
            <span className="text-sm font-medium">Use SSL/TLS</span>
          </div>
        </label>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium flex items-center space-x-2">
          <FiUser className="text-gray-400" />
          <span>Authentication (Optional)</span>
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-2">Username</label>
            <input
              type="text"
              name="auth.user"
              value={formData.auth.user}
              onChange={handleChange}
              placeholder="user@example.com"
              className={cn(
                "w-full rounded-lg border-gray-300 dark:border-gray-600",
                "focus:ring-2 focus:ring-blue-500"
              )}
              disabled={loading || testing}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="auth.pass"
                value={formData.auth.pass}
                onChange={handleChange}
                placeholder="••••••••"
                className={cn(
                  "w-full rounded-lg border-gray-300 dark:border-gray-600",
                  "focus:ring-2 focus:ring-blue-500"
                )}
                disabled={loading || testing}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={loading || testing}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          type="button"
          onClick={handleTest}
          disabled={testing || loading || !formData.host || !formData.port}
          className={cn(
            "px-4 py-2 rounded-lg text-white font-medium flex-1",
            "bg-green-500 hover:bg-green-600",
            "transition-colors duration-200",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "flex items-center justify-center space-x-2"
          )}
        >
          {testing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              <span>Testing...</span>
            </>
          ) : (
            <>
              <FiPlay />
              <span>Test Connection</span>
            </>
          )}
        </button>

        <button
          type="submit"
          disabled={loading || testing || !formData.host || !formData.port}
          className={cn(
            "px-4 py-2 rounded-lg text-white font-medium flex-1",
            "bg-blue-500 hover:bg-blue-600",
            "transition-colors duration-200",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "flex items-center justify-center space-x-2"
          )}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              <span>Adding Server...</span>
            </>
          ) : (
            <>
              <FiServer />
              <span>Add SMTP Server</span>
            </>
          )}
        </button>
      </div>
    </motion.form>
  );
}