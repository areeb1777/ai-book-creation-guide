# AI-Powered Book Creation Guide

This repository contains the complete source code and documentation for the "AI-Powered Book Creation Guide," a project demonstrating how to build a full-stack application for writing and publishing a book with the assistance of AI.

## What's Inside? 

This project is a monorepo containing two main components:

1.  **`ai-powered-book/`**: A modern, fully custom Docusaurus website that serves as the frontend. It is designed to provide a premium reading experience and includes an integrated RAG (Retrieval-Augmented Generation) chatbot to answer questions about the book's content.
2.  **`rag-backend/`**: A FastAPI (Python) backend that powers the chatbot. It handles document ingestion, embedding generation (using OpenAI), vector storage (using Qdrant), and provides the API endpoints for the chatbot to query.

### Tech Stack

-   **Frontend:**
    -   React
    -   Docusaurus
    -   CSS Modules
-   **Backend:**
    -   Python
    -   FastAPI
    -   Uvicorn
    -   Qdrant (Vector Database)
    -   PostgreSQL (via Neon for metadata storage)
    -   OpenAI API (for embeddings and text generation)

## Getting Started

To run this project locally, you will need to set up both the frontend and backend services.

### 1. Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd rag-backend
    ```
2.  **Create and activate a virtual environment:**
    ```bash
    # For Windows
    python -m venv venv
    venv\Scripts\activate

    # For macOS/Linux
    python3 -m venv venv
    source venv/bin/activate
    ```
3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
4.  **Configure environment variables:**
    -   Copy the example environment file: `cp .env.example .env`
    -   Fill in the required API keys and URLs in the `.env` file (OpenAI, Qdrant, Neon). See `rag-backend/SETUP_GUIDE.md` for detailed instructions.
5.  **Run the backend server:**
    ```bash
    uvicorn app.main:app --reload --port 8000
    ```

### 2. Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd ai-powered-book
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the frontend development server:**
    ```bash
    npm start
    ```
    The website will be available at `http://localhost:3000`, and the chatbot will connect to your local backend server.

## Deployment

This project is designed to be deployed as two separate services:

-   **Frontend (`ai-powered-book`)**: Deployed on **Vercel**. Configure the "Root Directory" in Vercel to point to the `ai-powered-book` folder.
-   **Backend (`rag-backend`)**: Deployed on **Railway**. Configure the "Root Directory" in Railway to point to the `rag-backend` folder. Railway will use the provided `Dockerfile` to deploy the application.

Ensure that all necessary environment variables are set in the respective deployment platforms and that the frontend's `REACT_APP_API_URL` variable points to the public URL of your deployed backend.
