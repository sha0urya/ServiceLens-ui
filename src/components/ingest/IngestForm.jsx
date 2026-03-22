import { FolderOpen, Server, Loader2 } from 'lucide-react';

export default function IngestForm({ repoPath, serviceName, onRepoPathChange, onServiceNameChange, mode, onModeChange, onSubmit, loading }) {
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

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Ingestion Mode</label>
        <div className="flex rounded-lg border border-gray-700 overflow-hidden">
          <button
            type="button"
            onClick={() => onModeChange('full')}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
              mode === 'full'
                ? 'bg-indigo-500/20 text-indigo-400 border-r border-indigo-500/30'
                : 'bg-gray-800 text-gray-400 hover:text-gray-200 border-r border-gray-700'
            }`}
          >
            Full Ingest
          </button>
          <button
            type="button"
            onClick={() => onModeChange('incremental')}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
              mode === 'incremental'
                ? 'bg-indigo-500/20 text-indigo-400'
                : 'bg-gray-800 text-gray-400 hover:text-gray-200'
            }`}
          >
            Incremental
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !repoPath.trim() || !serviceName.trim()}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:text-gray-500 text-white text-sm font-medium rounded-lg transition-colors"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            {mode === 'full' ? 'Ingesting...' : 'Scanning changes...'}
          </>
        ) : (
          mode === 'full' ? 'Start Full Ingestion' : 'Run Incremental Scan'
        )}
      </button>
    </form>
  );
}
