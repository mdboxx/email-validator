import { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender
} from '@tanstack/react-table';
import { motion } from 'framer-motion';
import { FiDownload, FiFilter, FiRefreshCw, FiSearch, FiTrash2 } from 'react-icons/fi';
import { useEmailStore } from '../../stores/emailStore';
import { exportToCSV, exportToExcel } from '../../utils/exportUtils';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';

export default function ResultsGrid() {
  const emails = useEmailStore((state) => state.emails);
  const clearEmails = useEmailStore((state) => state.clearEmails);
  const [filters, setFilters] = useState({ 
    status: 'all', 
    search: '',
    domain: '' 
  });

  const columns = useMemo(
    () => [
      {
        header: 'Email',
        accessorKey: 'email',
        cell: ({ row }) => (
          <div className="font-medium text-gray-900 dark:text-gray-100">
            {row.original.email}
          </div>
        )
      },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: ({ row }) => {
          const status = row.original.status;
          const isValid = row.original.isValid;
          
          if (status === 'pending') {
            return (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100">
                Pending
              </span>
            );
          }
          
          return (
            <span
              className={cn(
                'px-3 py-1 rounded-full text-xs font-medium',
                isValid
                  ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                  : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
              )}
            >
              {isValid ? 'Valid' : 'Invalid'}
            </span>
          );
        }
      },
      {
        header: 'Error Type',
        accessorKey: 'errorType',
        cell: ({ row }) => (
          <div className="text-gray-600 dark:text-gray-300">
            {row.original.errorType || '-'}
          </div>
        )
      },
      {
        header: 'Domain',
        accessorKey: 'domain',
        cell: ({ row }) => (
          <div className="text-gray-600 dark:text-gray-300">
            {row.original.domain}
          </div>
        )
      }
    ],
    []
  );

  const filteredData = useMemo(() => {
    return emails.filter(email => {
      const matchesStatus = 
        filters.status === 'all' || 
        (filters.status === 'valid' && email.isValid) ||
        (filters.status === 'invalid' && email.isValid === false) ||
        (filters.status === 'pending' && email.status === 'pending');
      
      const matchesSearch = !filters.search || 
        email.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        email.domain?.toLowerCase().includes(filters.search.toLowerCase());

      const matchesDomain = !filters.domain || 
        email.domain?.toLowerCase() === filters.domain.toLowerCase();
      
      return matchesStatus && matchesSearch && matchesDomain;
    });
  }, [emails, filters]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel()
  });

  const handleExport = async (format, exportFilters = {}) => {
    try {
      let dataToExport = filteredData;

      // Apply additional export filters
      if (exportFilters.validOnly) {
        dataToExport = dataToExport.filter(email => email.isValid);
      }
      if (exportFilters.invalidOnly) {
        dataToExport = dataToExport.filter(email => !email.isValid);
      }
      if (exportFilters.domain) {
        dataToExport = dataToExport.filter(email => 
          email.domain?.toLowerCase() === exportFilters.domain.toLowerCase()
        );
      }

      const data = dataToExport.map(email => ({
        email: email.email,
        status: email.status,
        isValid: email.isValid ? 'Valid' : 'Invalid',
        errorType: email.errorType || '',
        domain: email.domain
      }));

      if (format === 'csv') {
        await exportToCSV(data, 'validation-results');
        toast.success('Results exported to CSV');
      } else if (format === 'excel') {
        await exportToExcel(data, 'validation-results');
        toast.success('Results exported to Excel');
      }
    } catch (error) {
      toast.error('Failed to export results');
    }
  };

  const handleClearResults = () => {
    if (window.confirm('Are you sure you want to clear all results?')) {
      clearEmails();
      toast.success('Results cleared');
    }
  };

  const uniqueDomains = useMemo(() => {
    const domains = new Set(emails.map(email => email.domain));
    return Array.from(domains).filter(Boolean).sort();
  }, [emails]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
    >
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4 w-full md:w-auto">
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="rounded-md border-gray-300 dark:border-gray-600 text-sm"
            >
              <option value="all">All Results</option>
              <option value="valid">Valid Only</option>
              <option value="invalid">Invalid Only</option>
              <option value="pending">Pending</option>
            </select>

            <select
              value={filters.domain}
              onChange={(e) => setFilters(prev => ({ ...prev, domain: e.target.value }))}
              className="rounded-md border-gray-300 dark:border-gray-600 text-sm"
            >
              <option value="">All Domains</option>
              {uniqueDomains.map(domain => (
                <option key={domain} value={domain}>{domain}</option>
              ))}
            </select>

            <div className="relative flex-1 md:flex-none">
              <input
                type="text"
                placeholder="Search emails..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10 pr-4 py-2 w-full rounded-md border-gray-300 dark:border-gray-600 text-sm"
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            <button
              onClick={() => setFilters({ status: 'all', search: '', domain: '' })}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              title="Reset filters"
            >
              <FiRefreshCw className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
            <div className="dropdown relative">
              <button
                onClick={() => handleExport('csv')}
                className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center space-x-2"
              >
                <FiDownload className="w-4 h-4" />
                <span>Export CSV</span>
              </button>
              <div className="dropdown-content absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg hidden group-hover:block">
                <button
                  onClick={() => handleExport('csv', { validOnly: true, domain: filters.domain })}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Export Valid Only
                </button>
                <button
                  onClick={() => handleExport('csv', { invalidOnly: true, domain: filters.domain })}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Export Invalid Only
                </button>
              </div>
            </div>
            <button
              onClick={() => handleExport('excel')}
              className="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center space-x-2"
            >
              <FiDownload className="w-4 h-4" />
              <span>Export Excel</span>
            </button>
            <button
              onClick={handleClearResults}
              className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center space-x-2"
            >
              <FiTrash2 className="w-4 h-4" />
              <span>Clear All</span>
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center space-x-1">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 whitespace-nowrap"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        
        {table.getRowModel().rows.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No results found
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing {table.getRowModel().rows.length} of {emails.length} results
        </div>
      </div>
    </motion.div>
  );
}