import { User, Bot } from 'lucide-react';
import AnswerCard from './AnswerCard';

export default function ChatMessage({ message }) {
  if (message.role === 'user') {
    return (
      <div className="flex gap-3 justify-end">
        <div className="max-w-2xl">
          <div className="bg-indigo-600/20 border border-indigo-500/30 rounded-2xl rounded-tr-sm px-4 py-3">
            <p className="text-sm text-gray-200">{message.query}</p>
          </div>
          <p className="text-[10px] text-gray-600 mt-1 text-right">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <div className="p-1.5 bg-indigo-500/15 rounded-lg h-fit mt-1">
          <User size={16} className="text-indigo-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <div className="p-1.5 bg-emerald-500/15 rounded-lg h-fit mt-1">
        <Bot size={16} className="text-emerald-400" />
      </div>
      <div className="max-w-4xl flex-1 min-w-0">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl rounded-tl-sm px-5 py-4">
          {message.response ? (
            <AnswerCard response={message.response} />
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse [animation-delay:0.2s]" />
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse [animation-delay:0.4s]" />
            </div>
          )}
        </div>
        <p className="text-[10px] text-gray-600 mt-1">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}
