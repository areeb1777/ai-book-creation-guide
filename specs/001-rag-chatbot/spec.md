# Feature Specification: RAG Chatbot Integration

**Feature Branch**: `001-rag-chatbot`
**Created**: 2025-12-17
**Status**: Draft
**Input**: User description: "Extend the already published Docusaurus-based book by adding a backup folder and integrating a Retrieval-Augmented Generation (RAG) chatbot. The chatbot must answer user questions based strictly on the book's content and optionally only on user-selected text."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Question Answering from Full Book Content (Priority: P1)

A reader is studying Chapter 5 of the book and encounters a concept they don't fully understand. Rather than manually searching through previous chapters, they open the chatbot widget, type their question, and receive an accurate answer with references to specific sections where the information appears.

**Why this priority**: This is the core value proposition - enabling readers to quickly find information within the book without breaking their reading flow. This represents the minimal viable product.

**Independent Test**: Can be fully tested by asking questions about book content and verifying answers include correct section references and are grounded in actual book text.

**Acceptance Scenarios**:

1. **Given** a reader is viewing any page of the published book, **When** they click the chatbot widget, **Then** a chat interface opens with a prompt inviting them to ask questions about the book
2. **Given** the chatbot is open, **When** the reader asks "What is covered in Chapter 3?", **Then** the chatbot responds with a summary based only on Chapter 3 content and includes references like "See Chapter 3, Section 2"
3. **Given** the reader asks a question, **When** the answer is provided, **Then** the response includes clickable references to specific book sections where the information was found
4. **Given** a reader asks a question about content not in the book, **When** the chatbot searches and finds no relevant content, **Then** it responds with "I couldn't find information about that in this book"

---

### User Story 2 - Question Answering from Selected Text (Priority: P2)

A reader is confused about a specific paragraph. They highlight the paragraph, click "Ask about this," and receive an explanation based only on that selected text, ensuring the answer is precisely focused on their immediate concern.

**Why this priority**: This provides focused, contextual help for specific confusing passages. It's a premium feature that enhances P1 but isn't required for basic functionality.

**Independent Test**: Can be tested by selecting text, triggering the chatbot with that context, and verifying answers are constrained to only the selected text.

**Acceptance Scenarios**:

1. **Given** a reader has selected a paragraph of text on the page, **When** they click "Ask about this selection" button, **Then** the chatbot opens with the selected text pre-loaded as context
2. **Given** the chatbot has received selected text, **When** the reader asks a question, **Then** the answer is based exclusively on that selected text, not the entire book
3. **Given** a question that cannot be answered from selected text alone, **When** the reader asks it, **Then** the chatbot responds "Based on your selected text, I can only see..." and explains the limitation

---

### User Story 3 - Content Backup and Regeneration (Priority: P3)

A content administrator needs to update the book's content after publication. They access the backup folder, which contains all raw markdown files and ingestion scripts, run the regeneration script, and the vector database is updated with the new content without requiring code changes.

**Why this priority**: This is an administrative feature that ensures long-term maintainability. Not required for initial launch but critical for ongoing operations.

**Independent Test**: Can be tested by modifying backup content, running ingestion script, and verifying chatbot answers reflect the updated content.

**Acceptance Scenarios**:

1. **Given** the book has been published, **When** an administrator accesses the `/backup` folder, **Then** they find complete snapshots of all markdown source files organized by chapter
2. **Given** book content has changed, **When** an administrator runs the ingestion script, **Then** the vector database is regenerated with updated embeddings
3. **Given** the vector database has been regenerated, **When** a reader asks a question, **Then** answers reflect the updated content
4. **Given** the backup system needs disaster recovery, **When** an administrator uses the database schema export, **Then** they can restore conversation metadata and session history

---

### User Story 4 - Source Attribution and Navigation (Priority: P2)

A reader asks a complex question that draws from multiple book chapters. The chatbot provides an answer synthesizing information from three different sections and includes hyperlinks to each referenced section, allowing the reader to click through and read the full context.

**Why this priority**: Source attribution builds trust and enables deeper learning. It's essential for academic/educational use cases but the chatbot could technically function without it.

**Independent Test**: Can be tested by asking cross-chapter questions and verifying all source references are included and clickable.

**Acceptance Scenarios**:

1. **Given** a chatbot answer references multiple book sections, **When** the answer is displayed, **Then** each section is clearly labeled with chapter and section identifiers
2. **Given** source references are included in an answer, **When** the reader clicks a reference link, **Then** the book navigates to that exact section in a new tab or scrolls to it
3. **Given** an answer synthesizes information from sections X, Y, and Z, **When** displayed, **Then** the answer clearly attributes which parts came from which sections

---

### Edge Cases

- **What happens when a reader asks a question in a language different from the book?** System should detect language mismatch and respond "This book is in [language]. Please ask your question in [language]."
- **What happens when the book content is very large (1000+ pages)?** The chunking and retrieval system must maintain sub-2-second response times by limiting retrieval to top-k most relevant chunks.
- **What happens when selected text is very short (1-2 words)?** System should inform user "Selected text is too short. Please select at least one complete sentence for better context."
- **What happens when the vector database is empty or unreachable?** Chatbot should display a maintenance message: "The chatbot is temporarily unavailable. Please try again later."
- **What happens when a reader asks multiple questions in rapid succession?** System should handle concurrent requests gracefully, queuing them with visible loading indicators.
- **What happens when the book has diagrams, tables, or code blocks?** These should be chunked with special metadata so answers can reference "See Figure 3.1" or "Refer to Code Example 5.2."

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide an embedded chatbot widget visible on all published book pages
- **FR-002**: System MUST accept natural language questions from readers via text input
- **FR-003**: System MUST retrieve relevant content chunks from the book corpus using vector similarity search
- **FR-004**: System MUST generate answers using retrieved content as the sole knowledge source (no external knowledge)
- **FR-005**: System MUST support text selection mode where answers are constrained to user-selected text only
- **FR-006**: System MUST include source citations in all answers, referencing specific chapters and sections
- **FR-007**: System MUST make source citations clickable, navigating to the referenced book location
- **FR-008**: System MUST respond "No relevant information found" when queries cannot be answered from book content
- **FR-009**: System MUST process markdown files from Docusaurus `docs/` directory during ingestion
- **FR-010**: System MUST chunk documents with appropriate overlap to maintain context across boundaries
- **FR-011**: System MUST store document embeddings with metadata including chapter, section, page, and source file
- **FR-012**: System MUST store embeddings in a vector database accessible via API
- **FR-013**: System MUST retrieve top-k relevant chunks based on query embedding similarity (k configurable, default 5)
- **FR-014**: System MUST maintain conversation context for follow-up questions within a session
- **FR-015**: System MUST operate statelessly at the API level, with context passed in each request
- **FR-016**: System MUST expose a RESTful API for query submission and answer retrieval
- **FR-017**: System MUST provide a `/backup` directory containing raw book content snapshots
- **FR-018**: System MUST provide ingestion scripts that can regenerate embeddings from backup content
- **FR-019**: System MUST provide database schema export scripts for metadata persistence
- **FR-020**: System MUST load all API credentials from environment variables (no hardcoded secrets)
- **FR-021**: System MUST handle API rate limits gracefully with appropriate retry logic
- **FR-022**: System MUST log all queries and responses for quality monitoring
- **FR-023**: System MUST validate input queries for appropriate length (minimum 3 words, maximum 500 words)
- **FR-024**: System MUST sanitize user inputs to prevent injection attacks
- **FR-025**: System MUST return responses within 3 seconds for 95% of queries

### Key Entities *(include if feature involves data)*

- **Document Chunk**: Represents a segment of book content (typically 500-1000 tokens) with overlap, associated with metadata identifying source chapter, section, page number, and file path. Used as the atomic unit for retrieval and citation.

- **Query**: Represents a reader's natural language question, includes the question text, optional conversation history for context, and optional selected text constraint. Generates an embedding vector for similarity matching.

- **Answer**: Represents the chatbot's response, contains the generated text answer, source citations with chapter/section references, retrieval confidence scores, and conversation turn identifier.

- **Embedding**: Vector representation of text (chunks or queries), stored as dense float vectors (typically 1536 dimensions for OpenAI embeddings), used for similarity search in vector database.

- **Conversation Session**: Ephemeral grouping of related queries and answers, identified by session ID, stores turn history for context, expires after inactivity period (default 30 minutes).

- **Backup Snapshot**: Complete copy of source markdown files at a point in time, organized by book structure (chapters/sections), includes timestamp and version identifier for tracking.

- **Ingestion Job**: Process instance that converts markdown to chunks, generates embeddings, and populates vector database. Tracks processing status, chunk counts, and error logs.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Readers can ask questions and receive relevant answers in under 3 seconds for 95% of queries
- **SC-002**: Chatbot answers are grounded in book content with 100% verifiable source citations (no hallucinated information)
- **SC-003**: At least 90% of answers include clickable references to specific book sections
- **SC-004**: System correctly responds "no information found" for 100% of queries about content not in the book
- **SC-005**: Selected text mode constrains answers to selected content with 100% accuracy (no information from outside selection)
- **SC-006**: Ingestion pipeline processes entire book (up to 500 pages) in under 10 minutes
- **SC-007**: Vector database retrieves relevant chunks with sub-100ms latency for 99% of queries
- **SC-008**: Backup and regeneration workflow allows content updates to be reflected in chatbot within 15 minutes
- **SC-009**: Chatbot widget loads and initializes in under 2 seconds on book pages
- **SC-010**: System handles at least 100 concurrent users without degradation in response time
- **SC-011**: API endpoints return appropriate error messages with 100% coverage for failure scenarios (rate limits, service unavailable, invalid input)
- **SC-012**: Zero security incidents related to API credential exposure or injection attacks during first 90 days

## Scope and Boundaries

### In Scope

- RAG-based question answering using book content only
- Both full-book and selected-text query modes
- Source attribution with chapter/section references
- Document ingestion from Docusaurus markdown files
- Embedding generation and vector storage
- Backup folder with content snapshots and regeneration scripts
- Embedded chatbot widget for published book
- RESTful API for frontend-backend communication
- Stateless API design with session context management
- Environment-based configuration

### Out of Scope

- Multi-book corpus support (single book only in v1)
- User authentication or personalization
- Fine-tuning or training custom models
- Real-time collaborative features
- Mobile native applications (responsive web only)
- Offline mode functionality
- Multi-language support (English only in v1)
- Advanced analytics dashboard
- Admin UI for content management (CLI tools only)
- Integration with external knowledge bases

## Assumptions

1. **Book format**: Book is published using Docusaurus and markdown files are available in `docs/` directory
2. **Hosting**: Book is already deployed on Vercel and accessible via public URL
3. **Content structure**: Markdown files follow consistent heading hierarchy (H1 for chapters, H2 for sections)
4. **Update frequency**: Book content updates are infrequent (monthly or less), so manual ingestion workflow is acceptable
5. **Audience size**: Expected concurrent users is under 500 (free tier limits for Qdrant and Neon are sufficient)
6. **Query language**: All queries and content are in English
7. **API access**: Team has access to OpenAI API with sufficient quota
8. **Deployment**: Backend can be deployed to a serverless platform (Vercel Functions, Railway, or Fly.io)
9. **Session management**: Conversation context is maintained client-side and passed with each request (no server-side session storage)
10. **Content licensing**: Book content can be embedded and retrieved without licensing restrictions

## Dependencies

- **External Services**: OpenAI API for embeddings and text generation, Qdrant Cloud for vector storage, Neon Serverless Postgres for metadata storage
- **Existing Systems**: Published Docusaurus book hosted on Vercel, access to book's GitHub repository for markdown source files
- **Technical Prerequisites**: API keys for OpenAI, Qdrant, and Neon; environment variable configuration in deployment platform; CORS configuration to allow frontend-backend communication

## Constraints

- **Retrieval-only grounding**: Answers must be strictly based on retrieved content; no external knowledge or hallucination allowed
- **No model training**: Solution must use existing LLM APIs without fine-tuning (to keep complexity low)
- **Stateless API**: Backend must not maintain session state; all context passed in requests
- **Environment configuration**: All secrets and configuration via environment variables (no hardcoded credentials)
- **Free tier limits**: Solution must work within Qdrant Cloud free tier (1GB storage, 100 RPM) and Neon free tier (0.5GB storage, 100 hours compute/month)
- **Response time**: 95% of queries must complete within 3 seconds (including retrieval + generation)
- **Source attribution**: Every answer must include verifiable references to book sections

## Non-Functional Requirements

### Performance

- Query response time: p95 < 3 seconds, p99 < 5 seconds
- Chatbot widget load time: < 2 seconds
- Vector search latency: < 100ms for p99
- Ingestion throughput: Process 500 pages in < 10 minutes
- Concurrent users: Support 100 concurrent users without degradation

### Reliability

- API uptime: 99% availability during business hours
- Graceful degradation: Display clear error messages when services unavailable
- Retry logic: Automatic retry with exponential backoff for transient failures
- Data durability: Vector embeddings and metadata persisted with backup

### Security

- No credential exposure: All API keys in environment variables
- Input validation: Sanitize all user inputs to prevent injection
- CORS configuration: Restrict API access to published book domain only
- Rate limiting: Prevent abuse with per-IP rate limits (100 requests/hour)
- Audit logging: Log all queries and API calls for security review

### Maintainability

- Clear separation: Frontend, backend, and data layers independently deployable
- Documentation: README with setup instructions, architecture diagrams, API documentation
- Backup workflow: Documented process for content updates and re-ingestion
- Error logging: Structured logs for debugging and monitoring
- Code quality: Beginner-friendly code with comments explaining RAG flow
