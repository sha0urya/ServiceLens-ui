const BASE = '/api';

async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}

/**
 * Ingest a service. Strategy is auto-selected by the backend:
 *   - Not registered yet → FRESH (full pipeline)
 *   - Registered, force=false → INCREMENTAL (changed files only, ~32× faster)
 *   - Registered, force=true → FORCE_FULL (purge + full pipeline)
 *
 * Response shape differs by strategy:
 *   FRESH / FORCE_FULL → { serviceName, totalCodeChunks, totalDocChunks, totalClasses, totalMethods, cfgNodes, ... }
 *   INCREMENTAL        → { serviceName, added, modified, deleted, unchanged }
 */
export function ingest(repoPath, serviceName, force = false) {
  return request(`${BASE}/ingest`, {
    method: 'POST',
    body: JSON.stringify({ repoPath, serviceName, force: String(force) }),
  });
}

/** @deprecated Use ingest() with force=false — the backend auto-selects INCREMENTAL */
export function ingestFull(repoPath, serviceName) {
  return ingest(repoPath, serviceName, false);
}

/** @deprecated Use ingest() — the backend auto-selects INCREMENTAL when service is registered */
export function ingestIncremental(repoPath, serviceName) {
  return ingest(repoPath, serviceName, false);
}

// ── Service management ─────────────────────────────────────────────────────

/** Returns all registered services from the service registry. */
export function listServices() {
  return request(`${BASE}/services`, { headers: {} });
}

/** Returns a single service by name, or rejects with HTTP 404 if not found. */
export function getService(serviceName) {
  return request(`${BASE}/services/${encodeURIComponent(serviceName)}`, { headers: {} });
}

/**
 * Deletes a service completely:
 * Neo4j nodes + pgvector embeddings + file hashes + registry entry.
 * Rejects with HTTP 404 if the service is not registered.
 */
export function deleteService(serviceName) {
  return request(`${BASE}/services/${encodeURIComponent(serviceName)}`, {
    method: 'DELETE',
  });
}

// ── Retrieval & query ──────────────────────────────────────────────────────

export function retrieve(query, serviceName, topK = 8) {
  const params = new URLSearchParams({ query, serviceName, topK: String(topK) });
  return request(`${BASE}/retrieve?${params}`, {
    headers: {},
  });
}

export function queryIntent(query, serviceName) {
  return request(`${BASE}/query`, {
    method: 'POST',
    body: JSON.stringify({ query, serviceName }),
  });
}

/**
 * Send a query to the /api/ask endpoint with automatic session management.
 *
 * On the first call for a service, no sessionId is sent → backend creates a new
 * session and returns its UUID. On subsequent calls the stored sessionId is sent
 * back so the backend can inject prior conversation turns as context for the LLM.
 *
 * Sessions are stored per service in localStorage under the key `sl-session-{serviceName}`.
 * Changing the service name automatically starts a fresh session without any extra logic.
 */
export function ask(query, serviceName, signal) {
  const sessionKey = `sl-session-${serviceName}`;
  const sessionId  = localStorage.getItem(sessionKey);

  return request(`${BASE}/ask`, {
    method: 'POST',
    body: JSON.stringify({ query, serviceName, sessionId: sessionId || null }),
    signal,
  }).then((data) => {
    if (data.sessionId) {
      localStorage.setItem(sessionKey, data.sessionId);
    }
    return data;
  });
}
