# 🚀 Render Deployment Guide - RAG Backend

Complete step-by-step guide to deploy your RAG backend on Render.com

## 📋 Prerequisites

Before starting, make sure you have:
- ✅ GitHub account (you already have)
- ✅ Render.com account (free tier available)
- ✅ Qdrant Cloud account (for vector database)
- ✅ Neon/PostgreSQL database (for metadata)
- ✅ Google Gemini API key (for embeddings)

---

## 🎯 Step 1: Prepare External Services

### 1.1 Qdrant Cloud Setup (Vector Database)
1. Go to https://cloud.qdrant.io
2. Sign up / Login
3. Create a new cluster:
   - Click "Create Cluster"
   - Choose FREE tier (1GB storage)
   - Select region closest to you
   - Note down:
     - **Cluster URL** (e.g., `https://xxx.qdrant.io`)
     - **API Key**

### 1.2 Neon Database Setup (PostgreSQL)
1. Go to https://neon.tech
2. Sign up / Login
3. Create a new project:
   - Click "Create Project"
   - Choose FREE tier
   - Note down **Connection String**:
     ```
     postgresql://user:password@host/database?sslmode=require
     ```

### 1.3 Google Gemini API Key
1. Go to https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy your API key

---

## 🎯 Step 2: Deploy Backend on Render

### 2.1 Create New Web Service

1. **Go to Render Dashboard**
   - Visit https://dashboard.render.com
   - Click "New +" button (top right)
   - Select "Web Service"

2. **Connect GitHub Repository**
   - Click "Connect a repository"
   - Authorize Render to access your GitHub
   - Select your repository: `ai-book-creation-guide`
   - Click "Connect"

### 2.2 Configure Service Settings

Fill in the following details:

#### Basic Settings:
- **Name**: `ai-book-rag-backend` (or your preferred name)
- **Region**: Select closest to you (e.g., Singapore)
- **Branch**: `main`
- **Root Directory**: `rag-backend`
- **Runtime**: `Python 3`

#### Build & Deploy Settings:
- **Build Command**:
  ```bash
  pip install -r requirements.txt
  ```

- **Start Command**:
  ```bash
  uvicorn app.main:app --host 0.0.0.0 --port $PORT
  ```

#### Instance Type:
- **Free** (for testing)
- Or **Starter** ($7/month for better performance)

### 2.3 Environment Variables

Click "Advanced" and add these environment variables:

```bash
# Qdrant Configuration
QDRANT_URL=https://your-cluster.qdrant.io
QDRANT_API_KEY=your-qdrant-api-key
QDRANT_COLLECTION_NAME=book_chapters

# Database Configuration (Neon PostgreSQL)
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# Google Gemini API
GEMINI_API_KEY=your-gemini-api-key

# API Configuration
DEMO_MODE=false
RATE_LIMIT=100/minute
```

### 2.4 Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Render will:
   - Clone your repository
   - Install dependencies
   - Start your FastAPI server
   - Provide you a live URL: `https://ai-book-rag-backend.onrender.com`

---

## 🎯 Step 3: Run Data Ingestion

After deployment, you need to populate your vector database with book content.

### 3.1 Local Ingestion (Recommended)

1. **Setup local environment**:
   ```bash
   cd rag-backend
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Create .env file** with your production credentials:
   ```bash
   QDRANT_URL=https://your-cluster.qdrant.io
   QDRANT_API_KEY=your-qdrant-api-key
   QDRANT_COLLECTION_NAME=book_chapters
   DATABASE_URL=postgresql://user:password@host/database?sslmode=require
   GEMINI_API_KEY=your-gemini-api-key
   ```

3. **Run ingestion script**:
   ```bash
   python scripts/run_ingestion.py
   ```

   This will:
   - Read all markdown files from `ai-powered-book/docs`
   - Create embeddings using Google Gemini
   - Store vectors in Qdrant
   - Store metadata in PostgreSQL

---

## 🎯 Step 4: Update Frontend to Use Render Backend

### 4.1 Update Frontend API URL

In your frontend code (chatbot component), update the API URL:

```javascript
// Before (Vercel)
const API_URL = 'https://your-vercel-backend.vercel.app';

// After (Render)
const API_URL = 'https://ai-book-rag-backend.onrender.com';
```

### 4.2 Test API Endpoints

Open your browser and test:
- Health Check: `https://ai-book-rag-backend.onrender.com/health`
- API Docs: `https://ai-book-rag-backend.onrender.com/docs`

---

## 🎯 Step 5: Verify Deployment

### 5.1 Test Backend Health

```bash
curl https://ai-book-rag-backend.onrender.com/health
```

Expected response:
```json
{
  "status": "healthy",
  "qdrant": "connected",
  "database": "connected"
}
```

### 5.2 Test Query Endpoint

```bash
curl -X POST https://ai-book-rag-backend.onrender.com/query \
  -H "Content-Type: application/json" \
  -d '{"query": "What is Spec-Kit Plus?"}'
```

### 5.3 Check Logs

In Render Dashboard:
- Go to your service
- Click "Logs" tab
- Monitor for any errors

---

## 📊 Monitoring & Maintenance

### Performance Monitoring

Render provides:
- CPU usage graphs
- Memory usage graphs
- Response time metrics
- Request logs

### Auto-Scaling

Render automatically:
- Restarts your service if it crashes
- Scales based on traffic (paid plans)
- Provides SSL certificates (HTTPS)

---

## 💡 Troubleshooting

### Issue: Cold Starts (Free Tier)
**Problem**: First request after 15 minutes is slow

**Solution**:
- Upgrade to Starter plan ($7/month) for always-on service
- Or accept 30-60 second delay on first request

### Issue: Out of Memory
**Problem**: Service crashes with memory errors

**Solution**:
- Upgrade to larger instance
- Optimize vector search (reduce top_k)
- Use batch processing for embeddings

### Issue: Database Connection Failed
**Problem**: Cannot connect to PostgreSQL

**Solution**:
- Check DATABASE_URL format
- Ensure `?sslmode=require` is appended
- Verify Neon database is active

### Issue: Qdrant Connection Failed
**Problem**: Vector search not working

**Solution**:
- Verify QDRANT_URL and QDRANT_API_KEY
- Check Qdrant cluster is running
- Ensure collection exists (run ingestion)

---

## 🎉 Success!

Your RAG backend is now deployed on Render! 🚀

### Quick Links:
- **Backend URL**: `https://ai-book-rag-backend.onrender.com`
- **API Docs**: `https://ai-book-rag-backend.onrender.com/docs`
- **Render Dashboard**: https://dashboard.render.com

### Next Steps:
1. ✅ Update frontend chatbot to use Render URL
2. ✅ Test all chatbot features
3. ✅ Monitor logs for any issues
4. ✅ Consider upgrading to paid plan for better performance

---

## 📝 Notes

- **Free tier** spins down after 15 minutes of inactivity
- **Starter plan** ($7/month) keeps service always running
- Render provides **automatic HTTPS** and **SSL certificates**
- **No cold starts** on paid plans = faster response times
- Backend stays **always connected** to databases (better than serverless)

---

## 🆘 Need Help?

If you face any issues:
1. Check Render logs first
2. Verify all environment variables
3. Test database connections
4. Check API documentation: `/docs` endpoint

---

Made with ❤️ for your AI Book Creation Guide
