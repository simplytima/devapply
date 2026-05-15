import { useState } from 'react';
import { Edit2, Trash2, ExternalLink, Plus } from 'lucide-react';

const statusColors = {
  applied: 'bg-blue-500/20 text-blue-300',
  interview: 'bg-purple-500/20 text-purple-300',
  accepted: 'bg-emerald-500/20 text-emerald-300',
  rejected: 'bg-red-500/20 text-red-300',
};

const statusLabels = {
  applied: 'Applied',
  interview: 'Interview',
  accepted: 'Accepted',
  rejected: 'Rejected',
};

const ApplicationTable = ({ applications, onEdit, onDelete }) => {
  const [filterStatus, setFilterStatus] = useState('all');

  // Helper function to capitalize first letter of each word
  const capitalizeWords = (str) => {
    if (!str) return '';
    return str.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };


  const filteredApplications = applications.filter(app => 
    filterStatus === 'all' ? true : app.status === filterStatus
  );

  const getStatusBadge = (status) => {
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
        {statusLabels[status]}
      </span>
    );
  };

  const handleOpenForm = () => {
    window.dispatchEvent(new CustomEvent('openAddForm'));
  };

  return (
    <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6">
      {/* Header with Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-semibold">All Applications</h2>
        
        <div className="flex gap-2">
          {['all', 'applied', 'interview', 'accepted', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                filterStatus === status
                  ? 'bg-violet-500 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {status === 'all' ? 'All' : statusLabels[status]}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="text-left py-3 px-4 text-slate-400 font-medium">Company</th>
              <th className="text-left py-3 px-4 text-slate-400 font-medium">Position</th>
              <th className="text-left py-3 px-4 text-slate-400 font-medium">Status</th>
              <th className="text-left py-3 px-4 text-slate-400 font-medium">Date</th>
              <th className="text-left py-3 px-4 text-slate-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplications.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-12">
                  <div className="flex flex-col items-center gap-4">
                    <p className="text-slate-400">No applications found.</p>
                    <button
                      onClick={handleOpenForm}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-all hover:scale-105"
                    >
                      <Plus size={18} />
                      <span>Add your first job application</span>
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              filteredApplications.map((app) => (
                <tr key={app._id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4 font-medium">{capitalizeWords(app.company)}</td>
                  <td className="py-3 px-4 text-slate-300">{capitalizeWords(app.position)}</td>
                  <td className="py-3 px-4">{getStatusBadge(app.status)}</td>
                  <td className="py-3 px-4 text-slate-400">{app.date}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      {app.link && (
                        <a
                          href={app.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 text-slate-400 hover:text-white transition-colors"
                        >
                          <ExternalLink size={18} />
                        </a>
                      )}
                      <button
                        onClick={() => onEdit(app)}
                        className="p-1 text-slate-400 hover:text-blue-400 transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => onDelete(app._id)}
                        className="p-1 text-slate-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApplicationTable;