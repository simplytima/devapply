import { useAuth } from '../context/AuthContext';
import { useApplications } from '../context/ApplicationContext';
import { User, Mail, Calendar, Briefcase, Award, TrendingUp } from 'lucide-react';
import { useState } from 'react';

const Profile = () => {
  const { user, logout } = useAuth();
  const { applications, getStats } = useApplications();
  const stats = getStats();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');

  // Calculate member since (based on first application or registration)
  const memberSince = applications.length > 0 
    ? new Date(Math.min(...applications.map(a => new Date(a.date)))).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const handleUpdateProfile = () => {
    // In a real app, this would call an API
    const updatedUser = { ...user, name };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    window.location.reload(); // Simple refresh to update UI
  };

  return (
    <div className="text-white p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-slate-400 mt-1">Manage your account settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 sticky top-6">
            <div className="text-center">
              {/* Avatar */}
              <div className="relative inline-block">
                <img 
                  src={user?.avatar} 
                  alt={user?.name}
                  className="w-32 h-32 rounded-full mx-auto border-4 border-violet-500/30"
                />
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 rounded-full border-2 border-[#0f172a]"></div>
              </div>
              
              {/* User Info */}
              {isEditing ? (
                <div className="mt-4">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#020817] border border-slate-700 rounded-lg text-white text-center"
                  />
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={handleUpdateProfile}
                      className="flex-1 px-3 py-1 bg-violet-600 rounded-lg text-sm hover:bg-violet-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setName(user?.name);
                      }}
                      className="flex-1 px-3 py-1 bg-slate-800 rounded-lg text-sm hover:bg-slate-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-semibold mt-4">{user?.name}</h2>
                  <p className="text-slate-400 text-sm">{user?.email}</p>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-3 px-4 py-1 bg-slate-800 rounded-lg text-sm hover:bg-slate-700 transition-colors"
                  >
                    Edit Profile
                  </button>
                </>
              )}
            </div>

            {/* Account Info */}
            <div className="mt-6 pt-6 border-t border-slate-800 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail size={16} className="text-slate-400" />
                <span className="text-slate-300">{user?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar size={16} className="text-slate-400" />
                <span className="text-slate-300">Member since {memberSince}</span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="w-full mt-6 px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors border border-red-500/20"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Stats & Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Overview */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Your Activity</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-violet-600/10 to-purple-600/10 rounded-xl p-4">
                <Briefcase size={20} className="text-violet-400 mb-2" />
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-slate-400">Total Applications</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-600/10 to-green-600/10 rounded-xl p-4">
                <Award size={20} className="text-emerald-400 mb-2" />
                <p className="text-2xl font-bold">{stats.accepted}</p>
                <p className="text-xs text-slate-400">Accepted Offers</p>
              </div>
              <div className="bg-gradient-to-br from-blue-600/10 to-cyan-600/10 rounded-xl p-4">
                <TrendingUp size={20} className="text-blue-400 mb-2" />
                <p className="text-2xl font-bold">
                  {stats.total > 0 ? Math.round((stats.accepted / stats.total) * 100) : 0}%
                </p>
                <p className="text-xs text-slate-400">Success Rate</p>
              </div>
              <div className="bg-gradient-to-br from-purple-600/10 to-pink-600/10 rounded-xl p-4">
                <Calendar size={20} className="text-purple-400 mb-2" />
                <p className="text-2xl font-bold">{stats.interviews}</p>
                <p className="text-xs text-slate-400">Interviews</p>
              </div>
            </div>
          </div>

          {/* Recent Activity Timeline */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            {applications.length === 0 ? (
              <p className="text-center text-slate-400 py-8">No applications yet. Start tracking!</p>
            ) : (
              <div className="space-y-4">
                {applications.slice(0, 5).map((app) => (
                  <div key={app.id} className="flex items-center justify-between p-3 bg-[#020817] rounded-xl">
                    <div>
                      <p className="font-medium">{app.position}</p>
                      <p className="text-sm text-slate-400">{app.company}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{app.date}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        app.status === 'accepted' ? 'bg-emerald-500/20 text-emerald-300' :
                        app.status === 'rejected' ? 'bg-red-500/20 text-red-300' :
                        app.status === 'interview' ? 'bg-purple-500/20 text-purple-300' :
                        'bg-blue-500/20 text-blue-300'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;