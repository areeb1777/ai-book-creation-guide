/**
 * Message List Component
 *
 * Displays conversation messages (user queries and bot answers with sources).
 */

import React from 'react';
import styles from './styles.module.css';

export default function MessageList({ messages }) {
  if (messages.length === 0) {
    return (
      <div className={styles.welcomeMessage}>
        <h3>👋 Ask me anything about this book!</h3>
        <p>I can help you find information quickly and provide references to specific sections.</p>
      </div>
    );
  }

  return (
    <div className={styles.messageList}>
      {messages.map((message, index) => (
        <div
          key={index}
          className={
            message.role === 'user' ? styles.userMessage : styles.assistantMessage
          }
        >
          <div
            className={
              message.role === 'user' ? styles.userBubble : styles.assistantBubble
            }
          >
            {message.content}

            {/* Show sources for assistant messages */}
            {message.role === 'assistant' && message.sources && message.sources.length > 0 && (
              <div className={styles.sources}>
                <strong>Sources:</strong>
                {message.sources.map((source, idx) => (
                  <a
                    key={idx}
                    href={source.url}
                    className={styles.sourceItem}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={source.excerpt}
                  >
                    📖 {source.chapter}
                    {source.section && ` - ${source.section}`}
                    {' '}({(source.similarity_score * 100).toFixed(0)}% match)
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
