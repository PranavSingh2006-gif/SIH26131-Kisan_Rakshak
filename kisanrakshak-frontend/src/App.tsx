// ── App.tsx — Shell (refactored) ─────────────────────────────────────────────
// Reduced from 1083 → ~130 lines. All section logic lives in dedicated components.
// This file only: global state, layout skeleton, mounting section components.
import { useEffect, useState } from "react"
import "./App.css"
import type { AnalysisResult, AuthUser, CropEntry, Lang } from "./types"
import { text } from "./i18n"

// Section components
import CropScanModal     from "./components/CropScan/CropScanModal"
import HistoryModal      from "./components/CropScan/HistoryModal"
import FieldMonitoring   from "./components/FieldMonitoring/FieldMonitoring"
import WeatherAdvisory   from "./components/WeatherAdvisory/WeatherAdvisory"
import HotspotSurveillance from "./components/HotspotSurveillance/HotspotSurveillance"
import IrrigationPlanner from "./components/IrrigationPlanner/IrrigationPlanner"
import ChatSection       from "./components/ChatSection/ChatSection"
import GovernmentSchemes from "./components/GovernmentSchemes/GovernmentSchemes"

// ── Constants ─────────────────────────────────────────────────────────────────
const CROP_EMOJI: Record<string, string> = {
  Tomato:"🍅", Potato:"🥔", Rice:"🌾", Wheat:"🌾", Cotton:"🌸",
  Maize:"🌽", Sugarcane:"🎋", Groundnut:"🥜", Mustard:"🌻",
  Chilli:"🌶", Onion:"🧅", Soybean:"🫘", Grape:"🍇", Banana:"🍌",
}

const DEFAULT_CROPS: CropEntry[] = [
  { emoji:"🌾", name:"Wheat",   field:"Field A • 2.4 acres", status:"Healthy",   health:88, stage:"Tillering",  statusClass:"good"   },
  { emoji:"🫘", name:"Soybean", field:"Field B • 3.1 acres", status:"Monitor",   health:72, stage:"Flowering",  statusClass:"warn"   },
  { emoji:"🍅", name:"Tomato",  field:"Field C • 1.2 acres", status:"Healthy",   health:84, stage:"Fruiting",   statusClass:"good"   },
  { emoji:"🌽", name:"Maize",   field:"Field D • 2.0 acres", status:"Attention", health:59, stage:"Vegetative", statusClass:"danger" },
]

// ── App Shell ─────────────────────────────────────────────────────────────────
export default function App({ user, onLogout }: { user: AuthUser; onLogout: () => void }) {
  // ── Global UI state ────────────────────────────────────────────────────────
  const [lang, setLang]           = useState<Lang>("en")
  const [dark, setDark]           = useState(false)
  const [alertBanner, setAlertBanner] = useState(true)

  // ── Scan modal state ───────────────────────────────────────────────────────
  const [scanOpen, setScanOpen]   = useState(false)

  // ── Field Monitoring state ─────────────────────────────────────────────────
  const [crops, setCrops]         = useState<CropEntry[]>(DEFAULT_CROPS)

  // ── History modal state ────────────────────────────────────────────────────
  const [historyModalCrop, setHistoryModalCrop] = useState<string | null>(null)

  // ── Toast state ────────────────────────────────────────────────────────────
  const [toast, setToast]         = useState("")
  const [errorToast, setErrorToast] = useState("")

  const t = text[lang]

  // ── Side effects ───────────────────────────────────────────────────────────
  useEffect(() => { document.body.classList.toggle("dark", dark) }, [dark])
  useEffect(() => {
    document.body.style.overflow = (scanOpen || historyModalCrop) ? "hidden" : ""
  }, [scanOpen, historyModalCrop])

  // ── Helpers ────────────────────────────────────────────────────────────────
  const showToast      = (msg: string) => { setToast(msg);      window.setTimeout(() => setToast(""),      2800) }
  const showErrorToast = (msg: string) => { setErrorToast(msg); window.setTimeout(() => setErrorToast(""), 3500) }
  const scrollTo       = (id: string)  => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })

  // ── Add/update crop in Field Monitoring from scan result ───────────────────
  const addToDashboard = (analysis: AnalysisResult, cropName: string, growthStage: string, location: string) => {
    const fin = analysis?.finalResult
    if (!fin) return
    const emoji = CROP_EMOJI[cropName] || "🌱"
    const sev   = fin.severity || ""
    const statusClass: "good" | "warn" | "danger" = sev === "Low" ? "good" : sev === "Medium" ? "warn" : "danger"
    const status    = sev === "Low" ? "Healthy" : sev === "Medium" ? "Monitor" : "Attention"
    const healthVal = sev === "Low" ? 85 : sev === "Medium" ? 68 : 45
    const hist = fin.historyComparison

    setCrops(prev => {
      const idx = prev.findIndex(c =>
        c.name.toLowerCase() === cropName.toLowerCase() &&
        c.stage.toLowerCase() === growthStage.toLowerCase()
      )
      const entry: CropEntry = {
        emoji, name: cropName,
        field: location ? location : `Field ${prev.length + 1}`,
        status, health: healthVal, stage: growthStage,
        statusClass,
        disease: fin.disease,
        severity: fin.severity,
        efficacyStatus: hist?.efficacyStatus,
        prescriptionsChanged: hist?.prescriptionsChanged,
        progressNotes: hist?.progressNotes,
        lastScanDate: new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
      }
      if (idx >= 0) { const upd = [...prev]; upd[idx] = entry; return upd }
      return [...prev, entry]
    })

    const alreadyAdded = crops.find(c => c.name.toLowerCase() === cropName.toLowerCase())
    showToast(
      lang === "hi" ? `✅ ${cropName} ${alreadyAdded ? "अपडेट" : "जोड़ा"} गया`
      : lang === "mr" ? `✅ ${cropName} ${alreadyAdded ? "अपडेट" : "जोडले"} गेले`
      : `✅ ${cropName} ${alreadyAdded ? "updated" : "added"} in Field Monitoring`
    )
  }

  const removeCrop = (idx: number) => {
    const crop = crops[idx]
    setCrops(prev => prev.filter((_, i) => i !== idx))
    showToast(lang === "hi" ? `${crop?.name || "फसल"} खेत निगरानी से हटाई गई` : `${crop?.name || "Crop"} removed from Field Monitoring`)
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="app-shell">
      {/* Demo mode ribbon */}
      {user.role === "demo" && (
        <div style={{background:"#fef08a",borderBottom:"1px solid #fde047",textAlign:"center",fontSize:"12px",fontWeight:700,padding:"5px",color:"#713f12",zIndex:200,position:"relative"}}>
          🚀 DEMO MODE — Data is not saved | <span style={{opacity:0.7}}>Remove this bar before deployment</span>
        </div>
      )}

      {/* ── Topbar ── */}
      <header className="topbar">
        <div className="logo"><div className="logo-mark">🌾</div><div><b>{t.app}</b><small>{t.sub}</small></div></div>
        <div className="top-center"><span>📍 Jhansi, Uttar Pradesh</span><span className="live">● {t.live}</span></div>
        <div className="actions">
          <button
            onClick={() => setLang(lang === "en" ? "hi" : lang === "hi" ? "mr" : "en")}
            style={{fontWeight:700, fontSize:"12px", minWidth:"86px", display:"flex", alignItems:"center", gap:"4px", justifyContent:"center"}}
            title="Switch language"
          >
            {lang === "en" && <>🇮🇳 हिंदी</>}
            {lang === "hi" && <>🇮🇳 मराठी</>}
            {lang === "mr" && <>🇬🇧 English</>}
          </button>
          <button onClick={() => setDark(!dark)}>◐</button>
          {user.role === "admin" && (
            <span style={{background:"#1d4ed8",color:"#fff",fontSize:"11px",fontWeight:700,padding:"3px 10px",borderRadius:"999px"}}>👑 Admin</span>
          )}
          <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",lineHeight:1.2}}>
            <span style={{fontSize:"13px",fontWeight:700,color:"#15803d"}}>{user.fullName}</span>
            <span style={{fontSize:"11px",color:"#9ca3af"}}>{user.userId}</span>
          </div>
          <button onClick={onLogout} style={{background:"#fee2e2",color:"#b91c1c",border:"none",borderRadius:"8px",padding:"6px 12px",fontWeight:700,fontSize:"12px",cursor:"pointer"}}>
            Logout
          </button>
          <div className="avatar">{user.fullName.charAt(0).toUpperCase()}</div>
        </div>
      </header>

      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="farmer-card"><div className="avatar big">KR</div><div><b>{t.dashboard}</b><small>{t.companion}</small></div></div>
        <nav>
          <a className="active" href="#home">⌂ <span>{t.home}</span></a>
          <a href="#crops">🌱 <span>{t.crops}</span></a>
          <a href="#irrigation">💧 <span>{t.irrigation}</span></a>
          <a href="#hotspots">📍 <span>{t.hotspots}</span></a>
          <a href="#pests">🐛 <span>{t.pests}</span></a>
          <a href="#weather">☁ <span>{t.weather}</span></a>
          <a href="#schemes">▣ <span>{t.schemes}</span></a>
          <a href="#experts">👨‍🌾 <span>{t.experts}</span></a>
        </nav>
        <div className="side-help"><b>{t.urgent}</b><p>{t.urgentText}</p><button onClick={() => scrollTo("experts")}>{t.connect}</button></div>
      </aside>

      {/* ── Main Content ── */}
      <main>
        {/* Hero */}
        <section id="home" className="hero">
          <div>
            <p className="eyebrow">{t.smart}</p>
            <h1>
              {user?.role !== "demo" && user?.fullName && user.fullName !== "Demo User"
                ? (lang === "hi" ? `शुभ संध्या, ${user.fullName} 👋` : lang === "mr" ? `शुभ संध्याकाळ, ${user.fullName} 👋` : `Good evening, ${user.fullName} 👋`)
                : t.greeting}
            </h1>
            <p className="hero-sub">{t.hero}</p>
          </div>
          <button className="primary" onClick={() => setScanOpen(true)}>{t.diagnose}</button>
        </section>

        {/* Alert banner */}
        {alertBanner && (
          <section className="alert">
            <span className="alert-icon">⚠</span>
            <div><b>{t.alertTitle}</b><p>{t.alertText}</p></div>
            <button onClick={() => { setAlertBanner(false); showToast(t.dismiss) }}>{t.dismiss}</button>
          </section>
        )}

        {/* Stats */}
        <section className="stats">
          <div className="stat"><span>{t.myCrops}</span><strong>{crops.length}</strong><small>{crops.map(c => c.name).join(" • ")}</small></div>
          <div className="stat"><span>{t.tasks}</span><strong>3</strong><small className="amber">{t.priority}</small></div>
          <div className="stat"><span>{t.health}</span><strong>82%</strong><small className="green">{t.good}</small></div>
        </section>

        {/* ── Section 3: Weather & Pest Advisory ── */}
        <WeatherAdvisory
          lang={lang}
          showToast={showToast}
          onScrollToExperts={() => scrollTo("experts")}
        />

        {/* ── Section 2: Field Monitoring ── */}
        <FieldMonitoring
          crops={crops}
          lang={lang}
          onScanCrop={() => setScanOpen(true)}
          onRemoveCrop={removeCrop}
          onViewHistory={setHistoryModalCrop}
          showToast={showToast}
        />

        {/* ── Section 4: Irrigation Planner (existing) ── */}
        <IrrigationPlanner lang={lang} />

        {/* ── Section 4: Hotspot Surveillance (existing) ── */}
        <HotspotSurveillance />

        {/* ── Section 7: Government Schemes ── */}
        <GovernmentSchemes lang={lang} showToast={showToast} />

        {/* ── Section 5 + 6: Chat (AI Assistant + Expert Desk) ── */}
        <ChatSection lang={lang} showToast={showToast} />
      </main>

      {/* ── Section 1: Crop Scan Modal ── */}
      <CropScanModal
        open={scanOpen}
        lang={lang}
        user={user}
        onClose={() => setScanOpen(false)}
        onAnalysisComplete={addToDashboard}
        showToast={showToast}
        showErrorToast={showErrorToast}
      />

      {/* ── Section 1: History Modal ── */}
      <HistoryModal
        cropName={historyModalCrop}
        userId={user.userId || "DEMO_USER"}
        onClose={() => setHistoryModalCrop(null)}
      />

      {/* ── Global Toasts ── */}
      <div className={`toast${toast ? " show" : ""}`}>✅ {toast}</div>
      <div className={`toast error-toast${errorToast ? " show" : ""}`}>{errorToast}</div>
    </div>
  )
}
