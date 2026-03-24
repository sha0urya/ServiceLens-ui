# ServiceLens UI

React frontend for [ServiceLens](https://github.com/SamridhiParihar/ServiceLens) — a code intelligence platform for Java backends. Provides a dark-themed SPA with four pages: ask questions about your codebase, ingest services, manage registered services, and explore raw semantic search results.

---

## Tech Stack

| Concern | Technology |
|---|---|
| Framework | React 19 |
| Routing | React Router v7 |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| Markdown | react-markdown |
| Syntax Highlighting | react-syntax-highlighter (Prism) |

---

## Pages

### Ask (`/`)
Chat interface for natural-language queries about an ingested service.

- Sends queries to `POST /api/ask`
- Renders answers as markdown with syntax-highlighted code blocks
- Shows intent classification (e.g. `TRACE_CALLERS`, `DEBUG_ERROR`), confidence %, model used, and context chunk count
- Collapsible context panel showing what the backend retrieved: semantic matches, call chain, callers, related classes, HTTP endpoints
- Suggested starter questions for first-time use
- Service name persisted in localStorage between sessions

### Ingest (`/ingest`)
Trigger ingestion of a Java service. The backend auto-selects the strategy — no manual mode selection needed.

- Single endpoint: `POST /api/ingest`
- **Strategy is selected automatically by the backend:**
  - `FRESH` — service not yet registered → full pipeline runs
  - `INCREMENTAL` — service already registered → only changed files processed (~32× faster)
  - `FORCE_FULL` — service registered + force flag → purges all data, then full pipeline runs
- **Force toggle** in the form — off by default; turn on to force a clean re-index
- Result display adapts to the strategy used:
  - Full / FORCE_FULL → stats cards: code chunks, doc chunks, classes, methods, CFG nodes + chunk type breakdown
  - Incremental → file change cards: added / modified / deleted / unchanged
- Success banner shows which strategy the backend actually ran
- Repo path and service name persisted in localStorage

### Services (`/services`)
View and manage all services registered in the ingestion registry.

- Fetches from `GET /api/services` on load
- Shows each service as a card with:
  - Service name and **status badge** (ACTIVE / INGESTING / DELETING / ERROR — colour-coded, with pulse animation for in-progress states)
  - Repository path
  - First ingested timestamp and last updated timestamp
  - File count from last ingestion
- **Delete button** per service — opens a confirmation modal listing exactly what will be removed (Neo4j nodes, pgvector embeddings, file hashes, registry entry)
- Calls `DELETE /api/services/{name}` on confirm; refreshes list automatically
- Delete is disabled while a service is INGESTING or DELETING
- Success / error toast after deletion
- Manual refresh button

### Explore (`/explore`)
Raw semantic similarity search over the vector store — no LLM synthesis.

- Sends queries to `GET /api/retrieve`
- Top K input (1–50, default 8)
- Results shown as code chunk cards with syntax highlighting
- Each card shows: chunk type badge, element name, class name, file path
- Useful for inspecting retrieval quality directly

---

## Project Structure

```
src/
├── api/
│   └── servicelens.js          # All API calls to the backend
├── components/
│   ├── ask/
│   │   ├── AnswerCard.jsx       # AI response with intent/confidence/model metadata
│   │   ├── ChatMessage.jsx      # User / bot message bubbles
│   │   └── ContextPanel.jsx     # Collapsible retrieval context panel
│   ├── explore/
│   │   ├── ChunkCard.jsx        # Code chunk result card
│   │   └── SearchBar.jsx        # Search form with topK input
│   ├── ingest/
│   │   ├── IngestForm.jsx       # Repo path + service name + force toggle + strategy info
│   │   ├── FullIngestResult.jsx # Stats cards + chunk breakdown table
│   │   └── IncrementalResult.jsx# Change count stats cards
│   ├── layout/
│   │   ├── AppLayout.jsx        # Root layout with collapsible sidebar
│   │   └── Sidebar.jsx          # Navigation (Ask / Ingestion / Services / Explorer)
│   └── shared/
│       ├── Badge.jsx            # Color-coded intent, type, confidence badges
│       ├── CodeBlock.jsx        # Syntax-highlighted code with copy button
│       ├── LoadingSpinner.jsx   # Animated loading indicator
│       └── StatsCard.jsx        # Icon + number + label stat display
├── pages/
│   ├── AskPage.jsx
│   ├── IngestPage.jsx
│   ├── ServicesPage.jsx         # Service registry management (list + delete)
│   └── ExplorePage.jsx
├── App.jsx                      # Route definitions
├── main.jsx                     # React entry point
└── index.css                    # Tailwind imports + global styles
```

---

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server (proxies /api to http://localhost:8080)
npm run dev
```

App runs at `http://localhost:5173`.

The backend must be running at `http://localhost:8080` before making any API calls. See the [backend README](../servicelens/README.md) for setup.

```bash
# Production build
npm run build

# Preview production build locally
npm run preview

# Lint
npm run lint
```

---

## API Integration

All backend calls go through `src/api/servicelens.js`. In development, Vite proxies `/api/*` to `http://localhost:8080`.

| Function | Method | Endpoint | Used By |
|---|---|---|---|
| `ingest(repoPath, serviceName, force)` | POST | `/api/ingest` | IngestPage |
| `listServices()` | GET | `/api/services` | ServicesPage |
| `getService(serviceName)` | GET | `/api/services/{name}` | ServicesPage |
| `deleteService(serviceName)` | DELETE | `/api/services/{name}` | ServicesPage |
| `ask(query, serviceName, signal)` | POST | `/api/ask` | AskPage |
| `retrieve(query, serviceName, topK)` | GET | `/api/retrieve` | ExplorePage |
| `queryIntent(query, serviceName)` | POST | `/api/query` | (available, unused in UI) |

`ingest()` sends `force` as a string (`"true"` / `"false"`) to match the backend's request mapping.
`ask()` accepts an optional `AbortSignal` for request cancellation.

To point the app at a different backend URL, update the proxy in `vite.config.js`:

```js
server: {
  proxy: {
    '/api': 'http://your-backend-host:8080'
  }
}
```

---

## State Management

No external state library. All state is local to pages using React hooks.

- `useState` — query input, messages, loading flags, results, delete target
- `useEffect` — auto-scroll to latest chat message, localStorage sync, toast auto-dismiss
- `useCallback` — stable `load` reference in ServicesPage to avoid duplicate fetches
- `useRef` — message container ref for scroll control
- localStorage — persists `sl-serviceName`, `sl-repoPath`, sidebar collapsed state across page reloads

---

## Design System

**Color scheme:** Dark (gray-950 background, gray-100 text)

| Color | Use |
|---|---|
| Indigo-600 | Primary buttons, active nav, focus rings |
| Emerald | Success states, ACTIVE status badge, FRESH ingestion result banner |
| Blue | INCREMENTAL ingestion result banner, INGESTING status badge |
| Amber | Force Full toggle, FORCE_FULL result banner, modified file counts |
| Red | Errors, delete counts, DELETING status badge |
| Cyan / Sky | Info badges, endpoint tags |
| Gray-800 | Input backgrounds, card borders |

**Sidebar:** Collapses to 16px (icon-only) or expands to 256px. State persisted in localStorage. Navigation links: Ask, Ingestion, Services, Explorer.

**Code blocks:** Prism `oneDark` theme with a copy-to-clipboard button.

**Badges:** Color-coded by variant — intent type, chunk type, confidence level, model name, service status.

**Modals:** Delete confirmation modal with backdrop blur, lists exactly what will be deleted.

**Toasts:** Fixed bottom-right, auto-dismiss after 3.5 seconds, success (emerald) or error (red).
