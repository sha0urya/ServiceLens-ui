import { useState, useEffect } from 'react';
import { Database, CheckCircle, AlertCircle } from 'lucide-react';
import IngestForm from '../components/ingest/IngestForm';
import FullIngestResult from '../components/ingest/FullIngestResult';
import IncrementalResult from '../components/ingest/IncrementalResult';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { ingestFull, ingestIncremental } from '../api/servicelens';

function useLocalState(key, initial) {
  const [val, setVal] = useState(() => localStorage.getItem(key) ?? initial);
  useEffect(() => { localStorage.setItem(key, val); }, [key, val]);
  return [val, setVal];
}

export default function IngestPage() {
  const [repoPath, setRepoPath] = useLocalState('sl-repoPath', '');
  const [serviceName, setServiceName] = useLocalState('sl-serviceName', '');
  const [mode, setMode] = useState('full');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [resultMode, setResultMode] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = mode === 'full'
        ? await ingestFull(repoPath, serviceName)
        : await ingestIncremental(repoPath, serviceName);
      setResult(res);
      setResultMode(mode);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-indigo-500/15 rounded-lg">
          <Database size={22} className="text-indigo-400" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-100">Ingestion</h1>
          <p className="text-sm text-gray-400">Ingest or re-ingest a service repository</p>
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
              mode={mode}
              onModeChange={setMode}
              onSubmit={handleSubmit}
              loading={loading}
            />
          </div>
        </div>

        <div>
          {loading && (
            <LoadingSpinner message={mode === 'full' ? 'Ingesting repository... This may take a few minutes.' : 'Scanning for changes...'} />
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
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle size={16} className="text-emerald-400" />
                <span className="text-sm font-medium text-emerald-400">
                  {resultMode === 'full' ? 'Full ingestion' : 'Incremental scan'} complete for {result.serviceName}
                </span>
              </div>
              {resultMode === 'full' ? (
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
