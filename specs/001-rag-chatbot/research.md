# Research Document: RAG Chatbot Integration

**Feature**: RAG Chatbot Integration
**Branch**: `001-rag-chatbot`
**Date**: 2025-12-17
**Purpose**: Document technology choices, best practices, and research findings for implementation

## Overview

This document captures research findings and technology decisions made during the planning phase for the RAG chatbot integration. All decisions are based on the feature specification requirements and industry best practices for RAG systems.

## Technology Decisions

### 1. Backend Framework: FastAPI

**Decision**: Use FastAPI 0.110+ for backend API

**Rationale**:
- Native async/await support (critical for concurrent API calls to OpenAI/Qdrant)
- Automatic OpenAPI schema generation (satisfies FR-016)
- Built-in request validation with Pydantic models (satisfies FR-023, FR-024)
- Excellent performance (comparable to Node.js/Go)
- Python ecosystem compatibility (OpenAI SDK, Qdrant client)
- Strong typing support reduces runtime errors

**Alternatives Considered**:
- **Flask**: Simpler but lacks async support, manual API documentation
- **Django**: Too heavyweight for stateless API, includes ORM we don't need
- **Node.js/Express**: Would require different SDKs, team unfamiliar with Node

**Best Practices**:
- Use dependency injection for services (FastAPI native support)
- Implement middleware for logging, rate limiting, CORS
- Structure as modular app with routers (api/routes/)
- Use Pydantic BaseSettings for configuration management

**References**:
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Building Production RAG APIs with FastAPI](https://blog.langchain.dev/production-rag-fastapi/)

---

### 2. Vector Database: Qdrant Cloud

**Decision**: Use Qdrant Cloud (managed service) for vector storage

**Rationale**:
- Free tier (1GB storage, 100 RPM) sufficient for single book (FR-012, Constraint: free tier)
- Fast similarity search (<10ms p50, <50ms p99) (SC-007)
- Built-in HNSW indexing (optimal for high-dimensional vectors)
- Official Python client with async support
- Metadata filtering capabilities (filter by chapter, section)
- No self-hosting overhead (managed service)

**Alternatives Considered**:
- **Pinecone**: Similar features but smaller free tier (100MB), less flexible metadata
- **Weaviate**: More features but complex setup, no generous free tier
- **ChromaDB**: Open-source, lightweight but requires self-hosting, limited scale
- **Pgvector**: PostgreSQL extension, but Neon free tier insufficient for embeddings + metadata

**Configuration**:
```python
# Collection config for Qdrant
collection_config = {
    "vectors": {
        "size": 1536,  # OpenAI text-embedding-3-small
        "distance": "Cosine"
    },
    "optimizers_config": {
        "indexing_threshold": 20000  # Build HNSW index after 20k vectors
    }
}
```

**Best Practices**:
- Use batch upserts for ingestion (100-1000 vectors per call)
- Include rich metadata payload: {chapter, section, file, heading, page}
- Use metadata filtering for advanced queries (e.g., "search only Chapter 3")
- Monitor storage usage via Qdrant dashboard

**References**:
- [Qdrant Documentation](https://qdrant.tech/documentation/)
- [Qdrant vs. Pinecone Comparison](https://qdrant.tech/benchmarks/)

---

### 3. Embedding Model: OpenAI text-embedding-3-small

**Decision**: Use OpenAI `text-embedding-3-small` (1536 dimensions)

**Rationale**:
- High quality embeddings (outperforms text-embedding-ada-002)
- Cost-effective: $0.02 per 1M tokens (500-page book ≈ $0.01 ingestion)
- Fast API response (<200ms for 100 inputs)
- Proven for RAG applications (industry standard)
- 1536 dimensions balance between quality and storage/compute

**Alternatives Considered**:
- **text-embedding-3-large** (3072 dim): Higher quality but 2x storage, overkill for book content
- **text-embedding-ada-002** (1536 dim): Older model, inferior to -3-small
- **Sentence Transformers** (open-source): Free but requires hosting, lower quality

**Configuration**:
```python
# OpenAI embedding params
embedding_params = {
    "model": "text-embedding-3-small",
    "dimensions": 1536,  # Can be reduced to 512 if storage constrained
    "encoding_format": "float"  # Or "base64" for reduced bandwidth
}
```

**Best Practices**:
- Batch embed up to 2048 inputs per API call (OpenAI limit)
- Implement exponential backoff for rate limits
- Cache embeddings (don't regenerate for unchanged content)
- Consider dimensionality reduction (1536 → 512) if storage constrained

**Cost Optimization**:
- Ingestion (one-time): 500 pages × 1000 tokens/page × $0.02/1M tokens = ~$0.01
- Query (per query): 50 tokens × $0.02/1M tokens = ~$0.000001 (negligible)

**References**:
- [OpenAI Embeddings Guide](https://platform.openai.com/docs/guides/embeddings)
- [text-embedding-3 Announcement](https://openai.com/blog/new-embedding-models-and-api-updates)

---

### 4. LLM: OpenAI gpt-3.5-turbo-0125

**Decision**: Use OpenAI `gpt-3.5-turbo-0125` for answer generation (with `gpt-4o-mini` upgrade path)

**Rationale**:
- Fast responses (~1-2s for 500 token answer) (SC-001)
- Cost-effective: $0.50/$1.50 per 1M tokens (input/output)
- 16k context window (sufficient for 5 chunks + history)
- Good instruction-following for RAG tasks
- Proven to avoid hallucination when prompted correctly

**Alternatives Considered**:
- **gpt-4o-mini**: Higher quality, similar cost, slightly slower (upgrade option)
- **gpt-4-turbo**: Best quality but 10x cost, slower, overkill for book Q&A
- **Claude 3.5 Sonnet**: Good quality but external dependency, different API
- **Open-source models** (Llama 3, Mixtral): Free but requires hosting, lower quality

**Configuration**:
```python
# OpenAI chat params for RAG
chat_params = {
    "model": "gpt-3.5-turbo-0125",
    "temperature": 0.3,  # Low but not zero (allow some creativity)
    "max_tokens": 500,   # Concise answers
    "top_p": 1.0,
    "frequency_penalty": 0.0,
    "presence_penalty": 0.0
}
```

**System Prompt** (anti-hallucination):
```
You are a helpful assistant answering questions about a book.
Answer ONLY based on the provided context excerpts below.
If the context doesn't contain enough information to answer, respond: "I couldn't find information about that in this book."
Always cite the source (chapter and section) in your answer.
Be concise but complete.
```

**Best Practices**:
- Use temperature 0.1-0.3 (deterministic but not robotic)
- Set max_tokens to prevent rambling
- Include explicit "don't hallucinate" instructions in system prompt
- Validate answer against retrieved chunks (post-processing check)

**Cost Estimate** (per 1000 queries):
- Input: 1000 queries × 3000 tokens/query × $0.50/1M = $1.50
- Output: 1000 answers × 300 tokens/answer × $1.50/1M = $0.45
- Total: ~$2 per 1000 queries

**References**:
- [OpenAI Chat Completions Guide](https://platform.openai.com/docs/guides/text-generation)
- [Preventing Hallucination in RAG](https://platform.openai.com/docs/guides/prompt-engineering/tactic-instruct-the-model-to-answer-using-a-reference-text)

---

### 5. Metadata Storage: Neon Serverless Postgres

**Decision**: Use Neon Serverless Postgres for query logs and metadata

**Rationale**:
- Free tier (0.5GB storage, 100 compute hours/month) sufficient (FR-022)
- PostgreSQL-compatible (standard SQL, JSONB support)
- Auto-pause feature reduces compute usage (sleeps after 5 min idle)
- Serverless architecture (no manual scaling)
- Built-in connection pooling

**Alternatives Considered**:
- **Supabase**: Similar features but Neon has better free tier
- **PlanetScale**: MySQL-based, missing PostgreSQL features (JSONB)
- **AWS RDS Free Tier**: Only 12 months free, manual management
- **SQLite**: Local only, not suitable for deployed API

**Schema Design**:
```sql
-- Query logs table
CREATE TABLE query_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL,
    query_text TEXT NOT NULL,
    query_mode VARCHAR(20) NOT NULL CHECK (query_mode IN ('full_book', 'selected_text')),
    selected_text TEXT,
    answer_text TEXT NOT NULL,
    source_chunks JSONB NOT NULL,  -- [{chapter, section, file, score}]
    response_time_ms INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_query_logs_session ON query_logs(session_id);
CREATE INDEX idx_query_logs_created ON query_logs(created_at DESC);

-- Ingestion logs table
CREATE TABLE ingestion_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    started_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    status VARCHAR(20) NOT NULL CHECK (status IN ('running', 'completed', 'failed')),
    total_chunks INTEGER,
    error_message TEXT
);
```

**Best Practices**:
- Use connection pooling (psycopg2.pool or asyncpg)
- Enable auto-pause to maximize free tier
- Use JSONB for flexible metadata (source_chunks)
- Add indexes on frequently queried columns (session_id, created_at)
- Implement async queries with asyncpg for FastAPI

**Cost Management**:
- Auto-pause reduces compute hours to ~10-20/month (well within 100 limit)
- Query logging uses ~10-50MB storage for 10k queries
- Monitor via Neon dashboard

**References**:
- [Neon Documentation](https://neon.tech/docs/introduction)
- [Neon Serverless Architecture](https://neon.tech/docs/introduction/architecture)

---

### 6. Chunking Strategy: Semantic Chunking with Overlap

**Decision**: Use semantic chunking with 800 token chunks and 100 token overlap

**Rationale**:
- 800 tokens (~600 words) preserves paragraph-level context
- 100 token overlap prevents context loss at boundaries (FR-010)
- Semantic boundaries (paragraphs, headings) improve retrieval quality
- Generates ~1000 chunks for 500-page book (within Qdrant free tier)

**Alternatives Considered**:
- **Fixed-size chunking**: Simple but splits mid-sentence, loses context
- **Sentence-based chunking**: Too granular, loses document structure
- **Document-level chunking**: Each chapter as one chunk, too large for context window

**Algorithm** (from LangChain):
```python
from langchain.text_splitter import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=800,  # In tokens (approx 600 words)
    chunk_overlap=100,
    length_function=len,  # Use tiktoken for accurate token count
    separators=["\n\n", "\n", ". ", " ", ""]  # Try paragraph first, then sentence, etc.
)
```

**Special Handling**:
- **Code blocks**: Keep intact (set `is_separator_regex=False`)
- **Tables**: Keep as single chunk if < 800 tokens
- **Lists**: Keep list items together
- **Headings**: Include parent heading in chunk metadata

**Best Practices**:
- Use tiktoken for accurate token counting (OpenAI tokenizer)
- Tag each chunk with heading hierarchy
- Preserve markdown formatting in chunk text
- Store heading context in metadata: `{h1, h2, h3}`

**References**:
- [LangChain Text Splitters](https://python.langchain.com/docs/modules/data_connection/document_transformers/)
- [RAG Chunking Strategies](https://www.pinecone.io/learn/chunking-strategies/)

---

### 7. Frontend Integration: Docusaurus Theme Swizzling

**Decision**: Use Docusaurus theme swizzling to inject chatbot widget globally

**Rationale**:
- Theme swizzling allows custom components in all pages
- `<BrowserOnly>` component ensures client-side only rendering (FR-001)
- Preserves existing Docusaurus build process
- No conflicts with existing components

**Integration Approach**:
1. Create `ChatbotWidget` component in `src/components/`
2. Swizzle `Root` component to inject widget globally
3. Use React Context for chatbot state management
4. Position as fixed element (bottom-right corner)

**Alternative Considered**:
- **Manual injection in each page**: Too much duplication, hard to maintain
- **Docusaurus plugin**: More complex, overkill for single component

**Implementation**:
```jsx
// src/theme/Root.js (swizzled)
import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

export default function Root({children}) {
  return (
    <>
      {children}
      <BrowserOnly>
        {() => {
          const ChatbotWidget = require('@site/src/components/ChatbotWidget').default;
          return <ChatbotWidget />;
        }}
      </BrowserOnly>
    </>
  );
}
```

**Best Practices**:
- Use CSS Modules for scoped styling
- Implement accessibility (ARIA labels, keyboard navigation)
- Add loading states for API calls
- Handle errors gracefully (toast notifications)

**References**:
- [Docusaurus Swizzling](https://docusaurus.io/docs/swizzling)
- [BrowserOnly Component](https://docusaurus.io/docs/docusaurus-core#browseronly)

---

### 8. Deployment: Railway

**Decision**: Deploy backend on Railway (with Fly.io as backup)

**Rationale**:
- Simple GitHub integration (auto-deploy on push)
- Good free tier (500 hours/month, $5 credit)
- Native Python support (auto-detect from requirements.txt)
- Built-in Postgres addon (can use Neon instead)
- Easy environment variable management

**Alternatives Considered**:
- **Fly.io**: Similar quality but requires Dockerfile, more manual
- **Vercel Functions**: Serverless but 10s timeout may be tight for RAG
- **Render**: Similar to Railway but slower cold starts
- **AWS Lambda**: Complex setup, cold start issues

**Deployment Steps** (Railway):
1. Push `rag-backend/` to GitHub
2. Connect Railway to repo
3. Set environment variables in Railway dashboard
4. Railway auto-detects Python, installs dependencies, starts `uvicorn`
5. Get public URL: `https://rag-backend.railway.app`

**Optimization**:
- Use lightweight Docker image (python:3.11-slim)
- Implement health check endpoint for Railway monitoring
- Set auto-sleep after 15 min idle (extends free tier)

**References**:
- [Railway Documentation](https://docs.railway.app/)
- [Deploying FastAPI on Railway](https://docs.railway.app/guides/fastapi)

---

## Best Practices Summary

### RAG Pipeline Best Practices

1. **Grounding**: Include explicit "don't hallucinate" instructions in system prompt
2. **Source Attribution**: Always return chunk metadata with answers
3. **Chunk Quality**: Use semantic chunking with overlap, preserve structure
4. **Top-k Selection**: Start with k=5, tune based on quality metrics
5. **Similarity Threshold**: Filter chunks below 0.7 cosine similarity
6. **Prompt Engineering**: Use clear context/question separation

### API Design Best Practices

1. **Stateless**: No server-side sessions, context passed in requests (FR-015)
2. **Validation**: Use Pydantic models for automatic request validation
3. **Error Handling**: Return consistent error format with status codes
4. **Rate Limiting**: Use slowapi middleware for per-IP limits
5. **CORS**: Whitelist only production frontend domain
6. **Logging**: Structured JSON logs with request IDs

### Security Best Practices

1. **Input Sanitization**: Escape special characters, validate length (FR-024)
2. **API Keys**: Use environment variables, rotate regularly (FR-020)
3. **Rate Limiting**: 100 requests/hour per IP (adjustable)
4. **CORS**: Restrict to book domain only
5. **Secrets Management**: Use Railway secret store, never commit .env

### Performance Best Practices

1. **Batching**: Batch embed 100 chunks per API call
2. **Async**: Use async/await for all I/O operations
3. **Caching**: Cache embeddings, don't regenerate unchanged content
4. **Connection Pooling**: Use psycopg2.pool for Neon connections
5. **Monitoring**: Track p95/p99 latencies, set alerts

### Cost Optimization Best Practices

1. **Embeddings**: Use text-embedding-3-small (cheapest quality option)
2. **LLM**: Start with gpt-3.5-turbo, upgrade to gpt-4o-mini only if needed
3. **Free Tiers**: Qdrant (1GB), Neon (0.5GB), Railway (500hrs)
4. **Auto-pause**: Enable for Neon (5 min), Railway (15 min)
5. **Batch Processing**: Reduce API calls by batching

---

## Risk Mitigation

### Risk 1: Free Tier Exhaustion

**Scenarios**:
- Qdrant: >1M vectors (>1GB storage)
- Neon: >100 compute hours/month
- Railway: >500 hours/month
- OpenAI: Unexpected high usage

**Mitigation**:
- Monitor usage dashboards weekly
- Set up billing alerts (OpenAI, Railway)
- Implement aggressive rate limiting (100 req/hr)
- Use auto-pause for Neon/Railway
- Cache embeddings to avoid regeneration

### Risk 2: Answer Quality Issues

**Scenarios**:
- Hallucination (answers not in book)
- Irrelevant chunk retrieval
- Poor source attribution

**Mitigation**:
- Strong system prompt with explicit grounding instructions
- Similarity threshold (0.7) to filter weak matches
- Post-processing validation: check answer against chunks
- Manual QA on diverse queries before launch
- User feedback mechanism (thumbs up/down)

### Risk 3: Performance Degradation

**Scenarios**:
- Cold start latency (serverless)
- OpenAI rate limits
- Qdrant query timeout

**Mitigation**:
- Keep Railway instance warm (15 min auto-sleep)
- Implement exponential backoff for OpenAI
- Set Qdrant timeout to 2s, return graceful error
- Cache frequent queries (future enhancement)
- Load test before launch (100 concurrent users)

### Risk 4: Security Vulnerabilities

**Scenarios**:
- SQL injection via query text
- API key exposure
- CORS misconfiguration
- DDoS attacks

**Mitigation**:
- Use Pydantic validation for all inputs
- Store API keys in Railway secret store
- Whitelist only production domain in CORS
- Implement rate limiting (100 req/hr per IP)
- Regular security audits (automated with Snyk)

---

## Testing Strategy

### Unit Tests (pytest)
- `test_chunking.py`: Validate chunk size, overlap, metadata
- `test_embeddings.py`: Mock OpenAI API, test batching
- `test_query_pipeline.py`: Test prompt composition, context formatting

### Integration Tests
- `test_api_endpoints.py`: End-to-end API tests (POST /api/query)
- `test_vector_store.py`: Qdrant integration (insert, search)
- `test_metadata_store.py`: Neon integration (insert, query logs)

### Contract Tests
- `test_openapi_compliance.py`: Validate API responses match OpenAPI schema

### Performance Tests (locust)
- Load test: 100 concurrent users, 1000 total queries
- Measure p95/p99 latencies, error rates
- Verify < 3 second response time (SC-001)

### Manual QA Checklist
- [ ] Full-book query returns relevant answer with sources
- [ ] Selected-text query constrains answer to selection
- [ ] Source citations are clickable and navigate correctly
- [ ] Error handling: empty query, long query, no results
- [ ] Rate limiting triggers after 100 requests/hour
- [ ] Widget loads on all book pages

---

## Open Questions (Resolved)

All technology choices have been finalized. No remaining ambiguities.

---

## References & Further Reading

### RAG Systems
- [Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks](https://arxiv.org/abs/2005.11401)
- [LangChain RAG Guide](https://python.langchain.com/docs/use_cases/question_answering/)
- [OpenAI RAG Best Practices](https://platform.openai.com/docs/guides/prompt-engineering/tactic-use-external-knowledge)

### Vector Databases
- [Qdrant Documentation](https://qdrant.tech/documentation/)
- [Vector Database Comparison](https://superlinked.com/vector-db-comparison)

### FastAPI & Python
- [FastAPI Best Practices](https://github.com/zhanymkanov/fastapi-best-practices)
- [Async Python Guide](https://realpython.com/async-io-python/)

### Docusaurus
- [Docusaurus Documentation](https://docusaurus.io/)
- [Theme Swizzling Guide](https://docusaurus.io/docs/swizzling)

---

**Last Updated**: 2025-12-17
**Status**: Complete - Ready for Phase 1 (Data Model & Contracts)
