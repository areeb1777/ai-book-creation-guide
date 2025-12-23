"""
Hugging Face Spaces Entry Point for RAG Backend
This file is required for Hugging Face Spaces deployment
"""

from app.main import app

# Hugging Face Spaces looks for an 'app' object
# This is automatically picked up by the Spaces runtime
