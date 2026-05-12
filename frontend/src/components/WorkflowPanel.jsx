
const STEPS = [
  { icon: "⬆️", label: "Ingest", sub: "PDF/DOCX/CSV/TXT" },
  { icon: "✂️", label: "Chunk", sub: "512-token windows" },
  { icon: "📐", label: "Embed", sub: "384-dim vectors" },
  { icon: "🗄️", label: "FAISS Index", sub: "Vector store" },
]
const QUERY_STEPS = [
  { icon: "❓", label: "User Query", sub: "Natural language" },
  { icon: "🔍", label: "Semantic Search", sub: "Cosine similarity" },
  { icon: "🔀", label: "Re-rank", sub: "Top-K retrieval" },
  { icon: "🧠", label: "LLM Generate", sub: "Claude claude-sonnet-4" },
  { icon: "✅", label: "Cited Answer", sub: "Grounded response" },
]

const FEATURES = [
  { icon: "🛡️", title: "Hallucination Guard", desc: "Agent answers only from retrieved chunks. If no evidence exists, it says so — never fabricates." },
  { icon: "📌", title: "Source Citations", desc: "Every claim is tagged with [filename, page]. Full audit trail back to the source." },
  { icon: "🔗", title: "Cross-Document Analysis", desc: "Retrieves from all indexed documents simultaneously for comparison and synthesis." },
  { icon: "⚡", title: "Fast Retrieval", desc: "FAISS in-memory vector index returns top-K results in milliseconds." },
]

const TECH = [
  { name: "FastAPI", role: "REST backend" },
  { name: "Anthropic Claude", role: "LLM generation" },
  { name: "Sentence Transformers", role: "Embeddings" },
  { name: "FAISS", role: "Vector search" },
  { name: "React + Vite", role: "Frontend UI" },
  { name: "pypdf + docx", role: "File parsing" },
]

export default function WorkflowPanel() {
  return (
    <div style={{ overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>Agent Reasoning Pipeline</h2>
        <p style={{ fontSize: 13, color: "var(--text2)", marginBottom: 16 }}>How ResearchIQ processes your documents and answers questions</p>

        <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 12, color: "var(--green-text)", fontWeight: 500, marginBottom: 10 }}>📥 INDEXING PIPELINE</div>
          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 0 }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 0 }}>
                <div style={{ textAlign: "center", padding: "10px 14px", borderRadius: 10, background: "var(--bg3)", border: "1px solid var(--border)", minWidth: 90 }}>
                  <div style={{ fontSize: 22 }}>{s.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text)", marginTop: 4 }}>{s.label}</div>
                  <div style={{ fontSize: 11, color: "var(--text3)" }}>{s.sub}</div>
                </div>
                {i < STEPS.length - 1 && <div style={{ padding: "0 6px", color: "var(--text3)", fontSize: 18 }}>→</div>}
              </div>
            ))}
          </div>

          <div style={{ fontSize: 12, color: "var(--green-text)", fontWeight: 500, margin: "14px 0 10px" }}>🔍 QUERY PIPELINE</div>
          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 0 }}>
            {QUERY_STEPS.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center" }}>
                <div style={{ textAlign: "center", padding: "10px 10px", borderRadius: 10, background: "var(--bg3)", border: "1px solid var(--border)", minWidth: 80 }}>
                  <div style={{ fontSize: 20 }}>{s.icon}</div>
                  <div style={{ fontSize: 11, fontWeight: 500, color: "var(--text)", marginTop: 4 }}>{s.label}</div>
                  <div style={{ fontSize: 10, color: "var(--text3)" }}>{s.sub}</div>
                </div>
                {i < QUERY_STEPS.length - 1 && <div style={{ padding: "0 4px", color: "var(--text3)", fontSize: 18 }}>→</div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 12 }}>Key Features</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {FEATURES.map(f => (
            <div key={f.title} style={{ padding: 14, background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 10 }}>
              <div style={{ fontSize: 20, marginBottom: 6 }}>{f.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>{f.title}</div>
              <div style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.5 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 12 }}>Tech Stack</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {TECH.map(t => (
            <div key={t.name} style={{ padding: "6px 14px", borderRadius: 20, background: "var(--bg2)", border: "1px solid var(--border)", display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: "var(--green-text)" }}>{t.name}</span>
              <span style={{ fontSize: 11, color: "var(--text3)" }}>— {t.role}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
