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

export function ingestFull(repoPath, serviceName) {
  return request(`${BASE}/ingest`, {
    method: 'POST',
    body: JSON.stringify({ repoPath, serviceName }),
  });
}

export function ingestIncremental(repoPath, serviceName) {
  return request(`${BASE}/ingest/incremental`, {
    method: 'POST',
    body: JSON.stringify({ repoPath, serviceName }),
  });
}

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

export function ask(query, serviceName, signal) {
  return request(`${BASE}/ask`, {
    method: 'POST',
    body: JSON.stringify({ query, serviceName }),
    signal,
  });
}
