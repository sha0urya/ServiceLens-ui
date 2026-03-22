import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <Loader2 size={28} className="animate-spin text-indigo-400" />
      <span className="text-sm text-gray-400">{message}</span>
    </div>
  );
}
