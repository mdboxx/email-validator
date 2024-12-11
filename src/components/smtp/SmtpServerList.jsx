import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiServer, FiEdit2, FiTrash2, FiPlay, FiCheck, FiX, FiClock } from 'react-icons/fi';
import { useSmtpStore } from '../../stores/smtpStore';
import { testSmtpConnection } from '../../services/api';
import toast from 'react-hot-toast';
import { cn } from '../../utils/cn';

export default function SmtpServerList() {
  const { servers, removeServer } = useSmtpStore();
  const [testingServer, setTestingServer] = useState(null);
  const [selectedServer, setSelectedServer] = useState(null);

  const handleTestConnection = async (server) => {
    try {
      setTestingServer(server.id);
      const result = await testSmtpConnection(server);
      
      if (result.success) {
        toast.success('Connection successful!');
      } else {
        toast.error(`Connection failed: ${result.error}`);
      }
    } catch (error) {
      toast.error('Connection test failed');
    } finally {
      setTestingServer(null);
    }
  };

  const handleRemoveServer = async (serverId) => {
    if (window.confirm('Are you sure you want to remove this server?')) {
      try {
        await removeServer(serverId);
        toast.success('Server removed successfully');
      } catch (error) {
        toast.error('Failed to remove server');
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">SMTP Servers</h2>
        <div className="text-sm text-gray-500">
          {servers.length} {servers.length === 1 ? 'server' : 'servers'} configured
        </div>
      </div>

      <AnimatePresence>
        {servers.map((server) => (
          <motion.div
            key={server.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  server.secure ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"
                )}>
                  <FiServer className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium">{server.host}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>Port: {server.port}</span>
                    <span>•</span>
                    <span>{server.secure ? 'SSL/TLS' : 'Non-Secure'}</span>
                    {server.auth?.user && (
                      <>
                        <span>•</span>
                        <span>Auth: {server.auth.user}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleTestConnection(server)}
                  disabled={testingServer === server.id}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    testingServer === server.id
                      ? "bg-gray-100 dark:bg-gray-700"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  )}
                  title="Test Connection"
                >
                  {testingServer === server.id ? (
                    <FiClock className="w-5 h-5 animate-spin text-gray-500" />
                  ) : (
                    <FiPlay className="w-5 h-5 text-green-500" />
                  )}
                </button>
                <button
                  onClick={() => setSelectedServer(server)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  title="Edit Server"
                >
                  <FiEdit2 className="w-5 h-5 text-blue-500" />
                </button>
                <button
                  onClick={() => handleRemoveServer(server.id)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  title="Remove Server"
                >
                  <FiTrash2 className="w-5 h-5 text-red-500" />
                </button>
              </div>
            </div>

            {server.lastTest && (
              <div className={cn(
                "mt-3 text-sm p-2 rounded-lg",
                server.lastTest.success
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              )}>
                <div className="flex items-center space-x-2">
                  {server.lastTest.success ? (
                    <FiCheck className="w-4 h-4" />
                  ) : (
                    <FiX className="w-4 h-4" />
                  )}
                  <span>
                    Last test: {server.lastTest.success ? 'Successful' : 'Failed'}
                    {server.lastTest.timestamp && ` - ${new Date(server.lastTest.timestamp).toLocaleString()}`}
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {servers.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No SMTP servers configured yet
        </div>
      )}
    </div>
  );
}