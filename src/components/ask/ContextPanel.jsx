import { useState } from 'react';
import { ChevronDown, ChevronRight, FileCode, GitBranch, ArrowRight, Box, Globe } from 'lucide-react';
import CodeBlock from '../shared/CodeBlock';

function MethodTag({ method }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-800/80 border border-gray-700/50 rounded-md text-xs font-mono">
      <span className="text-gray-300">{method.simpleName}</span>
      {method.endpoint && (
        <span className="ml-1 px-1.5 py-0.5 bg-sky-500/15 text-sky-400 rounded text-[10px] font-sans">
          {method.httpMethod} {method.endpointPath}
        </span>
      )}
    </span>
  );
}

function Section({ title, icon: Icon, count, children }) {
  if (!count) return null;
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Icon size={13} className="text-gray-500" />
        <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">{title}</span>
      </div>
      {children}
    </div>
  );
}

export default function ContextPanel({ retrieval }) {
  const [open, setOpen] = useState(false);

  if (!retrieval) return null;

  const hasContent = (retrieval.semanticMatches?.length > 0) ||
    (retrieval.callChain?.length > 0) ||
    (retrieval.callers?.length > 0) ||
    (retrieval.impactedClasses?.length > 0) ||
    (retrieval.endpointMethods?.length > 0);

  if (!hasContent) return null;

  return (
    <div className="mt-3">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-200 transition-colors"
      >
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        Show retrieval context
      </button>

      {open && (
        <div className="mt-3 space-y-4">
          {/* Semantic Matches — show as clean code cards */}
          <Section title="Source Code" icon={FileCode} count={retrieval.semanticMatches?.length}>
            <div className="space-y-2">
              {retrieval.semanticMatches.map((match, i) => (
                <div key={i} className="rounded-lg overflow-hidden border border-gray-800">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 text-xs">
                    <span className="font-mono text-gray-200">{match.elementName}</span>
                    {match.className && (
                      <>
                        <span className="text-gray-600">in</span>
                        <span className="font-mono text-gray-400">{match.className}</span>
                      </>
                    )}
                    <span className="ml-auto text-[10px] text-gray-600 uppercase">{match.chunkType}</span>
                  </div>
                  <CodeBlock code={match.content} chunkType={match.chunkType} maxHeight="180px" />
                </div>
              ))}
            </div>
          </Section>

          {/* Call Chain — show as a flow */}
          <Section title="Call Chain" icon={GitBranch} count={retrieval.callChain?.length}>
            <div className="flex flex-wrap items-center gap-1">
              {retrieval.callChain.map((m, i) => (
                <span key={i} className="flex items-center gap-1">
                  {i > 0 && <ArrowRight size={12} className="text-gray-600" />}
                  <MethodTag method={m} />
                </span>
              ))}
            </div>
          </Section>

          {/* Callers */}
          <Section title="Called By" icon={ArrowRight} count={retrieval.callers?.length}>
            <div className="flex flex-wrap gap-1.5">
              {retrieval.callers.map((m, i) => <MethodTag key={i} method={m} />)}
            </div>
          </Section>

          {/* Impacted Classes */}
          <Section title="Related Classes" icon={Box} count={retrieval.impactedClasses?.length}>
            <div className="flex flex-wrap gap-1.5">
              {retrieval.impactedClasses.map((c, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 px-2 py-1 bg-gray-800/80 border border-gray-700/50 rounded-md text-xs">
                  <span className="font-mono text-gray-300">{c.simpleName}</span>
                  <span className="text-[10px] text-gray-600">{c.nodeType}</span>
                </span>
              ))}
            </div>
          </Section>

          {/* Endpoints */}
          <Section title="Endpoints" icon={Globe} count={retrieval.endpointMethods?.length}>
            <div className="flex flex-wrap gap-1.5">
              {retrieval.endpointMethods.map((m, i) => <MethodTag key={i} method={m} />)}
            </div>
          </Section>
        </div>
      )}
    </div>
  );
}
