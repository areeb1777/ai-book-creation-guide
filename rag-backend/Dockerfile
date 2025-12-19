# RAG Chatbot Backend - Production Dockerfile

FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first (for caching)
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY app ./app
COPY ingestion ./ingestion
COPY scripts ./scripts

# Create non-root user
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

# Expose port (Railway sets PORT env var)
EXPOSE 8000
ENV PORT=8000

# Health check (will use PORT env var if set)
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD python -c "import requests, os; port = os.getenv('PORT', '8000'); requests.get(f'http://localhost:{port}/api/health')"

# Run application (PORT env var set by Railway)
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT}
