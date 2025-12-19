# Quickstart Guide: RAG Chatbot Integration

**Feature**: RAG Chatbot Integration
**Branch**: `001-rag-chatbot`
**Date**: 2025-12-17
**Audience**: Developers implementing the RAG chatbot feature

## Overview

This guide provides step-by-step instructions to set up, develop, and deploy the RAG chatbot integration for the AI-powered book. Follow these steps in order to get the system running locally and deployed to production.

**Estimated Time**: 2-3 hours for local setup, 1-2 hours for deployment

---

## Prerequisites

### Required Tools

- **Python**: 3.11 or higher ([Download](https://www.python.org/downloads/))
- **Node.js**: 20.0 or higher ([Download](https://nodejs.org/))
- **Git**: Latest version ([Download](https://git-scm.com/))
- **Code Editor**: VS Code recommended ([Download](https://code.visualstudio.com/))

### Required Accounts (Free Tiers)

1. **OpenAI Platform**: [platform.openai.com](https://platform.openai.com/)
   - Get API key with billing enabled (pay-as-you-go)
   - Estimated cost: $0.01-$0.10 for development

2. **Qdrant Cloud**: [cloud.qdrant.io](https://cloud.qdrant.io/)
   - Free tier: 1GB storage, 100 RPM
   - Create account and cluster

3. **Neon Serverless Postgres**: [neon.tech](https://neon.tech/)
   - Free tier: 0.5GB storage, 100 compute hours/month
   - Create account and database

4. **Railway** (or Fly.io): [railway.app](https://railway.app/)
   - For backend deployment
   - Free tier: 500 hours/month

5. **Vercel** (already set up): For book deployment

### Optional Tools

- **Postman** or **Insomnia**: For API testing ([Download](https://www.postman.com/))
- **Docker**: For containerized development ([Download](https://www.docker.com/))

---

## Part 1: Local Development Setup (30-45 minutes)

### Step 1: Clone Repository and Setup Branch

```bash
# Clone the repository (if not already cloned)
git clone https://github.com/your-org/ai-book-creation-guide.git
cd ai-book-creation-guide

# Checkout feature branch
git checkout 001-rag-chatbot

# Verify you're on the correct branch
git branch
```

### Step 2: Create Backend Project Structure

```bash
# Create backend directory
mkdir rag-backend
cd rag-backend

# Create Python virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Create project structure
mkdir -p app/{api/routes,core,services,utils} ingestion tests scripts
touch app/__init__.py app/main.py
touch app/api/__init__.py app/api/routes/__init__.py
touch app/core/__init__.py app/core/config.py
touch app/services/__init__.py
touch ingestion/__init__.py
```

### Step 3: Install Python Dependencies

```bash
# Still in rag-backend/ directory with venv activated

# Install core dependencies
pip install fastapi==0.110.0
pip install "uvicorn[standard]==0.27.0"
pip install openai==1.10.0
pip install qdrant-client==1.7.0
pip install psycopg2-binary==2.9.9
pip install python-dotenv==1.0.0
pip install pydantic-settings==2.1.0

# Install development dependencies
pip install pytest==8.0.0
pip install httpx==0.26.0  # For FastAPI test client
pip install black==24.1.0  # Code formatter
pip install flake8==7.0.0  # Linter

# Freeze dependencies
pip freeze > requirements.txt
```

### Step 4: Setup External Services

#### 4.1 OpenAI API Key

1. Visit [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Click "Create new secret key"
3. Name it "RAG Chatbot Dev"
4. Copy the key (starts with `sk-...`)
5. Set usage limit: $5/month (Settings → Usage limits)

#### 4.2 Qdrant Cloud

1. Sign up at [cloud.qdrant.io](https://cloud.qdrant.io/)
2. Create new cluster:
   - Name: "book-chatbot-dev"
   - Region: Closest to you
   - Tier: Free (1GB)
3. Get credentials:
   - **Cluster URL**: `https://xyz-abc.cloud.qdrant.io`
   - **API Key**: Click "Generate API Key"
4. Create collection (we'll automate this later):
   ```bash
   # Test connection with curl (optional)
   curl -X GET "https://xyz-abc.cloud.qdrant.io/collections" \
     -H "api-key: YOUR_QDRANT_API_KEY"
   ```

#### 4.3 Neon Serverless Postgres

1. Sign up at [neon.tech](https://neon.tech/)
2. Create new project:
   - Name: "rag-chatbot-dev"
   - Region: Closest to you
3. Get connection string:
   - Dashboard → Connection Details
   - Copy "Pooled connection" string:
     ```
     postgresql://user:pass@ep-xyz.neon.tech/dbname?sslmode=require
     ```
4. Run schema setup (create tables):
   ```bash
   # We'll create a schema file in scripts/setup_neon.py later
   ```

### Step 5: Configure Environment Variables

```bash
# Still in rag-backend/ directory

# Create .env file
cat > .env << 'EOF'
# OpenAI API
OPENAI_API_KEY=sk-your-key-here
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
OPENAI_CHAT_MODEL=gpt-3.5-turbo-0125

# Qdrant Cloud
QDRANT_URL=https://xyz-abc.cloud.qdrant.io
QDRANT_API_KEY=your-qdrant-key-here
QDRANT_COLLECTION_NAME=book_chunks

# Neon Serverless Postgres
DATABASE_URL=postgresql://user:pass@ep-xyz.neon.tech/dbname?sslmode=require

# API Config
API_KEY=dev-secret-key-123
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
RATE_LIMIT_PER_HOUR=100

# Logging
LOG_LEVEL=INFO
EOF

# IMPORTANT: Add .env to .gitignore
echo ".env" >> .gitignore
echo "venv/" >> .gitignore
echo "__pycache__/" >> .gitignore
echo "*.pyc" >> .gitignore
```

**Replace placeholders**:
- `sk-your-key-here` → Your OpenAI API key
- `https://xyz-abc.cloud.qdrant.io` → Your Qdrant cluster URL
- `your-qdrant-key-here` → Your Qdrant API key
- `postgresql://...` → Your Neon connection string

### Step 6: Create Minimal FastAPI App (Smoke Test)

```bash
# Create app/main.py
cat > app/main.py << 'EOF'
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="RAG Chatbot API",
    description="API for book Q&A chatbot",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:3000").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "RAG Chatbot API", "status": "running"}

@app.get("/api/health")
async def health():
    return {
        "status": "healthy",
        "services": {
            "qdrant": "not_implemented",
            "neon": "not_implemented",
            "openai": "not_implemented"
        },
        "version": "1.0.0"
    }
EOF

# Run the app
uvicorn app.main:app --reload --port 8000
```

**Test the app**:
1. Open browser: [http://localhost:8000](http://localhost:8000)
2. You should see: `{"message": "RAG Chatbot API", "status": "running"}`
3. Visit docs: [http://localhost:8000/docs](http://localhost:8000/docs)
4. Stop the server: `Ctrl+C`

---

## Part 2: Implement Core Components (1-2 hours)

Now that the basic setup is complete, follow the implementation order in `plan.md` to build each component:

### Phase 2: Ingestion Pipeline

See `plan.md` → "Execution Order" → "Phase 2: Ingestion Pipeline" for detailed steps.

**Quick checklist**:
- [ ] Implement `app/utils/markdown_parser.py`
- [ ] Implement `app/utils/chunking.py`
- [ ] Implement `app/services/embeddings.py`
- [ ] Implement `app/services/vector_store.py`
- [ ] Create `scripts/run_ingestion.py`
- [ ] Run ingestion: `python scripts/run_ingestion.py`
- [ ] Verify chunks in Qdrant dashboard

### Phase 3: Backend API

See `plan.md` → "Execution Order" → "Phase 3: Backend API" for detailed steps.

**Quick checklist**:
- [ ] Implement `app/services/query_pipeline.py`
- [ ] Implement `app/services/answer_generator.py`
- [ ] Implement `app/api/routes/query.py`
- [ ] Implement `app/api/routes/health.py`
- [ ] Test API with Postman/curl
- [ ] Write unit tests

---

## Part 3: Frontend Integration (30-45 minutes)

### Step 1: Setup Frontend Environment

```bash
# Navigate to book directory
cd ../ai-powered-book

# Install dependencies (if not already installed)
npm install

# Add chatbot-specific dependencies
npm install axios  # For API calls
# Note: React 19 and other dependencies already installed
```

### Step 2: Create Chatbot Widget Component

```bash
# Create component directory
mkdir -p src/components/ChatbotWidget

# Create component files
touch src/components/ChatbotWidget/index.tsx
touch src/components/ChatbotWidget/ChatWindow.tsx
touch src/components/ChatbotWidget/api.ts
touch src/components/ChatbotWidget/styles.module.css
```

See `plan.md` → "Component Breakdown" → "6. Frontend Chatbot Widget Integration" for implementation details.

### Step 3: Integrate Widget into Docusaurus

```bash
# Swizzle Root component (one-time only)
npm run swizzle @docusaurus/theme-classic Root -- --eject

# This creates src/theme/Root.js
# Edit it to inject the ChatbotWidget (see plan.md for code)
```

### Step 4: Configure Environment Variables

```bash
# Create .env.local in ai-powered-book/
cat > .env.local << 'EOF'
REACT_APP_RAG_API_URL=http://localhost:8000
REACT_APP_RAG_API_KEY=dev-secret-key-123
EOF

# Add to .gitignore
echo ".env.local" >> .gitignore
```

### Step 5: Test Integration Locally

```bash
# Terminal 1: Start backend (from rag-backend/)
cd rag-backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
uvicorn app.main:app --reload --port 8000

# Terminal 2: Start frontend (from ai-powered-book/)
cd ai-powered-book
npm start

# Browser will open at http://localhost:3000
# Look for chatbot widget in bottom-right corner
```

---

## Part 4: Deployment (1-2 hours)

### Step 1: Deploy Backend to Railway

#### 1.1 Prepare for Deployment

```bash
# In rag-backend/ directory

# Create Dockerfile
cat > Dockerfile << 'EOF'
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app
COPY ingestion ./ingestion
COPY scripts ./scripts

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
EOF

# Create .dockerignore
cat > .dockerignore << 'EOF'
venv/
__pycache__/
*.pyc
.env
.git/
tests/
EOF

# Create railway.json (optional, for Railway-specific config)
cat > railway.json << 'EOF'
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE"
  },
  "deploy": {
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
EOF
```

#### 1.2 Push to GitHub

```bash
# Commit backend code
git add rag-backend/
git commit -m "Add RAG chatbot backend

🤖 Generated with Claude Code"

git push origin 001-rag-chatbot
```

#### 1.3 Deploy on Railway

1. Sign up/login at [railway.app](https://railway.app/)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository and `001-rag-chatbot` branch
4. Railway will auto-detect Dockerfile and build
5. Set environment variables:
   - Go to project → Variables
   - Add all variables from `.env` (OPENAI_API_KEY, QDRANT_URL, etc.)
   - **Important**: Update `CORS_ORIGINS` to include your Vercel domain
6. Get deployment URL:
   - Settings → Domains → Generate domain
   - Copy URL (e.g., `https://rag-backend-production.up.railway.app`)

#### 1.4 Run Ingestion on Railway

```bash
# SSH into Railway (one-time setup)
railway login
railway link  # Link to your project

# Run ingestion script
railway run python scripts/run_ingestion.py

# Verify chunks in Qdrant dashboard
```

### Step 2: Deploy Frontend to Vercel

```bash
# In ai-powered-book/ directory

# Update environment variable for production
# Go to Vercel dashboard → Your project → Settings → Environment Variables
# Add:
#   REACT_APP_RAG_API_URL = https://rag-backend-production.up.railway.app
#   REACT_APP_RAG_API_KEY = your-production-api-key

# Commit frontend changes
git add ai-powered-book/
git commit -m "Integrate RAG chatbot widget

🤖 Generated with Claude Code"

git push origin 001-rag-chatbot

# Vercel auto-deploys on push
# Check deployment at https://your-book.vercel.app
```

### Step 3: End-to-End Testing

**Test production deployment**:

1. Visit your deployed book: `https://your-book.vercel.app`
2. Click chatbot widget (bottom-right corner)
3. Ask a question: "What is Spec-Kit Plus?"
4. Verify:
   - [ ] Answer appears within 3 seconds
   - [ ] Answer is relevant to book content
   - [ ] Source citations are clickable
   - [ ] Clicking source navigates to correct section
5. Test selected-text mode:
   - Highlight a paragraph
   - Click "Ask about this"
   - Ask a question
   - Verify answer is based only on selected text

**Check logs**:
- Railway: Project → Logs (check for errors)
- Vercel: Project → Deployments → Logs

---

## Part 5: Backup Setup (15-30 minutes)

### Step 1: Create Backup Folder

```bash
# In repository root
mkdir -p backup/docs backup/scripts backup/schemas

# Copy current docs to backup
cp -r ai-powered-book/docs/* backup/docs/

# Create metadata file
cat > backup/metadata.json << EOF
{
  "backup_date": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "version": "1.0.0",
  "total_files": $(ls -1 ai-powered-book/docs/*.md | wc -l),
  "source": "ai-powered-book/docs/"
}
EOF
```

### Step 2: Create Backup Scripts

See `plan.md` → "Execution Order" → "Phase 6: Backup & Documentation" for script implementations.

**Quick checklist**:
- [ ] Create `backup/scripts/snapshot_content.sh`
- [ ] Create `backup/scripts/regenerate_embeddings.sh`
- [ ] Export Neon schema: `python rag-backend/scripts/export_db_schema.py > backup/schemas/neon_schema.sql`
- [ ] Test backup workflow

### Step 3: Document Backup Process

```bash
# Create backup/README.md with instructions
# (See plan.md for template)
```

---

## Common Issues & Troubleshooting

### Issue 1: OpenAI API Key Invalid

**Error**: `openai.error.AuthenticationError: Incorrect API key provided`

**Solution**:
1. Verify API key in `.env` file (no extra spaces)
2. Check OpenAI dashboard → API keys (key not deleted)
3. Ensure billing is enabled (Settings → Billing)

### Issue 2: Qdrant Connection Failed

**Error**: `ConnectionError: Could not connect to Qdrant`

**Solution**:
1. Verify Qdrant URL and API key in `.env`
2. Check Qdrant cluster status (cloud dashboard)
3. Test connection: `curl -X GET "YOUR_QDRANT_URL/collections" -H "api-key: YOUR_KEY"`

### Issue 3: Neon Connection Timeout

**Error**: `psycopg2.OperationalError: timeout expired`

**Solution**:
1. Check Neon dashboard → Compute (ensure not paused)
2. Verify connection string (pooled connection, not direct)
3. Enable auto-resume in Neon settings

### Issue 4: CORS Error in Browser

**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**:
1. Verify `CORS_ORIGINS` in backend `.env` includes frontend URL
2. Restart backend server after changing CORS config
3. Check browser console for exact origin being blocked

### Issue 5: Rate Limit Exceeded

**Error**: `429: Rate limit of 100 requests per hour exceeded`

**Solution**:
1. Wait 1 hour or increase `RATE_LIMIT_PER_HOUR` in `.env`
2. For development, set to higher value (e.g., 1000)
3. For production, implement IP whitelisting

---

## Next Steps

After completing this quickstart:

1. **Run `/sp.tasks`** to generate detailed implementation tasks
2. **Review `plan.md`** for complete architecture and component details
3. **Review `data-model.md`** for entity definitions and schemas
4. **Review `contracts/openapi.yaml`** for API contract details
5. **Write tests** following `plan.md` → "Testing Strategy"
6. **Monitor production** using Railway/Vercel logs
7. **Iterate based on user feedback**

---

## Useful Commands Reference

### Backend (rag-backend/)

```bash
# Activate virtual environment
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows

# Run dev server
uvicorn app.main:app --reload --port 8000

# Run tests
pytest tests/

# Format code
black app/ ingestion/ tests/

# Lint code
flake8 app/ ingestion/ tests/

# Run ingestion
python scripts/run_ingestion.py

# Export database schema
python scripts/export_db_schema.py > backup/schemas/neon_schema.sql
```

### Frontend (ai-powered-book/)

```bash
# Start dev server
npm start

# Build for production
npm run build

# Serve production build
npm run serve

# Clear Docusaurus cache
npm run clear
```

### Railway CLI

```bash
# Login
railway login

# Link to project
railway link

# Run command in Railway environment
railway run <command>

# View logs
railway logs

# Deploy manually
railway up
```

### Git

```bash
# Check current branch
git branch

# Commit changes
git add .
git commit -m "Your message"

# Push to remote
git push origin 001-rag-chatbot

# Create pull request (after implementation complete)
gh pr create --title "RAG Chatbot Integration" --body "See specs/001-rag-chatbot/plan.md"
```

---

## Resources

- **Feature Spec**: [spec.md](./spec.md)
- **Implementation Plan**: [plan.md](./plan.md)
- **Data Model**: [data-model.md](./data-model.md)
- **API Contract**: [contracts/openapi.yaml](./contracts/openapi.yaml)
- **Research**: [research.md](./research.md)

### External Documentation

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Qdrant Documentation](https://qdrant.tech/documentation/)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [Neon Documentation](https://neon.tech/docs/introduction)
- [Railway Documentation](https://docs.railway.app/)
- [Docusaurus Documentation](https://docusaurus.io/)

---

**Last Updated**: 2025-12-17
**Status**: Complete - Ready for implementation
