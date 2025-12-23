# 🚀 Koyeb Deployment Guide - RAG Backend (100% FREE)

Complete step-by-step guide to deploy your RAG backend on Koyeb - **No Credit Card Required!**

## ✨ Why Koyeb?

- ✅ **100% FREE** - No credit card needed
- ✅ **No Cold Starts** - Always running
- ✅ **2 Free Apps** allowed
- ✅ **Easy GitHub Integration**
- ✅ **Automatic HTTPS/SSL**
- ✅ **Global CDN**
- ✅ **Better than Vercel for FastAPI**

---

## 📋 Prerequisites

Before starting, make sure you have:
- ✅ GitHub account with your repo pushed
- ✅ Koyeb account (we'll create in Step 1)
- ✅ Qdrant Cloud account (for vector database)
- ✅ Neon/PostgreSQL database (for metadata)
- ✅ Google Gemini API key (for embeddings)

---

## 🎯 Step 1: Setup External Services

### 1.1 Qdrant Cloud Setup (Vector Database) - FREE

1. **Go to**: https://cloud.qdrant.io
2. **Sign up** with GitHub (quick & free)
3. **Create Cluster**:
   - Click "Create Cluster"
   - Select **FREE tier** (1GB storage - perfect for your book)
   - Choose region: **Europe** or **Asia** (closest to you)
   - Wait 2-3 minutes for cluster creation
4. **Get Credentials**:
   - Click on your cluster name
   - Copy **Cluster URL**: `https://xxxxx.qdrant.io`
   - Copy **API Key**: (shown in dashboard)

### 1.2 Neon Database Setup (PostgreSQL) - FREE

1. **Go to**: https://neon.tech
2. **Sign up** with GitHub
3. **Create Project**:
   - Click "Create a project"
   - Name: `ai-book-metadata`
   - Select FREE tier (0.5GB storage)
   - Region: Choose closest to you
4. **Get Connection String**:
   - Go to "Connection Details"
   - Copy **Connection String** (looks like):
     ```
     postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
     ```

### 1.3 Google Gemini API Key - FREE

1. **Go to**: https://makersuite.google.com/app/apikey
2. **Create API Key** (free tier: 60 requests/minute)
3. **Copy** your API key

---

## 🎯 Step 2: Create Koyeb Account & Deploy

### 2.1 Sign Up on Koyeb (30 seconds)

1. **Visit**: https://app.koyeb.com/auth/signup
2. **Sign up with GitHub** (easiest method)
3. **Verify email** (check inbox)
4. **Login** to Koyeb Dashboard

### 2.2 Create New App

1. **Click**: "Create App" button (top right)
2. **Select**: "GitHub" as source
3. **Authorize** Koyeb to access your GitHub repos
4. **Select Repository**: `ai-book-creation-guide`

### 2.3 Configure Deployment

#### Builder Settings:
- **Builder**: `Dockerfile` (Koyeb will auto-detect)
- **Branch**: `main`
- **Dockerfile path**: `rag-backend/Dockerfile`

#### Instance Settings:
- **Instance Type**: `Free` (Eco - 512MB RAM)
- **Regions**: `Frankfurt (fra)` or closest to you
- **Auto-scaling**: OFF (free tier = 1 instance)

#### Port Configuration:
- **Port**: `8000`
- **Protocol**: `HTTP`
- **Expose publicly**: ✅ YES

#### Health Check:
- **Path**: `/health`
- **Port**: `8000`
- **Initial delay**: `30` seconds
- **Timeout**: `5` seconds

### 2.4 Add Environment Variables

Click **"Environment Variables"** and add these (one by one):

```bash
# Qdrant Configuration
QDRANT_URL=https://your-cluster-id.qdrant.io
QDRANT_API_KEY=your-qdrant-api-key-here
QDRANT_COLLECTION_NAME=book_chapters

# Database Configuration (Neon PostgreSQL)
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# Google Gemini API
GEMINI_API_KEY=your-gemini-api-key-here

# API Configuration
DEMO_MODE=false
RATE_LIMIT=100/minute
PORT=8000
PYTHON_VERSION=3.11
```

**IMPORTANT**: Replace all placeholder values with your actual credentials from Step 1!

### 2.5 Deploy!

1. **App Name**: `ai-book-rag-backend` (or your choice)
2. **Click**: "Create App"
3. **Wait**: 5-8 minutes for:
   - Building Docker image
   - Deploying to Koyeb
   - Health check to pass
4. **Get URL**: `https://ai-book-rag-backend-yourname.koyeb.app`

---

## 🎯 Step 3: Populate Vector Database (Data Ingestion)

After deployment, you need to load your book content into the vector database.

### 3.1 Setup Local Environment

```bash
# Navigate to backend folder
cd rag-backend

# Create virtual environment (if not exists)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3.2 Create .env File

Create `.env` file in `rag-backend` folder with your **production credentials**:

```bash
# Copy from Step 1 - Use SAME values as Koyeb environment variables
QDRANT_URL=https://your-cluster-id.qdrant.io
QDRANT_API_KEY=your-qdrant-api-key
QDRANT_COLLECTION_NAME=book_chapters
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
GEMINI_API_KEY=your-gemini-api-key
```

### 3.3 Run Ingestion Script

```bash
# Run the ingestion script
python scripts/run_ingestion.py
```

**What this does:**
- ✅ Reads all `.md` files from `ai-powered-book/docs/`
- ✅ Chunks content into semantic pieces
- ✅ Creates embeddings using Google Gemini (FREE)
- ✅ Stores vectors in Qdrant Cloud
- ✅ Stores metadata in Neon PostgreSQL

**Expected output:**
```
Processing file: intro.md
Created 12 chunks
Generating embeddings...
Stored 12 vectors in Qdrant
✓ Complete! Total: 67 chunks processed
```

**Time**: ~2-5 minutes depending on book size

---

## 🎯 Step 4: Test Your Deployment

### 4.1 Test Health Endpoint

Open in browser:
```
https://ai-book-rag-backend-yourname.koyeb.app/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "qdrant_connected": true,
  "database_connected": true,
  "collection_exists": true,
  "total_vectors": 67
}
```

### 4.2 Test API Documentation

Visit:
```
https://ai-book-rag-backend-yourname.koyeb.app/docs
```

You'll see **interactive API docs** - try the `/query` endpoint!

### 4.3 Test Query Endpoint

Using `curl`:
```bash
curl -X POST https://ai-book-rag-backend-yourname.koyeb.app/query \
  -H "Content-Type: application/json" \
  -d '{"query": "What is Spec-Kit Plus?"}'
```

**Expected Response:**
```json
{
  "answer": "Spec-Kit Plus is a structured...",
  "sources": [
    {
      "chapter": "Chapter 1",
      "content": "...",
      "similarity": 0.89
    }
  ]
}
```

---

## 🎯 Step 5: Connect Frontend to Backend

### 5.1 Update Frontend API URL

In your chatbot component (e.g., `ChatbotWidget.js`):

```javascript
// OLD (Vercel):
const API_URL = 'https://your-vercel-backend.vercel.app';

// NEW (Koyeb):
const API_URL = 'https://ai-book-rag-backend-yourname.koyeb.app';
```

### 5.2 Deploy Frontend (Vercel)

```bash
cd ai-powered-book
npm run build
# Push to GitHub - Vercel will auto-deploy
```

### 5.3 Test End-to-End

1. Open your deployed frontend
2. Open chatbot
3. Ask: "What is Spec-Kit Plus?"
4. Verify response comes from backend

---

## 📊 Monitoring & Logs

### View Logs in Koyeb Dashboard

1. Go to **Koyeb Dashboard**
2. Click on your app: `ai-book-rag-backend`
3. Click **"Logs"** tab
4. See real-time logs:
   ```
   INFO: Started server process
   INFO: Uvicorn running on http://0.0.0.0:8000
   INFO: Application startup complete
   ```

### Check Metrics

Koyeb Dashboard shows:
- 📊 **CPU Usage**
- 💾 **Memory Usage**
- 🌐 **Request Count**
- ⏱️ **Response Time**

---

## 💡 Troubleshooting

### Issue: Health Check Failing

**Problem**: Deployment stuck at "Unhealthy"

**Solutions**:
1. Check logs for errors
2. Verify environment variables are correct
3. Ensure PORT=8000 is set
4. Wait 2-3 minutes - initial startup takes time

### Issue: Qdrant Connection Failed

**Problem**: "Could not connect to Qdrant"

**Solutions**:
1. Verify `QDRANT_URL` format: `https://xxx.qdrant.io` (no trailing slash)
2. Check `QDRANT_API_KEY` is correct
3. Ensure Qdrant cluster is running (check Qdrant dashboard)

### Issue: Database Connection Error

**Problem**: "Could not connect to PostgreSQL"

**Solutions**:
1. Check `DATABASE_URL` has `?sslmode=require` at the end
2. Verify Neon database is active
3. Check connection string is correct

### Issue: No Vectors Found

**Problem**: Query returns "No relevant content found"

**Solutions**:
1. Run ingestion script (Step 3.3)
2. Check `QDRANT_COLLECTION_NAME` matches in all configs
3. Verify ingestion completed successfully

### Issue: "Module not found" Error

**Problem**: Import errors in logs

**Solutions**:
1. Ensure `requirements.txt` is complete
2. Check Dockerfile is copying all files
3. Verify Python version is 3.11

---

## 🎉 Success Checklist

- ✅ Koyeb app deployed and running
- ✅ Health check returns "healthy"
- ✅ Qdrant has vectors (check `/health` endpoint)
- ✅ Database connected
- ✅ Query endpoint returns answers
- ✅ Frontend connected to backend
- ✅ Chatbot working end-to-end

---

## 📝 Free Tier Limits

Koyeb FREE tier includes:
- ✅ **2 apps** (1 web service + 1 database or 2 web services)
- ✅ **512MB RAM** per instance
- ✅ **Always running** - NO cold starts
- ✅ **100GB bandwidth/month**
- ✅ **Unlimited requests**
- ✅ **Custom domains** (optional)
- ✅ **Automatic HTTPS/SSL**

**Perfect for your AI Book project!** 🚀

---

## 🔄 Updating Your Backend

When you make changes to backend code:

```bash
# Commit changes
git add .
git commit -m "Update backend"
git push origin main
```

**Koyeb will automatically**:
1. Detect the push
2. Rebuild Docker image
3. Deploy new version
4. Run health checks
5. Switch traffic to new version

**Zero downtime deployment!** ✨

---

## 🆘 Need Help?

### Check These First:
1. **Koyeb Logs**: Dashboard → App → Logs
2. **Health Endpoint**: `/health` shows connection status
3. **API Docs**: `/docs` to test endpoints manually

### Common Issues:
- **Slow first request**: Normal - Koyeb may need to wake up (< 2 seconds)
- **502 Bad Gateway**: App is starting up - wait 30 seconds
- **Environment variable not found**: Check spelling and values in Koyeb dashboard

---

## 🎊 Congratulations!

Your RAG Backend is now:
- ✅ **Deployed on Koyeb** (100% FREE)
- ✅ **Always running** (no cold starts)
- ✅ **Globally accessible**
- ✅ **Connected to your frontend**
- ✅ **Ready for users!**

### Your URLs:
- **Backend**: `https://ai-book-rag-backend-yourname.koyeb.app`
- **API Docs**: `https://ai-book-rag-backend-yourname.koyeb.app/docs`
- **Health**: `https://ai-book-rag-backend-yourname.koyeb.app/health`

---

Made with ❤️ for your AI Book Creation Guide
Deployed on Koyeb 🚀 - 100% FREE Forever!
