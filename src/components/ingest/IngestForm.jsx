import { FolderOpen, Server, RefreshCw, Loader2, Info } from 'lucide-react';

export default function IngestForm({
  repoPath,
  serviceName,
  onRepoPathChange,
  onServiceNameChange,
  force,
  onForceChange,
  onSubmit,
  loading,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Repository Path</label>
        <div className="relative">
          <FolderOpen size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={repoPath}
            onChange={(e) => onRepoPathChange(e.target.value)}
            placeholder="/path/to/your/project"
            className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Service Name</label>
        <div className="relative">
          <Server size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={serviceName}
            onChange={(e) => onServiceNameChange(e.target.value)}
            placeholder="my-service"
            className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Strategy info */}
      <div className="p-3 bg-gray-800/60 border border-gray-700/60 rounded-lg space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400 mb-2">
          <Info size={13} />
          Strategy is auto-selected by the backend
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded font-medium">FRESH</span>
          <span>First-time ingest — full pipeline</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="px-1.5 py-0.5 bg-blue-500/10 text-blue-400 rounded font-medium">INCREMENTAL</span>
          <span>Already registered — changed files only (~32× faster)</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-400 rounded font-medium">FORCE FULL</span>
          <span>Registered + force flag — purge &amp; re-index everything</span>
        </div>
      </div>

      {/* Force toggle */}
      <label className="flex items-center gap-3 cursor-pointer group">
        <div className="relative">
          <input
            type="checkbox"
            checked={force}
            onChange={(e) => onForceChange(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-gray-700 peer-checked:bg-amber-500/80 rounded-full transition-colors peer-focus:ring-2 peer-focus:ring-amber-500/40" />
          <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-4 shadow" />
        </div>
        <div>
          <span className="text-sm font-medium text-gray-300 group-hover:text-gray-100 transition-colors flex items-center gap-1.5">
            <RefreshCw size={13} className={force ? 'text-amber-400' : 'text-gray-500'} />
            Force full re-ingest
          </span>
          <p className="text-xs text-gray-500 mt-0.5">Clears all existing data and re-indexes from scratch</p>
        </div>
      </label>

      <button
        type="submit"
        disabled={loading || !repoPath.trim() || !serviceName.trim()}
        className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 text-white text-sm font-medium rounded-lg transition-colors disabled:bg-gray-700 disabled:text-gray-500 ${
          force
            ? 'bg-amber-600 hover:bg-amber-500'
            : 'bg-indigo-600 hover:bg-indigo-500'
        }`}
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            {force ? 'Re-indexing everything...' : 'Ingesting...'}
          </>
        ) : (
          force ? 'Force Full Re-ingest' : 'Run Ingest'
        )}
      </button>
    </form>
  );
}
