# OpenRouter Setup Guide

OpenRouter provides access to multiple AI models including free options!

## Step 1: Get Your OpenRouter API Key

1. Go to https://openrouter.ai/
2. Sign up for a free account
3. Go to https://openrouter.ai/keys
4. Click "Create Key"
5. Copy your API key (starts with `sk-or-...`)

## Step 2: Update Your .env File

Open `rag-backend/.env` and update these lines:

```bash
# OpenAI API Configuration (Using OpenRouter)
OPENAI_API_KEY=sk-or-v1-YOUR_OPENROUTER_KEY_HERE
OPENAI_BASE_URL=https://openrouter.ai/api/v1
OPENAI_EMBEDDING_MODEL=openai/text-embedding-3-small
OPENAI_CHAT_MODEL=meta-llama/llama-3.1-8b-instruct:free
```

## Available Free Models on OpenRouter:

### For Chat (OPENAI_CHAT_MODEL):
- `meta-llama/llama-3.1-8b-instruct:free` (Recommended - Fast & Good)
- `google/gemma-2-9b-it:free` (Alternative)
- `microsoft/phi-3-mini-128k-instruct:free` (Lightweight)

### For Embeddings (OPENAI_EMBEDDING_MODEL):
- `openai/text-embedding-3-small` (Small cost, best quality)
- Note: OpenRouter doesn't have free embedding models, but they're very cheap (~$0.0001 per query)

## Step 3: Add Credit (Optional but Recommended)

For embeddings, you'll need minimal credit:
- Go to https://openrouter.ai/credits
- Add $5 (will last for 50,000+ queries)
- Embeddings cost: $0.00002 per 1K tokens

## Step 4: Restart the Backend

```bash
# Kill the current backend (Ctrl+C in the terminal)
# Then restart:
cd rag-backend
./venv/Scripts/uvicorn app.main:app --reload --port 8000
```

## Cost Comparison:

### With Free Model (Llama 3.1):
- Chat: **FREE** ✅
- Embeddings: ~$0.0001 per query
- **Total: ~$0.01 for 100 queries**

### OpenAI Direct:
- Chat: $0.002 per query
- Embeddings: $0.0001 per query
- **Total: ~$0.21 for 100 queries**

## Testing:

1. Make sure your backend is running
2. Open http://localhost:3000
3. Click the chatbot button 💬
4. Ask: "What is this book about?"
5. You should get a response using the free Llama model!
