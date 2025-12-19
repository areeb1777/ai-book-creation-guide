# RAG Chatbot Backend - Vercel Deployment

Production-ready FastAPI backend for RAG (Retrieval-Augmented Generation) chatbot, optimized for Vercel serverless deployment.

## 🚀 Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/areeb1777/ai-book-creation-guide)

## 📁 Project Structure

```
rag-backend/
├── api/
│   └── index.py          # Vercel serverless entry point
├── app/
│   ├── api/
│   │   ├── models/       # Pydantic request/response models
│   │   └── routes/       # API endpoints
│   ├── core/
│   │   ├── config.py     # Settings and configuration
│   │   ├── logging.py    # Logging setup
│   │   └── security.py   # Rate limiting and authentication
│   ├── services/
│   │   ├── embeddings.py        # Embedding generation
│   │   ├── gemini_service.py    # Google Gemini integration
│   │   ├── vector_store.py      # Qdrant vector database
│   │   ├── metadata_store.py    # Postgres metadata storage
│   │   ├── query_pipeline.py    # RAG query orchestration
│   │   └── answer_generator.py  # Response generation
│   └── utils/
│       ├── chunking.py          # Text chunking strategies
│       └── markdown_parser.py   # Markdown parsing
├── ingestion/            # Data ingestion scripts (local use)
├── scripts/              # Setup and utility scripts (local use)
├── tests/                # Unit and integration tests
├── requirements.txt      # Python dependencies
├── vercel.json          # Vercel configuration
└── .vercelignore        # Files to exclude from deployment
```

## 🎯 Features

- **100% FREE** Google Gemini API for embeddings and chat
- **Serverless** architecture on Vercel (auto-scaling)
- **Vector Search** using Qdrant Cloud
- **Metadata Storage** with Neon Postgres
- **Rate Limiting** and API key authentication
- **CORS** configuration for frontend integration
- **Interactive API Docs** (Swagger/OpenAPI)
- **Health Checks** for monitoring

## 🛠️ Technology Stack

- **Framework**: FastAPI
- **Serverless Adapter**: Mangum
- **Vector Database**: Qdrant Cloud
- **Metadata Database**: Neon Postgres (Serverless)
- **Embeddings & Chat**: Google Gemini API (FREE)
- **Deployment**: Vercel

## 📋 Prerequisites

1. **Vercel Account** - [Sign up](https://vercel.com)
2. **Google Gemini API Key** - [Get API Key](https://makersuite.google.com/app/apikey) (FREE)
3. **Qdrant Cloud** - [Sign up](https://cloud.qdrant.io) (Free tier)
4. **Neon Postgres** - [Sign up](https://neon.tech) (Free tier)

## 🚀 Deployment

### Step 1: Deploy to Vercel

1. Click the **"Deploy with Vercel"** button above, or:
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click **"Add New"** → **"Project"**
4. Import your GitHub repository
5. Set **Root Directory** to `rag-backend`
6. Add environment variables (see below)
7. Click **Deploy**

### Step 2: Configure Environment Variables

Add these in Vercel Dashboard → Project → Settings → Environment Variables:

```bash
# Required
GEMINI_API_KEY=your-gemini-api-key
QDRANT_URL=https://your-cluster.gcp.cloud.qdrant.io:6333
QDRANT_API_KEY=your-qdrant-api-key
QDRANT_COLLECTION_NAME=book_chunks
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
API_KEY=your-chosen-api-key

# Optional
CORS_ORIGINS=https://your-frontend.vercel.app
ENVIRONMENT=production
LOG_LEVEL=INFO
```

### Step 3: Initialize Vector Database

Run locally to ingest your book content:

```bash
# Setup
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env with your credentials
cp .env.example .env

# Run ingestion
python scripts/run_ingestion.py
```

## 📚 API Documentation

Once deployed, visit:
- **Swagger UI**: `https://your-project.vercel.app/api/docs`
- **ReDoc**: `https://your-project.vercel.app/api/redoc`
- **OpenAPI JSON**: `https://your-project.vercel.app/api/openapi.json`

### Endpoints

#### Health Check
```bash
GET /api/health
```

#### Query Full Book
```bash
POST /api/query
{
  "query": "What is SpecKit?",
  "session_id": "user-123",
  "top_k": 5,
  "conversation_history": []
}
```

#### Query Selected Text
```bash
POST /api/query/selected
{
  "query": "Explain this",
  "selected_text": "The context to search within",
  "session_id": "user-123"
}
```

## 🧪 Testing

### Test Locally

```bash
# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn app.main:app --reload --port 8000
```

Visit: http://localhost:8000/api/docs

### Run Tests

```bash
# Install dev dependencies
pip install -r requirements-dev.txt

# Run tests
pytest tests/
```

## 🔐 Authentication

API supports two authentication methods:

1. **API Key** (via `X-API-Key` header)
   ```bash
   curl -H "X-API-Key: your-api-key" https://api.vercel.app/api/query
   ```

2. **Rate Limiting** (default: 100 requests/hour per IP)

## 📊 Monitoring

### Vercel Dashboard
- View logs: Project → Deployments → Logs
- Monitor performance: Analytics tab
- Check errors: Error Analytics

### Health Check
Monitor uptime using:
```bash
curl https://your-project.vercel.app/api/health
```

## 🔧 Configuration

### Adjust Rate Limits
Edit `app/core/security.py`:
```python
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["100/hour"]  # Change this
)
```

### Modify CORS Origins
Set in environment variables:
```bash
CORS_ORIGINS=https://domain1.com,https://domain2.com
```

## 🐛 Troubleshooting

### Connection Errors
- Verify all environment variables are set
- Check Qdrant cluster is running
- Ensure Neon database is active

### Timeout Issues
- Reduce `top_k` parameter (fewer chunks)
- Optimize chunk size in ingestion
- Use caching for frequent queries

### CORS Errors
- Add your frontend URL to `CORS_ORIGINS`
- Redeploy backend after changes

## 💰 Cost (FREE!)

- **Vercel**: Free tier (100GB bandwidth, 100h execution/month)
- **Gemini API**: FREE (15 req/min, 1500 req/day)
- **Qdrant**: Free tier (1GB)
- **Neon**: Free tier (3GB storage)

**Total: $0/month** within free tiers

## 📖 Full Documentation

See [VERCEL_DEPLOYMENT_GUIDE.md](../VERCEL_DEPLOYMENT_GUIDE.md) for detailed setup instructions.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file

## 🙋 Support

- Issues: [GitHub Issues](https://github.com/areeb1777/ai-book-creation-guide/issues)
- Documentation: [Full Deployment Guide](../VERCEL_DEPLOYMENT_GUIDE.md)
- API Docs: `/api/docs` on your deployment

---

**Happy deploying!** 🚀
