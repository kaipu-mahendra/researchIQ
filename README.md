# ResearchIQ - AI Research and Document Q&A Agent

Upload documents (PDF, DOCX, CSV, TXT), ask questions, get cited answers.

## Quick Start

### Step 1 - Backend (Terminal 1)

    cd backend
    python -m venv venv
    venv/Scripts/activate      # Windows
    source venv/bin/activate   # Mac/Linux
    pip install -r requirements.txt
    cp .env.example .env
    # Edit .env: set ANTHROPIC_API_KEY=your_key_here
    python -m uvicorn main:app --reload

### Step 2 - Frontend (Terminal 2)

    cd frontend
    npm install
    npm run dev

### Step 3 - Open browser

Go to: http://localhost:5173
API docs at: http://localhost:8000/docs

## Get Anthropic API Key
1. Go to https://console.anthropic.com
2. Sign up and create an API key
3. Add it to backend/.env file

## Architecture
- Backend: FastAPI + Python
- LLM: Anthropic Claude (claude-sonnet-4)
- Embeddings: Sentence Transformers (all-MiniLM-L6-v2)
- Vector Search: FAISS
- File Parsing: pypdf, python-docx, pandas
- Frontend: React + Vite

## API Endpoints
- POST /api/upload     - Upload and index a document
- GET  /api/documents  - List indexed documents
- DELETE /api/documents/{filename} - Remove document
- POST /api/chat       - Ask a question
- GET  /api/health     - Health check
