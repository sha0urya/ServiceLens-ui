import { useState, useEffect, useCallback } from 'react';
import {
  Layers, Trash2, RefreshCw, AlertCircle, CheckCircle,
  FolderOpen, Clock, Files, ChevronRight,
} from 'lucide-react';
import { listServices, deleteService } from '../api/servicelens';

const STATUS_STYLES = {
  ACTIVE:     { dot: 'bg-emerald-400', label: 'text-emerald-400', badge: 'bg-emerald-500/10 border-emerald-500/20' },
  INGESTING:  { dot: 'bg-blue-400 animate-pulse', label: 'text-blue-400',  badge: 'bg-blue-500/10 border-blue-500/20' },
  DELETING:   { dot: 'bg-red-400 animate-pulse',  label: 'text-red-400',   badge: 'bg-red-500/10 border-red-500/20'   },
  ERROR:      { dot: 'bg-rose-400',               label: 'text-rose-400',  badge: 'bg-rose-500/10 border-rose-500/20' },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.ERROR;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-xs font-medium ${s.badge} ${s.label}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}

function formatDate(iso) {
  if (!iso) return '—';
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function ConfirmDeleteModal({ serviceName, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-500/10 rounded-lg">
            <Trash2 size={18} className="text-red-400" />
          </div>
          <h2 className="text-base font-semibold text-gray-100">Delete service?</h2>
        </div>
        <p className="text-sm text-gray-400 mb-1">
          This will permanently delete all data for:
        </p>
        <p className="text-sm font-mono font-medium text-gray-100 mb-4 px-3 py-1.5 bg-gray-800 rounded-lg">
          {serviceName}
        </p>
        <ul className="text-xs text-gray-500 space-y-1 mb-6">
          <li className="flex items-center gap-1.5"><ChevronRight size={11} />All Neo4j nodes and relationships</li>
          <li className="flex items-center gap-1.5"><ChevronRight size={11} />All pgvector embeddings</li>
          <li className="flex items-center gap-1.5"><ChevronRight size={11} />File fingerprint hashes</li>
          <li className="flex items-center gap-1.5"><ChevronRight size={11} />Service registry entry</li>
        </ul>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2 text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-500 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <RefreshCw size={14} className="animate-spin" /> : <Trash2 size={14} />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);   // service name being confirmed
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast] = useState(null);   // { type: 'success'|'error', message }

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listServices();
      setServices(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteService(deleteTarget);
      setToast({ type: 'success', message: `"${deleteTarget}" deleted successfully` });
      setDeleteTarget(null);
      await load();
    } catch (err) {
      setToast({ type: 'error', message: err.message });
      setDeleteTarget(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/15 rounded-lg">
            <Layers size={22} className="text-indigo-400" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-100">Services</h1>
            <p className="text-sm text-gray-400">All services registered in the ingestion registry</p>
          </div>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-gray-200 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl mb-6">
          <AlertCircle size={18} className="text-red-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-400">Failed to load services</p>
            <p className="text-sm text-red-300/70 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && !error && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-800/50 border border-gray-800 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && services.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <Layers size={40} className="mb-3 opacity-30" />
          <p className="text-sm font-medium">No services ingested yet</p>
          <p className="text-xs mt-1 text-gray-600">
            Go to Ingestion and run your first ingest to register a service.
          </p>
        </div>
      )}

      {/* Services list */}
      {!loading && !error && services.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs text-gray-500 mb-4">{services.length} service{services.length !== 1 ? 's' : ''} registered</p>
          {services.map((svc) => (
            <div
              key={svc.serviceName}
              className="bg-gray-900/50 border border-gray-800 hover:border-gray-700 rounded-xl p-5 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                {/* Left — name + status + path */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                    <span className="text-sm font-semibold text-gray-100 font-mono">
                      {svc.serviceName}
                    </span>
                    <StatusBadge status={svc.status} />
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
                    <FolderOpen size={12} />
                    <span className="truncate font-mono">{svc.repoPath || '—'}</span>
                  </div>
                  {/* Timestamps + file count */}
                  <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <Clock size={11} />
                      <span>First ingested:</span>
                      <span className="text-gray-400">{formatDate(svc.ingestedAt)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <RefreshCw size={11} />
                      <span>Last updated:</span>
                      <span className="text-gray-400">{formatDate(svc.lastUpdatedAt)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Files size={11} />
                      <span className="text-gray-400">{svc.fileCount ?? 0} files</span>
                    </div>
                  </div>
                </div>

                {/* Right — delete */}
                <button
                  onClick={() => setDeleteTarget(svc.serviceName)}
                  disabled={svc.status === 'DELETING' || svc.status === 'INGESTING'}
                  title="Delete service"
                  className="p-2 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <ConfirmDeleteModal
          serviceName={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleteLoading}
        />
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border text-sm font-medium transition-all ${
            toast.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {toast.message}
        </div>
      )}
    </div>
  );
}
