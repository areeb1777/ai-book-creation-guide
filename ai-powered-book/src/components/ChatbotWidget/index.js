/**
 * Chatbot Widget Component
 *
 * Main component that provides collapsible chatbot interface.
 * Embedded in all book pages via Docusaurus theme.
 */

import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';
import ChatWindow from './ChatWindow';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedText, setSelectedText] = useState(undefined);

  // Toggle chat window
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Close chat
  const closeChat = () => {
    setIsOpen(false);
    setSelectedText(undefined);
  };

  // Handle text selection (for "Ask about this" feature)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleSelection = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();

      if (text && text.length > 20) {
        setSelectedText(text);
      }
    };

    document.addEventListener('mouseup', handleSelection);
    return () => document.removeEventListener('mouseup', handleSelection);
  }, []);

  return (
    <div className={styles.chatbotContainer}>
      {/* Chat window (shown when open) */}
      {isOpen && <ChatWindow onClose={closeChat} selectedText={selectedText} />}

      {/* Toggle button (always visible) */}
      {!isOpen && (
        <button
          className={styles.toggleButton}
          onClick={toggleChat}
          aria-label="Open chatbot"
          title="Ask questions about this book"
        >
          💬
        </button>
      )}
    </div>
  );
}