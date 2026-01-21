const StatCard = ({ title, value, icon, colorClass }) => (
  <div className="bg-bg-card p-6 rounded-2xl border border-border-dim shadow-sm flex items-center gap-4">
    <div className={`p-3 rounded-lg ${colorClass} bg-opacity-10 text-xl`}>
      {icon}
    </div>
    <div>
      <p className="text-text-muted text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold text-text-base">{value}</p>
    </div>
  </div>
);

export default StatCard;