import { Download } from 'lucide-react';

const ExportButton = ({ applications }) => {
  const exportToCSV = () => {
    // Prepare data
    const headers = ['Company', 'Position', 'Status', 'Date', 'Link'];
    const csvData = applications.map(app => [
      app.company,
      app.position,
      app.status,
      app.date,
      app.link
    ]);
    
    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell || ''}"`).join(','))
    ].join('\n');
    
    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `devapply-applications-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={exportToCSV}
      className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
    >
      <Download size={18} />
      <span>Export CSV</span>
    </button>
  );
};

export default ExportButton;