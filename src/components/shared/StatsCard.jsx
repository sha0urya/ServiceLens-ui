export default function StatsCard({ label, value, icon: Icon, color = 'text-indigo-400' }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-4">
      <div className={`p-2.5 rounded-lg bg-gray-800 ${color}`}>
        <Icon size={20} />
      </div>
      <div>
        <div className="text-2xl font-semibold text-gray-100">{value}</div>
        <div className="text-sm text-gray-400">{label}</div>
      </div>
    </div>
  );
}
