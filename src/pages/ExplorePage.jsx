import { useState, useEffect } from 'react';
import { Search, AlertCircle } from 'lucide-react';
import SearchBar from '../components/explore/SearchBar';
import ChunkCard from '../components/explore/ChunkCard';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { retrieve } from '../api/servicelens';

function useLocalState(key, initial) {
  const [val, setVal] = useState(() => localStorage.getItem(key) ?? initial);
  useEffect(() => { localStorage.setItem(key, val); }, [key, val]);
  return [val, setVal];
}

export default function ExplorePage() {
  const [query, setQuery] = useState('');
  const [serviceName, setServiceName] = useLocalState('sl-serviceName', '');
  const [topK, setTopK] = useState(8);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await retrieve(query, serviceName, topK);
      setResults(res);
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
          <Search size={22} className="text-indigo-400" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-100">Explorer</h1>
          <p className="text-sm text-gray-400">Semantic similarity search across ingested code</p>
        </div>
      </div>

      <div className="mb-6">
        <SearchBar
          query={query}
          serviceName={serviceName}
          topK={topK}
          onQueryChange={setQuery}
          onServiceNameChange={setServiceName}
          onTopKChange={setTopK}
          onSubmit={handleSearch}
          loading={loading}
        />
      </div>

      {loading && <LoadingSpinner message="Searching..." />}

      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
          <AlertCircle size={18} className="text-red-400 mt-0.5 shrink-0" />
          <p className="text-sm text-red-300/70">{error}</p>
        </div>
      )}

      {results && !loading && (
        <div className="space-y-4">
          <p className="text-sm text-gray-400">{results.length} result{results.length !== 1 ? 's' : ''} found</p>
          {results.map((chunk, i) => (
            <ChunkCard key={i} chunk={chunk} />
          ))}
          {results.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-sm">No results found. Try a different query or check the service name.</p>
            </div>
          )}
        </div>
      )}

      {!loading && !error && !results && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <Search size={40} className="mb-3 opacity-30" />
          <p className="text-sm">Enter a query to search through ingested code</p>
        </div>
      )}
    </div>
  );
}
