/**
 * API Client for RAG Chatbot Backend
 *
 * Handles HTTP requests to the FastAPI backend.
 */

import { v4 as uuidv4 } from 'uuid';

// Configuration
const API_URL = process.env.REACT_APP_RAG_API_URL || 'http://localhost:8000';
const API_KEY = process.env.REACT_APP_RAG_API_KEY;

/**
 * Query the full book corpus
 */
export async function queryFullBook(
  query,
  conversationHistory = [],
  sessionId
) {
  const requestBody = {
    query,
    conversation_history: conversationHistory,
    session_id: sessionId || uuidv4(),
    top_k: 5
  };

  const headers = {
    'Content-Type': 'application/json'
  };

  if (API_KEY) {
    headers['X-API-Key'] = API_KEY;
  }

  const response = await fetch(`${API_URL}/api/query`, {
    method: 'POST',
    headers,
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `API request failed: ${response.status}`);
  }

  return response.json();
}

/**
 * Query using only selected text
 */
export async function querySelectedText(
  query,
  selectedText,
  sessionId
) {
  const requestBody = {
    query,
    selected_text: selectedText,
    session_id: sessionId || uuidv4()
  };

  const headers = {
    'Content-Type': 'application/json'
  };

  if (API_KEY) {
    headers['X-API-Key'] = API_KEY;
  }

  const response = await fetch(`${API_URL}/api/query/selected`, {
    method: 'POST',
    headers,
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `API request failed: ${response.status}`);
  }

  return response.json();
}

/**
 * Check API health
 */
export async function checkHealth() {
  const response = await fetch(`${API_URL}/api/health`);

  if (!response.ok) {
    throw new Error(`Health check failed: ${response.status}`);
  }

  return response.json();
}
