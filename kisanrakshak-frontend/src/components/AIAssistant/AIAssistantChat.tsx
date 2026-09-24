// ── AIAssistantChat ───────────────────────────────────────────────────────────
// Section 5: KisanRakshak keyword-based AI assistant chat panel.
// Bug fix: removed double-message append from original App.tsx sendChatMessage().
import { useEffect, useRef, useState } from "react"
import type { ChatMessage, Lang } from "../../types"
import { getBotResponse } from "./chatResponses"
import "./AIAssistantChat.css"

interface Props {
  lang: Lang
  showToast: (msg: string) => void
}

export default function AIAssistantChat({ lang, showToast }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "bot", text: "🌾 Namaste! I'm the KisanRakshak Assistant. Share your crop name, growth stage, and affected plant part — I'll help you identify the issue." }
  ])
  const [input, setInput]       = useState("")
  const [typing, setTyping]     = useState(false)
  const [listening, setListening] = useState(false)
  const endRef       = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }) }, [messages, typing])

  const send = () => {
    const trimmed = input.trim()
    if (!trimmed || typing) return
    // BUG FIX: single append only (original code appended twice)
    setMessages(prev => [...prev, { role: "user", text: trimmed }])
    setInput("")
    setTyping(true)
    window.setTimeout(() => {
      setMessages(prev => [...prev, { role: "bot", text: getBotResponse(trimmed, lang) }])
      setTyping(false)
    }, 800)
  }

  const startVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      showToast(lang === "hi" ? "⚠ आपका ब्राउज़र वॉइस इनपुट को सपोर्ट नहीं करता" : lang === "mr" ? "⚠ तुमचा ब्राउझर व्हॉइस इनपुटला सपोर्ट करत नाही" : "⚠ Voice input not supported in this browser. Try Chrome.")
      return
    }
    if (listening && recognitionRef.current) {
      recognitionRef.current.stop()
      setListening(false)
      return
    }
    const rec = new SpeechRecognition()
    recognitionRef.current = rec
    rec.lang = lang === "hi" ? "hi-IN" : lang === "mr" ? "mr-IN" : "en-IN"
    rec.interimResults = true
    rec.maxAlternatives = 1
    rec.continuous = false
    setListening(true)
    rec.onresult = (e: any) => setInput(Array.from(e.results).map((r: any) => r[0].transcript).join(""))
    rec.onerror  = (e: any) => {
      setListening(false)
      if (e.error === "not-allowed") showToast(lang === "hi" ? "⚠ माइक्रोफ़ोन की अनुमति दें" : "⚠ Microphone permission denied. Allow mic access in browser settings.")
    }
    rec.onend = () => setListening(false)
    rec.start()
  }

  return (
    <div className="chat">
      <div className="chat-head" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span>🤖 KisanRakshak Assistant</span>
          <span className="online">● Online (AI)</span>
        </div>
      </div>
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={`msg ${msg.role}`}>{msg.text}</div>
        ))}
        {typing && (
          <div className="msg bot" style={{ opacity: 0.65, fontStyle: "italic" }}>⌨️ AI is analyzing…</div>
        )}
        <div ref={endRef} />
      </div>
      <div className="chat-input">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={lang === "hi" ? "अपना सवाल लिखें… (फसल का नाम + लक्षण)" : lang === "mr" ? "तुमचा प्रश्न लिहा… (पीक + लक्षणे)" : "Ask about your crop (e.g. tomato yellow leaves)…"}
          onKeyDown={e => { if (e.key === "Enter") send() }}
          disabled={typing}
        />
        <button
          className={`mic-btn${listening ? " mic-active" : ""}`}
          onClick={startVoice}
          disabled={typing}
          title={listening ? "Stop listening" : lang === "hi" ? "बोलकर पूछें" : lang === "mr" ? "बोलून विचारा" : "Speak your question"}
        >
          {listening ? "🔴" : "🎙️"}
        </button>
        <button onClick={send} disabled={typing || !input.trim()}>{typing ? "…" : "Send"}</button>
      </div>
    </div>
  )
}
