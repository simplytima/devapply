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
      <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
        {statusLabels[status]}
      </span>
    );
  };

  const handleOpenForm = () => {
    window.dispatchEvent(new CustomEvent('openAddForm'));
  };

  return (
    <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4 md:p-6">
      {/* Header with Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-lg md:text-xl font-semibold">All Applications</h2>
        
        <div className="flex flex-wrap gap-2">
          {['all', 'applied', 'interview', 'accepted', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-2 md:px-3 py-1 rounded-lg text-xs md:text-sm transition-colors ${
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
      <div className="overflow-x-auto -mx-4 md:mx-0">
        <div className="min-w-full inline-block align-middle px-4 md:px-0">
          <div className="overflow-hidden rounded-xl border border-slate-800">
            <table className="min-w-full divide-y divide-slate-800">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm text-slate-400 font-medium">Company</th>
                  <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm text-slate-400 font-medium">Position</th>
                  <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm text-slate-400 font-medium">Status</th>
                  <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm text-slate-400 font-medium">Date</th>
                  <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm text-slate-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 md:py-12">
                      <div className="flex flex-col items-center gap-4">
                        <p className="text-sm md:text-base text-slate-400">No applications found.</p>
                        <button
                          onClick={handleOpenForm}
                          className="inline-flex items-center gap-2 px-3 md:px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-all hover:scale-105 text-sm md:text-base"
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
                      <td className="py-2 md:py-3 px-2 md:px-4 font-medium text-xs md:text-sm">
                        {capitalizeWords(app.company)}
                      </td>
                      <td className="py-2 md:py-3 px-2 md:px-4 text-slate-300 text-xs md:text-sm">
                        {capitalizeWords(app.position)}
                      </td>
                      <td className="py-2 md:py-3 px-2 md:px-4">
                        {getStatusBadge(app.status)}
                      </td>
                      <td className="py-2 md:py-3 px-2 md:px-4 text-slate-400 text-xs md:text-sm">
                        {app.date}
                      </td>
                      <td className="py-2 md:py-3 px-2 md:px-4">
                        <div className="flex gap-1 md:gap-2">
                          {app.link && (
                            <a
                              href={app.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 text-slate-400 hover:text-white transition-colors"
                            >
                              <ExternalLink size={16} />
                            </a>
                          )}
                          <button
                            onClick={() => onEdit(app)}
                            className="p-1 text-slate-400 hover:text-blue-400 transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => onDelete(app._id)}
                            className="p-1 text-slate-400 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={16} />
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
      </div>
    </div>
  );
};

export default ApplicationTable;