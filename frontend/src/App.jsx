
import { useState, useRef, useEffect, useCallback } from "react"
import Sidebar from "./components/Sidebar"
import ChatPanel from "./components/ChatPanel"
import WorkflowPanel from "./components/WorkflowPanel"

const API = ""

export default function App() {
  const [tab, setTab] = useState("chat")
  const [documents, setDocuments] = useState([])
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I'm **ResearchIQ**, your AI research agent. Upload documents (PDF, DOCX, CSV, TXT) and I'll index them so you can ask questions, get summaries, and extract insights — all with cited sources.", sources: [] }
  ])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  const fetchDocs = useCallback(async () => {
    try {
      const r = await fetch(`${API}/api/documents`)
      if (r.ok) setDocuments(await r.json())
    } catch {}
  }, [])

  useEffect(() => { fetchDocs() }, [fetchDocs])

  const uploadFile = async (file) => {
    setUploading(true)
    const fd = new FormData()
    fd.append("file", file)
    try {
      const r = await fetch(`${API}/api/upload`, { method: "POST", body: fd })
      const data = await r.json()
      if (r.ok) {
        setDocuments(data.documents || [])
        setMessages(m => [...m, {
          role: "assistant",
          content: `✅ **${file.name}** indexed successfully — **${data.chunks} chunks** created and ready for Q&A.`,
          sources: []
        }])
      } else {
        setMessages(m => [...m, { role: "assistant", content: `❌ Upload failed: ${data.detail}`, sources: [] }])
      }
    } catch (e) {
      setMessages(m => [...m, { role: "assistant", content: `❌ Upload error: ${e.message}`, sources: [] }])
    }
    setUploading(false)
  }

  const deleteDoc = async (filename) => {
    try {
      await fetch(`${API}/api/documents/${encodeURIComponent(filename)}`, { method: "DELETE" })
      fetchDocs()
    } catch {}
  }

  const sendMessage = async (question) => {
    if (!question.trim() || loading) return
    const userMsg = { role: "user", content: question }
    setMessages(m => [...m, userMsg])
    setLoading(true)
    try {
      const history = messages
        .filter(m => m.role !== "assistant" || !m.content.startsWith("Hello!"))
        .map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content }))
      const r = await fetch(`${API}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, question })
      })
      const data = await r.json()
      if (r.ok) {
        setMessages(m => [...m, { role: "assistant", content: data.answer, sources: data.sources || [], chunks_used: data.chunks_used }])
      } else {
        setMessages(m => [...m, { role: "assistant", content: `Error: ${data.detail}`, sources: [] }])
      }
    } catch (e) {
      setMessages(m => [...m, { role: "assistant", content: `Connection error: ${e.message}. Is the backend running?`, sources: [] }])
    }
    setLoading(false)
  }

  return (
    <div style={{ display: "flex", height: "100vh", flexDirection: "column" }}>
      <Header tab={tab} setTab={setTab} />
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar documents={documents} onUpload={uploadFile} onDelete={deleteDoc} uploading={uploading} />
        <main style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {tab === "chat" && <ChatPanel messages={messages} loading={loading} onSend={sendMessage} docsCount={documents.length} />}
          {tab === "workflow" && <WorkflowPanel />}
        </main>
      </div>
    </div>
  )
}

function Header({ tab, setTab }) {
  const tabs = [["chat","💬 Chat"], ["workflow","🔀 Workflow"]]
  return (
    <header style={{ background: "var(--bg2)", borderBottom: "1px solid var(--border)", padding: "0 20px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--green)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>🧠</div>
        <span style={{ fontWeight: 600, fontSize: 15, color: "var(--text)" }}>ResearchIQ</span>
        <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: "var(--green-light)", color: "var(--green-text)", fontWeight: 500 }}>AI Agent</span>
      </div>
      <div style={{ display: "flex", gap: 4 }}>
        {tabs.map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{ padding: "5px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 13, background: tab === id ? "var(--bg3)" : "transparent", color: tab === id ? "var(--text)" : "var(--text2)", fontWeight: tab === id ? 500 : 400 }}>{label}</button>
        ))}
      </div>
      <div style={{ fontSize: 12, color: "var(--text3)" }}>Powered by Claude + RAG</div>
    </header>
  )
}
