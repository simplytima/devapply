import { useApplications } from '../context/ApplicationContext';
import { 
  TrendingUp, 
  Calendar, 
  Building2, 
  CheckCircle2,
  Clock3,
  XCircle,
  Briefcase,
  Award,
  Target,
  BarChart3,
  PieChart
} from 'lucide-react';

const Analytics = () => {
  const { applications } = useApplications();

  // Calculate real stats
  const total = applications.length;
  const interviews = applications.filter(app => app.status === 'interview').length;
  const accepted = applications.filter(app => app.status === 'accepted').length;
  const rejected = applications.filter(app => app.status === 'rejected').length;
  const pending = total - (interviews + accepted + rejected);
  
  const successRate = total > 0 ? ((accepted / total) * 100).toFixed(1) : 0;
  const interviewRate = total > 0 ? ((interviews / total) * 100).toFixed(1) : 0;
  
  // Get top companies (companies with most applications)
  const companyCount = {};
  applications.forEach(app => {
    companyCount[app.company] = (companyCount[app.company] || 0) + 1;
  });
  const topCompanies = Object.entries(companyCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  
  // Get monthly trends
  const monthlyData = {};
  applications.forEach(app => {
    const month = app.date.substring(0, 7); // YYYY-MM
    if (!monthlyData[month]) {
      monthlyData[month] = { total: 0, accepted: 0, rejected: 0, interview: 0 };
    }
    monthlyData[month].total++;
    monthlyData[month][app.status]++;
  });
  
  const months = Object.keys(monthlyData).sort();
  const monthlyTotals = months.map(m => monthlyData[m].total);
  const monthlyAccepted = months.map(m => monthlyData[m].accepted);
  
  const maxMonthlyTotal = Math.max(...monthlyTotals, 1);
  
  // Status distribution data
  const statusData = [
    { label: 'Pending', value: pending, color: 'from-blue-600 to-cyan-600', icon: <Clock3 size={16} /> },
    { label: 'Interview', value: interviews, color: 'from-purple-600 to-pink-600', icon: <Calendar size={16} /> },
    { label: 'Accepted', value: accepted, color: 'from-emerald-600 to-green-600', icon: <CheckCircle2 size={16} /> },
    { label: 'Rejected', value: rejected, color: 'from-red-600 to-rose-600', icon: <XCircle size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-[#020817] text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-slate-400 mt-1">
          Deep insights into your job search journey
        </p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-violet-600/20 to-purple-600/20 border border-violet-500/30 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-slate-300 text-sm">Success Rate</p>
            <Award size={20} className="text-violet-400" />
          </div>
          <p className="text-3xl font-bold text-violet-400">{successRate}%</p>
          <p className="text-xs text-slate-400 mt-2">{accepted} accepted out of {total}</p>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-600/20 to-green-600/20 border border-emerald-500/30 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-slate-300 text-sm">Interview Rate</p>
            <Target size={20} className="text-emerald-400" />
          </div>
          <p className="text-3xl font-bold text-emerald-400">{interviewRate}%</p>
          <p className="text-xs text-slate-400 mt-2">{interviews} interviews scheduled</p>
        </div>
        
        <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-slate-300 text-sm">Pending Review</p>
            <Briefcase size={20} className="text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-blue-400">{pending}</p>
          <p className="text-xs text-slate-400 mt-2">Waiting for response</p>
        </div>
        
        <div className="bg-gradient-to-br from-orange-600/20 to-amber-600/20 border border-orange-500/30 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-slate-300 text-sm">Application Velocity</p>
            <TrendingUp size={20} className="text-orange-400" />
          </div>
          <p className="text-3xl font-bold text-orange-400">
            {total > 0 ? (total / 30).toFixed(1) : 0}
          </p>
          <p className="text-xs text-slate-400 mt-2">Applications per day (avg)</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        {/* Monthly Trends */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 size={20} className="text-violet-400" />
            <h2 className="text-xl font-semibold">Monthly Trends</h2>
          </div>
          
          {total === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p>No data available. Add applications to see trends.</p>
            </div>
          ) : (
            <>
              <div className="flex items-end justify-between h-64 gap-3 mb-4">
                {monthlyTotals.map((total, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full relative group">
                      <div 
                        className="bg-gradient-to-t from-violet-600 to-purple-600 rounded-t-lg transition-all duration-300 hover:opacity-80"
                        style={{ height: `${(total / maxMonthlyTotal) * 180}px` }}
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {total} applications
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400 rotate-45 origin-left">
                      {months[index]?.substring(5)}
                    </span>
                  </div>
                ))}
              </div>
              
              {/* Accepted overlay on same chart */}
              <div className="mt-4 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gradient-to-t from-violet-600 to-purple-600 rounded"></div>
                      <span className="text-slate-400">Total</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gradient-to-t from-emerald-600 to-green-600 rounded"></div>
                      <span className="text-slate-400">Accepted</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Status Distribution */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <PieChart size={20} className="text-violet-400" />
            <h2 className="text-xl font-semibold">Status Distribution</h2>
          </div>
          
          {total === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p>No data available.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {statusData.map((status) => {
                const percentage = (status.value / total) * 100;
                return (
                  <div key={status.label}>
                    <div className="flex justify-between text-sm mb-2">
                      <div className="flex items-center gap-2">
                        {status.icon}
                        <span>{status.label}</span>
                      </div>
                      <div className="flex gap-4">
                        <span className="text-slate-400">{status.value}</span>
                        <span className="text-white font-medium">{percentage.toFixed(1)}%</span>
                      </div>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${status.color} rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              
              {/* Success indicator */}
              <div className="mt-6 pt-6 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Overall Progress</span>
                  <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-600 to-green-600 rounded-full"
                      style={{ width: `${successRate}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-emerald-400">{successRate}%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top Companies */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Building2 size={20} className="text-violet-400" />
            <h2 className="text-xl font-semibold">Top Companies</h2>
          </div>
          
          {topCompanies.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <p>No companies yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {topCompanies.map(([company, count], index) => (
                <div key={company} className="flex items-center justify-between p-3 bg-[#020817] rounded-xl hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{company}</p>
                      <p className="text-xs text-slate-400">{count} application{count !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-violet-400">{count}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Insights */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={20} className="text-violet-400" />
            <h2 className="text-xl font-semibold">Quick Insights</h2>
          </div>
          
          {total === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <p>Start adding applications to get insights!</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-violet-600/10 to-purple-600/10 rounded-xl border border-violet-500/20">
                <p className="text-sm text-slate-300 mb-2">🎯 Best Performing Status</p>
                <p className="text-lg font-semibold text-violet-400">
                  {accepted > rejected ? "You're getting more acceptances than rejections!" : "Keep pushing! Every rejection is closer to an offer."}
                </p>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-emerald-600/10 to-green-600/10 rounded-xl border border-emerald-500/20">
                <p className="text-sm text-slate-300 mb-2">📊 Application to Interview Ratio</p>
                <p className="text-lg font-semibold text-emerald-400">
                  {interviews} interviews from {total} applications
                  {total > 0 && ` (${((interviews / total) * 100).toFixed(1)}% conversion)`}
                </p>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 rounded-xl border border-blue-500/20">
                <p className="text-sm text-slate-300 mb-2">⚡ Next Milestone</p>
                <p className="text-lg font-semibold text-blue-400">
                  {total < 10 ? `${10 - total} more apps to reach 10 total` :
                   accepted < 5 ? `${5 - accepted} more acceptances to reach 5` :
                   "You're crushing it! 🚀"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;