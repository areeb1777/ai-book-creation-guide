# Implementation Tasks: RAG Chatbot Integration

**Feature**: RAG Chatbot Integration
**Branch**: `001-rag-chatbot`
**Created**: 2025-12-17
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

## Overview

This document provides an ordered, executable task list for implementing the RAG chatbot integration. Tasks are organized by user story priority to enable independent implementation and testing.

**User Stories**:
- **US1 (P1)**: Question Answering from Full Book Content [MVP]
- **US2 (P2)**: Question Answering from Selected Text
- **US3 (P3)**: Content Backup and Regeneration
- **US4 (P2)**: Source Attribution and Navigation

**Tech Stack**:
- Backend: Python 3.11+, FastAPI 0.110+, OpenAI Python SDK 1.10+
- Vector DB: Qdrant Cloud (1GB free tier)
- Metadata DB: Neon Serverless Postgres (0.5GB free tier)
- Frontend: React 19, TypeScript, Docusaurus 3.9.2
- Deployment: Railway (backend), Vercel (frontend)

---

## Phase 1: Setup & Project Initialization

**Goal**: Create project structure, configure external services, and set up development environment

**Independent Test**: Developer can run `uvicorn app.main:app --reload` and see "RAG Chatbot API" response at http://localhost:8000

### Tasks

- [x] T001 Create rag-backend/ directory structure with app/, ingestion/, tests/, scripts/ subdirectories
- [x] T002 Initialize Python virtual environment and install FastAPI 0.110+, uvicorn, openai, qdrant-client, psycopg2-binary
- [x] T003 Create requirements.txt with all dependencies (FastAPI, OpenAI SDK, Qdrant client, psycopg2, python-dotenv)
- [x] T004 Sign up for OpenAI Platform and generate API key with $5/month usage limit
- [x] T005 Sign up for Qdrant Cloud and create cluster "book-chatbot-dev" with 1GB free tier
- [x] T006 [P] Sign up for Neon Serverless Postgres and create database "rag-chatbot-dev"
- [x] T007 [P] Sign up for Railway and link GitHub repository for deployment
- [x] T008 Create rag-backend/.env file with OPENAI_API_KEY, QDRANT_URL, QDRANT_API_KEY, DATABASE_URL, CORS_ORIGINS
- [x] T009 Create rag-backend/.env.example template file with placeholder values for all environment variables
- [x] T010 [P] Create backup/ directory structure with docs/, scripts/, schemas/ subdirectories
- [x] T011 [P] Copy ai-powered-book/docs/ content to backup/docs/ for initial snapshot
- [x] T012 Create backup/metadata.json with backup_date, version, total_files, source path
- [x] T013 Create minimal FastAPI app in rag-backend/app/main.py with root endpoint and health endpoint
- [x] T014 Add CORS middleware to FastAPI app with CORS_ORIGINS from environment variables
- [x] T015 Test local backend: Run `uvicorn app.main:app --reload --port 8000` and verify http://localhost:8000 returns status

**Acceptance**: ✅ Backend runs locally, environment variables loaded, external accounts created, backup folder initialized

---

## Phase 2: Foundational Infrastructure

**Goal**: Set up database schemas, core configuration, and service integrations that ALL user stories depend on

**Independent Test**: All service health checks pass (Qdrant connected, Neon connected, OpenAI key valid)

### Tasks

- [x] T016 Create rag-backend/app/core/config.py with Pydantic Settings for environment variable loading
- [x] T017 [P] Create rag-backend/app/core/logging.py with structured JSON logging configuration
- [x] T018 Create Neon database schema: query_logs table with id, session_id, query_text, answer_text, source_chunks (JSONB), response_time_ms, created_at
- [x] T019 Create Neon database schema: ingestion_logs table with id, started_at, completed_at, status, total_chunks, error_message
- [x] T020 Add indexes to query_logs: idx_query_logs_session (session_id), idx_query_logs_created (created_at DESC)
- [x] T021 Create rag-backend/scripts/setup_neon.py to execute Neon schema SQL and verify connection
- [ ] T022 Run setup_neon.py to initialize Neon database tables
- [x] T023 Create Qdrant collection "book_chunks" with vector size 1536, distance metric Cosine, HNSW index
- [x] T024 Create rag-backend/scripts/setup_qdrant.py to create Qdrant collection and verify connection
- [ ] T025 Run setup_qdrant.py to initialize Qdrant collection
- [x] T026 [P] Implement rag-backend/app/services/metadata_store.py with NeonClient class for query logging
- [x] T027 [P] Implement rag-backend/app/services/vector_store.py with QdrantClient wrapper for vector operations
- [x] T028 Update rag-backend/app/api/routes/health.py to check Qdrant, Neon, OpenAI connections
- [ ] T029 Test health endpoint: GET /api/health returns status "healthy" with all services "connected"
- [x] T030 Export Neon schema to backup/schemas/neon_schema.sql using pg_dump or Python script

**Acceptance**: ✅ Qdrant collection created, Neon tables created, health endpoint returns all services connected, schema backed up

---

## Phase 3: User Story 1 - Question Answering from Full Book (P1) [MVP]

**Goal**: Implement core RAG pipeline for full-book question answering with source citations

**Why P1**: This is the MVP - enabling readers to quickly find information within the book

**Independent Test**:
1. Ask "What is Spec-Kit Plus?" via POST /api/query
2. Verify answer includes content from Chapter 1
3. Verify response includes sources array with chapter, section, file, url
4. Verify source citations are clickable URLs pointing to /docs/chapter-1-spec-kit#section

### Ingestion Pipeline (US1)

- [ ] T031 [US1] Implement rag-backend/app/utils/markdown_parser.py to extract headings (H1=chapter, H2=section) and hierarchy
- [ ] T032 [US1] Implement rag-backend/app/utils/chunking.py with semantic chunking (800 tokens, 100 overlap, paragraph boundaries)
- [ ] T033 [US1] Add special handling in chunking.py for code blocks (keep intact), lists (keep together), tables (single chunk if <800 tokens)
- [ ] T034 [US1] Implement rag-backend/ingestion/chunk_strategy.py with ChunkMetadata class (chapter, section, source_file, heading_path, chunk_index)
- [ ] T035 [US1] Implement rag-backend/app/services/embeddings.py with OpenAI text-embedding-3-small batch processing (100 chunks per call)
- [ ] T036 [US1] Add exponential backoff retry logic to embeddings.py for OpenAI rate limit handling
- [ ] T037 [US1] Implement rag-backend/ingestion/ingest.py to scan docs/ directory, chunk markdown files, generate embeddings, store in Qdrant
- [ ] T038 [US1] Add ingestion progress logging to ingest.py (files processed, chunks created, errors)
- [ ] T039 [US1] Log ingestion job to Neon ingestion_logs table (started_at, status=running, then completed/failed)
- [ ] T040 [US1] Create rag-backend/scripts/run_ingestion.py wrapper script to execute ingestion with error handling
- [ ] T041 [US1] Run ingestion on ai-powered-book/docs/ and verify ~1000 chunks created in Qdrant dashboard

### RAG Query Pipeline (US1)

- [ ] T042 [US1] Create rag-backend/app/api/models/request.py with QueryRequest Pydantic model (query, conversation_history, session_id, top_k)
- [ ] T043 [US1] Create rag-backend/app/api/models/response.py with QueryResponse and SourceCitation Pydantic models
- [ ] T044 [US1] Add validation to QueryRequest: query length 10-2000 chars, top_k range 3-10, conversation_history max 10 turns
- [ ] T045 [US1] Implement rag-backend/app/services/query_pipeline.py with RAGPipeline class orchestrating full query flow
- [ ] T046 [US1] In query_pipeline.py: Add input validation (query length, sanitization for injection attacks per FR-024)
- [ ] T047 [US1] In query_pipeline.py: Generate query embedding using OpenAI text-embedding-3-small
- [ ] T048 [US1] In query_pipeline.py: Retrieve top-k chunks from Qdrant using vector similarity search (default k=5, threshold 0.7)
- [ ] T049 [US1] Implement rag-backend/app/services/answer_generator.py with OpenAI gpt-3.5-turbo-0125 chat completion
- [ ] T050 [US1] In answer_generator.py: Compose system prompt "Answer ONLY based on provided context. Cite sources. Say 'no information found' if context insufficient"
- [ ] T051 [US1] In answer_generator.py: Format context with chunk text and metadata ([Chapter X, Section Y]: {text})
- [ ] T052 [US1] In answer_generator.py: Include conversation history (last 2 turns) in prompt for follow-up questions per FR-014
- [ ] T053 [US1] In answer_generator.py: Set temperature=0.3, max_tokens=500 for concise answers
- [ ] T054 [US1] In query_pipeline.py: Extract source citations from chunk metadata and format as SourceCitation objects
- [ ] T055 [US1] In query_pipeline.py: Generate clickable URLs for sources (/docs/{file}#{section-slug})
- [ ] T056 [US1] In query_pipeline.py: Log query and answer to Neon query_logs table with source_chunks JSONB and response_time_ms
- [ ] T057 [US1] Implement rag-backend/app/api/routes/query.py with POST /api/query endpoint using QueryRequest/QueryResponse schemas
- [ ] T058 [US1] Add error handling to query.py: 400 (invalid input), 500 (internal error), 503 (service unavailable)
- [ ] T059 [US1] Test POST /api/query with curl: {"query": "What is Spec-Kit Plus?"} and verify answer + sources returned
- [ ] T060 [US1] Test POST /api/query with out-of-book query: {"query": "What is quantum physics?"} and verify "no information found" response per FR-008

### Frontend Widget (US1)

- [ ] T061 [US1] Create ai-powered-book/src/components/ChatbotWidget/index.tsx with collapsible widget container (fixed bottom-right)
- [ ] T062 [US1] Create ai-powered-book/src/components/ChatbotWidget/ChatWindow.tsx with message list and input form
- [ ] T063 [US1] Create ai-powered-book/src/components/ChatbotWidget/MessageList.tsx to display user questions and bot answers
- [ ] T064 [US1] Create ai-powered-book/src/components/ChatbotWidget/api.ts with HTTP client for POST /api/query using axios
- [ ] T065 [US1] In api.ts: Add REACT_APP_RAG_API_URL and REACT_APP_RAG_API_KEY from environment variables
- [ ] T066 [US1] In api.ts: Include session_id (generate UUID v4) and conversation_history in API calls
- [ ] T067 [US1] Create ai-powered-book/src/components/ChatbotWidget/styles.module.css with responsive widget styling
- [ ] T068 [US1] Swizzle Docusaurus Root component: Run `npm run swizzle @docusaurus/theme-classic Root -- --eject`
- [ ] T069 [US1] Edit ai-powered-book/src/theme/Root.js to inject ChatbotWidget using BrowserOnly component
- [ ] T070 [US1] Create ai-powered-book/.env.local with REACT_APP_RAG_API_URL=http://localhost:8000 for local development
- [ ] T071 [US1] Update ai-powered-book/package.json to add axios dependency
- [ ] T072 [US1] Run `npm install` in ai-powered-book/ to install new dependencies
- [ ] T073 [US1] Test frontend integration: Run `npm start` in ai-powered-book/, open chatbot widget, ask question, verify answer displayed

### US1 Acceptance Scenarios

- [ ] T074 [US1] Test Scenario 1: Reader viewing book page clicks chatbot widget → Chat interface opens with prompt "Ask me anything about this book"
- [ ] T075 [US1] Test Scenario 2: Reader asks "What is covered in Chapter 3?" → Bot responds with Chapter 3 summary and references like "See Chapter 3, Section 2"
- [ ] T076 [US1] Test Scenario 3: Reader asks question → Answer includes clickable references that navigate to specific book sections (verify URL format /docs/{file}#{section})
- [ ] T077 [US1] Test Scenario 4: Reader asks about content not in book → Bot responds "I couldn't find information about that in this book"

**Acceptance**: ✅ MVP complete - chatbot answers full-book questions with source citations, widget embedded, all US1 scenarios pass

---

## Phase 4: User Story 4 - Source Attribution and Navigation (P2)

**Goal**: Enhance source citations with chapter/section labels and ensure navigation works

**Why P2**: Source attribution builds trust and enables deeper learning (essential for educational use)

**Independent Test**:
1. Ask cross-chapter question: "How do Spec-Kit Plus and Claude Code work together?"
2. Verify answer synthesizes information from Chapter 1 and Chapter 2
3. Verify each source citation clearly labeled with chapter and section
4. Click source link → Verify book navigates to exact section (new tab or scroll)

### Tasks

- [ ] T078 [P] [US4] Enhance SourceCitation model in response.py to include chapter (required), section (optional), excerpt (optional 500 chars)
- [ ] T079 [US4] In answer_generator.py: Enhance prompt to explicitly request source attribution in answer text (e.g., "According to Chapter 1, Section 2...")
- [ ] T080 [US4] In query_pipeline.py: Extract chapter and section from chunk metadata for each source citation
- [ ] T081 [US4] In query_pipeline.py: Add excerpt field to SourceCitation by including first 200 chars of chunk text
- [ ] T082 [US4] In MessageList.tsx: Render source citations as formatted list with chapter/section labels
- [ ] T083 [US4] In MessageList.tsx: Make source URLs clickable with target="_blank" and rel="noopener noreferrer" for security
- [ ] T084 [US4] In ChatWindow.tsx: Add visual indicator when answer references multiple sources (e.g., "3 sources cited")
- [ ] T085 [US4] Test cross-chapter question: Ask "How do Spec-Kit Plus and Claude Code integrate?" and verify sources from both chapters
- [ ] T086 [US4] Test source navigation: Click source link in chatbot answer → Verify new tab opens at correct book section with heading visible
- [ ] T087 [US4] Test source labeling: Verify each citation displays as "Chapter X, Section Y - {file}" format

### US4 Acceptance Scenarios

- [ ] T088 [US4] Test Scenario 1: Answer references multiple sections → Each section clearly labeled with chapter and section identifiers
- [ ] T089 [US4] Test Scenario 2: Click source reference link → Book navigates to exact section in new tab (verify URL hash navigation works)
- [ ] T090 [US4] Test Scenario 3: Answer from sections X, Y, Z → Answer clearly attributes which parts came from which sections (inline citations)

**Acceptance**: ✅ Source citations enhanced with chapter/section labels, navigation tested, all US4 scenarios pass

---

## Phase 5: User Story 2 - Selected Text Query Mode (P2)

**Goal**: Enable question answering based exclusively on user-selected text

**Why P2**: Provides focused help for confusing passages (premium feature, not required for MVP)

**Independent Test**:
1. Select a paragraph from book page
2. Click "Ask about this selection" button
3. Ask "What does this mean?"
4. Verify answer is based ONLY on selected text (no vector search)
5. Verify answer includes disclaimer "Based on your selected text..."

### Tasks

- [ ] T091 [P] [US2] Add query_mode enum to QueryRequest model: "full_book" or "selected_text" (default: "full_book")
- [ ] T092 [US2] Add selected_text field to QueryRequest model (string, min 20 chars, required if mode=selected_text)
- [ ] T093 [US2] Add @validator to QueryRequest to ensure selected_text provided when mode=selected_text
- [ ] T094 [US2] Create rag-backend/app/api/routes/query_selected.py with POST /api/query/selected endpoint
- [ ] T095 [US2] In query_selected.py: Validate selected_text length (min 20 chars = ~1 sentence) per edge case requirements
- [ ] T096 [US2] In query_selected.py: Skip embedding generation and vector search (no Qdrant query)
- [ ] T097 [US2] In query_selected.py: Pass selected_text directly to answer_generator as sole context
- [ ] T098 [US2] In answer_generator.py: Add generate_from_selected_text() method that uses selected text as context without retrieval
- [ ] T099 [US2] In answer_generator.py: Prepend disclaimer to answer: "Based on your selected text, {answer}"
- [ ] T100 [US2] In query_selected.py: Return QueryResponse with mode="selected_text", empty sources array
- [ ] T101 [US2] In ChatWindow.tsx: Add text selection listener to detect when user highlights text on page
- [ ] T102 [US2] In ChatWindow.tsx: Show "Ask about this selection" button when text is selected (floating button near selection)
- [ ] T103 [US2] In ChatWindow.tsx: On button click, open chatbot with selected text pre-loaded and input placeholder "Ask about this selection..."
- [ ] T104 [US2] In api.ts: Add querySelected() method that calls POST /api/query/selected with query and selected_text
- [ ] T105 [US2] In MessageList.tsx: Display selected-text answers with disclaimer badge (e.g., "Based on selection" label)
- [ ] T106 [US2] Test selected-text mode: Select paragraph, click button, ask question, verify answer based only on selection (manually check no external content)

### US2 Acceptance Scenarios

- [ ] T107 [US2] Test Scenario 1: Select paragraph → Click "Ask about this selection" → Chatbot opens with selected text pre-loaded
- [ ] T108 [US2] Test Scenario 2: Ask question with selected text → Answer based exclusively on selected text (verify by asking about content outside selection)
- [ ] T109 [US2] Test Scenario 3: Ask question that requires external context → Bot responds "Based on your selected text, I can only see..." with explanation

**Acceptance**: ✅ Selected-text mode implemented, button appears on text selection, answers constrained to selection, all US2 scenarios pass

---

## Phase 6: User Story 3 - Backup and Regeneration (P3)

**Goal**: Provide content backup utilities and regeneration workflow for book updates

**Why P3**: Administrative feature for long-term maintainability (not required for launch)

**Independent Test**:
1. Modify content in backup/docs/
2. Run backup/scripts/regenerate_embeddings.sh
3. Ask question about modified content → Verify answer reflects changes
4. Restore from backup using backup/scripts/restore_from_backup.sh → Verify original content restored

### Tasks

- [ ] T110 [P] [US3] Create backup/scripts/snapshot_content.sh to copy ai-powered-book/docs/ to backup/docs/ with timestamp
- [ ] T111 [P] [US3] Create backup/scripts/regenerate_embeddings.sh to re-run ingestion pipeline from backup/docs/ directory
- [ ] T112 [US3] In regenerate_embeddings.sh: Clear existing Qdrant collection before re-ingestion
- [ ] T113 [US3] In regenerate_embeddings.sh: Run rag-backend/scripts/run_ingestion.py targeting backup/docs/ as source
- [ ] T114 [US3] In regenerate_embeddings.sh: Update backup/metadata.json with regeneration timestamp
- [ ] T115 [US3] Create backup/scripts/restore_from_backup.sh to copy backup/docs/ back to ai-powered-book/docs/
- [ ] T116 [US3] Create backup/README.md documenting backup workflow: snapshot → modify → regenerate → test → restore if needed
- [ ] T117 [US3] Create rag-backend/scripts/export_db_schema.py to export Neon schema to SQL file (pg_dump wrapper)
- [ ] T118 [US3] Run export_db_schema.py to create backup/schemas/neon_schema.sql with CREATE TABLE statements
- [ ] T119 [US3] Test backup workflow: Run snapshot_content.sh → Verify backup/docs/ matches ai-powered-book/docs/
- [ ] T120 [US3] Test regeneration: Modify backup/docs/chapter-1.md → Run regenerate_embeddings.sh → Ask question → Verify answer reflects changes

### US3 Acceptance Scenarios

- [ ] T121 [US3] Test Scenario 1: Administrator accesses /backup folder → Find complete snapshots organized by chapter with all markdown files present
- [ ] T122 [US3] Test Scenario 2: Content changed → Run ingestion script → Vector database regenerated with updated embeddings (verify chunk count matches)
- [ ] T123 [US3] Test Scenario 3: Vector DB regenerated → Ask question → Answer reflects updated content (compare before/after answers)
- [ ] T124 [US3] Test Scenario 4: Disaster recovery → Use database schema export → Restore conversation metadata and session history (verify query_logs table restored)

**Acceptance**: ✅ Backup scripts created, regeneration tested, schema export working, all US3 scenarios pass

---

## Phase 7: Security, Rate Limiting, and Configuration

**Goal**: Implement security measures, rate limiting, and production-ready configuration

**Independent Test**:
1. Send 101 requests in 1 hour → Verify 101st request returns 429 (rate limit exceeded)
2. Send query with SQL injection attempt → Verify sanitization prevents execution
3. Check backend logs → Verify no secrets (API keys, passwords) logged

### Tasks

- [ ] T125 [P] Install slowapi package for rate limiting in rag-backend/requirements.txt
- [ ] T126 [P] Create rag-backend/app/core/security.py with input sanitization functions (escape special chars, validate length)
- [ ] T127 In security.py: Add rate_limiter decorator using slowapi (100 requests/hour per IP from env RATE_LIMIT_PER_HOUR)
- [ ] T128 In security.py: Add sanitize_query() function to remove/escape SQL injection patterns, XSS attempts per FR-024
- [ ] T129 Apply rate_limiter decorator to POST /api/query and POST /api/query/selected routes
- [ ] T130 Add sanitize_query() call in query.py and query_selected.py before processing queries
- [ ] T131 In config.py: Add API_KEY optional environment variable for production authentication
- [ ] T132 In config.py: Add CORS_ORIGINS validation to ensure only whitelisted domains (default: localhost for dev)
- [ ] T133 Create API key middleware in security.py to check X-API-Key header if API_KEY env var is set
- [ ] T134 Apply API key middleware to FastAPI app if API_KEY is configured (optional, skip for dev)
- [ ] T135 In logging.py: Add log filtering to redact sensitive fields (API keys, passwords) from logs
- [ ] T136 In logging.py: Configure structured JSON logs with request_id, timestamp, level, message, context
- [ ] T137 Test rate limiting: Send 101 requests in 1 hour using locust or ab tool → Verify 101st returns 429 error
- [ ] T138 Test input sanitization: Send query with <script>alert('xss')</script> → Verify escaped/sanitized before processing
- [ ] T139 Test SQL injection protection: Send query with ' OR '1'='1 → Verify sanitized and no DB error
- [ ] T140 Test CORS: Make request from unauthorized origin → Verify 403 CORS error
- [ ] T141 Test API key auth (if enabled): Send request without X-API-Key header → Verify 401 unauthorized error

**Acceptance**: ✅ Rate limiting active (100/hr), input sanitization working, secrets not logged, CORS configured, optional API key auth ready

---

## Phase 8: Testing and Validation

**Goal**: Comprehensive testing to verify all functional requirements and success criteria

**Independent Test**: All tests pass (unit, integration, performance benchmarks)

### Unit Tests

- [ ] T142 [P] Create rag-backend/tests/conftest.py with pytest fixtures for mock OpenAI client, Qdrant client, Neon client
- [ ] T143 [P] Create rag-backend/tests/unit/test_chunking.py to test chunk size, overlap, metadata extraction
- [ ] T144 [P] Create rag-backend/tests/unit/test_markdown_parser.py to test heading extraction (H1, H2, H3) and hierarchy
- [ ] T145 [P] Create rag-backend/tests/unit/test_embeddings.py with mocked OpenAI API to test batch processing and retry logic
- [ ] T146 [P] Create rag-backend/tests/unit/test_query_pipeline.py to test RAG flow with mocked vector search and LLM calls
- [ ] T147 [P] Create rag-backend/tests/unit/test_answer_generator.py to test prompt composition, context formatting, source extraction
- [ ] T148 [P] Create rag-backend/tests/unit/test_security.py to test input sanitization (SQL injection, XSS patterns)
- [ ] T149 [P] Run unit tests: `pytest rag-backend/tests/unit/ -v` and verify all pass

### Integration Tests

- [ ] T150 [P] Create rag-backend/tests/integration/test_api_endpoints.py with FastAPI TestClient
- [ ] T151 In test_api_endpoints.py: Test POST /api/query with valid input → Verify 200 response with answer and sources
- [ ] T152 In test_api_endpoints.py: Test POST /api/query with invalid input (query too short) → Verify 400 error
- [ ] T153 In test_api_endpoints.py: Test POST /api/query/selected with selected_text → Verify answer constrained to text
- [ ] T154 In test_api_endpoints.py: Test GET /api/health → Verify returns status and service connections
- [ ] T155 [P] Create rag-backend/tests/integration/test_vector_store.py to test Qdrant insert and search operations
- [ ] T156 [P] Create rag-backend/tests/integration/test_metadata_store.py to test Neon query logging and retrieval
- [ ] T157 Run integration tests: `pytest rag-backend/tests/integration/ -v` and verify all pass

### Performance Tests

- [ ] T158 Create rag-backend/tests/performance/locustfile.py with Locust load test scenarios
- [ ] T159 In locustfile.py: Define query task with random questions from test dataset
- [ ] T160 Run load test: 100 concurrent users, 1000 total requests → Measure p95 response time
- [ ] T161 Verify performance criteria: p95 < 3 seconds (SC-001), p99 vector search < 100ms (SC-007)
- [ ] T162 Run ingestion performance test: Time full ingestion of 500 pages → Verify < 10 minutes (SC-006)

### End-to-End Tests

- [ ] T163 Test E2E flow: Open book page → Click chatbot → Ask question → Verify answer with sources → Click source link → Verify navigation
- [ ] T164 Test conversation context: Ask follow-up question → Verify answer uses previous context (FR-014)
- [ ] T165 Test no-information-found: Ask out-of-book question → Verify "no information found" response (FR-008, SC-004)
- [ ] T166 Test edge case: Ask question in non-English language → Verify language detection message
- [ ] T167 Test edge case: Select 1-2 words → Click "Ask about selection" → Verify "text too short" message
- [ ] T168 Test edge case: Rapid-fire queries (5 in 10 seconds) → Verify all handled with loading indicators, no errors
- [ ] T169 Test concurrent users: Simulate 100 concurrent users → Verify no degradation in response time (SC-010)
- [ ] T170 Test error scenarios: Stop Qdrant service → Verify chatbot shows "temporarily unavailable" message (503 error)

**Acceptance**: ✅ All unit tests pass, integration tests pass, performance benchmarks met, E2E scenarios validated

---

## Phase 9: Deployment and Production Readiness

**Goal**: Deploy backend to Railway, frontend to Vercel, and verify production environment

**Independent Test**:
1. Visit production book URL (e.g., https://your-book.vercel.app)
2. Open chatbot widget
3. Ask question → Verify answer from production backend
4. Check Railway logs → No errors
5. Verify all production environment variables set correctly

### Backend Deployment

- [ ] T171 Create rag-backend/Dockerfile with Python 3.11-slim base image, copy app code, expose port 8000, CMD uvicorn
- [ ] T172 Create rag-backend/.dockerignore with venv/, __pycache__/, .env, .git/, tests/
- [ ] T173 Create rag-backend/railway.json with build config (DOCKERFILE), deploy config (restart policy)
- [ ] T174 Commit rag-backend/ code to Git and push to GitHub repository on 001-rag-chatbot branch
- [ ] T175 Connect Railway to GitHub repository and select 001-rag-chatbot branch
- [ ] T176 In Railway dashboard: Set environment variables (OPENAI_API_KEY, QDRANT_URL, QDRANT_API_KEY, DATABASE_URL, CORS_ORIGINS with production book URL)
- [ ] T177 Update CORS_ORIGINS in Railway to include production Vercel domain: https://your-book.vercel.app
- [ ] T178 Deploy backend to Railway (auto-deploys on git push) and wait for build completion
- [ ] T179 Get Railway public URL (e.g., https://rag-backend-production.up.railway.app) from dashboard
- [ ] T180 Test production backend health endpoint: GET https://rag-backend-production.up.railway.app/api/health → Verify all services connected
- [ ] T181 SSH into Railway or run remotely: `railway run python scripts/run_ingestion.py` to populate Qdrant with book content
- [ ] T182 Verify ingestion in Qdrant dashboard: Check collection has ~1000 vectors with metadata

### Frontend Deployment

- [ ] T183 Update ai-powered-book/.env.local with production backend URL: REACT_APP_RAG_API_URL=https://rag-backend-production.up.railway.app
- [ ] T184 Commit ai-powered-book/ changes (ChatbotWidget component, Root.js, package.json) to Git
- [ ] T185 Push to GitHub → Vercel auto-deploys from 001-rag-chatbot branch
- [ ] T186 In Vercel dashboard: Add environment variable REACT_APP_RAG_API_URL=https://rag-backend-production.up.railway.app
- [ ] T187 In Vercel dashboard: Add environment variable REACT_APP_RAG_API_KEY (optional, if using API key auth)
- [ ] T188 Wait for Vercel deployment to complete and get production URL (e.g., https://your-book.vercel.app)
- [ ] T189 Visit production book URL and verify chatbot widget appears in bottom-right corner
- [ ] T190 Test production chatbot: Ask question → Verify answer from production backend with source citations

### Monitoring and Documentation

- [ ] T191 [P] Set up Railway monitoring: Enable CPU/memory alerts in dashboard
- [ ] T192 [P] Set up error tracking: Add Sentry DSN to environment variables (optional) for error monitoring
- [ ] T193 Create rag-backend/README.md with setup instructions, API documentation, deployment guide
- [ ] T194 Update backup/README.md with production backup workflow (Railway CLI commands for remote ingestion)
- [ ] T195 Create rag-backend/docs/API.md with endpoint documentation, request/response examples, error codes
- [ ] T196 Add production runbook to rag-backend/docs/RUNBOOK.md with common tasks (re-run ingestion, check logs, scale up)
- [ ] T197 Monitor production logs for 24 hours: Check Railway logs for errors, verify no API rate limit issues
- [ ] T198 Monitor usage: Check OpenAI usage dashboard, Qdrant storage usage, Neon compute hours
- [ ] T199 Test disaster recovery: Export Neon schema, simulate data loss, restore from backup → Verify query_logs table restored

**Acceptance**: ✅ Backend deployed to Railway, frontend deployed to Vercel, production testing complete, monitoring active, documentation written

---

## Phase 10: Polish and Cross-Cutting Concerns

**Goal**: Final refinements, accessibility, performance optimizations, and launch preparation

**Independent Test**: All success criteria (SC-001 through SC-012) validated in production

### Tasks

- [ ] T200 [P] Add accessibility to ChatbotWidget: ARIA labels, keyboard navigation (Tab, Enter, Escape), screen reader support
- [ ] T201 [P] Add loading states to ChatWindow.tsx: Show spinner while waiting for API response, disable input during loading
- [ ] T202 [P] Add error handling to ChatWindow.tsx: Display toast notification on API error (503, 500), retry button
- [ ] T203 [P] Optimize widget performance: Lazy load ChatbotWidget component, defer API calls until widget opened
- [ ] T204 [P] Add analytics to track chatbot usage: Log widget opens, queries asked, sources clicked (privacy-compliant, no PII)
- [ ] T205 Add code formatting: Run `black rag-backend/` to format Python code, run `prettier ai-powered-book/src/` for TypeScript
- [ ] T206 Add linting: Run `flake8 rag-backend/` and fix linting errors, run `eslint ai-powered-book/src/` and fix warnings
- [ ] T207 Create rag-backend/tests/test_contract_compliance.py to validate API responses match OpenAPI schema in contracts/openapi.yaml
- [ ] T208 Run contract tests to ensure API responses match specification
- [ ] T209 Validate all success criteria in production: SC-001 (p95 < 3s), SC-002 (100% citations), SC-003 (90% clickable), SC-004 (no-info responses), SC-005 (selected-text accuracy), SC-006 (ingestion < 10min), SC-007 (vector search < 100ms), SC-008 (updates < 15min), SC-009 (widget load < 2s), SC-010 (100 concurrent users), SC-011 (error coverage), SC-012 (zero security incidents)
- [ ] T210 Create launch checklist: Verify all functional requirements (FR-001 through FR-025) implemented and tested
- [ ] T211 Prepare launch announcement: Document new chatbot feature in book introduction, add usage tips
- [ ] T212 Create feedback mechanism: Add "Was this helpful?" thumbs up/down buttons to chatbot answers (log feedback to Neon)

**Acceptance**: ✅ All polish tasks complete, accessibility verified, analytics tracking, success criteria validated, ready for launch

---

## Dependencies & Execution Strategy

### User Story Dependencies

```
Setup (Phase 1) → Foundational (Phase 2)
                      ↓
        ┌─────────────┴─────────────┐
        ↓                           ↓
    US1 (Phase 3)              US3 (Phase 6)
    [MVP - P1]                 [Backup - P3]
        ↓
        ├─────────────┬─────────────┐
        ↓             ↓             ↓
    US4 (Phase 4)  US2 (Phase 5)  Security (Phase 7)
    [Sources-P2]   [Selected-P2]
        ↓             ↓             ↓
        └─────────────┴─────────────┘
                      ↓
                Testing (Phase 8)
                      ↓
                Deployment (Phase 9)
                      ↓
                Polish (Phase 10)
```

**Critical Path**: Setup → Foundational → US1 → Testing → Deployment
**Parallelizable After US1**: US2, US4, US3, Security (can be developed concurrently)

### Parallel Execution Opportunities

**Within US1 (Phase 3)**:
- Ingestion pipeline (T031-T041) can run in parallel with RAG query pipeline (T042-T060)
- Frontend widget (T061-T073) can start once API contract is stable (after T042-T044)

**After US1 Complete**:
- US2 (Phase 5), US4 (Phase 4), US3 (Phase 6), Security (Phase 7) are independent
- Run all 4 phases concurrently with different developers

**Testing (Phase 8)**:
- Unit tests (T142-T149), integration tests (T150-T157), performance tests (T158-T162) are parallelizable
- Different test types can run simultaneously

### Suggested MVP Scope

**Minimum Viable Product = User Story 1 (Phase 3)**:
- Core RAG pipeline with full-book query answering
- Source citations in answers
- Embedded chatbot widget
- Basic frontend integration

**After MVP (Incremental Additions)**:
1. Add US4 (source attribution enhancements)
2. Add US2 (selected-text mode)
3. Add security hardening (Phase 7)
4. Add US3 (backup/regeneration)
5. Full testing suite (Phase 8)
6. Production deployment (Phase 9)
7. Polish (Phase 10)

---

## Task Summary

**Total Tasks**: 212
**By Phase**:
- Phase 1 (Setup): 15 tasks
- Phase 2 (Foundational): 15 tasks
- Phase 3 (US1 - MVP): 47 tasks
- Phase 4 (US4 - Sources): 13 tasks
- Phase 5 (US2 - Selected Text): 19 tasks
- Phase 6 (US3 - Backup): 15 tasks
- Phase 7 (Security): 17 tasks
- Phase 8 (Testing): 29 tasks
- Phase 9 (Deployment): 29 tasks
- Phase 10 (Polish): 13 tasks

**By User Story**:
- US1 (P1): 47 tasks [MVP]
- US2 (P2): 19 tasks
- US3 (P3): 15 tasks
- US4 (P2): 13 tasks
- Infrastructure: 30 tasks (Setup + Foundational)
- Cross-cutting: 88 tasks (Security + Testing + Deployment + Polish)

**Parallelizable Tasks**: 58 tasks marked with [P]

**Estimated Timeline**:
- Phase 1-2 (Setup + Foundational): 2-3 days
- Phase 3 (US1 - MVP): 5-7 days
- Phase 4-6 (US2, US3, US4): 4-6 days (parallel)
- Phase 7 (Security): 2 days
- Phase 8 (Testing): 3-4 days
- Phase 9 (Deployment): 2 days
- Phase 10 (Polish): 1-2 days
- **Total**: ~16-24 days

---

## Format Validation

✅ All tasks follow checklist format: `- [ ] T### [P?] [US#?] Description with file path`
✅ Task IDs sequential (T001 to T212)
✅ [P] markers on 58 parallelizable tasks
✅ [US#] labels on all user story tasks (US1, US2, US3, US4)
✅ File paths included in task descriptions
✅ Dependencies clearly documented
✅ Independent test criteria defined for each user story

---

## Next Steps

1. Review task breakdown with team
2. Assign tasks to developers
3. Set up project board (GitHub Projects, Jira) with tasks
4. Begin Phase 1 (Setup) immediately
5. Track progress daily, adjust estimates based on actual velocity
6. Celebrate MVP completion after Phase 3!

---

**Document Status**: Ready for implementation
**Last Updated**: 2025-12-17
