import { useState } from 'react';
import { X } from 'lucide-react';

const ApplicationForm = ({ onSubmit, onClose, initialData = null }) => {
  const [formData, setFormData] = useState({
    company: initialData?.company || '',
    position: initialData?.position || '',
    status: initialData?.status || 'applied',
    date: initialData?.date || new Date().toISOString().split('T')[0],
    link: initialData?.link || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="text-xl font-semibold">
            {initialData ? 'Edit Application' : 'Add New Application'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Company Name *
            </label>
            <input
              type="text"
              required
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-4 py-2 bg-[#020817] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-500 transition-colors"
              placeholder="Google, Spotify, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Position *
            </label>
            <input
              type="text"
              required
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              className="w-full px-4 py-2 bg-[#020817] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-500 transition-colors"
              placeholder="Frontend Developer, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Status *
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2 bg-[#020817] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-500 transition-colors"
            >
              <option value="applied">Applied</option>
              <option value="interview">Interview</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Application Date *
            </label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-2 bg-[#020817] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Job Link (Optional)
            </label>
            <input
              type="url"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              className="w-full px-4 py-2 bg-[#020817] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-500 transition-colors"
              placeholder="https://..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            {initialData ? 'Update Application' : 'Add Application'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;