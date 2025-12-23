# 🚀 Railway Deployment Guide - RAG Backend

Complete step-by-step guide to deploy your RAG backend on Railway with $5 free monthly credit.

## ✨ Why Railway?

- ✅ **$5 Free Credit Monthly** - No credit card for trial
- ✅ **No Cold Starts** - Always running
- ✅ **Easy GitHub Integration** - Auto-deploy on push
- ✅ **Automatic HTTPS/SSL** - Secure by default
- ✅ **Great for FastAPI** - Persistent connections
- ✅ **Built-in Database Support** - PostgreSQL available
- ✅ **Excellent Logs & Metrics** - Real-time monitoring

---

## 📋 Prerequisites

Before starting, make sure you have:
- ✅ GitHub account with your repo pushed
- ✅ Railway account (we'll create in Step 1)
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

## 🎯 Step 2: Create Railway Account & Deploy

### 2.1 Sign Up on Railway (30 seconds)

1. **Visit**: https://railway.app
2. **Click**: "Login" → "Login with GitHub"
3. **Authorize** Railway to access your GitHub
4. **Verify email** (check inbox)
5. **Complete profile setup**

**Note**: Railway gives you $5 in free credits monthly. No credit card needed for trial!

### 2.2 Create New Project

1. **Click**: "New Project" (in dashboard)
2. **Select**: "Deploy from GitHub repo"
3. **Authorize** Railway to access your repositories (if first time)
4. **Select Repository**: `ai-book-creation-guide`
5. **Click**: "Deploy Now"

### 2.3 Configure Service

Railway will detect your `railway.json` and `Procfile` automatically!

#### Update Root Directory (Important!)

1. **Click** on your deployed service
2. **Go to**: "Settings" tab
3. **Find**: "Root Directory"
4. **Set to**: `rag-backend`
5. **Click**: "Update" or save

This tells Railway that your app is inside the `rag-backend` folder.

#### Verify Configuration

Railway should auto-detect:
- **Builder**: Nixpacks
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Health Check Path**: `/health`

### 2.4 Add Environment Variables

1. **Click** on your service
2. **Go to**: "Variables" tab
3. **Click**: "New Variable"
4. **Add these variables one by one**:

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
PYTHON_VERSION=3.11
```

**IMPORTANT**: Replace all placeholder values with your actual credentials from Step 1!

### 2.5 Deploy!

1. Railway will **automatically deploy** after you set environment variables
2. **Wait**: 3-5 minutes for:
   - Installing dependencies
   - Building the app
   - Starting uvicorn server
   - Health check to pass
3. **Get URL**: Click "Settings" → Look for "Domains" section
4. **Add Domain**: Click "Generate Domain" to get your Railway URL
   - Example: `https://ai-book-rag-backend-production.up.railway.app`

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
# Copy from Step 1 - Use SAME values as Railway environment variables
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
https://your-app-name.up.railway.app/health
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
https://your-app-name.up.railway.app/docs
```

You'll see **interactive API docs** - try the `/query` endpoint!

### 4.3 Test Query Endpoint

Using `curl`:
```bash
curl -X POST https://your-app-name.up.railway.app/query \
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
// OLD:
const API_URL = 'https://your-old-backend.vercel.app';

// NEW (Railway):
const API_URL = 'https://your-app-name.up.railway.app';
```

### 5.2 Deploy Frontend

```bash
cd ai-powered-book
npm run build
# Push to GitHub - Your frontend host (Vercel/Netlify) will auto-deploy
```

### 5.3 Test End-to-End

1. Open your deployed frontend
2. Open chatbot
3. Ask: "What is Spec-Kit Plus?"
4. Verify response comes from Railway backend

---

## 📊 Monitoring & Logs

### View Logs in Railway Dashboard

1. Go to **Railway Dashboard**
2. Click on your service
3. Click **"Deployments"** tab
4. Click on latest deployment
5. Click **"View Logs"**
6. See real-time logs:
   ```
   INFO: Started server process
   INFO: Uvicorn running on http://0.0.0.0:8000
   INFO: Application startup complete
   ```

### Check Metrics

Railway Dashboard shows:
- 📊 **CPU Usage**
- 💾 **Memory Usage**
- 🌐 **Network Traffic**
- ⏱️ **Response Time**
- 💰 **Credit Usage**

---

## 💡 Troubleshooting

### Issue: Deployment Failed

**Problem**: Build or deployment failed

**Solutions**:
1. Check **Logs** in Railway dashboard for error messages
2. Verify `requirements.txt` has all dependencies
3. Ensure `railway.json` and `Procfile` exist in `rag-backend/`
4. Verify Root Directory is set to `rag-backend`
5. Check Python version is 3.11

### Issue: Health Check Failing

**Problem**: Deployment stuck at "Unhealthy"

**Solutions**:
1. Check logs for errors
2. Verify environment variables are correct
3. Ensure all required env vars are set
4. Wait 2-3 minutes - initial startup takes time
5. Check `/health` endpoint returns 200 status

### Issue: Qdrant Connection Failed

**Problem**: "Could not connect to Qdrant"

**Solutions**:
1. Verify `QDRANT_URL` format: `https://xxx.qdrant.io` (no trailing slash)
2. Check `QDRANT_API_KEY` is correct
3. Ensure Qdrant cluster is running (check Qdrant dashboard)
4. Test connection from Railway logs

### Issue: Database Connection Error

**Problem**: "Could not connect to PostgreSQL"

**Solutions**:
1. Check `DATABASE_URL` has `?sslmode=require` at the end
2. Verify Neon database is active
3. Check connection string is correct
4. Ensure no extra spaces in environment variable

### Issue: No Vectors Found

**Problem**: Query returns "No relevant content found"

**Solutions**:
1. Run ingestion script (Step 3.3)
2. Check `QDRANT_COLLECTION_NAME` matches in all configs
3. Verify ingestion completed successfully
4. Check `/health` endpoint shows `total_vectors > 0`

### Issue: Port Binding Error

**Problem**: "Address already in use"

**Solutions**:
1. Railway automatically sets `$PORT` environment variable
2. Ensure `Procfile` uses `$PORT` (not hardcoded 8000)
3. Restart the deployment

### Issue: Out of Free Credits

**Problem**: "Exceeded free tier limits"

**Solutions**:
1. Check credit usage in Railway dashboard
2. Optimize your app to use fewer resources
3. Consider adding payment method for continued service
4. Free tier gives $5/month (resets monthly)

---

## 🎉 Success Checklist

- ✅ Railway app deployed and running
- ✅ Health check returns "healthy"
- ✅ Qdrant has vectors (check `/health` endpoint)
- ✅ Database connected
- ✅ Query endpoint returns answers
- ✅ Frontend connected to backend
- ✅ Chatbot working end-to-end

---

## 📝 Free Tier Limits

Railway FREE tier includes:
- ✅ **$5 in credits per month**
- ✅ **Always running** - NO cold starts
- ✅ **512MB RAM** (upgradeable)
- ✅ **1GB disk space**
- ✅ **100GB bandwidth/month**
- ✅ **Unlimited requests**
- ✅ **Custom domains**
- ✅ **Automatic HTTPS/SSL**

**Perfect for your AI Book project!** 🚀

**Credit Usage Estimates:**
- Small FastAPI app: ~$0.50-$2/month
- With moderate traffic: ~$2-$4/month
- Your app should easily fit in $5/month!

---

## 🔄 Updating Your Backend

When you make changes to backend code:

```bash
# Commit changes
git add .
git commit -m "Update backend"
git push origin main
```

**Railway will automatically**:
1. Detect the push
2. Pull latest code
3. Rebuild the app
4. Run health checks
5. Switch traffic to new version

**Zero downtime deployment!** ✨

---

## 💰 Monitoring Credit Usage

### Check Your Usage

1. Go to **Railway Dashboard**
2. Click **"Account"** (top right)
3. Click **"Usage"**
4. See breakdown:
   - CPU usage
   - Memory usage
   - Network egress
   - Estimated cost

### Optimize Costs

**Tips to stay within $5/month:**
1. ✅ Use efficient queries (limit results)
2. ✅ Implement caching where possible
3. ✅ Optimize database queries
4. ✅ Monitor and fix memory leaks
5. ✅ Use rate limiting (already implemented)

---

## 🆘 Need Help?

### Check These First:
1. **Railway Logs**: Dashboard → Service → Deployments → View Logs
2. **Health Endpoint**: `/health` shows connection status
3. **API Docs**: `/docs` to test endpoints manually
4. **Metrics**: Dashboard shows resource usage

### Common Issues:
- **First request slow**: Completely normal - Railway has no cold starts but initial connection may take 1-2 seconds
- **502 Bad Gateway**: App is starting up - wait 30 seconds and retry
- **Environment variable not found**: Check spelling and values in Railway dashboard
- **Connection timeout**: Check firewall settings and environment variables

### Railway Support:
- **Documentation**: https://docs.railway.app
- **Discord Community**: https://discord.gg/railway
- **Status Page**: https://status.railway.app

---

## 🎊 Congratulations!

Your RAG Backend is now:
- ✅ **Deployed on Railway** (with $5 free monthly credit)
- ✅ **Always running** (no cold starts)
- ✅ **Globally accessible**
- ✅ **Auto-deploys** from GitHub
- ✅ **Connected to your frontend**
- ✅ **Ready for users!**

### Your URLs:
- **Backend**: `https://your-app-name.up.railway.app`
- **API Docs**: `https://your-app-name.up.railway.app/docs`
- **Health**: `https://your-app-name.up.railway.app/health`

---

## 📚 Next Steps

1. **Monitor your app** in Railway dashboard
2. **Test all endpoints** thoroughly
3. **Share your app** with users
4. **Gather feedback** and iterate
5. **Scale up** if needed (add payment method)

---

## 🔧 Advanced Configuration

### Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Click **"Custom Domain"**
3. Add your domain: `api.yourdomain.com`
4. Add CNAME record to your DNS:
   ```
   CNAME api -> your-app-name.up.railway.app
   ```
5. Wait for SSL certificate (automatic)

### Database Scaling (Optional)

If you need more database storage:
1. Consider Railway's built-in PostgreSQL
2. Or upgrade your Neon tier
3. Monitor usage in respective dashboards

### Performance Optimization

1. **Enable Redis caching** (optional)
2. **Optimize vector search** (adjust top_k)
3. **Batch queries** where possible
4. **Monitor response times** in logs

---

Made with ❤️ for your AI Book Creation Guide
Deployed on Railway 🚀 - $5 Free Credit Monthly!
