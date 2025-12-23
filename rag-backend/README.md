---
title: AI Book RAG Backend
emoji: 📚
colorFrom: blue
colorTo: purple
sdk: docker
pinned: false
license: mit
app_port: 7860
---

# AI Book RAG Backend

A FastAPI-based RAG (Retrieval-Augmented Generation) backend for an AI-powered book Q&A chatbot.

## Features

- 🔍 Vector similarity search using Qdrant
- 💬 Q&A using Google Gemini API
- 📊 PostgreSQL metadata storage
- 🚀 FastAPI for high performance
- 🔒 Rate limiting and security

## Project Structure

```
rag-backend/
├── app/
│   ├── main.py              # Main FastAPI application
│   ├── api/
│   │   ├── routes/
│   │   │   ├── health.py
│   │   │   ├── query.py
│   │   │   └── query_selected.py
│   │   └── models/
│   ├── core/
│   │   ├── config.py
│   │   ├── logging.py
│   │   └── security.py
│   └── services/
├── app.py                   # Hugging Face Spaces entry point
├── requirements.txt         # Python dependencies
└── README.md               # This file
```

## API Endpoints

- `GET /` - API status
- `GET /health` - Health check with service status
- `POST /query` - Ask questions about the book
- `GET /docs` - Interactive API documentation (Swagger UI)
- `GET /redoc` - Alternative API documentation (ReDoc)

## Environment Variables

Configure in Hugging Face Spaces Settings → Repository secrets:

```env
OPENAI_API_KEY=your_google_gemini_api_key
OPENAI_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai/
OPENAI_EMBEDDING_MODEL=text-embedding-004
OPENAI_CHAT_MODEL=gemini-2.5-flash
QDRANT_URL=your_qdrant_cloud_url
QDRANT_API_KEY=your_qdrant_api_key
QDRANT_COLLECTION_NAME=book_chunks
DATABASE_URL=your_postgresql_url
RATE_LIMIT_PER_HOUR=100
```

## Local Development

```bash
cd rag-backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 7860
```

The API will be available at `http://localhost:7860` with documentation at `http://localhost:7860/docs`.

## Deployment on Hugging Face Spaces

1. Create a new Space on Hugging Face
2. Select "Docker" as SDK
3. Push this code to the Space repository
4. Configure environment variables in Settings
5. Space will automatically build and deploy

## Health Check

Visit `/health` endpoint to check:
- API status
- Qdrant connection
- Database connection
- Vector collection status

## License

MIT
