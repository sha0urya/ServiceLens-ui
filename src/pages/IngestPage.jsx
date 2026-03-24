import { useState, useEffect } from 'react';
import { Database, CheckCircle, AlertCircle, Zap, RefreshCw, Sparkles } from 'lucide-react';
import IngestForm from '../components/ingest/IngestForm';
import FullIngestResult from '../components/ingest/FullIngestResult';
import IncrementalResult from '../components/ingest/IncrementalResult';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { ingest } from '../api/servicelens';

function useLocalState(key, initial) {
  const [val, setVal] = useState(() => localStorage.getItem(key) ?? initial);
  useEffect(() => { localStorage.setItem(key, val); }, [key, val]);
  return [val, setVal];
}

/**
 * Detects which strategy the backend used by inspecting response fields:
 *   INCREMENTAL response has `added`, `modified`, `deleted`, `unchanged`
 *   FRESH / FORCE_FULL response has `totalCodeChunks`, `totalClasses`, etc.
 */
function detectResultType(res) {
  if (res == null) return null;
  return 'added' in res ? 'incremental' : 'full';
}

const STRATEGY_META = {
  incremental: {
    label: 'Incremental scan',
    icon: Zap,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    loading: 'Scanning for changes...',
  },
  full: {
    label: 'Full ingestion',
    icon: Sparkles,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    loading: 'Ingesting repository… This may take a few minutes.',
  },
  force: {
    label: 'Force full re-ingest',
    icon: RefreshCw,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    loading: 'Purging existing data and re-indexing… This may take a few minutes.',
  },
};

export default function IngestPage() {
  const [repoPath, setRepoPath] = useLocalState('sl-repoPath', '');
  const [serviceName, setServiceName] = useLocalState('sl-serviceName', '');
  const [force, setForce] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [resultType, setResultType] = useState(null);   // 'full' | 'incremental'
  const [usedForce, setUsedForce] = useState(false);    // was force=true when submitted?
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setUsedForce(force);
    try {
      const res = await ingest(repoPath, serviceName, force);
      setResult(res);
      setResultType(detectResultType(res));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Which strategy meta to show in loading / success banner
  const strategyKey = loading
    ? (usedForce ? 'force' : 'full')   // we don't know the actual strategy yet while loading
    : resultType === 'incremental'
      ? 'incremental'
      : (usedForce ? 'force' : 'full');

  const meta = STRATEGY_META[strategyKey] ?? STRATEGY_META.full;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-indigo-500/15 rounded-lg">
          <Database size={22} className="text-indigo-400" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-100">Ingestion</h1>
          <p className="text-sm text-gray-400">
            Strategy is auto-selected — FRESH, INCREMENTAL, or FORCE_FULL
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <IngestForm
              repoPath={repoPath}
              serviceName={serviceName}
              onRepoPathChange={setRepoPath}
              onServiceNameChange={setServiceName}
              force={force}
              onForceChange={setForce}
              onSubmit={handleSubmit}
              loading={loading}
            />
          </div>
        </div>

        <div>
          {loading && (
            <LoadingSpinner message={force ? STRATEGY_META.force.loading : STRATEGY_META.full.loading} />
          )}

          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <AlertCircle size={18} className="text-red-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-400">Ingestion failed</p>
                <p className="text-sm text-red-300/70 mt-1">{error}</p>
              </div>
            </div>
          )}

          {result && !loading && (
            <div>
              <div className={`flex items-center gap-2 mb-4 px-3 py-2 ${meta.bg} border ${meta.border} rounded-lg`}>
                <CheckCircle size={15} className={meta.color} />
                <meta.icon size={14} className={meta.color} />
                <span className={`text-sm font-medium ${meta.color}`}>
                  {meta.label} complete
                </span>
                {result.serviceName && (
                  <span className="text-sm text-gray-400">— {result.serviceName}</span>
                )}
              </div>
              {resultType === 'full' ? (
                <FullIngestResult result={result} />
              ) : (
                <IncrementalResult result={result} />
              )}
            </div>
          )}

          {!loading && !error && !result && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500">
              <Database size={40} className="mb-3 opacity-30" />
              <p className="text-sm">Configure and run an ingestion to see results</p>
              <p className="text-xs mt-1 text-gray-600">
                Strategy (FRESH / INCREMENTAL / FORCE_FULL) is selected automatically
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
