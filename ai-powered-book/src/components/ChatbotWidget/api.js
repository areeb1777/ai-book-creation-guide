/**
 * API Client for RAG Chatbot Backend
 *
 * Handles HTTP requests to the FastAPI backend.
 */

import { v4 as uuidv4 } from 'uuid';

// Configuration
const API_URL = 'http://localhost:8000';  // Hardcoded for reliability
const API_KEY = process.env.REACT_APP_RAG_API_KEY;

console.log('API Configuration:', { API_URL, hasApiKey: !!API_KEY });

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

  console.log('Sending query:', requestBody);

  const response = await fetch(`${API_URL}/api/query`, {
    method: 'POST',
    headers,
    body: JSON.stringify(requestBody)
  });

  console.log('Response status:', response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('API Error Response:', errorText);

    try {
      const error = JSON.parse(errorText);
      throw new Error(error.detail?.message || error.message || `API request failed: ${response.status}`);
    } catch (parseError) {
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }
  }

  const data = await response.json();
  console.log('API Response:', data);
  return data;
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
