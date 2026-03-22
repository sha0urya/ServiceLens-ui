import { FileCode, FileText, Box, Braces, GitBranch } from 'lucide-react';
import StatsCard from '../shared/StatsCard';
import Badge from '../shared/Badge';

export default function FullIngestResult({ result }) {
  const stats = [
    { label: 'Code Chunks', value: result.totalCodeChunks, icon: FileCode, color: 'text-emerald-400' },
    { label: 'Doc Chunks', value: result.totalDocChunks, icon: FileText, color: 'text-blue-400' },
    { label: 'Classes', value: result.totalClasses, icon: Box, color: 'text-purple-400' },
    { label: 'Methods', value: result.totalMethods, icon: Braces, color: 'text-amber-400' },
    { label: 'CFG Nodes', value: result.totalCfgNodes, icon: GitBranch, color: 'text-cyan-400' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-gray-400 mb-3">Ingestion Summary</h3>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {stats.map((s) => (
            <StatsCard key={s.label} {...s} />
          ))}
        </div>
      </div>

      {result.chunksByType && Object.keys(result.chunksByType).length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-3">Chunks by Type</h3>
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            {Object.entries(result.chunksByType).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between px-4 py-2.5 border-b border-gray-800 last:border-0">
                <Badge label={type} variant="type" />
                <span className="text-sm font-mono text-gray-300">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
