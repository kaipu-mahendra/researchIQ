
import { useRef } from "react"

export default function Sidebar({ documents, onUpload, onDelete, uploading }) {
  const fileRef = useRef()

  const handleDrop = (e) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    files.forEach(f => onUpload(f))
  }

  return (
    <aside style={{ width: 240, background: "var(--bg2)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", padding: 14, gap: 14, overflowY: "auto", flexShrink: 0 }}>
      <div>
        <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text3)", fontWeight: 600, marginBottom: 8 }}>Documents ({documents.length})</div>
        {documents.length === 0 && (
          <div style={{ fontSize: 13, color: "var(--text3)", textAlign: "center", padding: "20px 0" }}>No documents yet.<br/>Upload to get started.</div>
        )}
        {documents.map(doc => (
          <div key={doc.filename} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 8, border: "1px solid var(--border)", marginBottom: 6, background: "var(--bg3)" }}>
            <span style={{ fontSize: 16 }}>{doc.filename.endsWith('.pdf') ? '📄' : doc.filename.endsWith('.csv') ? '📊' : doc.filename.endsWith('.docx') ? '📝' : '📃'}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, color: "var(--text)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.filename}</div>
              <div style={{ fontSize: 11, color: "var(--text3)" }}>{doc.chunks} chunks · {doc.pages}p</div>
            </div>
            <button onClick={() => onDelete(doc.filename)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text3)", fontSize: 14, padding: "2px 4px", borderRadius: 4 }} title="Remove">✕</button>
          </div>
        ))}
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        onClick={() => fileRef.current.click()}
        style={{ border: "1px dashed var(--border)", borderRadius: 10, padding: "16px 10px", textAlign: "center", cursor: "pointer", transition: "border-color 0.2s", background: uploading ? "var(--green-light)" : "transparent" }}
      >
        <div style={{ fontSize: 22, marginBottom: 6 }}>{uploading ? "⏳" : "⬆️"}</div>
        <div style={{ fontSize: 13, color: uploading ? "var(--green-text)" : "var(--text2)", fontWeight: 500 }}>{uploading ? "Indexing..." : "Upload document"}</div>
        <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 3 }}>PDF, DOCX, CSV, TXT</div>
        <input ref={fileRef} type="file" accept=".pdf,.docx,.doc,.csv,.txt" style={{ display: "none" }} multiple onChange={e => Array.from(e.target.files).forEach(f => onUpload(f))} />
      </div>

      <div>
        <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text3)", fontWeight: 600, marginBottom: 8 }}>Agent Capabilities</div>
        {["📖 Document Q&A", "🔍 Semantic Search", "📝 Summarization", "🔗 Cross-doc Compare", "🛡️ Cited Answers"].map(cap => (
          <div key={cap} style={{ fontSize: 12, color: "var(--text2)", padding: "4px 0", borderBottom: "1px solid var(--border)", paddingBottom: 4, marginBottom: 4 }}>{cap}</div>
        ))}
      </div>
    </aside>
  )
}
