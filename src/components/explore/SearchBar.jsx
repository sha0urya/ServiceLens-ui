import { Search, Server, Loader2 } from 'lucide-react';

export default function SearchBar({ query, serviceName, topK, onQueryChange, onServiceNameChange, onTopKChange, onSubmit, loading }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-3">
      <div className="flex-1">
        <label className="block text-xs font-medium text-gray-400 mb-1">Search Query</label>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="How does authentication work?"
            className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="w-44">
        <label className="block text-xs font-medium text-gray-400 mb-1">Service</label>
        <div className="relative">
          <Server size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={serviceName}
            onChange={(e) => onServiceNameChange(e.target.value)}
            placeholder="service-name"
            className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="w-20">
        <label className="block text-xs font-medium text-gray-400 mb-1">Top K</label>
        <input
          type="number"
          min={1}
          max={50}
          value={topK}
          onChange={(e) => onTopKChange(Number(e.target.value))}
          className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-100 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading || !query.trim() || !serviceName.trim()}
        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:text-gray-500 text-white text-sm font-medium rounded-lg transition-colors"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
        Search
      </button>
    </form>
  );
}
