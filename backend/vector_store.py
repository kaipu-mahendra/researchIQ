import numpy as np
import faiss
import json
import os
import pickle
from typing import List, Dict, Any
from sentence_transformers import SentenceTransformer
from config import settings

class VectorStore:
    def __init__(self):
        self.model = SentenceTransformer(settings.embed_model)
        self.index = None
        self.chunks: List[Dict[str, Any]] = []
        self.dimension = 384

    def add_chunks(self, chunks: List[Dict[str, Any]]):
        if not chunks:
            return
        texts = [c["text"] for c in chunks]
        embeddings = self.model.encode(texts, show_progress_bar=False, convert_to_numpy=True)
        embeddings = embeddings.astype(np.float32)
        faiss.normalize_L2(embeddings)
        if self.index is None:
            self.index = faiss.IndexFlatIP(self.dimension)
        self.index.add(embeddings)
        self.chunks.extend(chunks)

    def search(self, query: str, k: int = None) -> List[Dict[str, Any]]:
        if self.index is None or len(self.chunks) == 0:
            return []
        k = k or settings.top_k
        q_emb = self.model.encode([query], convert_to_numpy=True).astype(np.float32)
        faiss.normalize_L2(q_emb)
        scores, indices = self.index.search(q_emb, min(k, len(self.chunks)))
        results = []
        for score, idx in zip(scores[0], indices[0]):
            if idx >= 0:
                chunk = dict(self.chunks[idx])
                chunk["score"] = float(score)
                results.append(chunk)
        return results

    def remove_document(self, filename: str):
        self.chunks = [c for c in self.chunks if c["filename"] != filename]
        self._rebuild_index()

    def _rebuild_index(self):
        self.index = None
        if not self.chunks:
            return
        texts = [c["text"] for c in self.chunks]
        embeddings = self.model.encode(texts, show_progress_bar=False, convert_to_numpy=True)
        embeddings = embeddings.astype(np.float32)
        faiss.normalize_L2(embeddings)
        self.index = faiss.IndexFlatIP(self.dimension)
        self.index.add(embeddings)

    def list_documents(self) -> List[Dict[str, Any]]:
        seen = {}
        for c in self.chunks:
            fn = c["filename"]
            if fn not in seen:
                seen[fn] = {"filename": fn, "chunks": 0, "pages": set()}
            seen[fn]["chunks"] += 1
            seen[fn]["pages"].add(c["page"])
        result = []
        for v in seen.values():
            result.append({"filename": v["filename"], "chunks": v["chunks"], "pages": len(v["pages"])})
        return result

vector_store = VectorStore()
