# Deployment Guide: RAG Chatbot Backend

Complete guide for deploying the RAG chatbot backend to production.

## Pre-Deployment Checklist

- [ ] All environment variables configured in `.env`
- [ ] External services set up (OpenAI, Qdrant, Neon)
- [ ] Local testing completed (health endpoint returns "healthy")
- [ ] Code committed to Git on branch `001-rag-chatbot`
- [ ] Docker builds successfully: `docker build -t rag-backend .`

## Option 1: Deploy to Railway (Recommended)

### Step 1: Prepare Repository

```bash
# Ensure all code is committed
git add rag-backend/
git commit -m "Add RAG chatbot backend"
git push origin 001-rag-chatbot
```

### Step 2: Create Railway Project

1. Visit [railway.app](https://railway.app/)
2. Click "New Project" → "Deploy from GitHub repo"
3. Authorize Railway to access your repository
4. Select repository and branch `001-rag-chatbot`
5. Railway auto-detects Dockerfile from `rag-backend/`

### Step 3: Configure Environment Variables

In Railway dashboard → Variables, add:

```bash
OPENAI_API_KEY=sk-your-key-here
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
OPENAI_CHAT_MODEL=gpt-3.5-turbo-0125

QDRANT_URL=https://your-cluster.cloud.qdrant.io
QDRANT_API_KEY=your-qdrant-key
QDRANT_COLLECTION_NAME=book_chunks

DATABASE_URL=postgresql://user:pass@ep-xyz.neon.tech/dbname?sslmode=require

API_KEY=your-production-secret-key
CORS_ORIGINS=https://your-book.vercel.app
RATE_LIMIT_PER_HOUR=100

LOG_LEVEL=INFO
ENVIRONMENT=production
```

**Important**: Update `CORS_ORIGINS` with your actual Vercel book URL!

### Step 4: Deploy

Railway automatically deploys when you push to GitHub.

**Monitor deployment**:
- Railway Dashboard → Deployments → View logs
- Wait for "Build successful" message
- Get public URL: Settings → Domains → Generate domain

**Example URL**: `https://rag-backend-production.up.railway.app`

### Step 5: Initialize Database and Vector Store

After deployment, initialize services:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to project
railway link

# Run Neon setup
railway run python scripts/setup_neon.py

# Run Qdrant setup
railway run python scripts/setup_qdrant.py

# Run ingestion
railway run python scripts/run_ingestion.py
```

### Step 6: Verify Deployment

Test production API:

```bash
# Health check
curl https://rag-backend-production.up.railway.app/api/health

# Expected response:
# {
#   "status": "healthy",
#   "services": {
#     "qdrant": "connected",
#     "neon": "connected",
#     "openai": "api_key_valid"
#   },
#   "version": "1.0.0"
# }

# Test query (replace with your API key if enabled)
curl -X POST https://rag-backend-production.up.railway.app/api/query \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-production-secret-key" \
  -d '{"query": "What is Spec-Kit Plus?"}'
```

---

## Option 2: Deploy to Fly.io

### Step 1: Install Fly CLI

```bash
# macOS
brew install flyctl

# Linux
curl -L https://fly.io/install.sh | sh

# Windows
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
```

### Step 2: Login and Initialize

```bash
cd rag-backend

# Login
fly auth login

# Initialize (creates fly.toml)
fly launch --name rag-chatbot-backend --region ord
```

### Step 3: Configure Secrets

```bash
# Set environment variables as secrets
fly secrets set OPENAI_API_KEY=sk-your-key
fly secrets set QDRANT_URL=https://your-cluster.cloud.qdrant.io
fly secrets set QDRANT_API_KEY=your-key
fly secrets set DATABASE_URL="postgresql://..."
fly secrets set CORS_ORIGINS=https://your-book.vercel.app
```

### Step 4: Deploy

```bash
fly deploy
```

### Step 5: Initialize Services

```bash
# SSH into Fly.io instance
fly ssh console

# Run setup scripts
python scripts/setup_neon.py
python scripts/setup_qdrant.py
python scripts/run_ingestion.py

# Exit
exit
```

---

## Option 3: Deploy to Vercel Functions (Serverless)

**Note**: May have cold start latency and 10s timeout limit.

### Step 1: Create API Directory

```bash
mkdir -p api
```

### Step 2: Create Serverless Function

Create `api/query.py`:

```python
# Vercel serverless function wrapper
from app.main import app

# Export for Vercel
handler = app
```

### Step 3: Create vercel.json

```json
{
  "builds": [
    {
      "src": "api/**/*.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "api/query.py"
    }
  ]
}
```

### Step 4: Deploy

```bash
vercel --prod
```

---

## Post-Deployment Tasks

### 1. Update Frontend

Update `ai-powered-book/.env.local` (or Vercel environment variables):

```bash
REACT_APP_RAG_API_URL=https://rag-backend-production.up.railway.app
REACT_APP_RAG_API_KEY=your-production-secret-key
```

Deploy frontend:

```bash
git add ai-powered-book/
git commit -m "Update RAG API URL for production"
git push origin 001-rag-chatbot
# Vercel auto-deploys
```

### 2. Test End-to-End

1. Visit your production book: `https://your-book.vercel.app`
2. Click chatbot widget (bottom-right)
3. Ask: "What is Spec-Kit Plus?"
4. Verify:
   - Answer appears within 3 seconds
   - Sources are clickable
   - Clicking source navigates to correct section

### 3. Monitor Production

**Railway**:
- Dashboard → Metrics (CPU, memory, requests)
- Logs → Check for errors
- Set up alerts for failures

**Qdrant**:
- Cloud Dashboard → Check storage usage (<1GB)
- Monitor request count (<100 RPM)

**Neon**:
- Dashboard → Compute hours (<100 hours/month)
- Enable auto-pause (5 min idle)

**OpenAI**:
- Usage Dashboard → Track token consumption
- Set up billing alerts ($5 threshold)

### 4. Setup Monitoring (Optional)

Add Sentry for error tracking:

```bash
# Install
pip install sentry-sdk[fastapi]

# Configure in app/main.py
import sentry_sdk
sentry_sdk.init(dsn=settings.sentry_dsn)
```

Add to Railway environment variables:

```bash
SENTRY_DSN=https://your-sentry-dsn
```

---

## Rollback Procedure

If deployment fails or has issues:

### Quick Rollback (Railway)

1. Railway Dashboard → Deployments
2. Find previous working deployment
3. Click "Redeploy"

### Manual Rollback

```bash
# Revert commits
git revert HEAD
git push origin 001-rag-chatbot

# Railway auto-deploys reverted code
```

---

## Scaling Considerations

### When to Upgrade from Free Tier

**Qdrant** (upgrade from 1GB free):
- When >1M document chunks
- When >100 requests/minute
- Cost: $25/month for 2GB

**Neon** (upgrade from 0.5GB/100hrs free):
- When >100 compute hours/month
- When >0.5GB storage
- Cost: $19/month for always-on compute

**Railway** (upgrade from 500hrs free):
- When >500 hours/month
- Cost: $5/month base + usage

**OpenAI**:
- Pay-as-you-go pricing
- Set billing alerts in dashboard

### Horizontal Scaling

Railway auto-scales. To enable:
1. Dashboard → Settings
2. Enable "Autoscaling"
3. Set min/max replicas

---

## Troubleshooting Production Issues

### Issue: Health check returns "degraded"

**Solution**:
1. Check Railway logs for connection errors
2. Verify environment variables set correctly
3. Test each service individually:
   - Qdrant: Check dashboard (cluster running?)
   - Neon: Check dashboard (compute not paused?)
   - OpenAI: Verify API key valid

### Issue: 503 Service Unavailable

**Solution**:
1. Check Qdrant cluster status (may be paused)
2. Check Neon compute (enable auto-resume)
3. Verify OpenAI API quota not exceeded

### Issue: CORS errors in browser

**Solution**:
1. Verify `CORS_ORIGINS` in Railway env vars includes exact Vercel URL
2. Include protocol: `https://your-book.vercel.app` (not `http`)
3. Restart Railway service after changing env vars

### Issue: Rate limit errors (429)

**Solution**:
1. Increase `RATE_LIMIT_PER_HOUR` in Railway env vars
2. Or implement IP whitelisting for production use

---

## Security Best Practices

### Production Checklist

- [ ] API_KEY set (enable authentication)
- [ ] CORS_ORIGINS restricted to production domain only
- [ ] Rate limiting enabled (100 req/hr or appropriate limit)
- [ ] Secrets not committed to Git (.env in .gitignore)
- [ ] Database connection uses SSL (sslmode=require)
- [ ] Regular security audits (monthly)

### Rotate API Keys

```bash
# OpenAI
# 1. Generate new key in OpenAI dashboard
# 2. Update in Railway env vars
# 3. Delete old key

# Qdrant
# 1. Generate new API key in Qdrant dashboard
# 2. Update in Railway env vars
# 3. Revoke old key

# Custom API_KEY
# 1. Generate new random key: openssl rand -hex 32
# 2. Update in Railway and frontend Vercel env vars
```

---

## Support and Maintenance

### Regular Tasks

**Weekly**:
- Check Railway logs for errors
- Monitor free tier usage (Qdrant, Neon, OpenAI)
- Review query logs for quality issues

**Monthly**:
- Rotate API keys
- Update dependencies: `pip list --outdated`
- Run backup snapshot
- Review costs

### Getting Help

- Railway Support: [railway.app/help](https://railway.app/help)
- Qdrant Docs: [qdrant.tech/documentation](https://qdrant.tech/documentation/)
- Neon Docs: [neon.tech/docs](https://neon.tech/docs/)
- OpenAI Support: [help.openai.com](https://help.openai.com/)
