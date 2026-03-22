import Badge from '../shared/Badge';
import CodeBlock from '../shared/CodeBlock';

export default function ChunkCard({ chunk }) {
  const meta = chunk.metadata || {};
  const chunkType = meta.chunk_type || meta.chunkType || 'CODE';
  const elementName = meta.element_name || meta.elementName || '';
  const className = meta.class_name || meta.className || '';
  const filePath = meta.file_path || meta.filePath || '';

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-800">
        <Badge label={chunkType} variant="type" />
        {elementName && (
          <span className="text-sm font-mono font-medium text-gray-200">{elementName}</span>
        )}
        {className && (
          <span className="text-xs text-gray-500">in {className}</span>
        )}
      </div>

      <CodeBlock code={chunk.content} chunkType={chunkType} maxHeight="300px" />

      {filePath && (
        <div className="px-4 py-2 border-t border-gray-800">
          <p className="text-xs text-gray-500 font-mono truncate">{filePath}</p>
        </div>
      )}
    </div>
  );
}
