# RAG Chatbot Backend

FastAPI backend for the RAG-based chatbot that answers questions about book content.

## Quick Start

### 1. Setup Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (macOS/Linux)
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Edit .env and add your API keys
# See SETUP_GUIDE.md for detailed instructions
```

### 4. Run Development Server

```bash
# Option 1: Using uvicorn directly
uvicorn app.main:app --reload --port 8000

# Option 2: Using Python
python -m app.main
```

### 5. Test the API

Open your browser and visit:
- API: http://localhost:8000
- Interactive Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/api/health

## Project Structure

```
rag-backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app entry point
│   ├── api/
│   │   ├── routes/          # API endpoints
│   │   └── models/          # Pydantic request/response models
│   ├── core/
│   │   ├── config.py        # Configuration management
│   │   ├── logging.py       # Logging setup
│   │   └── security.py      # Security utilities
│   ├── services/
│   │   ├── embeddings.py    # OpenAI embeddings
│   │   ├── vector_store.py  # Qdrant client
│   │   ├── query_pipeline.py # RAG orchestration
│   │   ├── answer_generator.py # Answer generation
│   │   └── metadata_store.py # Neon Postgres client
│   └── utils/
│       ├── chunking.py      # Document chunking
│       └── markdown_parser.py # Markdown parsing
├── ingestion/
│   ├── ingest.py            # Main ingestion script
│   └── chunk_strategy.py    # Chunking strategies
├── scripts/
│   ├── setup_qdrant.py      # Initialize Qdrant collection
│   ├── setup_neon.py        # Initialize Neon database
│   └── run_ingestion.py     # Run ingestion pipeline
├── tests/
│   ├── unit/                # Unit tests
│   ├── integration/         # Integration tests
│   └── contract/            # API contract tests
├── requirements.txt         # Production dependencies
├── requirements-dev.txt     # Development dependencies
├── .env.example             # Environment variable template
└── README.md                # This file
```

## Development Workflow

### Phase 1: Setup (Current)
- ✅ Project structure created
- ✅ Dependencies installed
- ✅ Basic FastAPI app running
- ⏳ External services configuration

### Phase 2: Foundational Infrastructure
- Database schemas
- Service clients (Qdrant, Neon, OpenAI)
- Health check endpoint

### Phase 3: MVP (User Story 1)
- Document ingestion pipeline
- RAG query pipeline
- Frontend chatbot widget

## Testing

```bash
# Install dev dependencies
pip install -r requirements-dev.txt

# Run all tests
pytest

# Run with coverage
pytest --cov=app tests/

# Run specific test file
pytest tests/unit/test_chunking.py -v
```

## Code Quality

```bash
# Format code
black app/ ingestion/ tests/

# Check linting
flake8 app/ ingestion/ tests/

# Sort imports
isort app/ ingestion/ tests/

# Type checking
mypy app/ ingestion/
```

## Deployment

See SETUP_GUIDE.md for detailed deployment instructions to Railway.

## Environment Variables

Required variables (see .env.example for template):

- `OPENAI_API_KEY`: OpenAI API key for embeddings and chat
- `QDRANT_URL`: Qdrant Cloud cluster URL
- `QDRANT_API_KEY`: Qdrant Cloud API key
- `DATABASE_URL`: Neon Postgres connection string
- `CORS_ORIGINS`: Comma-separated allowed origins
- `RATE_LIMIT_PER_HOUR`: Rate limit per IP (default: 100)

## Troubleshooting

### "Module not found" errors
```bash
# Ensure virtual environment is activated
# Reinstall dependencies
pip install -r requirements.txt
```

### "Connection refused" errors
```bash
# Verify external services are accessible
# Check .env file has correct credentials
# Test with health endpoint: GET /api/health
```

### Port 8000 already in use
```bash
# Use different port
uvicorn app.main:app --reload --port 8001
```

## Support

For detailed setup instructions, see SETUP_GUIDE.md
For implementation tasks, see ../specs/001-rag-chatbot/tasks.md
