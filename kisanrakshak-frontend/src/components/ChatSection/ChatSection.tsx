// ── ChatSection ───────────────────────────────────────────────────────────────
// Wrapper holding the mode switcher button + left info panel.
// Renders either AIAssistantChat or ExpertChat based on active tab.
import { useState } from "react"
import type { Lang } from "../../types"
import { text } from "../../i18n"
import AIAssistantChat from "../AIAssistant/AIAssistantChat"
import ExpertChat      from "../ExpertChat/ExpertChat"
import "../ExpertChat/ExpertChat.css"

interface Props {
  lang: Lang
  showToast: (msg: string) => void
}

export default function ChatSection({ lang, showToast }: Props) {
  const [chatMode, setChatMode] = useState<"assistant" | "expert">("assistant")
  const t = text[lang]

  const toggleMode = () => {
    const next = chatMode === "assistant" ? "expert" : "assistant"
    setChatMode(next)
    showToast(
      next === "expert"
        ? (lang === "hi" ? "👨🌾 विशेषज्ञ सलाहकार चैट में बदला गया" : lang === "mr" ? "👨🌾 तज्ञ सल्लागार चॅटवर बदलले" : "👨🌾 Switched to Expert Advisory Desk")
        : (lang === "hi" ? "🤖 किसानरक्षक AI सहायक में बदला गया" : lang === "mr" ? "🤖 किसानरक्षक AI सहाय्यकवर बदलले" : "🤖 Switched to KisanRakshak Assistant")
    )
  }

  return (
    <section id="experts" className="section">
      <div className="section-head">
        <div>
          <p className="eyebrow">{t.human}</p>
          <h2>{t.askExpert}</h2>
          <p>{t.askDesc}</p>
        </div>
        <button
          className="primary"
          onClick={toggleMode}
          style={{
            display: "flex", alignItems: "center", gap: "8px",
            background: chatMode === "assistant" ? "#166534" : "#1e40af",
            borderColor: chatMode === "assistant" ? "#15803d" : "#1d4ed8",
            cursor: "pointer"
          }}
          title="Toggle between KisanRakshak Assistant and Expert Advisory"
        >
          {chatMode === "assistant" ? (
            <><span>👨🌾</span><span>{lang === "hi" ? "विशेषज्ञ सलाह" : lang === "mr" ? "तज्ञ सल्ला" : "Expert Advisory"}</span></>
          ) : (
            <><span>🤖</span><span>{lang === "hi" ? "किसानरक्षक सहायक" : lang === "mr" ? "किसानरक्षक सहाय्यक" : "KisanRakshak Assistant"}</span></>
          )}
        </button>
      </div>

      <div className="expert-panel">
        {/* Left info panel */}
        <div className="expert-copy">
          <div className="expert-avatar">{chatMode === "assistant" ? "🤖" : "👨🌾"}</div>
          <h3>
            {chatMode === "assistant"
              ? t.dashboard
              : (lang === "hi" ? "विशेषज्ञ परामर्श कक्ष" : lang === "mr" ? "तज्ञ सल्लागार कक्ष" : "Expert Advisory Desk")}
          </h3>
          <p>
            {chatMode === "assistant"
              ? t.urgentText
              : (lang === "hi" ? "प्रमाणित कृषि वैज्ञानिकों और फसल रोग विशेषज्ञों से सीधा परामर्श और सलाह।" : lang === "mr" ? "प्रमाणित कृषी शास्त्रज्ञ आणि पीक रोग तज्ञांशी थेट सल्लामसलत." : "Direct consultation with certified agricultural scientists, agronomists & crop pathologists.")}
          </p>
          <div className="expert-points">
            {chatMode === "assistant" ? (
              <>
                <span>🤖 AI crop scan</span>
                <span>🌦️ Weather context</span>
                <span>🌱 Stage-specific advice</span>
                <span>🗣️ Multilingual support</span>
              </>
            ) : (
              <>
                <span>👨🌾 Certified Agronomists</span>
                <span>📋 Customized Prescription</span>
                <span>🛡️ ICAR Verified Guidance</span>
                <span>💬 Direct Support Channel</span>
              </>
            )}
          </div>
        </div>

        {/* Right chat panel — switches between modes */}
        {chatMode === "assistant"
          ? <AIAssistantChat lang={lang} showToast={showToast} />
          : <ExpertChat lang={lang} />
        }
      </div>
    </section>
  )
}
