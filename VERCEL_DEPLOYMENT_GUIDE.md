# Complete Vercel Deployment Guide - RAG Chatbot Backend

This guide provides step-by-step instructions for deploying your RAG chatbot backend to Vercel.

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Account**: Your code should be pushed to GitHub (already done ✅)
3. **Required API Keys** (obtained beforehand):
   - Google Gemini API key (for embeddings & chat)
   - Qdrant Cloud URL and API key (for vector storage)
   - Neon Postgres connection string (for metadata)

---

## 🚀 Step 1: Prepare Your Environment Variables

Before deploying, gather all your API credentials. You'll need:

### Required Environment Variables:

```bash
# Google Gemini API (FREE - Get from: https://makersuite.google.com/app/apikey)
GEMINI_API_KEY=your-gemini-api-key

# Qdrant Cloud (Vector Database)
QDRANT_URL=https://your-cluster.gcp.cloud.qdrant.io:6333
QDRANT_API_KEY=your-qdrant-api-key
QDRANT_COLLECTION_NAME=book_chunks

# Neon Postgres (Metadata Database)
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# API Security
API_KEY=your-chosen-api-key-for-rate-limiting

# Optional: CORS Origins (comma-separated)
CORS_ORIGINS=https://your-frontend.vercel.app,https://yourdomain.com

# Environment
ENVIRONMENT=production
LOG_LEVEL=INFO
```

### 📝 How to Get API Keys:

#### 1. Google Gemini API Key (FREE):
- Go to: https://makersuite.google.com/app/apikey
- Click "Create API Key"
- Copy the key

#### 2. Qdrant Cloud:
- Sign up at: https://cloud.qdrant.io
- Create a free cluster
- Get URL and API key from dashboard
- Create a collection named `book_chunks` with dimension 768

#### 3. Neon Postgres:
- Sign up at: https://neon.tech
- Create a new project
- Copy the connection string

---

## 🎯 Step 2: Deploy Backend to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Click **"Add New"** → **"Project"**

2. **Import Your GitHub Repository**
   - Select **"Import Git Repository"**
   - Choose your repository: `ai-book-creation-guide`
   - Click **"Import"**

3. **Configure Project Settings**
   - **Framework Preset**: Select **"Other"**
   - **Root Directory**: Click **"Edit"** and set to `rag-backend`
   - **Build Command**: Leave empty (not needed for Python serverless)
   - **Output Directory**: Leave empty
   - **Install Command**: Leave empty

4. **Add Environment Variables**
   - Click **"Environment Variables"**
   - Add each variable from Step 1:
     ```
     GEMINI_API_KEY: [paste your key]
     QDRANT_URL: [paste your URL]
     QDRANT_API_KEY: [paste your key]
     QDRANT_COLLECTION_NAME: book_chunks
     DATABASE_URL: [paste your Neon connection string]
     API_KEY: [create a secure random string]
     CORS_ORIGINS: *
     ENVIRONMENT: production
     LOG_LEVEL: INFO
     ```

   **Important**: Make sure to add these to all environments (Production, Preview, Development)

5. **Deploy**
   - Click **"Deploy"**
   - Wait 2-3 minutes for deployment to complete
   - Your backend will be live at: `https://your-project.vercel.app`

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Navigate to Backend Directory**
   ```bash
   cd rag-backend
   ```

4. **Deploy**
   ```bash
   vercel
   ```

   Follow the prompts:
   - Set up and deploy? **Yes**
   - Which scope? Select your account
   - Link to existing project? **No**
   - What's your project's name? `rag-chatbot-backend`
   - In which directory is your code located? `./`
   - Want to override the settings? **No**

5. **Add Environment Variables**
   ```bash
   vercel env add GEMINI_API_KEY
   vercel env add QDRANT_URL
   vercel env add QDRANT_API_KEY
   vercel env add QDRANT_COLLECTION_NAME
   vercel env add DATABASE_URL
   vercel env add API_KEY
   vercel env add CORS_ORIGINS
   vercel env add ENVIRONMENT
   vercel env add LOG_LEVEL
   ```

6. **Deploy to Production**
   ```bash
   vercel --prod
   ```

---

## 🧪 Step 3: Test Your Deployment

### 1. Test Root Endpoint
Open your browser and visit:
```
https://your-project.vercel.app/api
```

You should see:
```json
{
  "message": "RAG Chatbot API",
  "status": "running",
  "version": "1.0.0",
  "docs": "/api/docs"
}
```

### 2. Test Health Check
```
https://your-project.vercel.app/api/health
```

Should return:
```json
{
  "status": "healthy",
  "timestamp": "2025-12-19T...",
  "vector_store": "connected",
  "metadata_store": "connected"
}
```

### 3. View API Documentation
```
https://your-project.vercel.app/api/docs
```

This opens the interactive Swagger UI where you can test all endpoints.

### 4. Test Query Endpoint (using curl)
```bash
curl -X POST https://your-project.vercel.app/api/query \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key" \
  -d '{
    "query": "What is SpecKit?",
    "session_id": "test-123",
    "top_k": 3
  }'
```

---

## 🎨 Step 4: Configure Frontend to Use Vercel Backend

### 1. Update Frontend Environment Variables

In your `ai-powered-book` directory, create a `.env` file:

```bash
cd ai-powered-book
cp .env.example .env
```

Edit `.env`:
```env
REACT_APP_RAG_API_URL=https://your-backend-project.vercel.app
REACT_APP_RAG_API_KEY=your-api-key
```

**Replace** `your-backend-project` with your actual Vercel deployment URL.

### 2. Test Frontend Locally

```bash
npm start
```

Open http://localhost:3000 and test the chatbot:
- Click the chat widget
- Ask a question like "What is SpecKit?"
- Verify it connects to your Vercel backend

---

## 📦 Step 5: Deploy Frontend to Vercel (Optional)

If you want to deploy the frontend to Vercel as well:

### 1. Add Frontend to Vercel
- Go to Vercel Dashboard
- Click **"Add New"** → **"Project"**
- Import the same repository
- **Root Directory**: Set to `ai-powered-book`
- **Framework Preset**: Select **"Docusaurus"** or **"Other"**

### 2. Configure Build Settings
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install`

### 3. Add Environment Variables
```
REACT_APP_RAG_API_URL=https://your-backend.vercel.app
REACT_APP_RAG_API_KEY=your-api-key
```

### 4. Deploy
Click **Deploy** and wait for completion.

### 5. Update CORS in Backend
After frontend is deployed, update backend environment variable:
```
CORS_ORIGINS=https://your-frontend.vercel.app
```

Redeploy backend for CORS changes to take effect.

---

## 🔧 Step 6: Initialize Your Vector Database

Before your chatbot can answer questions, you need to ingest your book content:

### Option 1: Run Ingestion Locally (Recommended)

1. **Setup Local Environment**
   ```bash
   cd rag-backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Create `.env` file in rag-backend**
   ```bash
   cp .env.example .env
   ```

   Add the same environment variables as in Vercel

3. **Run Ingestion Script**
   ```bash
   python scripts/run_ingestion.py
   ```

   This will:
   - Read markdown files from `backup/docs/`
   - Generate embeddings using Gemini API (FREE)
   - Store vectors in Qdrant Cloud
   - Store metadata in Neon Postgres

### Option 2: Run Ingestion via API (Alternative)

Create an admin endpoint or manually upload your data through the Qdrant dashboard.

---

## 🔍 Troubleshooting

### Issue: "Failed to connect to vector store"

**Solution**:
- Verify `QDRANT_URL` and `QDRANT_API_KEY` are correct
- Check if Qdrant collection exists with correct dimensions (768)
- Verify Qdrant cluster is running

### Issue: "Database connection failed"

**Solution**:
- Verify `DATABASE_URL` is correct
- Check if Neon database is active
- Ensure connection string includes `?sslmode=require`

### Issue: "CORS error in frontend"

**Solution**:
- Update `CORS_ORIGINS` in Vercel backend environment variables
- Add your frontend URL
- Redeploy backend

### Issue: "Rate limit exceeded"

**Solution**:
- The API has rate limiting enabled
- Adjust rate limits in `app/core/security.py`
- Or use `X-API-Key` header to bypass rate limits

### Issue: "Function execution timeout"

**Solution**:
- Vercel serverless functions have a 60s timeout
- If queries take too long, optimize:
  - Reduce `top_k` parameter (fewer chunks retrieved)
  - Use faster embedding model
  - Cache frequently asked questions

---

## 📊 Monitoring Your Deployment

### Vercel Dashboard
- View logs: Go to your project → Deployments → Click on deployment → Logs
- Monitor performance: Check Function Invocations and Duration
- View errors: Check Error Analytics

### API Health Monitoring
Set up periodic health checks using services like:
- UptimeRobot (free)
- Pingdom
- Better Stack

Health check URL: `https://your-backend.vercel.app/api/health`

---

## 🔐 Security Best Practices

1. **Never commit `.env` files** - Already in `.gitignore` ✅
2. **Rotate API keys** regularly (especially after sharing in documentation)
3. **Set CORS_ORIGINS** to specific domains in production
4. **Use API_KEY** for rate limiting and access control
5. **Monitor logs** for suspicious activity
6. **Enable Vercel authentication** if needed for sensitive data

---

## 💰 Cost Estimation

### Free Tier Limits:

- **Vercel**:
  - 100GB bandwidth/month
  - 100 hours function execution/month
  - 1000 serverless function invocations/day

- **Google Gemini**:
  - 15 requests/minute
  - 1500 requests/day
  - **100% FREE** for embeddings & chat

- **Qdrant Cloud**:
  - 1GB free cluster
  - ~100k vectors

- **Neon Postgres**:
  - 3GB storage
  - 1 database

**Total Monthly Cost**: $0 (within free tiers)

---

## 🚀 Next Steps

1. **Ingest Your Book Content** (Step 6)
2. **Test All Endpoints** (Step 3)
3. **Configure Frontend** (Step 4)
4. **Set Up Monitoring** (Monitoring section)
5. **Optional: Deploy Frontend to Vercel** (Step 5)

---

## 📞 Support

If you encounter issues:

1. Check Vercel deployment logs
2. Verify all environment variables are set correctly
3. Test API endpoints using `/api/docs` (Swagger UI)
4. Review error messages in browser console (frontend)

---

## ✅ Deployment Checklist

- [ ] Backend deployed to Vercel
- [ ] All environment variables configured
- [ ] Health check returns "healthy"
- [ ] Vector database initialized
- [ ] Frontend configured with backend URL
- [ ] CORS configured correctly
- [ ] API documentation accessible
- [ ] Test query successful
- [ ] Monitoring set up

---

**Congratulations!** 🎉 Your RAG chatbot backend is now live on Vercel!

Your API is accessible at: `https://your-project.vercel.app/api`
API docs at: `https://your-project.vercel.app/api/docs`
