import { useState, useEffect, useRef } from 'react';
import { Send, Server, MessageSquare, AlertCircle } from 'lucide-react';
import ChatMessage from '../components/ask/ChatMessage';
import { ask } from '../api/servicelens';

function useLocalState(key, initial) {
  const [val, setVal] = useState(() => localStorage.getItem(key) ?? initial);
  useEffect(() => { localStorage.setItem(key, val); }, [key, val]);
  return [val, setVal];
}

export default function AskPage() {
  const [serviceName, setServiceName] = useLocalState('sl-serviceName', '');
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim() || !serviceName.trim() || loading) return;

    const userMsg = { role: 'user', query: query.trim(), timestamp: new Date() };
    const assistantPlaceholder = { role: 'assistant', query: query.trim(), response: null, timestamp: new Date() };

    setMessages((prev) => [...prev, userMsg, assistantPlaceholder]);
    setQuery('');
    setLoading(true);
    setError(null);

    try {
      const res = await ask(userMsg.query, serviceName);
      setMessages((prev) =>
        prev.map((msg, i) =>
          i === prev.length - 1 ? { ...msg, response: res, timestamp: new Date() } : msg
        )
      );
    } catch (err) {
      setMessages((prev) => prev.slice(0, -1));
      setError(err.message);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-800 bg-gray-900/50">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-indigo-500/15 rounded-lg">
            <MessageSquare size={18} className="text-indigo-400" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-gray-100">Ask ServiceLens</h1>
            <p className="text-xs text-gray-500">AI-powered code intelligence</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Server size={14} className="text-gray-500" />
          <input
            type="text"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            placeholder="service-name"
            className="w-40 px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto px-6 py-6 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <MessageSquare size={48} className="mb-4 opacity-20" />
            <h2 className="text-lg font-medium text-gray-400 mb-2">Ask about your codebase</h2>
            <p className="text-sm text-gray-500 max-w-md text-center">
              Ask questions about ingested services. ServiceLens will retrieve relevant code context
              and synthesize an answer using Groq LLaMA 3.3 70B.
            </p>
            <div className="flex flex-wrap gap-2 mt-6 max-w-lg justify-center">
              {[
                'How does task creation work?',
                'What endpoints exist?',
                'Trace the authentication flow',
                'What role-based access controls exist?',
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => setQuery(q)}
                  className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-xs text-gray-400 hover:text-gray-200 hover:border-gray-600 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <ChatMessage key={i} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Error banner */}
      {error && (
        <div className="mx-6 mb-2 flex items-start gap-2 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg">
          <AlertCircle size={14} className="text-red-400 mt-0.5 shrink-0" />
          <p className="text-xs text-red-300/70">{error}</p>
          <button onClick={() => setError(null)} className="ml-auto text-xs text-red-400 hover:text-red-300">Dismiss</button>
        </div>
      )}

      {/* Input */}
      <div className="px-6 py-4 border-t border-gray-800 bg-gray-900/50">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={serviceName ? `Ask about ${serviceName}...` : 'Set a service name first...'}
            disabled={!serviceName.trim()}
            className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !query.trim() || !serviceName.trim()}
            className="p-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-xl transition-colors"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
