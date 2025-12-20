/**
 * Docusaurus Root Component (Swizzled)
 */

import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

export default function Root({ children }) {
  return (
    <>
      <BrowserOnly fallback={<div />}>
        {() => (
          <div
            aria-hidden
            className="navbar navbar--placeholder"
            style={{ position: 'absolute', height: 0, width: 0, overflow: 'hidden' }}
          />
        )}
      </BrowserOnly>
      {children}
      <BrowserOnly fallback={<div />}>
        {() => {
          const ChatbotWidget = require('@site/src/components/ChatbotWidget').default;
          return <ChatbotWidget />;
        }}
      </BrowserOnly>
    </>
  );
}
