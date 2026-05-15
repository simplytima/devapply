import { useNavigate } from 'react-router-dom';
import { useApplications } from '../context/ApplicationContext';
import StatCard from '../components/StatCard';
import {
  Briefcase,
  Clock3,
  CheckCircle2,
  XCircle,
} from "lucide-react";


const Dashboard = () => {
  const navigate = useNavigate();
  const { applications, getStats, getRecentApplications } = useApplications();
  const stats = getStats();
  const recentApplications = getRecentApplications(3);


  // Helper function to capitalize first letter of each word
  const capitalizeWords = (str) => {
    return str.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };


  const statCards = [
    {
      title: "Total Jobs",
      value: stats.total,
      icon: <Briefcase size={20} />,
      color: "from-violet-600 to-purple-600",
      path: "/applications"
    },
    {
      title: "Interviews",
      value: stats.interviews,
      icon: <Clock3 size={20} />,
      color: "from-cyan-600 to-blue-600",
      path: "/applications?status=interview"
    },
    {
      title: "Accepted",
      value: stats.accepted,
      icon: <CheckCircle2 size={20} />,
      color: "from-emerald-600 to-green-600",
      path: "/applications?status=accepted"
    },
    {
      title: "Rejected",
      value: stats.rejected,
      icon: <XCircle size={20} />,
      color: "from-rose-600 to-red-600",
      path: "/applications?status=rejected"
    },
  ];

  const getStatusColor = (status) => {
    const colors = {
      applied: 'bg-blue-500/20 text-blue-300',
      interview: 'bg-purple-500/20 text-purple-300',
      accepted: 'bg-emerald-500/20 text-emerald-300',
      rejected: 'bg-red-500/20 text-red-300',
    };
    return colors[status] || 'bg-slate-500/20 text-slate-300';
  };

  const getStatusLabel = (status) => {
    const labels = {
      applied: 'Applied',
      interview: 'Interview',
      accepted: 'Accepted',
      rejected: 'Rejected',
    };
    return labels[status] || status;
  };

  // Generate weekly activity data based on actual application dates
  const getWeeklyActivity = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay() + 1); // Monday
    
    const activity = days.map((_, index) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + index);
      const dateStr = date.toISOString().split('T')[0];
      
      const count = applications.filter(app => app.date === dateStr).length;
      return count;
    });
    
    return activity;
  };

  const weeklyActivity = getWeeklyActivity();
  const maxActivity = Math.max(...weeklyActivity, 1);

  return (
    <div className="h-screen bg-[#020817] text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-slate-400 mt-1">
          Track your job applications and interviews
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {statCards.map((item, index) => (
          <StatCard
            key={index}
            title={item.title}
            value={item.value}
            icon={item.icon}
            color={item.color}
            onClick={() => navigate(item.path)}
          />
        ))}
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
        
        {/* Recent Applications */}
        <div className="xl:col-span-2 bg-[#0f172a] border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              Recent Applications
            </h2>
            <button 
              onClick={() => navigate('/applications')}
              className="text-sm text-violet-400 hover:text-violet-300"
            >
              View All
            </button>
          </div>

          <div className="space-y-4">
            {recentApplications.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                No applications yet. Click the 
                <button 
                onClick={() => navigate('/applications')}
                className="mx-1.5 p-1.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-all hover:scale-105 "
                >
                <span className="text-lg font-bold">+</span>
                </button>
                button to add your first job application!
              </div>
            ) : (
              recentApplications.map((job) => (
                <div
                  key={job.id}
                  className="flex items-center justify-between bg-[#020817] border border-slate-800 rounded-xl px-4 py-4 hover:border-violet-500/40 transition-all"
                >
                  <div>
                    <h3 className="font-medium">{capitalizeWords(job.position)} - {capitalizeWords(job.company)}</h3>
                    <p className="text-sm text-slate-400">
                      Applied on {job.date}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(job.status)}`}>
                    {getStatusLabel(job.status)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Analytics Preview with Chart */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-6">
            Weekly Activity
          </h2>

          <div className="flex items-end justify-between h-56 gap-3">
            {weeklyActivity.map((height, index) => {
              const barHeight = maxActivity > 0 ? (height / maxActivity) * 100 : 0;
              return (
                <div
                  key={index}
                  className="flex-1 bg-violet-500/20 rounded-t-xl relative overflow-hidden group cursor-pointer"
                  style={{ height: `${Math.max(barHeight, 4)}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-violet-600 to-fuchsia-500 rounded-t-xl transition-all duration-300 group-hover:opacity-80" />
                  {height > 0 && (
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {height} application{height !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-between mt-4 text-xs text-slate-500">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>

          {/* Summary Stats */}
          <div className="mt-6 pt-6 border-t border-slate-800">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-violet-400">
                  {stats.total}
                </p>
                <p className="text-xs text-slate-400">Total Applications</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-400">
                  {stats.total > 0 ? Math.round((stats.accepted / stats.total) * 100) : 0}%
                </p>
                <p className="text-xs text-slate-400">Success Rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;