const StatCard = ({ title, value, icon, color, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="relative overflow-hidden rounded-2xl border border-slate-800 bg-[#0f172a] p-5 hover:border-violet-500/40 transition-all duration-300 cursor-pointer group"
    >
      <div
        className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} opacity-20 blur-3xl group-hover:opacity-30 transition-opacity`}
      />
      
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm mb-2">{title}</p>
          <h2 className="text-3xl font-bold">{value}</h2>
        </div>
        
        <div
          className={`bg-gradient-to-br ${color} p-3 rounded-xl shadow-lg`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;