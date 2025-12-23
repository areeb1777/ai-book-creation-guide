#!/bin/bash
# Startup script for Koyeb deployment

# Start the FastAPI application with uvicorn
exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
