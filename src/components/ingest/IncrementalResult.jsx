import { Plus, Pencil, Trash2, Check, RefreshCw } from 'lucide-react';
import StatsCard from '../shared/StatsCard';

export default function IncrementalResult({ result }) {
  const stats = [
    { label: 'Added', value: result.added, icon: Plus, color: 'text-emerald-400' },
    { label: 'Modified', value: result.modified, icon: Pencil, color: 'text-yellow-400' },
    { label: 'Deleted', value: result.deleted, icon: Trash2, color: 'text-red-400' },
    { label: 'Unchanged', value: result.unchanged, icon: Check, color: 'text-gray-400' },
    { label: 'Total Changed', value: result.totalChanged, icon: RefreshCw, color: 'text-indigo-400' },
  ];

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-400 mb-3">Incremental Scan Results</h3>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {stats.map((s) => (
          <StatsCard key={s.label} {...s} />
        ))}
      </div>
    </div>
  );
}
