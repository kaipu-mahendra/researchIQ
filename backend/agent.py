import anthropic
from typing import List, Dict, Any
from config import settings
from vector_store import vector_store

client = anthropic.Anthropic(api_key=settings.anthropic_api_key)

SYSTEM_PROMPT = (
    "You are ResearchIQ, an expert AI research agent. "
    "Answer questions ONLY from the provided document context chunks. "
    "Rules: 1) Only use provided context. 2) Cite sources as [filename pg X]. "
    "3) Say clearly if context lacks info - never fabricate. "
    "4) Use markdown formatting when helpful. 5) Be concise and structured."
)

def build_context(chunks):
    parts = []
    for i, c in enumerate(chunks):
        parts.append(f"--- Chunk {i+1} | {c['filename']} pg.{c['page']} | score:{c['score']:.2f} ---")
        parts.append(c['text'])
        parts.append("")
    return "
".join(parts)

def chat(messages, question):
    chunks = vector_store.search(question, k=settings.top_k)
    context = build_context(chunks)
    if chunks:
        user_content = f"Context from documents:

{context}

Question: {question}"
    else:
        user_content = f"No documents indexed. Question: {question}"
    api_messages = list(messages)
    api_messages.append({"role": "user", "content": user_content})
    response = client.messages.create(
        model=settings.claude_model,
        max_tokens=1500,
        system=SYSTEM_PROMPT,
        messages=api_messages,
    )
    answer = response.content[0].text
    sources = [
        {"filename": c["filename"], "page": c["page"], "score": round(c["score"],3)}
        for c in chunks
    ]
    return {"answer": answer, "sources": sources, "chunks_used": len(chunks)}
