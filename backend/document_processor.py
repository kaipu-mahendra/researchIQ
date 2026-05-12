import os
import io
import re
import pypdf
import docx
import pandas as pd
from typing import List, Dict, Any
from config import settings

def extract_text_pdf(path: str) -> List[Dict]:
    chunks = []
    reader = pypdf.PdfReader(path)
    for i, page in enumerate(reader.pages):
        text = page.extract_text() or ""
        chunks.append({"page": i+1, "text": text.strip()})
    return chunks

def extract_text_docx(path: str) -> List[Dict]:
    doc = docx.Document(path)
    full = chr(10).join(p.text for p in doc.paragraphs if p.text.strip())
    return [{"page": 1, "text": full}]

def extract_text_csv(path: str) -> List[Dict]:
    df = pd.read_csv(path)
    rows = []
    chunk_size = 50
    for i in range(0, len(df), chunk_size):
        batch = df.iloc[i:i+chunk_size]
        rows.append({"page": (i//chunk_size)+1, "text": batch.to_string(index=False)})
    return rows

def extract_text_txt(path: str) -> List[Dict]:
    text = open(path, encoding="utf-8", errors="ignore").read()
    return [{"page": 1, "text": text}]

def chunk_text(text: str, size: int = 512, overlap: int = 64) -> List[str]:
    words = text.split()
    chunks, i = [], 0
    while i < len(words):
        chunk = " ".join(words[i:i+size])
        if chunk.strip():
            chunks.append(chunk)
        i += size - overlap
    return chunks

def process_file(path: str, filename: str) -> List[Dict[str, Any]]:
    ext = os.path.splitext(filename)[1].lower()
    if ext == ".pdf":
        pages = extract_text_pdf(path)
    elif ext in (".docx", ".doc"):
        pages = extract_text_docx(path)
    elif ext == ".csv":
        pages = extract_text_csv(path)
    else:
        pages = extract_text_txt(path)
    all_chunks = []
    for page in pages:
        for chunk in chunk_text(page["text"], settings.chunk_size, settings.chunk_overlap):
            all_chunks.append({"filename": filename, "page": page["page"], "text": chunk})
    return all_chunks
