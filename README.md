# 🚀 AI-Powered Book Creation Guide - Complete RAG System

A comprehensive AI-powered book creation and Q&A system using Retrieval-Augmented Generation (RAG) with Google Gemini and vector databases. Features a Docusaurus frontend with integrated chatbot and FastAPI backend.

## 🌟 **Features**

### 📚 **AI-Powered Book Creation**
- Spec-driven development approach with structured content creation
- Claude Code integration for AI-assisted writing
- Docusaurus-based documentation generation
- GitHub Pages deployment for publishing

### 🤖 **Intelligent Q&A Backend**
- FastAPI-powered RAG chatbot backend
- Google Gemini integration for question answering
- Qdrant vector database for semantic search
- PostgreSQL metadata storage
- Real-time chat interface with source citations

### 🌐 **Modern Web Interface**
- Docusaurus-based documentation site
- Responsive design with mobile support
- Interactive chatbot widget
- GitHub Pages deployment
- Vercel deployment ready

## 🛠️ **Tech Stack**

### Backend
- **Framework**: FastAPI
- **AI Provider**: Google Gemini (via OpenAI-compatible endpoint)
- **Vector DB**: Qdrant Cloud
- **Metadata DB**: PostgreSQL (Neon)
- **Deployment**: Hugging Face Spaces (100% FREE)

### Frontend
- **Framework**: Docusaurus
- **Styling**: CSS Modules & Custom CSS
- **Deployment**: Vercel
- **Chat Interface**: React-based widget

## 📁 **Project Structure**

```
ai-book-creation-guide/
├── ai-powered-book/          # Docusaurus frontend
│   ├── docs/                 # Book content markdown files
│   ├── src/                  # Custom React components
│   │   ├── components/       # React components
│   │   ├── css/              # Custom CSS
│   │   └── theme/            # Docusaurus theme customization
│   ├── static/               # Static assets
│   ├── docusaurus.config.js  # Docusaurus configuration
│   ├── sidebars.js           # Navigation sidebar
│   └── package.json          # Frontend dependencies
├── rag-backend/              # FastAPI RAG backend
│   ├── app/                  # FastAPI application
│   │   ├── api/              # API routes
│   │   │   ├── routes/       # Route definitions
│   │   │   └── models/       # Request/response models
│   │   ├── core/             # Core utilities
│   │   ├── services/         # Business logic
│   │   └── utils/            # Utility functions
│   ├── scripts/              # Setup and ingestion scripts
│   │   └── run_ingestion.py  # Data ingestion script
│   ├── requirements.txt      # Python dependencies
│   ├── Dockerfile            # Container configuration
│   └── .env.example          # Environment variables template
└── README.md                 # This file
```

## 🚀 **Quick Start**

### Backend Setup
1. Clone the repository
2. Install Python dependencies: `pip install -r rag-backend/requirements.txt`
3. Set up environment variables (see `.env.example`)
4. Run the backend: `cd rag-backend && uvicorn app.main:app --reload`

### Frontend Setup
1. Navigate to frontend: `cd ai-powered-book`
2. Install dependencies: `npm install`
3. Start development server: `npm start`

## 🔧 **Environment Variables**

### Backend (.env)
```env
# Google Gemini API (OpenAI-compatible)
OPENAI_API_KEY=your_gemini_api_key
OPENAI_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai/
OPENAI_EMBEDDING_MODEL=text-embedding-004
OPENAI_CHAT_MODEL=gemini-2.5-flash

# Qdrant Vector Database
QDRANT_URL=your_qdrant_url
QDRANT_API_KEY=your_qdrant_api_key
QDRANT_COLLECTION_NAME=book_chunks

# PostgreSQL Metadata
DATABASE_URL=your_postgres_url

# API Configuration
API_KEY=your_api_key
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

## 📊 **API Endpoints**

### Backend API
- `GET /` - API status
- `GET /health` - Health check
- `POST /query` - Book Q&A endpoint
- `GET /docs` - Interactive API documentation

### Frontend Features
- Interactive chatbot widget
- Chapter navigation
- Responsive design
- Dark/light mode support

## 📚 **Book Content Structure**

The book is organized into chapters covering:
- Spec-Kit Plus fundamentals
- Claude Code integration
- Docusaurus setup
- GitHub Pages deployment
- Best practices

## 🌐 **Deployment**

### Backend
- **Hugging Face Spaces**: 100% FREE deployment
- **Environment variables**: Configure in Space settings
- **Auto-restart**: On environment variable changes

### Frontend
- **Vercel**: Free hosting with custom domain support
- **GitHub Pages**: Alternative deployment option
- **Auto-deploy**: From GitHub repository

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 **Live Demo**

**Frontend**: [https://ai-book-creation-guide.vercel.app](https://ai-book-creation-guide.vercel.app)

**Backend API**: [https://areeb1777-ai-book-rag-backend.hf.space](https://areeb1777-ai-book-rag-backend.hf.space)

---

Made with ❤️ using AI, FastAPI, Docusaurus, and Google Gemini