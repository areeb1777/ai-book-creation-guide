import React, { useEffect, useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Hugging Face Spaces backend URL
const API_URL = 'https://areeb1777-ai-book-rag-backend.hf.space';

export default function ChatbotWidget() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => uuidv4());
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));

      const response = await fetch(`${API_URL}/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: input,
          conversation_history: history,
          session_id: sessionId,
          top_k: 5
        })
      });

      if (!response.ok) throw new Error('API request failed');

      const data = await response.json();
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.answer,
        sources: data.sources
      }]);
    } catch (error) {
      console.error('Query failed:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ Sorry, I encountered an error. Please try again.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
                  <div style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    width: '380px',
                    height: '500px',
                    maxHeight: 'calc(100vh - 40px)',
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                    display: 'flex',
                    flexDirection: 'column',
                    zIndex: 9999,
                  }}>          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '16px',
            fontWeight: '600',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: '12px 12px 0 0'
          }}>
            <span>💬 Ask About This Book</span>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                color: 'white',
                fontSize: '20px',
                cursor: 'pointer',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
              }}
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            background: '#f8f9fa',
          }}>
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', padding: '24px', color: '#666' }}>
                <h3 style={{ margin: '0 0 8px 0' }}>👋 Ask me anything about this book!</h3>
                <p style={{ margin: 0, fontSize: '14px' }}>I can help you find information quickly.</p>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div key={idx} style={{
                marginBottom: '16px',
                textAlign: msg.role === 'user' ? 'right' : 'left'
              }}>
                <div style={{
                  display: 'inline-block',
                  background: msg.role === 'user' ? '#667eea' : 'white',
                  color: msg.role === 'user' ? 'white' : '#333',
                  padding: '10px 14px',
                  borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  maxWidth: '80%',
                  wordWrap: 'break-word',
                  textAlign: 'left',
                  boxShadow: msg.role === 'assistant' ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none'
                }}>
                  {msg.content}

                  {msg.sources && msg.sources.length > 0 && (
                    <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                      <strong>Sources:</strong>
                      {msg.sources.map((src, i) => (
                        <a
                          key={i}
                          href={src.url}
                          style={{
                            display: 'block',
                            color: '#667eea',
                            marginTop: '4px',
                            padding: '4px 8px',
                            background: '#f0f0f0',
                            borderRadius: '4px',
                            textDecoration: 'none'
                          }}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          📖 {src.chapter}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ textAlign: 'center', padding: '12px', color: '#666', fontStyle: 'italic' }}>
                Thinking...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '12px',
            background: 'white',
            borderTop: '1px solid #e0e0e0',
            display: 'flex',
            gap: '8px',
            borderRadius: '0 0 12px 12px'
          }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Ask me anything..."
              disabled={loading}
              style={{
                flex: 1,
                border: '1px solid #d0d0d0',
                borderRadius: '20px',
                padding: '10px 16px',
                fontSize: '14px',
                outline: 'none'
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{
                background: loading || !input.trim() ? '#ccc' : '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                fontSize: '18px'
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      {!isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 9999,
        }}>
          <button
            onClick={() => setIsOpen(true)}
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              color: 'white',
              fontSize: '24px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            }}
            aria-label="Open chatbot"
          >
            💬
          </button>
        </div>
      )}
    </>
  );
}
