/**
 * Chat Window Component
 *
 * Main chat interface with message list and input form.
 */

import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import styles from './styles.module.css';
import MessageList from './MessageList';
import { queryFullBook, querySelectedText } from './api';

export default function ChatWindow({ onClose, selectedText }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessionId] = useState(() => uuidv4());
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle send message
  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      role: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      // Build conversation history
      const history = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Call appropriate API
      let response;
      if (selectedText) {
        response = await querySelectedText(input, selectedText, sessionId);
      } else {
        response = await queryFullBook(input, history, sessionId);
      }

      // Add assistant message
      const assistantMessage = {
        role: 'assistant',
        content: response.answer,
        sources: response.sources
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (err) {
      console.error('Query failed:', err);
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={styles.chatWindow}>
      {/* Header */}
      <div className={styles.chatHeader}>
        <span>💬 Ask About This Book</span>
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close chat"
        >
          ×
        </button>
      </div>

      {/* Messages */}
      <div className={styles.messageList}>
        <MessageList messages={messages} />
        {loading && (
          <div className={styles.loading}>
            Thinking...
          </div>
        )}
        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className={styles.inputContainer}>
        <input
          type="text"
          className={styles.input}
          placeholder={selectedText ? "Ask about this selection..." : "Ask me anything..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
          aria-label="Message input"
        />
        <button
          className={styles.sendButton}
          onClick={handleSend}
          disabled={loading || !input.trim()}
          aria-label="Send message"
        >
          ➤
        </button>
      </div>
    </div>
  );
}