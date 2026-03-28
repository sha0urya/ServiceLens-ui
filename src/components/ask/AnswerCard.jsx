import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Badge from '../shared/Badge';
import ContextPanel from './ContextPanel';

export default function AnswerCard({ response }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        <Badge label={response.intent} variant="intent" />
        <Badge label={String(response.intentConfidence)} variant="confidence" />
        <Badge label={response.modelUsed} variant="model" />
        <span className="text-xs text-gray-500">
          {response.contextChunksUsed} context chunk{response.contextChunksUsed !== 1 ? 's' : ''}
        </span>
      </div>

      {!response.synthesized && (
        <div className="px-3 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <p className="text-xs text-yellow-400">No relevant context found. The answer may be a fallback.</p>
        </div>
      )}

      <div className="prose prose-invert prose-sm max-w-none break-words overflow-hidden [&_p]:text-gray-300 [&_p]:leading-relaxed [&_p]:my-2 [&_li]:text-gray-300 [&_li]:leading-relaxed [&_strong]:text-gray-100 [&_h1]:text-gray-100 [&_h2]:text-gray-100 [&_h2]:mt-4 [&_h2]:mb-2 [&_h3]:text-gray-200 [&_h3]:mt-3 [&_h3]:mb-1.5 [&_a]:text-indigo-400 [&_ul]:space-y-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_ol]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2 [&_hr]:border-gray-700 [&_hr]:my-4 [&_blockquote]:border-l-2 [&_blockquote]:border-gray-600 [&_blockquote]:pl-4 [&_blockquote]:text-gray-400 [&_table]:w-full [&_table]:border-collapse [&_table]:my-3 [&_table]:text-sm [&_th]:text-left [&_th]:px-3 [&_th]:py-2 [&_th]:text-gray-300 [&_th]:font-semibold [&_th]:border [&_th]:border-gray-700 [&_th]:bg-gray-800/60 [&_td]:px-3 [&_td]:py-2 [&_td]:text-gray-400 [&_td]:border [&_td]:border-gray-700 [&_tr:hover_td]:bg-gray-800/30">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            pre({ node }) {
              const codeNode = node?.children?.[0];
              const className = codeNode?.properties?.className?.[0] || '';
              const match = /language-(\w+)/.exec(className);
              const codeText = codeNode?.children
                ?.map((c) => c.value || '')
                .join('') || '';

              return (
                <div className="not-prose my-3">
                  <SyntaxHighlighter
                    style={oneDark}
                    language={match ? match[1] : 'text'}
                    customStyle={{ borderRadius: '8px', fontSize: '13px', margin: 0 }}
                  >
                    {codeText.replace(/\n$/, '')}
                  </SyntaxHighlighter>
                </div>
              );
            },
            code({ children }) {
              return (
                <span className="px-1.5 py-0.5 bg-gray-800 rounded text-indigo-300 text-xs font-mono">
                  {children}
                </span>
              );
            },
          }}
        >
          {response.answer}
        </ReactMarkdown>
      </div>

      <ContextPanel retrieval={response.retrieval} />
    </div>
  );
}
