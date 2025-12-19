---
title: Building Your Book with Docusaurus (Project Setup and Structure)
---

# Building Your Book with Docusaurus (Project Setup and Structure)

## Why Docusaurus for Your AI-Assisted Book?

Docusaurus is an excellent choice for publishing AI-assisted books, particularly those created using Spec-Kit Plus and Claude Code workflows. Its strengths align perfectly with the needs of modern, AI-enhanced content creation.

### Markdown-First Approach

Docusaurus is built around Markdown, which makes it ideal for AI-assisted content creation. AI tools like Claude Code naturally generate Markdown-formatted content, making the integration seamless. You can easily take AI-generated content and place it directly into Docusaurus without complex conversion processes.

### Powerful Documentation Features

Docusaurus provides features specifically designed for long-form content and documentation:
- Built-in search functionality that works across all your content
- Automatic sidebar generation and navigation
- Versioning support for content updates
- Plugin architecture for extending functionality
- Responsive design that works on all devices

### Customization Capabilities

While Docusaurus provides excellent defaults, it's highly customizable:
- Theme customization for unique branding
- Layout flexibility for different content types
- Component extensibility for special features
- Plugin ecosystem for additional functionality

### Performance and Hosting

Docusaurus sites are optimized for performance out of the box:
- Static site generation for fast loading
- Code splitting for efficient loading
- Modern JavaScript and CSS optimization
- Easy integration with hosting platforms like GitHub Pages

### Community and Support

Docusaurus has a large, active community and comprehensive documentation, making it easier to solve problems and find solutions when building your AI-assisted book.

## Docusaurus Installation and Initial Setup

Setting up Docusaurus for your AI-assisted book is straightforward. The process creates a complete, functional documentation site that you can customize for your specific needs.

### Prerequisites

Before installing Docusaurus, ensure you have:

- **Node.js**: Version 18.0 or higher
- **npm** or **yarn**: Package managers that come with Node.js
- **Git**: For version control (recommended)

### Installation Process

The easiest way to create a new Docusaurus project is using the official scaffolding tool:

```bash
npx create-docusaurus@latest my-ai-book classic
```

This command will:
1. Create a new directory called `my-ai-book`
2. Install all necessary dependencies
3. Set up the basic project structure
4. Include sample content to help you get started

### Project Structure Overview

After installation, your Docusaurus project will have this structure:

```
my-ai-book/
├── blog/                 # Blog posts (optional)
├── docs/                 # Documentation files (your book chapters go here)
├── src/
│   ├── components/       # Custom React components
│   ├── css/              # Global styles
│   └── pages/            # Standalone pages
├── static/               # Static assets (images, files)
├── docusaurus.config.js  # Main configuration file
├── package.json          # Project metadata and dependencies
├── sidebars.js           # Sidebar navigation configuration
└── README.md            # Project overview
```

### Running Your Development Server

To start the development server and see your site locally:

```bash
cd my-ai-book
npm start
```

This will launch a local server (usually at http://localhost:3000) with hot reloading, so you can see changes immediately as you edit your content.

### Basic Configuration

The `docusaurus.config.js` file contains your site's main configuration. Key settings include:

- `title`: The name of your book/site
- `tagline`: A brief description
- `url`: Your production URL
- `baseUrl`: The base URL for your site
- `organizationName`: GitHub username or organization
- `projectName`: GitHub repository name (for GitHub Pages)

## Organizing Your Chapters: The `docs` Folder Structure

The `docs` folder is where your book's content lives. Proper organization is crucial for both navigation and maintainability, especially as your AI-assisted book grows.

### Basic Organization Principles

**Chronological Structure**: For most books, organizing chapters chronologically (Chapter 1, Chapter 2, etc.) works well. Name your files to reflect this order:

```
docs/
├── intro.md
├── chapter-1-getting-started.md
├── chapter-2-core-concepts.md
├── chapter-3-advanced-topics.md
└── chapter-4-conclusion.md
```

**Thematic Grouping**: For complex books, you might organize content in subdirectories by theme:

```
docs/
├── basics/
│   ├── introduction.md
│   ├── setup.md
│   └── first-steps.md
├── advanced/
│   ├── deep-dive.md
│   └── best-practices.md
└── reference/
    ├── api.md
    └── faq.md
```

### File Naming Conventions

Use consistent, descriptive names for your documentation files:

- Use lowercase letters
- Separate words with hyphens (not underscores)
- Include the chapter number or topic in the name
- Use `.md` or `.mdx` extensions

### Front Matter Requirements

Each documentation file should include front matter at the top:

```markdown
---
title: Your Chapter Title
description: Brief description of the chapter content
hide_table_of_contents: false  # Set to true to hide TOC for this page
---

# Your Chapter Title

Content starts here...
```

### Managing Large Books

For extensive books, consider these strategies:

**Modular Content**: Break large chapters into smaller, focused documents that can be linked together.

**Cross-References**: Use Docusaurus' linking capabilities to connect related content:

```markdown
[Link text](./relative-path-to-file.md)
[Link to specific heading](./file.md#specific-heading)
```

**Consistent Headers**: Use a consistent heading hierarchy (H1 for chapter titles, H2 for sections, H3 for subsections, etc.).

## Configuring Sidebars and Navigation (`sidebar.js`)

The `sidebar.js` file controls the navigation structure of your Docusaurus site. For AI-assisted books, this is where you organize your chapters and sections for easy navigation.

### Basic Sidebar Structure

The sidebar configuration is a JavaScript object that defines navigation items:

```javascript
// sidebars.js
module.exports = {
  tutorialSidebar: [
    'intro',
    'chapter-1',
    'chapter-2',
    {
      type: 'category',
      label: 'Advanced Topics',
      items: ['advanced-topic-1', 'advanced-topic-2'],
    },
  ],
};
```

### Navigation Item Types

**Doc Links**: Reference individual documentation files:

```javascript
'intro',                    // Links to docs/intro.md
'chapter-1-getting-started' // Links to docs/chapter-1-getting-started.md
```

**Categories**: Group related items under collapsible sections:

```javascript
{
  type: 'category',
  label: 'Tutorials',
  items: ['tutorial-1', 'tutorial-2', 'tutorial-3'],
}
```

**Links**: Add external links to your navigation:

```javascript
{
  type: 'link',
  label: 'GitHub Repository',
  href: 'https://github.com/your-username/your-repo',
}
```

### Advanced Sidebar Configurations

**Auto-Generated Sidebars**: Docusaurus can automatically generate sidebars from your file structure:

```javascript
{
  type: 'autogenerated',
  dirName: '.', // Generates from docs folder structure
}
```

**Customizable Categories**: Add more properties to categories for better UX:

```javascript
{
  type: 'category',
  label: 'Getting Started',
  items: ['introduction', 'installation', 'quickstart'],
  collapsed: false,  // Start expanded
  link: {
    type: 'generated-index',  // Create an index page for the category
    title: 'Getting Started',
    description: 'Learn the basics of our tool',
  },
}
```

### Best Practices for Book Navigation

**Logical Progression**: Arrange chapters in a logical reading order.

**Progressive Disclosure**: Use categories to group related chapters without overwhelming readers.

**Consistent Structure**: Maintain the same navigation structure across all pages.

**Clear Labels**: Use clear, descriptive labels that match your content titles.

## Creating Custom Pages and Components

While the `docs` folder handles your book's content, Docusaurus allows you to create custom pages and components for additional functionality or unique layouts.

### Creating Custom Pages

Custom pages go in the `src/pages` directory and are automatically converted to routes. For example, to create an about page:

```jsx
// src/pages/about.js
import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import styles from './about.module.css';

export default function About() {
  return (
    <Layout title="About" description="About our AI-assisted book">
      <main className={clsx('container', styles.main)}>
        <h1>About This Book</h1>
        <p>This book was created using AI-assisted techniques...</p>
      </main>
    </Layout>
  );
}
```

### Custom Components

Create reusable components in `src/components`:

```jsx
// src/components/BookHighlight.js
import React from 'react';

export default function BookHighlight({ children, type = 'info' }) {
  const className = `alert alert--${type}`;
  return <div className={className}>{children}</div>;
}
```

Then use it in your Markdown files:

```jsx
import BookHighlight from '@site/src/components/BookHighlight';

<BookHighlight type="success">
  This is an important tip for AI-assisted writing!
</BookHighlight>
```

### Advanced Customization

**Theme Components**: Override Docusaurus theme components by creating files in `src/theme`:

```jsx
// src/theme/Footer.js - Custom footer component
```

**MDX Components**: Create components specifically for use in Markdown files:

```jsx
// src/theme/MDXComponents.js
import React from 'react';
import CodeBlock from '@theme/CodeBlock';

export default {
  CodeBlock: (props) => <CodeBlock {...props} />,
  // Add your custom components here
};
```

## Ensuring Markdown Compatibility and Styling

AI-generated content needs to be compatible with Docusaurus' Markdown rendering. Understanding Docusaurus' Markdown capabilities helps ensure your AI-generated content displays correctly.

### Docusaurus Markdown Features

**Admonitions**: Special blocks for notes, warnings, and tips:

```markdown
:::note
This is a helpful note.
:::

:::caution
This is a warning about potential issues.
:::

:::danger
This indicates a critical problem.
:::
```

**Code Blocks**: Enhanced syntax highlighting with additional features:

```jsx title="src/components/Example.js" {1,4-6}
import React from 'react';

function Welcome() {
  return <h1>Hello, World!</h1>;
}
```

**Math Equations**: Using KaTeX for mathematical expressions (if enabled):

```markdown
Inline math: $E = mc^2$

Block math:
$$
\int_0^\infty e^{-x^2} dx = \frac{\sqrt{\pi}}{2}
$$
```

### Styling Considerations

**CSS Modules**: Use CSS modules for component-specific styling:

```css
/* myComponent.module.css */
.container {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}
```

**Global Styles**: Add global styles in `src/css/custom.css`:

```css
/* Custom styles that apply site-wide */
.book-highlight {
  background-color: #f0f8ff;
  padding: 1rem;
  border-left: 4px solid #007acc;
}
```

### Responsive Design

Docusaurus is mobile-responsive by default, but you can add responsive features to your content:

```markdown
<div className="row">
<div className="col col--6">

Content for left column

</div>
<div className="col col--6">

Content for right column

</div>
</div>
```

### Accessibility

Ensure your AI-generated content is accessible:

- Use proper heading hierarchy (H1, H2, H3, etc.)
- Add alt text to images: `![Description](image.png)`
- Use semantic HTML elements when needed
- Maintain sufficient color contrast

## Key Takeaways

- Docusaurus is ideal for AI-assisted books due to its Markdown-first approach and powerful features
- Installation is straightforward using the `create-docusaurus` command
- Organize your book content in the `docs` folder with clear, consistent naming
- Configure navigation in `sidebars.js` to create logical reading paths
- Use custom pages and components for additional functionality beyond standard documentation
- Leverage Docusaurus' extended Markdown features for enhanced content presentation
- Ensure accessibility and responsive design for the best reader experience

---

### Checklist: Building Your Book with Docusaurus
- [ ] Verified Node.js and npm are properly installed
- [ ] Created Docusaurus project using the classic template
- [ ] Organized book chapters in the docs folder with consistent naming
- [ ] Configured sidebar navigation to reflect book structure
- [ ] Added appropriate front matter to all chapter files
- [ ] Tested the development server to ensure proper functionality
- [ ] Implemented any necessary custom components for book-specific features