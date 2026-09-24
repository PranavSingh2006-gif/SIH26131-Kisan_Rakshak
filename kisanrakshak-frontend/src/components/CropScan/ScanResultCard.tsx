// ── ScanResultCard ────────────────────────────────────────────────────────────
// Pure display component: shows disease, confidence, severity, history
// comparison, symptoms, treatment, prevention and dataset info.
import type { FinalResult, Lang } from "../../types"
import { text } from "../../i18n"

interface Props {
  finalResult: FinalResult
  lang: Lang
}

const Badge = ({ bg, label }: { bg: string; label: string }) => (
  <span style={{ background: bg, color: "#fff", borderRadius: "999px", padding: "2px 9px", fontSize: "0.7rem", fontWeight: 700, whiteSpace: "nowrap" }}>
    {label}
  </span>
)

const SectionTitle = ({ icon, label }: { icon: string; label: string }) => (
  <div style={{ fontWeight: 700, fontSize: "0.8rem", marginBottom: "4px" }}>{icon} {label}</div>
)

const List = ({ items, ordered }: { items: string[]; ordered?: boolean }) =>
  ordered
    ? <ol style={{ margin: "2px 0 0 16px", padding: 0 }}>{items.map((s, i) => <li key={i} style={{ fontSize: "0.8rem", marginBottom: "3px", lineHeight: 1.4 }}>{s}</li>)}</ol>
    : <ul style={{ margin: "2px 0 0 14px", padding: 0 }}>{items.map((s, i) => <li key={i} style={{ fontSize: "0.8rem", marginBottom: "2px", lineHeight: 1.4 }}>{s}</li>)}</ul>

export default function ScanResultCard({ finalResult: fin, lang }: Props) {
  const t = text[lang]
  const sevColor: Record<string, string> = { Low: "#22c55e", Medium: "#f59e0b", High: "#ef4444", "Very High": "#7c3aed" }
  const sc = sevColor[fin.severity] || "#6b7280"

  return (
    <div style={{ marginTop: "14px" }}>
      {/* ── Final Result card ── */}
      <div style={{ border: "2px solid #fcd34d", borderRadius: "12px", padding: "14px", background: "linear-gradient(135deg,#fffbeb,#fefce8)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "1.1rem" }}>⭐</span>
          <span style={{ fontWeight: 800, fontSize: "0.95rem", color: "#92400e" }}>Result</span>
          {fin.icarRecommended && <Badge bg="#1d4ed8" label={`🏛 ${t.icarApproved}`} />}
        </div>

        <div style={{ fontWeight: 800, fontSize: "1.05rem", color: "#78350f", marginBottom: "4px" }}>{fin.disease}</div>
        {fin.pathogen && <div style={{ fontSize: "0.75rem", color: "#92400e", marginBottom: "6px", fontStyle: "italic" }}>{fin.pathogen}</div>}

        {/* Confidence + Severity */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "10px" }}>
          <span style={{ background: "#fef3c7", border: "1px solid #fcd34d", borderRadius: "6px", padding: "3px 10px", fontSize: "0.8rem" }}>
            <b>Confidence:</b> {fin.confidence}
          </span>
          <span style={{ background: sc + "22", color: sc, border: `1px solid ${sc}55`, borderRadius: "6px", padding: "3px 10px", fontSize: "0.8rem", fontWeight: 700 }}>
            <b>Severity:</b> {fin.severity}
          </span>
        </div>

        {/* ── Treatment Efficacy & Progress block ── */}
        {fin.historyComparison && (
          <div style={{
            margin: "10px 0 12px",
            padding: "10px 12px",
            borderRadius: "10px",
            background: fin.historyComparison.prescriptionsChanged ? "#fff7ed" : fin.historyComparison.efficacyStatus === "Improved" ? "#f0fdf4" : "#f8fafc",
            border: `1.5px solid ${fin.historyComparison.prescriptionsChanged ? "#fdba74" : fin.historyComparison.efficacyStatus === "Improved" ? "#86efac" : "#cbd5e1"}`
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "6px", marginBottom: "6px" }}>
              <div style={{ fontWeight: 800, fontSize: "0.82rem", display: "flex", alignItems: "center", gap: "5px", color: "#1e293b" }}>
                <span>🩺</span>
                <span>Treatment Efficacy &amp; Progress</span>
              </div>
              {fin.historyComparison.hasHistory ? (
                <span style={{
                  padding: "2px 9px", borderRadius: "999px", fontSize: "0.68rem", fontWeight: 800,
                  background: fin.historyComparison.prescriptionsChanged ? "#ea580c" : fin.historyComparison.efficacyStatus === "Improved" ? "#16a34a" : "#ca8a04",
                  color: "#fff"
                }}>
                  {fin.historyComparison.prescriptionsChanged ? "🔄 Prescriptions Adapted" : fin.historyComparison.efficacyStatus === "Improved" ? "📈 Showing Improvement" : "⚠️ Condition Persistent"}
                </span>
              ) : (
                <span style={{ padding: "2px 8px", borderRadius: "999px", fontSize: "0.68rem", fontWeight: 700, background: "#e2e8f0", color: "#475569" }}>
                  🌱 Baseline Scan
                </span>
              )}
            </div>

            {fin.historyComparison.hasHistory ? (
              <>
                <p style={{ fontSize: "0.78rem", color: "#334155", margin: "0 0 6px", lineHeight: 1.4 }}>
                  {fin.historyComparison.progressNotes}
                </p>
                {fin.historyComparison.prescriptionsChanged && (
                  <div style={{ background: "#ffedd5", borderLeft: "3px solid #ea580c", padding: "5px 8px", borderRadius: "5px", fontSize: "0.74rem", color: "#9a3412", marginBottom: "6px", fontWeight: 600 }}>
                    ⚡ <b>Adaptive Rx Alert:</b> Previous treatments were ineffective or disease persisted. Alternative 2nd-line prescriptions have been formulated below.
                  </div>
                )}
                <div style={{ fontSize: "0.7rem", color: "#64748b", borderTop: "1px dashed #cbd5e1", paddingTop: "5px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <span><b>Last Scan:</b> {fin.historyComparison.previousScanDate ? new Date(fin.historyComparison.previousScanDate).toLocaleDateString("en-IN", { month: "short", day: "numeric" }) : "Earlier"}</span>
                  <span><b>Prior Diagnosis:</b> {fin.historyComparison.previousDisease || "Recorded"} ({fin.historyComparison.previousSeverity || "N/A"})</span>
                </div>
              </>
            ) : (
              <p style={{ fontSize: "0.75rem", color: "#64748b", margin: 0 }}>
                Initial scan for this crop. Prescriptions given below will be tracked for efficacy on your subsequent scans.
              </p>
            )}
          </div>
        )}

        {/* Symptoms */}
        {fin.symptoms?.length > 0 && (
          <div style={{ marginBottom: "10px" }}>
            <SectionTitle icon="🔍" label="Symptoms (👁 AI-observed · 📚 Dataset-known):" />
            <List items={fin.symptoms} />
          </div>
        )}

        {/* Treatment */}
        {fin.treatment?.length > 0 && (
          <div style={{ marginBottom: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
              <SectionTitle icon="💊" label={`${t.treatment}:`} />
              {fin.historyComparison?.prescriptionsChanged && (
                <span style={{ fontSize: "0.65rem", background: "#ea580c", color: "#fff", padding: "2px 7px", borderRadius: "5px", fontWeight: 800 }}>
                  ⚡ ADAPTED 2ND-LINE RX
                </span>
              )}
            </div>
            <List items={fin.treatment} ordered />
          </div>
        )}

        {/* Prevention */}
        {fin.prevention?.length > 0 && (
          <div style={{ marginBottom: "8px" }}>
            <SectionTitle icon="🛡" label={`${t.prevention}:`} />
            <List items={fin.prevention} />
          </div>
        )}

        {/* Datasets used */}
        {fin.datasetsUsed?.length > 0 && (
          <div style={{ fontSize: "0.72rem", color: "#78350f", borderTop: "1px solid #fcd34d", paddingTop: "6px", marginTop: "4px" }}>
            📊 {t.datasetsUsed}: {fin.datasetsUsed.join(", ")}
          </div>
        )}
      </div>
    </div>
  )
}
