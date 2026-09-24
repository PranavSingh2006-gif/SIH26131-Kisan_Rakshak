// ── HistoryModal ──────────────────────────────────────────────────────────────
// Crop scan history timeline modal. Fetches from /api/history/:userId/:cropName
import { useEffect, useState } from "react"

interface HistoryItem {
  scanDate: string
  growthStage: string
  disease: string
  severity: string
  treatment: string[]
  historyComparison?: {
    efficacyStatus?: string
    prescriptionsChanged?: boolean
    progressNotes?: string
  }
}

interface Props {
  cropName: string | null   // null = modal closed
  userId: string
  onClose: () => void
}

export default function HistoryModal({ cropName, userId, onClose }: Props) {
  const [timeline, setTimeline] = useState<HistoryItem[]>([])
  const [loading, setLoading]   = useState(false)

  useEffect(() => {
    if (!cropName) return
    setLoading(true)
    fetch(`http://${window.location.hostname}:5000/api/history/${userId}/${encodeURIComponent(cropName)}`)
      .then(r => r.json())
      .then(data => setTimeline(data.success && data.history ? data.history : []))
      .catch(() => setTimeline([]))
      .finally(() => setLoading(false))
  }, [cropName, userId])

  if (!cropName) return null

  return (
    <div className="scan-modal open" onClick={onClose}>
      <div className="scan-box" onClick={e => e.stopPropagation()} style={{ maxWidth: "640px", width: "100%" }}>
        <button className="close" onClick={onClose}>×</button>
        <p className="eyebrow">{userId} • Historical Database</p>
        <h2 style={{ margin: "0 0 4px" }}>📜 {cropName} — Scan Milestones</h2>
        <p style={{ marginBottom: "16px" }}>Chronological treatment outcomes and AI progression timeline</p>

        <div style={{ maxHeight: "60vh", overflowY: "auto", paddingRight: "4px" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "48px 0", color: "#15803d", fontWeight: 700 }}>
              <span style={{ fontSize: "1.8rem" }}>⏳</span>
              <p style={{ margin: "8px 0 0" }}>Loading historical scan milestones…</p>
            </div>
          ) : timeline.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 16px", color: "#64748b", background: "#f8fafc", borderRadius: "10px", border: "1px dashed #cbd5e1" }}>
              <span style={{ fontSize: "2.2rem" }}>🌱</span>
              <p style={{ margin: "8px 0 4px", fontWeight: 700, color: "#1e293b", fontSize: "0.95rem" }}>No prior scan history recorded for {cropName}.</p>
              <small style={{ lineHeight: 1.4, display: "block" }}>Every scan performed on this crop will be preserved in your database and evaluated for treatment recovery here.</small>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ fontSize: "0.8rem", color: "#64748b", background: "#f1f5f9", padding: "8px 12px", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>Total Milestones Logged: <b>{timeline.length}</b></span>
                <span style={{ color: "#15803d", fontWeight: 700 }}>● Synced with Database</span>
              </div>
              {timeline.map((item, idx) => {
                const dStr    = new Date(item.scanDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
                const sevCol  = item.severity === "Low" ? "#16a34a" : item.severity === "Medium" ? "#d97706" : "#dc2626"
                const eff     = item.historyComparison?.efficacyStatus
                const rxChg   = item.historyComparison?.prescriptionsChanged
                return (
                  <div key={idx} style={{ border: "1.5px solid #e2e8f0", borderRadius: "12px", padding: "14px 16px", background: idx === 0 ? "#f8fafc" : "#ffffff", boxShadow: "0 2px 4px rgba(0,0,0,0.03)" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", marginBottom: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontWeight: 800, fontSize: "0.92rem", color: "#0f172a" }}>#{timeline.length - idx} • {item.growthStage} Stage</span>
                        {idx === 0 && <span style={{ background: "#dcfce7", color: "#15803d", fontSize: "0.68rem", fontWeight: 800, padding: "2px 8px", borderRadius: "999px" }}>LATEST SCAN</span>}
                      </div>
                      <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 500 }}>{dStr}</span>
                    </div>

                    <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "8px", flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "#1e293b" }}>Diagnosis: <span style={{ color: "#78350f" }}>{item.disease}</span></span>
                      <span style={{ background: sevCol + "22", color: sevCol, border: `1px solid ${sevCol}55`, fontSize: "0.7rem", fontWeight: 700, padding: "2px 8px", borderRadius: "6px" }}>{item.severity} Severity</span>
                      {eff && eff !== "Initial Scan" && (
                        <span style={{ background: rxChg ? "#ea580c" : eff === "Improved" ? "#16a34a" : "#ca8a04", color: "#fff", fontSize: "0.68rem", fontWeight: 700, padding: "2px 8px", borderRadius: "999px" }}>
                          {rxChg ? "🔄 Prescriptions Adapted" : eff === "Improved" ? "📈 Showing Improvement" : "⚠️ Condition Persistent"}
                        </span>
                      )}
                    </div>

                    {item.historyComparison?.progressNotes && (
                      <div style={{ fontSize: "0.8rem", color: "#334155", background: "#f1f5f9", padding: "8px 10px", borderRadius: "8px", margin: "6px 0 8px", lineHeight: 1.45 }}>
                        <b>Evaluation:</b> {item.historyComparison.progressNotes}
                      </div>
                    )}

                    {item.treatment?.length > 0 && (
                      <div style={{ marginTop: "6px" }}>
                        <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#334155", marginBottom: "3px" }}>💊 Prescribed Treatments:</div>
                        <ul style={{ margin: "0 0 0 16px", padding: 0, fontSize: "0.78rem", color: "#334155" }}>
                          {item.treatment.map((tItem, tIdx) => <li key={tIdx} style={{ marginBottom: "2px", lineHeight: 1.35 }}>{tItem}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div style={{ marginTop: "16px", paddingTop: "12px", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "flex-end" }}>
          <button className="primary" onClick={onClose} style={{ padding: "8px 24px" }}>Close</button>
        </div>
      </div>
    </div>
  )
}
