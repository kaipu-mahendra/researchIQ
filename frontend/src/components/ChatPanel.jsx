
import { useState, useRef, useEffect } from "react"

function renderMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code style="background:#1e2535;padding:1px 5px;border-radius:4px;font-size:12px">$1</code>')
    .replace(/^#{1,3} (.+)$/gm, '<div style="font-weight:600;font-size:14px;margin:6px 0 3px">$1</div>')
    .replace(/\n/g, '<br/>')
}

const SUGGESTIONS = [
  "Summarize all uploaded documents",
  "What are the key findings?",
  "List all main topics covered",
  "Compare information across documents",
  "What problems does this document describe?",
]

export default function ChatPanel({ messages, loading, onSend, docsCount }) {
  const [input, setInput] = useState("")
  const bottomRef = useRef()
  const textareaRef = useRef()

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }) }, [messages, loading])

  const send = () => {
    if (!input.trim() || loading) return
    onSend(input.trim())
    setInput("")
    textareaRef.current.style.height = "auto"
  }

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send() }
  }

  const autoResize = (e) => {
    e.target.style.height = "auto"
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"
    setInput(e.target.value)
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: 16 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", gap: 10, flexDirection: msg.role === "user" ? "row-reverse" : "row", alignItems: "flex-start" }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0, background: msg.role === "user" ? "var(--bg3)" : "var(--green-light)", border: "1px solid var(--border)" }}>
              {msg.role === "user" ? "👤" : "🧠"}
            </div>
            <div style={{ maxWidth: "78%", display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ padding: "10px 14px", borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px", background: msg.role === "user" ? "var(--bg3)" : "var(--bg2)", border: "1px solid var(--border)", fontSize: 14, lineHeight: 1.65, color: "var(--text)" }}
                dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }} />
              {msg.sources && msg.sources.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {[...new Map(msg.sources.map(s => [`${s.filename}-${s.page}`, s])).values()].slice(0,6).map((s, j) => (
                    <span key={j} style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: "var(--green-light)", color: "var(--green-text)", border: "1px solid rgba(29,185,122,0.2)" }}>
                      📄 {s.filename} · pg {s.page}
                    </span>
                  ))}
                  {msg.chunks_used && <span style={{ fontSize: 11, color: "var(--text3)" }}>{msg.chunks_used} chunks retrieved</span>}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--green-light)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🧠</div>
            <div style={{ padding: "12px 16px", borderRadius: "14px 14px 14px 4px", background: "var(--bg2)", border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--green)", animation: "pulse 1.2s ease-in-out infinite", animationDelay: `${i*0.2}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {messages.length <= 1 && docsCount === 0 && (
        <div style={{ padding: "0 20px 10px", display: "flex", flexWrap: "wrap", gap: 6 }}>
          {SUGGESTIONS.map(s => (
            <button key={s} onClick={() => onSend(s)} style={{ fontSize: 12, padding: "5px 12px", borderRadius: 20, border: "1px solid var(--border)", background: "var(--bg2)", color: "var(--text2)", cursor: "pointer", fontFamily: "inherit" }}>{s}</button>
          ))}
        </div>
      )}

      <div style={{ padding: "12px 20px 16px", borderTop: "1px solid var(--border)", display: "flex", gap: 10, alignItems: "flex-end" }}>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={autoResize}
          onKeyDown={handleKey}
          placeholder={docsCount > 0 ? "Ask anything about your documents…" : "Upload documents first, then ask questions…"}
          rows={1}
          style={{ flex: 1, background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 12, padding: "10px 14px", color: "var(--text)", fontSize: 14, fontFamily: "inherit", resize: "none", outline: "none", lineHeight: 1.5, minHeight: 40 }}
        />
        <button
          onClick={send}
          disabled={!input.trim() || loading}
          style={{ width: 40, height: 40, borderRadius: 10, background: input.trim() && !loading ? "var(--green)" : "var(--bg3)", border: "1px solid var(--border)", cursor: input.trim() && !loading ? "pointer" : "default", fontSize: 16, color: input.trim() && !loading ? "white" : "var(--text3)", transition: "all 0.2s", flexShrink: 0 }}
        >➤</button>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:0.3;transform:scale(0.8)}50%{opacity:1;transform:scale(1)}}`}</style>
    </div>
  )
}
