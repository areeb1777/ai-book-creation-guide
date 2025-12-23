# 📚 AI-Powered Book Website - Docusaurus Frontend

A modern, responsive Docusaurus-based documentation site with integrated AI chatbot for interactive book content exploration.

## 🌟 **Features**

### 🎨 **Modern UI/UX**
- Fully custom Docusaurus theme with premium design
- Responsive layout optimized for all devices
- Dark/light mode support
- Smooth animations and transitions
- Professional typography and spacing

### 🤖 **AI Integration**
- Integrated RAG chatbot for content Q&A
- Real-time responses with source citations
- Context-aware question answering
- Interactive chat interface
- Source document references

### 📖 **Content Management**
- Chapter-based navigation
- Search functionality
- Table of contents
- Last updated timestamps
- Edit links for contributions

### 📱 **Mobile-First Design**
- Optimized for mobile devices
- Touch-friendly navigation
- Responsive chat interface
- Fast loading times
- Progressive web app ready

## 🛠️ **Tech Stack**

- **Framework**: Docusaurus v3
- **Runtime**: React
- **Styling**: CSS Modules, Custom CSS
- **Build Tool**: Webpack
- **Deployment**: Vercel, GitHub Pages

## 📁 **Project Structure**

```
ai-powered-book/
├── docs/                    # Book content markdown files
│   ├── intro.md            # Introduction
│   ├── chapter-1-spec-kit.md # Spec-Kit Plus fundamentals
│   ├── chapter-2-claude-code.md # Claude Code integration
│   ├── chapter-3-docusaurus.md # Docusaurus setup
│   ├── chapter-4-github-pages.md # GitHub Pages deployment
│   └── chapter-5-best-practices.md # Best practices
├── src/                     # Custom React components
│   ├── components/         # Reusable React components
│   │   └── ChatbotWidget.js # AI chatbot widget
│   ├── css/               # Custom CSS files
│   │   └── custom.css     # Global styles
│   └── theme/             # Docusaurus theme customization
│       └── Navbar/        # Custom navbar components
├── static/                  # Static assets
│   ├── img/               # Images and icons
│   └── book-icon.svg      # Logo
├── docusaurus.config.js     # Docusaurus configuration
├── sidebars.js              # Navigation sidebar configuration
├── package.json             # Dependencies and scripts
└── README.md                # This file
```

## 🚀 **Getting Started**

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Navigate to the frontend directory
cd ai-powered-book

# Install dependencies
npm install

# Start development server
npm start
```

The website will be available at `http://localhost:3000`

## 🔧 **Configuration**

### Environment Variables
- `REACT_APP_API_URL` - Backend API URL for chatbot integration

### Docusaurus Configuration
- `docusaurus.config.js` - Site metadata, navigation, plugins
- `sidebars.js` - Documentation sidebar structure
- `static/` - Static assets (images, files)

## 🎨 **Custom Components**

### Chatbot Widget
- Interactive AI-powered Q&A interface
- Real-time responses with source citations
- Persistent chat history
- Mobile-responsive design
- Loading states and error handling

### Custom Navbar
- Responsive navigation
- Chapter dropdown menu
- GitHub link
- Mobile hamburger menu
- Logo and branding

## 📊 **API Integration**

### Backend Connection
- FastAPI backend integration
- Real-time chat functionality
- Source document citations
- Error handling and retries

### Endpoints Used
- `/query` - AI question answering
- `/health` - Backend health check
- `/docs` - API documentation

## 🌐 **Deployment**

### Vercel (Recommended)
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `build`
4. Environment: Node.js 18+

### GitHub Pages
1. Configure in `docusaurus.config.js`
2. Set `organizationName` and `projectName`
3. Run `npm run deploy`

## 🧪 **Development Scripts**

- `npm start` - Start development server
- `npm build` - Build for production
- `npm serve` - Serve production build locally
- `npm deploy` - Deploy to GitHub Pages

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 **Live Demo**

**Frontend**: [https://ai-book-creation-guide.vercel.app](https://ai-book-creation-guide.vercel.app)

---

Made with ❤️ using Docusaurus, React, and AI