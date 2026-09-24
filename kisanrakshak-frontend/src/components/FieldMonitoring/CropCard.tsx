// ── CropCard ──────────────────────────────────────────────────────────────────
// Single crop card in the Field Monitoring grid.
import type { CropEntry, Lang } from "../../types"
import { text } from "../../i18n"

interface Props {
  crop: CropEntry
  index: number
  lang: Lang
  onRemove: (index: number) => void
  onViewHistory: (cropName: string) => void
  showToast: (msg: string) => void
}

export default function CropCard({ crop: c, index, lang, onRemove, onViewHistory, showToast }: Props) {
  const t = text[lang]

  return (
    <div className="crop-card">
      <div className="crop-top">
        <span className="crop-emoji">{c.emoji}</span>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span className={`health ${c.statusClass}`}>{c.status}</span>
          <button
            className="crop-delete-btn"
            onClick={e => { e.stopPropagation(); onRemove(index) }}
            title="Remove crop"
            style={{
              border: "none", background: "#f3f4f6", color: "#6b7280",
              borderRadius: "50%", width: "24px", height: "24px",
              cursor: "pointer", fontSize: "14px", fontWeight: "bold",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              padding: 0, lineHeight: 1, transition: "all 0.2s"
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#fee2e2"; e.currentTarget.style.color = "#dc2626" }}
            onMouseLeave={e => { e.currentTarget.style.background = "#f3f4f6"; e.currentTarget.style.color = "#6b7280" }}
          >
            ✕
          </button>
        </div>
      </div>

      <h3>{c.name}</h3>
      <p>{c.field}</p>

      {c.disease && (
        <p style={{ fontSize: "0.75rem", color: "#b45309", marginTop: "4px", fontWeight: 600 }}>⚠ {c.disease}{c.severity ? ` · ${c.severity}` : ""}</p>
      )}

      {/* Efficacy badge */}
      {c.prescriptionsChanged ? (
        <div style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "#fff7ed", border: "1px solid #fdba74", color: "#c2410c", fontSize: "0.7rem", fontWeight: 700, padding: "2px 8px", borderRadius: "6px", marginTop: "4px" }}>
          <span>💊</span> New Prescriptions Active
        </div>
      ) : c.efficacyStatus === "Improved" ? (
        <div style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "#f0fdf4", border: "1px solid #86efac", color: "#15803d", fontSize: "0.7rem", fontWeight: 700, padding: "2px 8px", borderRadius: "6px", marginTop: "4px" }}>
          <span>📈</span> Condition Improving
        </div>
      ) : c.efficacyStatus === "No Improvement / Persistent" ? (
        <div style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "#fefce8", border: "1px solid #fef08a", color: "#a16207", fontSize: "0.7rem", fontWeight: 700, padding: "2px 8px", borderRadius: "6px", marginTop: "4px" }}>
          <span>🔄</span> Under Close Monitoring
        </div>
      ) : null}

      <div className="progress"><i style={{ width: `${c.health}%` }} /></div>
      <div className="crop-meta"><span>Stage: {c.stage}</span><b>{c.health}%</b></div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", marginTop: "8px" }}>
        <button
          type="button"
          onClick={() => onViewHistory(c.name)}
          style={{ background: "#f8fafc", color: "#334155", border: "1.5px solid #cbd5e1", borderRadius: "8px", padding: "6px 4px", fontSize: "0.72rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}
          title="View past scans and treatment progress"
        >
          📜 History
        </button>
        <button onClick={() => showToast(`${c.name} task list opened`)} style={{ padding: "6px 4px", fontSize: "0.72rem" }}>
          {t.fieldTasks}
        </button>
      </div>
    </div>
  )
}
