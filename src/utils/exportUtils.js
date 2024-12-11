import { format } from 'date-fns';

export async function exportToCSV(data, filename) {
  try {
    const csvContent = convertToCSV(data);
    const timestamp = getTimestamp();
    const fullFilename = `${filename}-${timestamp}${data.length > 0 ? `-${data[0].domain || 'all'}` : ''}.csv`;
    downloadFile(csvContent, fullFilename, 'text/csv;charset=utf-8;');
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    throw error;
  }
}

export async function exportToExcel(data, filename) {
  try {
    const csvContent = convertToCSV(data);
    const timestamp = getTimestamp();
    const fullFilename = `${filename}-${timestamp}${data.length > 0 ? `-${data[0].domain || 'all'}` : ''}.xlsx`;
    downloadFile(csvContent, fullFilename, 'text/csv;charset=utf-8;');
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    throw error;
  }
}

function convertToCSV(data) {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const rows = data.map(obj => headers.map(header => obj[header]));
  
  return [
    headers.join(','),
    ...rows.map(row => row.map(cell => formatCell(cell)).join(','))
  ].join('\n');
}

function formatCell(value) {
  if (value === null || value === undefined) return '""';
  return `"${String(value).replace(/"/g, '""')}"`;
}

function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

function getTimestamp() {
  return format(new Date(), 'yyyy-MM-dd-HHmm');
}