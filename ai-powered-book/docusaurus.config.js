// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'AI-Assisted Book Creation Guide',
  tagline: 'Master the art of AI-enhanced content creation with Spec-Kit Plus and Claude Code',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://your-username.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'your-username', // Usually your GitHub org/user name.
  projectName: 'ai-powered-book', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/your-username/ai-powered-book/edit/main/',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/your-username/ai-powered-book/edit/main/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      colorMode: {
        defaultMode: 'light',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'AI Book Guide',
        logo: {
          alt: 'AI-Assisted Book Creation Logo',
          src: 'img/book-icon.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Chapters',
          },
          {
            to: '/docs/intro',
            label: 'Get Started',
            position: 'left',
          },
          {
            href: 'https://github.com/your-username/ai-powered-book',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Chapters',
            items: [
              {
                label: 'Introduction',
                to: '/docs/intro',
              },
              {
                label: 'Spec-Kit Plus Fundamentals',
                to: '/docs/chapter-1-spec-kit',
              },
              {
                label: 'Crafting Content with Claude Code',
                to: '/docs/chapter-2-claude-code',
              },
              {
                label: 'Building with Docusaurus',
                to: '/docs/chapter-3-docusaurus',
              },
              {
                label: 'GitHub Pages Deployment',
                to: '/docs/chapter-4-github-pages',
              },
              {
                label: 'Best Practices',
                to: '/docs/chapter-5-best-practices',
              },
            ],
          },
          {
            title: 'Resources',
            items: [
              {
                label: 'Spec-Kit Plus',
                href: 'https://github.com/panaversity/spec-kit-plus/',
              },
              {
                label: 'Claude Code',
                href: 'https://www.claude.com/product/claude-code',
              },
              {
                label: 'Docusaurus',
                href: 'https://docusaurus.io/docs',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/your-username/ai-powered-book',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} AI-Assisted Book Creation Guide. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['bash', 'json', 'yaml', 'docker', 'git'],
      },
      // Using local search instead of Algolia
      algolia: undefined, // Disable Algolia
    }),
};

export default config;
