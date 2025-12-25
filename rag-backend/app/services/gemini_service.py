"""
Google Gemini Service

Provides embeddings and chat using Google's Gemini API (100% FREE).
"""

import time
from typing import List, Dict, Any, Optional
import google.generativeai as genai
from app.core.config import settings
from app.core.logging import get_logger
from app.api.models.request import ConversationTurn

logger = get_logger(__name__)


class GeminiEmbeddingsService:
    """Generate embeddings using Gemini API (FREE)"""

    def __init__(self, api_key: str):
        genai.configure(api_key=api_key)
        self.model = "models/text-embedding-004"

    def generate_embedding(self, text: str) -> List[float]:
        """Generate embedding for single text"""
        result = genai.embed_content(
            model=self.model,
            content=text,
            task_type="retrieval_query"
        )
        return result['embedding']

    def generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for multiple texts"""
        embeddings = []
        for i, text in enumerate(texts):
            if i > 0 and i % 10 == 0:
                logger.info(f"Processing batch {i}/{len(texts)}")
                time.sleep(0.1)  # Rate limiting

            embedding = self.generate_embedding(text)
            embeddings.append(embedding)

        return embeddings


class GeminiChatService:
    """Generate chat responses using Gemini API (FREE)"""

    def __init__(self, api_key: str):
        genai.configure(api_key=api_key)
        # Use the latest flash model
        self.model = genai.GenerativeModel('models/gemini-2.5-flash')

        self.system_prompt = """You are a helpful assistant answering questions about a book.

CRITICAL INSTRUCTIONS:
1. Answer ONLY based on the provided context excerpts below.
2. If the context doesn't contain enough information to answer the question, respond: "I couldn't find information about that in this book."
3. Always cite the source (chapter and section) in your answer when referencing specific information.
4. Be concise but complete.
5. Do NOT use any external knowledge or make assumptions beyond what's in the context.

Format your citations like: "According to Chapter X, Section Y, ..."
"""

        self.general_chat_prompt = """You are a friendly book chatbot assistant created by Areeb Malik.

PERSONALITY:
- You are warm, helpful, and enthusiastic about books
- You can handle greetings and general conversation naturally
- You guide users to ask about the book when they go off-topic

YOUR ROLE:
1. For greetings (hello, hi, hey, etc.): Respond warmly and invite them to ask about the book
2. For questions about who created you: "I was created by Areeb Malik!"
3. For questions about what you do: Explain you help answer questions about this specific book
4. For off-topic questions: Politely redirect them to ask about the book
5. Be conversational and friendly, not robotic

EXAMPLES:
User: "Hello"
Assistant: "Hello! 👋 I'm your book assistant, and I'm here to help you explore this book. Feel free to ask me anything about its content, chapters, or topics covered!"

User: "Who made you?"
Assistant: "I was created by Areeb Malik! I'm here to help you learn about this book. What would you like to know?"

User: "What's the weather?"
Assistant: "I'm a book assistant, so I focus on answering questions about this specific book. Is there anything from the book you'd like to learn about?"
"""

    def is_general_query(self, query: str) -> bool:
        """
        Detect if query is general conversation vs book-specific

        Args:
            query: User's question

        Returns:
            True if general conversation, False if potentially book-related
        """
        query_lower = query.lower().strip()

        # Greetings
        greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings']
        if any(greeting in query_lower for greeting in greetings) and len(query_lower.split()) <= 3:
            return True

        # Creator questions
        creator_keywords = ['who made you', 'who created you', 'who built you', 'who developed you',
                          'your creator', 'your maker', 'who are you', 'what are you']
        if any(keyword in query_lower for keyword in creator_keywords):
            return True

        # Common off-topic questions (short queries that are clearly not about books)
        if len(query_lower.split()) <= 5:
            off_topic = ['weather', 'time', 'date', 'how are you', 'whats up', "what's up"]
            if any(topic in query_lower for topic in off_topic):
                return True

        return False

    def generate_general_response(self, query: str) -> str:
        """
        Generate response for general/casual queries

        Args:
            query: User's general question

        Returns:
            Friendly conversational response
        """
        prompt = f"""{self.general_chat_prompt}

USER: {query}

ASSISTANT:"""

        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            logger.error(f"Gemini generation failed: {e}")
            # Fallback responses
            query_lower = query.lower()
            if 'hello' in query_lower or 'hi' in query_lower or 'hey' in query_lower:
                return "Hello! 👋 I'm your book assistant. I'm here to help you explore this book. What would you like to know?"
            elif 'who made' in query_lower or 'who created' in query_lower:
                return "I was created by Areeb Malik! I'm designed to help answer questions about this book. What would you like to know about it?"
            else:
                return "I'm a book assistant focused on helping you understand this book. Please ask me anything about its content!"

    def generate_answer(
        self,
        query: str,
        context_chunks: List[Dict[str, Any]],
        conversation_history: Optional[List[ConversationTurn]] = None
    ) -> str:
        """
        Generate answer from query and retrieved chunks

        Args:
            query: User's question
            context_chunks: Retrieved chunks with metadata
            conversation_history: Previous conversation turns

        Returns:
            Generated answer text
        """
        # Build context from chunks
        context_parts = []
        for i, chunk in enumerate(context_chunks, 1):
            metadata = chunk.get('metadata', {})
            chapter = metadata.get('chapter', 'Unknown')
            section = metadata.get('section', '')
            text = chunk.get('text', '')

            context_parts.append(
                f"[Source {i}] Chapter: {chapter}"
                + (f", Section: {section}" if section else "")
                + f"\n{text}\n"
            )

        context_text = "\n---\n".join(context_parts)

        # Build conversation history
        history_text = ""
        if conversation_history:
            for turn in conversation_history[-3:]:  # Last 3 turns
                history_text += f"{turn.role.upper()}: {turn.content}\n"

        # Compose prompt
        prompt = f"""{self.system_prompt}

CONTEXT FROM BOOK:
{context_text}

{history_text}
USER: {query}

ASSISTANT:"""

        # Generate response
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            logger.error(f"Gemini generation failed: {e}")
            raise
