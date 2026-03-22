# ServiceLens UI

React frontend for [ServiceLens](https://github.com/SamridhiParihar/ServiceLens) — a code intelligence platform for Java backends. Provides a dark-themed SPA with three pages: ask questions about your codebase, ingest services, and explore raw semantic search results.

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
Trigger full or incremental ingestion of a Java service.

- **Full Ingest** — `POST /api/ingest` — re-indexes the entire service from scratch
- **Incremental** — `POST /api/ingest/incremental` — processes only added/modified/deleted files (~32× faster)
- Displays result stats: code chunks, doc chunks, classes, methods, CFG nodes
- Full ingest shows chunk type breakdown table
- Incremental shows file change counts: added / modified / deleted / unchanged
- Repo path and service name persisted in localStorage

### Explore (`/explore`)
Raw semantic similarity search over the vector store — no LLM synthesis.

- Sends queries to `GET /api/retrieve`
- Top K slider (1–50, default 8)
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
│   │   └── SearchBar.jsx        # Search form with topK slider
│   ├── ingest/
│   │   ├── IngestForm.jsx       # Repo path + service name + mode toggle
│   │   ├── FullIngestResult.jsx # Stats cards + chunk breakdown table
│   │   └── IncrementalResult.jsx# Change count stats cards
│   ├── layout/
│   │   ├── AppLayout.jsx        # Root layout with collapsible sidebar
│   │   └── Sidebar.jsx          # Navigation (Ask / Ingest / Explore)
│   └── shared/
│       ├── Badge.jsx            # Color-coded intent, type, confidence badges
│       ├── CodeBlock.jsx        # Syntax-highlighted code with copy button
│       ├── LoadingSpinner.jsx   # Animated loading indicator
│       └── StatsCard.jsx        # Icon + number + label stat display
├── pages/
│   ├── AskPage.jsx
│   ├── IngestPage.jsx
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
| `ask(query, serviceName, signal)` | POST | `/api/ask` | AskPage |
| `ingestFull(repoPath, serviceName)` | POST | `/api/ingest` | IngestPage |
| `ingestIncremental(repoPath, serviceName)` | POST | `/api/ingest/incremental` | IngestPage |
| `retrieve(query, serviceName, topK)` | GET | `/api/retrieve` | ExplorePage |

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

- `useState` — query input, messages, loading flags, results
- `useEffect` — auto-scroll to latest chat message, localStorage sync
- `useRef` — message container ref for scroll control
- localStorage — persists `sl-serviceName`, `sl-repoPath`, sidebar collapsed state across page reloads

---

## Design System

**Color scheme:** Dark (gray-950 background, gray-100 text)

| Color | Use |
|---|---|
| Indigo-600 | Primary buttons, active nav, focus rings |
| Emerald | Success states, incremental add counts |
| Amber | Warning, modified file counts |
| Red | Errors, delete counts |
| Cyan / Sky | Info badges, endpoint tags |
| Gray-800 | Input backgrounds, card borders |

**Sidebar:** Collapses to 16px (icon-only) or expands to 256px. State persisted in localStorage.

**Code blocks:** Prism `oneDark` theme with a copy-to-clipboard button.

**Badges:** Color-coded by variant — intent type, chunk type, confidence level, model name.
