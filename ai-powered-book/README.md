# AI-Powered Book Website

This directory contains the source code for the Docusaurus frontend of the "AI-Powered Book Creation Guide". This website is designed to provide a premium, modern, and engaging reading experience for the book's content.

## Key Features

-   **Fully Custom UI:** The entire website has been redesigned with a unique, handcrafted UI that goes far beyond the default Docusaurus theme. This includes a custom hero section, navigation, feature cards, chapter layouts, and footer.
-   **Thematic Design:** The design is thematically aligned with the book's subject matter, using a dark, tech-inspired aesthetic to reflect the concepts of AI, code, and spec-driven development.
-   **Integrated RAG Chatbot:** An integrated chatbot allows readers to ask questions about the book's content in natural language and receive intelligent, context-aware answers.
-   **Optimized Reading Experience:** Chapter pages are designed for long-form reading, with a focus on clean typography, comfortable line spacing, and a focused layout.
-   **Responsive Design:** The entire website is fully responsive and optimized for a seamless experience across desktops, tablets, and mobile devices.

## Running Locally

To run the website on your local machine, follow these steps:

1.  **Ensure you are in the correct directory:**
    ```bash
    cd ai-powered-book
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the development server:**
    ```bash
    npm start
    ```
    The website will be available at `http://localhost:3000`.

**Note:** For the chatbot to function, the backend server must also be running. Please refer to the main project `README.md` for instructions on how to set up and run the backend.

## Configuration for Deployment

When deploying the website to a live environment (like Vercel), you must configure an environment variable to point to your deployed backend API.

-   **Environment Variable:** `REACT_APP_API_URL`
-   **Value:** The public URL of your deployed `rag-backend` service (e.g., `https://my-backend-1234.up.railway.app`).

This ensures that the chatbot in the deployed frontend can communicate with the live backend.
