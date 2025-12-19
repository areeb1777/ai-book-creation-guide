# Implementation Plan: RAG Chatbot Integration

**Branch**: `001-rag-chatbot` | **Date**: 2025-12-17 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-rag-chatbot/spec.md`

## Summary

Integrate a Retrieval-Augmented Generation (RAG) chatbot into the existing Docusaurus-based book to enable readers to ask questions and receive answers grounded strictly in book content. The system supports two query modes: full-book search and selected-text-only queries. The solution uses FastAPI for the backend, Qdrant Cloud for vector storage, Neon Serverless Postgres for metadata, and OpenAI API for embeddings and generation. The chatbot widget will be embedded in the existing Vercel-hosted book with a separate backend service.

## Technical Context

**Language/Version**: Python 3.11+ (backend), JavaScript/React 19.0 (frontend - existing Docusaurus)
**Primary Dependencies**: FastAPI 0.110+, OpenAI Python SDK 1.10+, Qdrant Client 1.7+, psycopg2 3.1+ (Neon), LangChain 0.1+ (optional RAG utilities)
**Storage**: Qdrant Cloud (vector embeddings), Neon Serverless Postgres (metadata, logs)
**Testing**: pytest 8.0+ (backend), Jest (frontend - existing Docusaurus setup)
**Target Platform**: Linux server/serverless (backend on Railway/Fly.io/Vercel Functions), Web browser (frontend)
**Project Type**: Web application (backend API + frontend integration)
**Performance Goals**:
- p95 query response < 3 seconds (end-to-end)
- p99 vector search < 100ms
- Ingestion: 500 pages in < 10 minutes
- Support 100 concurrent users
**Constraints**:
- Qdrant free tier: 1GB storage, 100 RPM
- Neon free tier: 0.5GB storage, 100 hours/month compute
- OpenAI API rate limits (tier-dependent)
- Stateless API (no server-side sessions)
- 100% grounded answers (no hallucination)
**Scale/Scope**:
- Single book (500 pages max)
- ~1000 document chunks
- Expected load: < 500 concurrent users

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Compliance with AI-Powered Spec-Driven Book Creation Constitution:**

✅ **Using Claude Code to generate structured content**: Plan uses structured approach with clear phases and artifacts

✅ **Building the book using Docusaurus**: Integration preserves existing Docusaurus structure (ai-powered-book/)

✅ **Hosting documentation on GitHub Pages**: Existing book remains on Vercel; new backend is separate service

✅ **End-to-end AI-assisted book creation pipeline**: RAG chatbot enhances the existing pipeline with interactive Q&A

✅ **Content and Formatting Guidelines**: All artifacts use Markdown, technical correctness verified against spec

✅ **Clear separation of concerns**: Frontend (Docusaurus widget) and backend (FastAPI) are independently deployable

**No violations detected.** Proceeding to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/001-rag-chatbot/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
│   └── openapi.yaml     # API contract specification
├── checklists/          # Validation checklists
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
ai-powered-book/                    # Existing Docusaurus book (unchanged)
├── docs/                           # Book content (markdown files)
├── src/
│   ├── components/
│   │   └── ChatbotWidget/         # NEW: React chatbot widget component
│   │       ├── index.tsx
│   │       ├── ChatWindow.tsx
│   │       ├── MessageList.tsx
│   │       ├── styles.module.css
│   │       └── api.ts             # API client for backend
│   ├── pages/
│   └── theme/                      # Docusaurus theme customization
├── static/
├── docusaurus.config.js            # MODIFIED: Add chatbot widget to theme
├── package.json                    # MODIFIED: Add chatbot dependencies
└── README.md

rag-backend/                        # NEW: FastAPI backend service
├── app/
│   ├── __init__.py
│   ├── main.py                     # FastAPI app entry point
│   ├── api/
│   │   ├── __init__.py
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   ├── query.py            # POST /api/query (full-book mode)
│   │   │   ├── query_selected.py   # POST /api/query/selected (selected-text mode)
│   │   │   └── health.py           # GET /api/health
│   │   └── models/
│   │       ├── __init__.py
│   │       ├── request.py          # Request schemas
│   │       └── response.py         # Response schemas
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py               # Environment config loader
│   │   ├── logging.py              # Structured logging setup
│   │   └── security.py             # Input sanitization, rate limiting
│   ├── services/
│   │   ├── __init__.py
│   │   ├── embeddings.py           # OpenAI embedding generation
│   │   ├── vector_store.py         # Qdrant client wrapper
│   │   ├── query_pipeline.py       # RAG query orchestration
│   │   ├── answer_generator.py     # OpenAI answer generation
│   │   └── metadata_store.py       # Neon Postgres client
│   └── utils/
│       ├── __init__.py
│       ├── chunking.py             # Document chunking logic
│       └── markdown_parser.py      # Parse Docusaurus markdown
├── ingestion/
│   ├── __init__.py
│   ├── ingest.py                   # Main ingestion script
│   ├── chunk_strategy.py           # Chunking strategies
│   └── metadata_extractor.py       # Extract chapter/section from markdown
├── tests/
│   ├── __init__.py
│   ├── conftest.py                 # Pytest fixtures
│   ├── unit/
│   │   ├── test_chunking.py
│   │   ├── test_embeddings.py
│   │   └── test_query_pipeline.py
│   ├── integration/
│   │   ├── test_api_endpoints.py
│   │   └── test_vector_store.py
│   └── contract/
│       └── test_openapi_compliance.py
├── scripts/
│   ├── setup_qdrant.py             # Create Qdrant collection
│   ├── setup_neon.py               # Initialize Neon schema
│   ├── run_ingestion.py            # Wrapper for ingestion pipeline
│   └── export_db_schema.py         # Export Neon schema for backup
├── requirements.txt                # Python dependencies
├── requirements-dev.txt            # Development dependencies
├── .env.example                    # Environment variable template
├── Dockerfile                      # Container for deployment
├── railway.json                    # Railway deployment config (optional)
├── fly.toml                        # Fly.io deployment config (optional)
└── README.md                       # Backend setup and deployment guide

backup/                             # NEW: Content backup and regeneration
├── docs/                           # Snapshot of ai-powered-book/docs/
│   ├── chapter-1-spec-kit.md
│   ├── chapter-2-claude-code.md
│   ├── chapter-3-docusaurus.md
│   ├── chapter-4-github-pages.md
│   ├── chapter-5-best-practices.md
│   └── intro.md
├── scripts/
│   ├── snapshot_content.sh         # Copy docs/ to backup/
│   ├── regenerate_embeddings.sh    # Re-run ingestion from backup
│   └── restore_from_backup.sh      # Restore docs/ from backup
├── schemas/
│   └── neon_schema.sql             # Neon database schema export
├── metadata.json                   # Backup timestamp, version info
└── README.md                       # Backup workflow documentation
```

**Structure Decision**: Web application architecture with clear separation:
1. **Frontend** (`ai-powered-book/src/components/ChatbotWidget/`): React component embedded in existing Docusaurus site
2. **Backend** (`rag-backend/`): Standalone FastAPI service with RAG pipeline
3. **Backup** (`backup/`): Content snapshots and regeneration utilities

The existing Docusaurus book structure is preserved. Only additions are made to integrate the chatbot widget.

## Complexity Tracking

No constitution violations. All complexity is justified by requirements:
- Separate backend service: Required for stateless API and independent deployment (FR-015, FR-016)
- Vector database: Required for semantic search over book content (FR-003, FR-012)
- Metadata database: Required for logging, session tracking, and audit trail (FR-022)
- Dual query modes: Required by specification (FR-004, FR-005)

## High-Level Architecture

### System Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Journey                             │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Docusaurus Book (Vercel)                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Book Page with Embedded ChatbotWidget (React)            │  │
│  │  - User types question OR selects text + clicks "Ask"    │  │
│  │  - Widget calls backend API via HTTPS                    │  │
│  │  - Displays answer with clickable source references      │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼ POST /api/query or /api/query/selected
┌─────────────────────────────────────────────────────────────────┐
│              FastAPI Backend (Railway/Fly.io/Vercel)            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  1. Validate & sanitize input (core/security.py)         │  │
│  │  2. Generate query embedding (services/embeddings.py)    │  │
│  │  3. Retrieve top-k chunks (services/vector_store.py)     │  │
│  │  4. Compose prompt with context (services/query_pipeline)│  │
│  │  5. Generate answer (services/answer_generator.py)       │  │
│  │  6. Log query/response (services/metadata_store.py)      │  │
│  │  7. Return answer + sources                              │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                    │                           │
                    ▼                           ▼
        ┌───────────────────┐       ┌──────────────────────┐
        │  Qdrant Cloud     │       │  Neon Serverless     │
        │  (Vector DB)      │       │  Postgres            │
        │  - Embeddings     │       │  - Query logs        │
        │  - Metadata       │       │  - Session metadata  │
        │  - Similarity     │       │  - Ingestion logs    │
        │    search         │       └──────────────────────┘
        └───────────────────┘
                    ▲
                    │
        ┌───────────────────────────┐
        │  Ingestion Pipeline       │
        │  (runs offline)           │
        │  1. Read docs/*.md        │
        │  2. Chunk with overlap    │
        │  3. Generate embeddings   │
        │  4. Store in Qdrant       │
        │  5. Update metadata       │
        └───────────────────────────┘
                    ▲
                    │
        ┌───────────────────────────┐
        │  backup/docs/             │
        │  (content snapshots)      │
        └───────────────────────────┘
```

### Layer Separation

**Frontend Layer** (Docusaurus + React):
- Chatbot UI widget embedded in all book pages
- Handles user interactions (text input, text selection)
- Makes API calls to backend
- Renders answers with clickable references
- No business logic, purely presentational

**Backend Layer** (FastAPI):
- Stateless REST API
- RAG query orchestration
- Input validation and security
- Logging and monitoring
- Independent deployment from frontend

**Data Layer**:
- **Qdrant Cloud**: Vector embeddings, semantic search
- **Neon Postgres**: Query logs, session metadata, ingestion status
- **Backup folder**: Content snapshots for disaster recovery

**Integration Points**:
- Frontend → Backend: HTTPS REST API (CORS configured)
- Backend → Qdrant: Qdrant Python client (gRPC or HTTP)
- Backend → Neon: psycopg2/asyncpg (PostgreSQL protocol)
- Backend → OpenAI: OpenAI Python SDK (HTTPS)

## Component Breakdown

### 1. Document Ingestion Pipeline

**Purpose**: Convert book markdown files into searchable chunks with embeddings

**Tech Stack**: Python, OpenAI Embeddings API, Qdrant Client, Markdown parser

**Inputs**:
- Source: `ai-powered-book/docs/*.md` or `backup/docs/*.md`
- Config: Chunk size (500-1000 tokens), overlap (50-100 tokens), top-k (5)

**Outputs**:
- Qdrant collection populated with document chunk embeddings
- Metadata: chapter, section, source file, page number, heading hierarchy
- Ingestion log in Neon Postgres (timestamp, chunk count, errors)

**Process**:
1. Scan `docs/` directory for markdown files
2. Parse markdown to extract headings (H1=chapter, H2=section)
3. Split content into chunks with overlap (preserve context)
4. Generate embeddings for each chunk (OpenAI `text-embedding-3-small`)
5. Store embeddings in Qdrant with metadata payload
6. Log ingestion status in Neon

**Key Files**:
- `rag-backend/ingestion/ingest.py`
- `rag-backend/ingestion/chunk_strategy.py`
- `rag-backend/app/utils/chunking.py`
- `rag-backend/app/utils/markdown_parser.py`

### 2. Vector Storage (Qdrant)

**Purpose**: Store and retrieve document embeddings via semantic similarity search

**Tech Stack**: Qdrant Cloud (managed service), Qdrant Python client

**Inputs**:
- Embeddings: 1536-dimensional vectors (OpenAI embedding model)
- Metadata: `{chapter, section, source_file, heading, page_number}`

**Outputs**:
- Top-k most similar chunks for a query embedding
- Similarity scores (0-1)

**Configuration**:
- Collection name: `book_chunks`
- Vector size: 1536 (OpenAI `text-embedding-3-small`)
- Distance metric: Cosine similarity
- Index: HNSW (default, optimized for high-dimensional vectors)

**Key Files**:
- `rag-backend/app/services/vector_store.py`
- `rag-backend/scripts/setup_qdrant.py`

### 3. Metadata Storage (Neon Postgres)

**Purpose**: Store query logs, session metadata, ingestion logs

**Tech Stack**: Neon Serverless Postgres, psycopg2/asyncpg

**Schema**:

**Table: `query_logs`**
- `id` (UUID, PK)
- `session_id` (UUID, indexed)
- `query_text` (TEXT)
- `query_mode` (ENUM: 'full_book', 'selected_text')
- `selected_text` (TEXT, nullable)
- `answer_text` (TEXT)
- `source_chunks` (JSONB) - Array of {chapter, section, file, score}
- `response_time_ms` (INTEGER)
- `created_at` (TIMESTAMP)

**Table: `ingestion_logs`**
- `id` (UUID, PK)
- `started_at` (TIMESTAMP)
- `completed_at` (TIMESTAMP, nullable)
- `status` (ENUM: 'running', 'completed', 'failed')
- `total_chunks` (INTEGER)
- `error_message` (TEXT, nullable)

**Key Files**:
- `rag-backend/app/services/metadata_store.py`
- `rag-backend/scripts/setup_neon.py`
- `backup/schemas/neon_schema.sql`

### 4. RAG Query Pipeline

**Purpose**: Orchestrate the full RAG flow from query to answer

**Tech Stack**: Python, OpenAI Chat Completions API, LangChain (optional)

**Inputs**:
- Query text (string)
- Query mode (enum: 'full_book' or 'selected_text')
- Selected text (optional, for 'selected_text' mode)
- Conversation history (optional, for follow-up questions)

**Outputs**:
- Generated answer (string)
- Source citations (list of {chapter, section, file, page})
- Confidence score (float, 0-1)

**Process**:
1. **Validate input**: Check query length (3-500 words), sanitize for injection
2. **Generate query embedding**: Call OpenAI Embeddings API
3. **Retrieve context**:
   - **Full-book mode**: Query Qdrant for top-k similar chunks
   - **Selected-text mode**: Use selected text as context (no vector search)
4. **Compose prompt**:
   - System prompt: "Answer based ONLY on provided context. If unsure, say so."
   - Context: Retrieved chunks or selected text
   - User query
   - Conversation history (if provided)
5. **Generate answer**: Call OpenAI Chat Completions API (gpt-4o-mini or gpt-3.5-turbo)
6. **Extract sources**: Parse chunk metadata to generate citations
7. **Log query/answer**: Write to Neon Postgres
8. **Return response**: JSON with answer, sources, metadata

**Key Files**:
- `rag-backend/app/services/query_pipeline.py`
- `rag-backend/app/services/answer_generator.py`
- `rag-backend/app/api/routes/query.py`
- `rag-backend/app/api/routes/query_selected.py`

### 5. Selected-Text-Only Query Flow

**Purpose**: Answer questions based exclusively on user-selected text

**Tech Stack**: Same as RAG Query Pipeline

**Inputs**:
- Query text
- Selected text (required, min 1 sentence)

**Outputs**:
- Answer constrained to selected text only
- No vector search performed

**Process**:
1. Validate selected text length (min 20 chars, ~1 sentence)
2. Skip embedding generation and vector search
3. Compose prompt with selected text as sole context
4. Generate answer using OpenAI API
5. Return answer with disclaimer: "Based on your selected text..."

**Key Files**:
- `rag-backend/app/api/routes/query_selected.py`

### 6. Frontend Chatbot Widget Integration

**Purpose**: Embed interactive chatbot UI in Docusaurus book

**Tech Stack**: React 19, TypeScript, CSS Modules, Docusaurus theming

**Components**:
- `ChatbotWidget/index.tsx`: Main widget container (collapsible)
- `ChatWindow.tsx`: Chat interface with message list and input
- `MessageList.tsx`: Display messages (user queries, bot answers, sources)
- `api.ts`: HTTP client for backend API calls

**Integration Method**:
- Add widget to Docusaurus theme via `docusaurus.config.js`
- Use Docusaurus `<BrowserOnly>` component (client-side only)
- Position: Fixed bottom-right corner (floating button)
- State: Collapsed by default, expands on click

**User Interactions**:
1. **Text query**: User types question, clicks send
   - Call `POST /api/query` with query text and conversation history
   - Display answer with clickable source links
2. **Selected-text query**: User highlights text, clicks "Ask about this"
   - Call `POST /api/query/selected` with query + selected text
   - Display answer with disclaimer

**Key Files**:
- `ai-powered-book/src/components/ChatbotWidget/*`
- `ai-powered-book/docusaurus.config.js` (modified)

## API Design (FastAPI)

### Base URL
- Development: `http://localhost:8000`
- Production: `https://rag-backend.railway.app` (or Fly.io/Vercel domain)

### Authentication Strategy
- **API Key in Header**: `X-API-Key: <secret>` (for production, optional)
- **CORS**: Allow origin `https://your-book.vercel.app`
- **Rate Limiting**: 100 requests/hour per IP (using `slowapi` middleware)

### Endpoints

#### 1. POST /api/query (Full-Book Query)

**Purpose**: Answer question using full book corpus

**Request**:
```json
{
  "query": "What is Spec-Kit Plus?",
  "conversation_history": [
    {"role": "user", "content": "Previous question"},
    {"role": "assistant", "content": "Previous answer"}
  ],
  "session_id": "uuid-v4" // optional
}
```

**Response** (200 OK):
```json
{
  "answer": "Spec-Kit Plus is a structured workflow for...",
  "sources": [
    {
      "chapter": "Chapter 1",
      "section": "Introduction to Spec-Kit Plus",
      "file": "chapter-1-spec-kit.md",
      "url": "/docs/chapter-1-spec-kit#introduction",
      "similarity_score": 0.92
    }
  ],
  "session_id": "uuid-v4",
  "response_time_ms": 1250
}
```

**Errors**:
- 400: Invalid query (too short/long, sanitization failed)
- 429: Rate limit exceeded
- 500: Internal error (Qdrant/OpenAI unavailable)
- 503: Service unavailable (vector DB down)

#### 2. POST /api/query/selected (Selected-Text Query)

**Purpose**: Answer question using only user-selected text

**Request**:
```json
{
  "query": "Can you explain this paragraph?",
  "selected_text": "The full paragraph user selected...",
  "session_id": "uuid-v4" // optional
}
```

**Response** (200 OK):
```json
{
  "answer": "Based on your selected text, this paragraph explains...",
  "mode": "selected_text",
  "session_id": "uuid-v4",
  "response_time_ms": 980
}
```

**Errors**: Same as `/api/query`

#### 3. GET /api/health

**Purpose**: Health check for monitoring

**Response** (200 OK):
```json
{
  "status": "healthy",
  "services": {
    "qdrant": "connected",
    "neon": "connected",
    "openai": "api_key_valid"
  },
  "version": "1.0.0",
  "uptime_seconds": 3600
}
```

**Errors**:
- 503: Service degraded (one or more services unavailable)

### API Contract
- Full OpenAPI 3.0 spec: `specs/001-rag-chatbot/contracts/openapi.yaml`
- Generated from FastAPI schema
- Includes request/response schemas, error codes, examples

## RAG Logic Plan

### Chunking Strategy

**Objective**: Split book content into chunks that preserve context and enable accurate retrieval

**Parameters**:
- Chunk size: 800 tokens (~600 words)
- Overlap: 100 tokens (~75 words)
- Separator: Paragraph boundaries (`\n\n`)
- Preserve: Heading hierarchy (include parent H1/H2 in chunk metadata)

**Algorithm** (semantic chunking):
1. Parse markdown to extract heading hierarchy
2. Split on paragraph boundaries
3. Accumulate paragraphs until chunk size reached
4. Add overlap from previous chunk
5. Tag each chunk with: `{chapter, section, subsection, file}`

**Special Handling**:
- **Code blocks**: Keep intact (don't split mid-code)
- **Lists**: Keep list items together
- **Tables**: Keep entire table in one chunk (or split by rows if large)
- **Images/Diagrams**: Store as metadata reference (e.g., `[IMAGE: Figure 3.1]`)

**Implementation**: `rag-backend/app/utils/chunking.py`

### Embedding Generation Workflow

**Model**: OpenAI `text-embedding-3-small` (1536 dimensions)
- Why: Balance between quality and cost/speed
- Alternative: `text-embedding-3-large` (3072 dimensions, higher quality)

**Batch Processing**:
- Batch size: 100 chunks per API call (OpenAI limit: 2048 inputs)
- Retry logic: Exponential backoff for rate limits
- Cost estimate: ~$0.02 per 1M tokens (500 pages ≈ 500k tokens ≈ $0.01)

**Workflow**:
1. Load chunk text
2. Call OpenAI Embeddings API
3. Receive 1536-dim vector
4. Store in Qdrant with metadata

**Implementation**: `rag-backend/app/services/embeddings.py`

### Retrieval Strategy

**Top-k Selection**: Default k=5 (configurable 3-10)
- Why: Balance between context richness and prompt length
- Trade-off: More chunks = better coverage but slower, more expensive

**Similarity Metric**: Cosine similarity
- Range: 0 (unrelated) to 1 (identical)
- Threshold: 0.7 (discard chunks below threshold to avoid noise)

**Filtering** (optional enhancements):
- By chapter: If query mentions "Chapter 3", filter to chapter 3 chunks
- By recency: Prioritize newer content if book is versioned

**Re-ranking** (future enhancement):
- Use cross-encoder model to re-rank top-k chunks
- Improves relevance at cost of latency

**Implementation**: `rag-backend/app/services/vector_store.py`

### Prompt Composition Rules

**Objective**: Ensure answers are grounded in retrieved context only (no hallucination)

**System Prompt**:
```
You are a helpful assistant answering questions about a book.
Answer ONLY based on the provided context excerpts.
If the context doesn't contain the answer, respond: "I couldn't find information about that in this book."
Always cite the source (chapter and section) for your answers.
```

**Context Format**:
```
Context:
---
[Chapter 1, Section 2: Introduction to Spec-Kit Plus]
{chunk_text_1}

[Chapter 3, Section 1: Claude Code Setup]
{chunk_text_2}
---

Question: {user_query}

Answer:
```

**Constraints**:
- Max prompt length: 8000 tokens (GPT-3.5-turbo: 16k context, leave room for answer)
- If context exceeds limit: Truncate to top-3 chunks with highest scores

**Follow-up Handling**:
- Include last 2 turns of conversation history in prompt
- Format: `Previous Q: ... Previous A: ... Current Q: ...`

**Implementation**: `rag-backend/app/services/query_pipeline.py`

### Answer Generation

**Model**: OpenAI `gpt-3.5-turbo-0125` (default) or `gpt-4o-mini` (higher quality)
- Temperature: 0.3 (balance between creativity and determinism)
- Max tokens: 500 (concise answers)
- Stop sequences: None

**Post-Processing**:
1. Extract source citations from answer (if model includes them)
2. Validate answer length (min 20 chars, max 1000 chars)
3. Sanitize for HTML rendering (escape special chars)

**Implementation**: `rag-backend/app/services/answer_generator.py`

## Deployment & Environment Plan

### Backend Deployment Options

**Option 1: Railway (Recommended)**
- **Pros**: Simple setup, auto-scaling, Postgres addon available
- **Cons**: Pricing starts at $5/month after free tier
- **Setup**: Push to GitHub → Connect Railway → Set env vars → Deploy

**Option 2: Fly.io**
- **Pros**: Good free tier (3 shared VMs), global edge locations
- **Cons**: Requires Dockerfile, more manual setup
- **Setup**: `fly launch` → Configure `fly.toml` → `fly deploy`

**Option 3: Vercel Functions (Serverless)**
- **Pros**: Already hosting book on Vercel, free tier generous
- **Cons**: Cold start latency, 10s timeout (may be tight for RAG)
- **Setup**: Create `api/` directory → Deploy alongside book

**Chosen**: Railway (easiest for Python + Postgres, good free tier)

### Required Environment Variables

**Backend (rag-backend/.env)**:
```bash
# OpenAI API
OPENAI_API_KEY=sk-...
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
OPENAI_CHAT_MODEL=gpt-3.5-turbo-0125

# Qdrant Cloud
QDRANT_URL=https://xyz.cloud.qdrant.io
QDRANT_API_KEY=...
QDRANT_COLLECTION_NAME=book_chunks

# Neon Serverless Postgres
DATABASE_URL=postgresql://user:pass@ep-xyz.neon.tech/dbname?sslmode=require

# API Config
API_KEY=optional-secret-key-for-frontend
CORS_ORIGINS=https://your-book.vercel.app
RATE_LIMIT_PER_HOUR=100

# Logging
LOG_LEVEL=INFO
SENTRY_DSN=optional-error-tracking
```

**Frontend (ai-powered-book/.env.local)**:
```bash
REACT_APP_RAG_API_URL=https://rag-backend.railway.app
REACT_APP_RAG_API_KEY=optional-secret-key
```

### Free-Tier Constraints & Optimizations

**Qdrant Cloud Free Tier**:
- Limit: 1GB storage (~1M vectors), 100 RPM
- Optimization: Reduce chunk count by increasing chunk size (800→1200 tokens)
- Monitoring: Track storage usage via Qdrant dashboard

**Neon Free Tier**:
- Limit: 0.5GB storage, 100 compute hours/month
- Optimization: Enable auto-pause (sleep after 5 min idle)
- Monitoring: Track compute hours via Neon dashboard

**OpenAI API**:
- Cost: ~$0.01 per ingestion + ~$0.001 per query
- Optimization: Cache embeddings (don't regenerate for same content)
- Monitoring: Track token usage via OpenAI dashboard

**Railway/Fly.io**:
- Free tier: 500 hours/month (Railway), 3 shared VMs (Fly.io)
- Optimization: Use lightweight Docker image, auto-sleep on idle
- Monitoring: Track usage via platform dashboard

### Deployment Steps

1. **Setup External Services**:
   - Create Qdrant Cloud account → New cluster → Get API key
   - Create Neon account → New database → Get connection string
   - Get OpenAI API key → Set usage limits

2. **Deploy Backend**:
   - Push `rag-backend/` to GitHub
   - Connect Railway/Fly.io to repo
   - Set environment variables
   - Deploy (auto-build from Dockerfile)

3. **Run Ingestion**:
   - SSH into Railway/Fly.io or run locally
   - `python rag-backend/scripts/run_ingestion.py`
   - Verify chunks in Qdrant dashboard

4. **Update Frontend**:
   - Add `REACT_APP_RAG_API_URL` to Vercel env vars
   - Deploy updated `ai-powered-book/` to Vercel
   - Test chatbot widget on deployed site

5. **Monitor & Maintain**:
   - Check Railway/Fly.io logs for errors
   - Monitor Qdrant/Neon usage
   - Set up alerts for API failures

## Execution Order

### Phase 0: Setup & Research (Complete before coding)
✅ **Already Complete**: Research decisions documented in plan

### Phase 1: Project Initialization (Days 1-2)

1. **Create backend project structure**:
   ```bash
   mkdir rag-backend
   cd rag-backend
   python -m venv venv
   source venv/bin/activate  # or venv\Scripts\activate on Windows
   pip install fastapi uvicorn openai qdrant-client psycopg2-binary python-dotenv
   pip freeze > requirements.txt
   ```

2. **Setup external services**:
   - Sign up for Qdrant Cloud → Create collection (`book_chunks`)
   - Sign up for Neon → Create database → Run schema SQL
   - Get OpenAI API key → Set usage limits

3. **Create .env files**:
   - Copy `.env.example` → `.env`
   - Fill in all API keys and URLs

4. **Initialize backup folder**:
   ```bash
   mkdir backup
   cp -r ai-powered-book/docs/ backup/docs/
   ```

### Phase 2: Ingestion Pipeline (Days 3-4)

5. **Implement chunking logic**:
   - `rag-backend/app/utils/markdown_parser.py`
   - `rag-backend/app/utils/chunking.py`

6. **Implement ingestion script**:
   - `rag-backend/ingestion/ingest.py`
   - `rag-backend/app/services/embeddings.py`
   - `rag-backend/app/services/vector_store.py`

7. **Run ingestion**:
   ```bash
   python rag-backend/scripts/run_ingestion.py
   ```
   - Verify: Check Qdrant dashboard for ~1000 chunks

### Phase 3: Backend API (Days 5-7)

8. **Implement core services**:
   - `rag-backend/app/services/query_pipeline.py`
   - `rag-backend/app/services/answer_generator.py`
   - `rag-backend/app/services/metadata_store.py`

9. **Implement API endpoints**:
   - `rag-backend/app/api/routes/query.py`
   - `rag-backend/app/api/routes/query_selected.py`
   - `rag-backend/app/api/routes/health.py`

10. **Add security & logging**:
    - `rag-backend/app/core/security.py` (input sanitization, rate limiting)
    - `rag-backend/app/core/logging.py` (structured logging)

11. **Test locally**:
    ```bash
    uvicorn app.main:app --reload
    # Test with curl or Postman
    ```

### Phase 4: Frontend Integration (Days 8-9)

12. **Create chatbot widget component**:
    - `ai-powered-book/src/components/ChatbotWidget/index.tsx`
    - `ai-powered-book/src/components/ChatbotWidget/api.ts`

13. **Integrate widget into Docusaurus**:
    - Modify `ai-powered-book/docusaurus.config.js`
    - Add widget to theme

14. **Test integration locally**:
    ```bash
    cd ai-powered-book
    npm start
    # Test chatbot on localhost:3000
    ```

### Phase 5: Deployment (Days 10-11)

15. **Deploy backend**:
    - Push `rag-backend/` to GitHub
    - Connect Railway/Fly.io
    - Set env vars
    - Deploy & verify health endpoint

16. **Deploy frontend**:
    - Update `REACT_APP_RAG_API_URL` in Vercel
    - Push to GitHub → Auto-deploy to Vercel

17. **End-to-end testing**:
    - Test chatbot on production URL
    - Verify full-book and selected-text modes
    - Check source citations are clickable

### Phase 6: Backup & Documentation (Days 12-13)

18. **Setup backup workflow**:
    - `backup/scripts/snapshot_content.sh`
    - `backup/scripts/regenerate_embeddings.sh`

19. **Export database schema**:
    ```bash
    python rag-backend/scripts/export_db_schema.py > backup/schemas/neon_schema.sql
    ```

20. **Write documentation**:
    - `rag-backend/README.md` (setup, deployment, API docs)
    - `backup/README.md` (backup workflow)

### Phase 7: Testing & Validation (Days 14-15)

21. **Write unit tests**:
    - `rag-backend/tests/unit/test_*.py`

22. **Write integration tests**:
    - `rag-backend/tests/integration/test_*.py`

23. **Manual QA**:
    - Test edge cases (long queries, non-English, rapid requests)
    - Verify all success criteria from spec

24. **Performance testing**:
    - Load test with 100 concurrent users
    - Verify p95 response time < 3 seconds

### Phase 8: Monitoring & Launch (Day 16+)

25. **Setup monitoring**:
    - Add Sentry for error tracking (optional)
    - Setup alerts for API failures

26. **Launch & announce**:
    - Announce chatbot feature to users
    - Monitor logs for first 24 hours

27. **Iterate based on feedback**:
    - Track query quality
    - Adjust chunking/prompt if needed

## Success Metrics Tracking

**During Development**:
- [ ] Ingestion processes 500 pages in < 10 minutes (SC-006)
- [ ] Vector search returns results in < 100ms (SC-007)
- [ ] All API endpoints return appropriate errors (SC-011)

**Post-Launch** (measure after 1 week):
- [ ] 95% of queries answered in < 3 seconds (SC-001)
- [ ] 100% of answers have verifiable sources (SC-002)
- [ ] 90%+ of answers include clickable references (SC-003)
- [ ] System handles 100 concurrent users (SC-010)
- [ ] Zero security incidents (SC-012)

## Next Steps

After this plan is approved:
1. Run `/sp.tasks` to generate detailed implementation tasks from this plan
2. Begin Phase 1: Project Initialization
3. Set up weekly check-ins to review progress and adjust priorities

## References

- **Feature Spec**: [spec.md](./spec.md)
- **OpenAPI Contract**: [contracts/openapi.yaml](./contracts/openapi.yaml) (generated in Phase 1)
- **Data Model**: [data-model.md](./data-model.md) (generated in Phase 1)
- **Quickstart Guide**: [quickstart.md](./quickstart.md) (generated in Phase 1)
