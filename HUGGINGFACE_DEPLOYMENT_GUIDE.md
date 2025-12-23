# 🚀 Hugging Face Spaces Deployment Guide - RAG Backend (100% FREE)

Complete step-by-step guide to deploy your RAG backend on Hugging Face Spaces - **Completely FREE Forever!**

## ✨ Why Hugging Face Spaces?

- ✅ **100% FREE** - No credit card required, ever!
- ✅ **Persistent Storage** - Stays running 24/7
- ✅ **Easy Git Integration** - Direct push to deploy
- ✅ **Automatic HTTPS** - Secure by default
- ✅ **Docker Support** - Full FastAPI compatibility
- ✅ **Built-in Logs** - Real-time monitoring
- ✅ **Community Support** - Active developer community
- ✅ **No Usage Limits** - Perfect for AI projects

---

## 📋 Prerequisites

Before starting, make sure you have:
- ✅ Hugging Face account (we'll create in Step 1)
- ✅ Qdrant Cloud account (for vector database)
- ✅ Neon/PostgreSQL database (for metadata)
- ✅ Google Gemini API key (for embeddings)
- ✅ Git installed on your computer

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
   - Copy **Cluster URL**: `https://xxxxx.qdrant.io:6333`
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

## 🎯 Step 2: Create Hugging Face Account & Space

### 2.1 Sign Up on Hugging Face (30 seconds)

1. **Visit**: https://huggingface.co/join
2. **Sign up** with Email or GitHub
3. **Verify email** (check inbox)
4. **Complete profile** (username, etc.)

**Note**: 100% FREE - No credit card ever required!

### 2.2 Create New Space

1. **Go to**: https://huggingface.co/new-space
2. **Fill in details**:
   - **Space name**: `ai-book-rag-backend` (or your choice)
   - **License**: MIT
   - **Select SDK**: **Docker** (Important!)
   - **Space hardware**: **CPU basic** (FREE - default)
   - **Visibility**: Public (or Private if preferred)
3. **Click**: "Create Space"

### 2.3 Note Your Space URL

Your Space URL will be:
```
https://huggingface.co/spaces/YOUR-USERNAME/ai-book-rag-backend
```

Your API URL will be:
```
https://YOUR-USERNAME-ai-book-rag-backend.hf.space
```

---

## 🎯 Step 3: Configure Environment Variables (Secrets)

Before pushing code, let's add environment variables (called "Secrets" in Hugging Face).

### 3.1 Go to Space Settings

1. Open your Space page
2. Click **"Settings"** tab (top right)
3. Scroll to **"Repository secrets"** section

### 3.2 Add Environment Variables

Click **"New secret"** and add these **one by one**:

#### Google Gemini API (OpenAI-compatible)
```
Name: OPENAI_API_KEY
Value: AIzaSyC0GB7NK6s5WgIhAFM5EXSc3t_jz9dZlhE
```

```
Name: OPENAI_BASE_URL
Value: https://generativelanguage.googleapis.com/v1beta/openai/
```

```
Name: OPENAI_EMBEDDING_MODEL
Value: text-embedding-004
```

```
Name: OPENAI_CHAT_MODEL
Value: gemini-2.5-flash
```

#### Qdrant Cloud (Vector Database)
```
Name: QDRANT_URL
Value: https://3c946b39-7fdd-4653-b020-54a93b8d4b7e.europe-west3-0.gcp.cloud.qdrant.io:6333
```

```
Name: QDRANT_API_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.NdnD-CpszfLmJBmfUOyzlNnYzGVrXwzmKPyN8kqIugY
```

```
Name: QDRANT_COLLECTION_NAME
Value: book_chunks
```

#### Neon PostgreSQL Database
```
Name: DATABASE_URL
Value: postgresql://neondb_owner:npg_9YlkwUD5dmsV@ep-fragrant-cake-a4zdfht7-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

#### API Configuration
```
Name: API_KEY
Value: dev-secret-key-123
```

```
Name: CORS_ORIGINS
Value: http://localhost:3000,http://localhost:3001,https://ai-book-creation-guide.vercel.app/
```

```
Name: RATE_LIMIT_PER_HOUR
Value: 100
```

#### Application Settings
```
Name: LOG_LEVEL
Value: INFO
```

```
Name: ENVIRONMENT
Value: production
```

```
Name: DEMO_MODE
Value: false
```

```
Name: PYTHON_VERSION
Value: 3.11
```

**Total: 15 secrets** - Add them all!

---

## 🎯 Step 4: Push Code to Hugging Face Space

### 4.1 Clone Your Space Repository

```bash
# Go to your project root (parent of rag-backend folder)
cd "D:\Web Development\AI\AI-Native Hackathon\ai-book-creation-guide"

# Add Hugging Face Space as remote
cd rag-backend
git init
git remote add space https://huggingface.co/spaces/YOUR-USERNAME/ai-book-rag-backend
```

**Replace `YOUR-USERNAME`** with your Hugging Face username!

### 4.2 Prepare Files for Deployment

Make sure these files exist in `rag-backend/`:
- ✅ `README.md` (with Hugging Face metadata)
- ✅ `Dockerfile`
- ✅ `.dockerignore`
- ✅ `requirements.txt`
- ✅ `app.py` (Hugging Face entry point)
- ✅ `app/` folder (your FastAPI code)

### 4.3 Commit and Push

```bash
# Stage all files
git add .

# Commit
git commit -m "Deploy RAG backend to Hugging Face Spaces"

# Push to Hugging Face Space
git push space main
```

**Authentication**:
- When prompted for username: Enter your **Hugging Face username**
- When prompted for password: Use your **Hugging Face Access Token**

**Get Access Token**:
1. Go to https://huggingface.co/settings/tokens
2. Click "New token"
3. Name: `spaces-deploy`
4. Role: **Write**
5. Copy the token
6. Use this as password when pushing

### 4.4 Watch the Build

1. Go to your Space page: `https://huggingface.co/spaces/YOUR-USERNAME/ai-book-rag-backend`
2. Click **"Logs"** tab
3. Watch the build process:
   ```
   Building Docker image...
   Installing dependencies...
   Starting uvicorn server...
   ✓ Application running on http://0.0.0.0:7860
   ```

**Build time**: 5-10 minutes (first time)

---

## 🎯 Step 5: Populate Vector Database (Data Ingestion)

After deployment, you need to load your book content into the vector database.

### 5.1 Setup Local Environment

```bash
# Navigate to backend folder (in your local machine)
cd rag-backend

# Activate virtual environment
# Windows:
venv\Scripts\activate

# Install dependencies (if not already done)
pip install -r requirements.txt
```

### 5.2 Verify .env File

Your `rag-backend/.env` should have **SAME values** as Hugging Face secrets:

```bash
OPENAI_API_KEY=AIzaSyC0GB7NK6s5WgIhAFM5EXSc3t_jz9dZlhE
OPENAI_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai/
OPENAI_EMBEDDING_MODEL=text-embedding-004
OPENAI_CHAT_MODEL=gemini-2.5-flash
QDRANT_URL=https://3c946b39-7fdd-4653-b020-54a93b8d4b7e.europe-west3-0.gcp.cloud.qdrant.io:6333
QDRANT_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.NdnD-CpszfLmJBmfUOyzlNnYzGVrXwzmKPyN8kqIugY
QDRANT_COLLECTION_NAME=book_chunks
DATABASE_URL=postgresql://neondb_owner:npg_9YlkwUD5dmsV@ep-fragrant-cake-a4zdfht7-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### 5.3 Run Ingestion Script

```bash
# Run the ingestion script
python scripts/run_ingestion.py
```

**What this does:**
- ✅ Reads all `.md` files from `../ai-powered-book/docs/`
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

## 🎯 Step 6: Test Your Deployment

### 6.1 Test Health Endpoint

Open in browser:
```
https://YOUR-USERNAME-ai-book-rag-backend.hf.space/health
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

### 6.2 Test API Documentation

Visit:
```
https://YOUR-USERNAME-ai-book-rag-backend.hf.space/docs
```

You'll see **interactive API docs** - try the `/query` endpoint!

### 6.3 Test Query Endpoint

Using `curl`:
```bash
curl -X POST https://YOUR-USERNAME-ai-book-rag-backend.hf.space/query \
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

## 🎯 Step 7: Connect Frontend to Backend

### 7.1 Update Frontend API URL

In your chatbot component (e.g., `ChatbotWidget.js`):

```javascript
// OLD:
const API_URL = 'https://your-old-backend.vercel.app';

// NEW (Hugging Face):
const API_URL = 'https://YOUR-USERNAME-ai-book-rag-backend.hf.space';
```

**Replace `YOUR-USERNAME`** with your actual Hugging Face username!

### 7.2 Deploy Frontend

```bash
cd ai-powered-book
npm run build
# Push to GitHub - Your frontend host (Vercel/Netlify) will auto-deploy
```

### 7.3 Test End-to-End

1. Open your deployed frontend
2. Open chatbot
3. Ask: "What is Spec-Kit Plus?"
4. Verify response comes from Hugging Face backend

---

## 📊 Monitoring & Logs

### View Logs in Hugging Face

1. Go to your **Space page**
2. Click **"Logs"** tab
3. See real-time logs:
   ```
   INFO: Started server process
   INFO: Uvicorn running on http://0.0.0.0:7860
   INFO: Application startup complete
   ```

### Check Space Status

Hugging Face Dashboard shows:
- 🟢 **Status**: Running / Sleeping / Building
- 📊 **Logs**: Real-time application logs
- ⚙️ **Settings**: Environment variables and configuration

---

## 💡 Troubleshooting

### Issue: Build Failed

**Problem**: Docker build fails

**Solutions**:
1. Check **Logs** tab for specific error
2. Verify `Dockerfile` is correct
3. Ensure `requirements.txt` has all dependencies
4. Check Python version is 3.11
5. Verify all files are committed and pushed

### Issue: Space Sleeping

**Problem**: "Space is sleeping" message

**Solutions**:
1. Free tier Spaces sleep after inactivity
2. Click **"Wake up Space"** button
3. First request takes 10-20 seconds to wake
4. Subsequent requests are instant
5. Consider upgrading to persistent hardware (paid) if needed

### Issue: Health Check Failing

**Problem**: `/health` returns errors

**Solutions**:
1. Check **Logs** for connection errors
2. Verify **all 15 environment variables** are set in Settings → Repository secrets
3. Check Qdrant URL format includes `:6333` port
4. Verify Database URL has `?sslmode=require`
5. Test Qdrant and Database connections separately

### Issue: Qdrant Connection Failed

**Problem**: "Could not connect to Qdrant"

**Solutions**:
1. Verify `QDRANT_URL` format: `https://xxx.qdrant.io:6333` (includes port!)
2. Check `QDRANT_API_KEY` is correct (no extra spaces)
3. Ensure Qdrant cluster is running (check Qdrant dashboard)
4. Test connection from Logs tab

### Issue: Database Connection Error

**Problem**: "Could not connect to PostgreSQL"

**Solutions**:
1. Check `DATABASE_URL` has `?sslmode=require&channel_binding=require` at the end
2. Verify Neon database is active (not paused)
3. Check connection string is correct (copy from Neon dashboard)
4. Ensure no extra spaces in SECRET value

### Issue: No Vectors Found

**Problem**: Query returns "No relevant content found"

**Solutions**:
1. **Run ingestion script** (Step 5.3) - this is CRITICAL!
2. Check `QDRANT_COLLECTION_NAME` is `book_chunks` (same everywhere)
3. Verify ingestion completed successfully
4. Check `/health` endpoint shows `total_vectors > 0`
5. Run ingestion again if needed

### Issue: Import Errors

**Problem**: "Module not found" in logs

**Solutions**:
1. Ensure `requirements.txt` is complete
2. Check `Dockerfile` is using Python 3.11
3. Verify all app files are in correct folders
4. Check `app.py` entry point exists
5. Rebuild Space (Settings → Factory reboot)

---

## 🎉 Success Checklist

- ✅ Hugging Face Space created and running
- ✅ All 15 environment variables configured
- ✅ Health check returns "healthy"
- ✅ Qdrant has vectors (check `/health` endpoint)
- ✅ Database connected
- ✅ Query endpoint returns answers
- ✅ Frontend connected to backend
- ✅ Chatbot working end-to-end

---

## 📝 Free Tier Benefits

Hugging Face Spaces FREE tier includes:
- ✅ **Unlimited Spaces** - Create as many as you want
- ✅ **2 vCPU** - Decent performance
- ✅ **16GB RAM** - Plenty for FastAPI
- ✅ **50GB Storage** - More than enough
- ✅ **Automatic HTTPS** - Secure by default
- ✅ **Unlimited Requests** - No rate limits on free tier
- ✅ **Community Support** - Active forums and Discord
- ✅ **Forever FREE** - No credit card, no trial period

**Perfect for your AI Book project!** 🚀

**Note about sleeping**:
- Free Spaces sleep after 48 hours of inactivity
- Wake up takes 10-20 seconds on first request
- Upgrade to persistent hardware ($0.60/hour) for always-on

---

## 🔄 Updating Your Backend

When you make changes to backend code:

```bash
# In rag-backend folder
git add .
git commit -m "Update backend"
git push space main
```

**Hugging Face will automatically**:
1. Detect the push
2. Rebuild Docker image
3. Restart the Space
4. Run health checks
5. Deploy new version

**Build time**: 2-5 minutes (faster than first build)

---

## 💰 Optional Upgrades

If you need better performance:

### Persistent Hardware (No Sleeping)
- **CPU Persistent**: $0.60/hour (~$18/month)
- Space stays awake 24/7
- No wake-up delay

### Faster Hardware
- **GPU T4 Small**: $0.60/hour
- Useful for heavy AI workloads
- Overkill for your current setup

**For now, FREE tier is perfect!** Only upgrade if sleeping becomes an issue.

---

## 🆘 Need Help?

### Check These First:
1. **Logs Tab**: Shows all errors and warnings
2. **Health Endpoint**: `/health` shows connection status
3. **API Docs**: `/docs` to test endpoints manually
4. **Settings**: Verify all 15 secrets are set

### Common Mistakes:
- ❌ Forgot to run ingestion script (no vectors)
- ❌ Missing environment variables in Settings
- ❌ Wrong Qdrant URL format (missing `:6333` port)
- ❌ Database URL missing SSL parameters
- ❌ Space is sleeping (just wake it up)

### Hugging Face Support:
- **Documentation**: https://huggingface.co/docs/hub/spaces
- **Forums**: https://discuss.huggingface.co
- **Discord**: https://discord.com/invite/JfAtkvEtRb
- **Status**: https://status.huggingface.co

---

## 🎊 Congratulations!

Your RAG Backend is now:
- ✅ **Deployed on Hugging Face** (100% FREE)
- ✅ **Always accessible** (wakes in seconds)
- ✅ **Globally available** with HTTPS
- ✅ **Git-based deployment** (easy updates)
- ✅ **Connected to your frontend**
- ✅ **Ready for users!**

### Your URLs:
- **Space Page**: `https://huggingface.co/spaces/YOUR-USERNAME/ai-book-rag-backend`
- **API**: `https://YOUR-USERNAME-ai-book-rag-backend.hf.space`
- **Docs**: `https://YOUR-USERNAME-ai-book-rag-backend.hf.space/docs`
- **Health**: `https://YOUR-USERNAME-ai-book-rag-backend.hf.space/health`

---

## 📚 Next Steps

1. **Test thoroughly** - Try different queries
2. **Monitor logs** - Watch for errors
3. **Share your Space** - Show it to users
4. **Gather feedback** - Improve based on usage
5. **Consider upgrades** - Only if sleeping is an issue

---

## 🌟 Why This Setup is Perfect

- 💰 **Cost**: $0 (completely free)
- ⚡ **Performance**: Great for FastAPI
- 🔒 **Security**: HTTPS by default
- 📈 **Scalability**: Upgrade when needed
- 🛠️ **Maintenance**: Automatic updates via git push
- 🌍 **Availability**: Global CDN
- 💚 **Community**: Millions of AI developers

---

Made with ❤️ for your AI Book Creation Guide
Deployed on Hugging Face Spaces 🚀 - 100% FREE Forever!
