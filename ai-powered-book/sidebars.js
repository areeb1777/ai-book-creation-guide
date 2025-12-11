// @ts-check

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.

 @type {import('@docusaurus/plugin-content-docs').SidebarsConfig}
 */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  tutorialSidebar: [
    'intro',
    'chapter-1-spec-kit',
    'chapter-2-claude-code',
    'chapter-3-docusaurus',
    'chapter-4-github-pages',
    'chapter-5-best-practices',
    {
      type: 'category',
      label: 'Tutorial',
      items: [
        'tutorial-basics/create-a-document',
        'tutorial-basics/create-a-page',
        'tutorial-basics/deploy-your-site',
      ],
    },
  ],

  // But you can create a sidebar manually
  /*
  tutorialSidebar: [
    'intro',
    'hello',
    {
      type: 'category',
      label: 'Tutorial',
      items: ['tutorial-basics/create-a-document'],
    },
  ],
   */
};

export default sidebars;
