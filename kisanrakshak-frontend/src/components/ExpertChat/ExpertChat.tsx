// ── ExpertChat ────────────────────────────────────────────────────────────────
// Section 6: Expert Advisory Desk chat panel with canned ticket responses.
import { useEffect, useRef, useState } from "react"
import type { ChatMessage, Lang } from "../../types"
import "../AIAssistant/AIAssistantChat.css"  // reuse shared chat styles
import "./ExpertChat.css"

interface Props {
  lang: Lang
}

const EXPERT_REPLIES = [
  (n: number) => `📋 Ticket #EXP-${n} logged at Agronomy Support Desk! Your field observation has been sent to our verified crop specialist. We will review your field details and respond shortly.`,
  () => `👨🌾 Expert Advisory Response: Query received regarding your crop issue. Please ensure high-humidity drainage is maintained. A certified agronomist will review your field records and send prescription advice.`,
  () => `🌾 Expert Desk: Case registered! We have notified our agricultural scientist on duty. For urgent field triage, check leaf undersides and avoid unverified chemical sprays until verified.`,
]

export default function ExpertChat({ lang }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "bot",
      sender: "Dr. Arvind Deshmukh (Sr. Agronomist)",
      text: "👨🌾 Namaste! You are connected to the KisanRakshak Expert Advisory Desk. Describe your field issue, disease symptoms, or fertilizer/pest problem. Our panel of agricultural scientists and agronomists will examine your query and send verified guidance."
    }
  ])
  const [input, setInput]   = useState("")
  const [typing, setTyping] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }) }, [messages, typing])

  const send = () => {
    const trimmed = input.trim()
    if (!trimmed || typing) return
    setMessages(prev => [...prev, { role: "user", text: trimmed }])
    setInput("")
    setTyping(true)
    window.setTimeout(() => {
      const caseNumber = Math.floor(1000 + Math.random() * 9000)
      const idx        = Math.floor(Math.random() * EXPERT_REPLIES.length)
      const reply      = EXPERT_REPLIES[idx](caseNumber)
      setMessages(prev => [...prev, { role: "bot", sender: "KisanRakshak Expert Desk", text: reply }])
      setTyping(false)
    }, 900)
  }

  return (
    <div className="chat">
      <div className="chat-head" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span>👨🌾 KisanRakshak Expert Advisory</span>
          <span className="online" style={{ color: "#1d4ed8", background: "#dbeafe", border: "1px solid #bfdbfe", padding: "2px 8px", borderRadius: "999px", fontSize: "11px" }}>● Agronomist Desk</span>
        </div>
      </div>
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={`msg ${msg.role}`}>
            {msg.role === "bot" && (
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#166534", marginBottom: "3px", display: "flex", alignItems: "center", gap: "4px" }}>
                <span>👨🌾</span> {msg.sender || "Expert Advisory"}
              </div>
            )}
            {msg.text}
          </div>
        ))}
        {typing && (
          <div className="msg bot" style={{ opacity: 0.65, fontStyle: "italic" }}>⌨️ Agronomist desk is typing…</div>
        )}
        <div ref={endRef} />
      </div>
      <div className="chat-input">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={lang === "hi" ? "कृषि विशेषज्ञ के लिए अपना संदेश लिखें…" : lang === "mr" ? "कृषी तज्ञांसाठी तुमचा संदेश लिहा…" : "Message agricultural experts (e.g. fertilizer dosage, severe blight)…"}
          onKeyDown={e => { if (e.key === "Enter") send() }}
          disabled={typing}
        />
        <button onClick={send} disabled={typing || !input.trim()}>{typing ? "…" : "Send"}</button>
      </div>
    </div>
  )
}
