# RAG Chatbot Backend

This is a FastAPI backend for a RAG (Retrieval-Augmented Generation) chatbot that answers questions about book content using vector similarity search. It's configured for deployment on Vercel.

## Project Structure

```
rag-backend/
├── app/
│   ├── main.py              # Main application entry point (Vercel deployment)
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
├── requirements.txt         # Python dependencies
├── vercel.json             # Vercel deployment configuration
└── README.md               # This file
```

## Dependencies

All required dependencies are listed in `requirements.txt` and include:
- `fastapi`: Modern, fast web framework for building APIs
- `uvicorn`: ASGI server for running the application
- `mangum`: Adapter for running ASGI apps on serverless platforms like Vercel
- `python-dotenv`: For environment variable management
- Other dependencies as needed for the RAG functionality

## Vercel Deployment Configuration

The `vercel.json` file is configured to:
- Use `app/main.py` as the entry point
- Deploy all routes via the FastAPI application
- Allocate 1024MB memory with 60s max duration for serverless functions

## Local Development

To run the application locally:

```bash
cd rag-backend
pip install -r requirements.txt
python -m app.main
```

The API will be available at `http://localhost:8000` with documentation at `http://localhost:8000/docs`.

## Environment Variables

Create a `.env` file in the rag-backend directory with the following variables:

```env
OPENAI_API_KEY=your_openai_api_key
QDRANT_URL=your_qdrant_url
QDRANT_API_KEY=your_qdrant_api_key
GEMINI_API_KEY=your_gemini_api_key
DATABASE_URL=your_database_url
RATE_LIMIT=30/minute
```

## Deployment

This backend is ready for deployment on Vercel:

1. Push the code to a Git repository
2. Connect your repository to Vercel
3. Set the Root Directory to `rag-backend`
4. The build will automatically use the configuration in `vercel.json`

## API Endpoints

- `GET /` - Health check and API info
- `GET /docs` - Interactive API documentation (Swagger UI)
- `GET /redoc` - Alternative API documentation (ReDoc)
- `/query` - Query endpoint for RAG functionality
- `/query-selected` - Query selected documents endpoint
- `/health` - Health check endpoint