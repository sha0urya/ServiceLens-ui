import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

const CHUNK_TYPE_LANG = {
  CODE: 'java',
  TEST: 'java',
  CONFIG: 'yaml',
  SCHEMA: 'sql',
  API_SPEC: 'yaml',
  DOCUMENTATION: 'markdown',
  BUSINESS_CONTEXT: 'markdown',
};

export default function CodeBlock({ code, language, chunkType, maxHeight = '400px' }) {
  const [copied, setCopied] = useState(false);
  const lang = language || CHUNK_TYPE_LANG[chunkType] || 'text';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-lg overflow-hidden border border-gray-800 bg-gray-900">
      <div className="flex items-center justify-between px-3 py-1.5 bg-gray-800/50 border-b border-gray-800">
        <span className="text-xs text-gray-400 font-mono">{lang}</span>
        <button
          onClick={handleCopy}
          className="text-gray-400 hover:text-gray-200 transition-colors p-1"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
      <div style={{ maxHeight, overflow: 'auto' }}>
        <SyntaxHighlighter
          language={lang}
          style={oneDark}
          customStyle={{
            margin: 0,
            padding: '12px',
            background: 'transparent',
            fontSize: '13px',
            lineHeight: '1.5',
          }}
          wrapLongLines
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
