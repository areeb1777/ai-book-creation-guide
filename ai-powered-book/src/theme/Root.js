/**
 * Docusaurus Root Component (Swizzled)
 */

import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

export default function Root({ children }) {
  return (
    <>
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
