import os
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from config import settings
from document_processor import process_file
from vector_store import vector_store
from agent import chat

app = FastAPI(title="ResearchIQ API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs(settings.upload_dir, exist_ok=True)

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage] = []
    question: str

@app.get("/")
def root():
    return {"status": "ok", "service": "ResearchIQ API"}

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    allowed = {".pdf", ".docx", ".doc", ".csv", ".txt"}
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in allowed:
        raise HTTPException(400, f"File type {ext} not supported. Use: pdf, docx, csv, txt")
    max_bytes = settings.max_file_size_mb * 1024 * 1024
    save_path = os.path.join(settings.upload_dir, file.filename)
    content = await file.read()
    if len(content) > max_bytes:
        raise HTTPException(400, f"File exceeds {settings.max_file_size_mb}MB limit")
    with open(save_path, "wb") as fh:
        fh.write(content)
    try:
        chunks = process_file(save_path, file.filename)
        vector_store.add_chunks(chunks)
        docs = vector_store.list_documents()
        return {"message": "Indexed successfully", "filename": file.filename,
                "chunks": len(chunks), "documents": docs}
    except Exception as e:
        if os.path.exists(save_path):
            os.remove(save_path)
        raise HTTPException(500, str(e))

@app.delete("/api/documents/{filename}")
def delete_document(filename: str):
    path = os.path.join(settings.upload_dir, filename)
    if os.path.exists(path):
        os.remove(path)
    vector_store.remove_document(filename)
    return {"message": f"Deleted {filename}", "documents": vector_store.list_documents()}

@app.get("/api/documents")
def list_documents():
    return vector_store.list_documents()

@app.post("/api/chat")
def chat_endpoint(req: ChatRequest):
    history = [{"role": m.role, "content": m.content} for m in req.messages]
    return chat(history, req.question)

@app.get("/api/health")
def health():
    return {"status": "healthy", "indexed_docs": len(vector_store.list_documents()),
            "total_chunks": sum(d["chunks"] for d in vector_store.list_documents())}
