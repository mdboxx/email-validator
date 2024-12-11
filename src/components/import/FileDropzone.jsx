import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { FiUploadCloud } from 'react-icons/fi';
import { useEmailStore } from '../../stores/emailStore';
import { parseEmailFile } from '../../utils/fileParser';
import toast from 'react-hot-toast';

export default function FileDropzone() {
  const addEmails = useEmailStore((state) => state.addEmails);

  const onDrop = useCallback(async (acceptedFiles) => {
    try {
      const emails = await parseEmailFile(acceptedFiles[0]);
      addEmails(emails);
      toast.success(`Successfully imported ${emails.length} emails`);
    } catch (error) {
      console.error('Error parsing file:', error);
      toast.error('Failed to parse file');
    }
  }, [addEmails]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/plain': ['.txt']
    },
    maxFiles: 1
  });

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="max-w-xl mx-auto"
    >
      <div
        {...getRootProps()}
        className={`p-12 border-2 border-dashed rounded-lg text-center cursor-pointer
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
      >
        <input {...getInputProps()} />
        <FiUploadCloud className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          {isDragActive
            ? 'Drop the files here...'
            : 'Drag and drop files here, or click to select files'}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Supports CSV, Excel (.xlsx, .xls), and text files
        </p>
      </div>
    </motion.div>
  );
}