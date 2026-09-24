// ── CropScanModal ─────────────────────────────────────────────────────────────
// Section 1: AI crop image upload + analysis form + result card.
// Owns all scan-related state internally. Calls /api/analyze endpoint.
import { useEffect, useState } from "react"
import type { AnalysisResult, AuthUser, Lang } from "../../types"
import { text } from "../../i18n"
import ScanResultCard from "./ScanResultCard"
import "./CropScanModal.css"

interface Props {
  open: boolean
  lang: Lang
  user: AuthUser
  onClose: () => void
  onAnalysisComplete: (result: AnalysisResult, cropName: string, growthStage: string, location: string) => void
  showToast: (msg: string) => void
  showErrorToast: (msg: string) => void
}

export default function CropScanModal({ open, lang, user, onClose, onAnalysisComplete, showToast, showErrorToast }: Props) {
  const t = text[lang]

  const [image, setImage]           = useState<File | null>(null)
  const [preview, setPreview]       = useState("")
  const [cropName, setCropName]     = useState("")
  const [growthStage, setGrowthStage] = useState("")
  const [location, setLocation]     = useState("")
  const [sowingDate, setSowingDate] = useState("")
  const [symptoms, setSymptoms]     = useState("")
  const [loading, setLoading]       = useState(false)
  const [analysis, setAnalysis]     = useState<AnalysisResult | null>(null)

  // Revoke object URL on unmount / preview change
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview) }, [preview])

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setAnalysis(null)
      setImage(null)
      if (preview) URL.revokeObjectURL(preview)
      setPreview("")
      setCropName("")
      setGrowthStage("")
      setLocation("")
      setSowingDate("")
      setSymptoms("")
    }
  }, [open])

  const onImage = (file?: File) => {
    if (!file) return
    setImage(file)
    if (preview) URL.revokeObjectURL(preview)
    setPreview(URL.createObjectURL(file))
  }

  const runAnalysis = async () => {
    if (!image)       { showErrorToast(lang === "hi" ? "⚠ पहले फसल की फोटो चुनें" : lang === "mr" ? "⚠ आधी पिकाचा फोटो निवडा" : "⚠ Please upload a crop image before analyzing"); return }
    if (!cropName)    { showErrorToast(lang === "hi" ? "⚠ कृपया फसल का प्रकार चुनें" : lang === "mr" ? "⚠ कृपया पिकाचा प्रकार निवडा" : "⚠ Please select a crop type"); return }
    if (!growthStage) { showErrorToast(lang === "hi" ? "⚠ कृपया वृद्धि अवस्था चुनें" : lang === "mr" ? "⚠ कृपया वाढीची अवस्था निवडा" : "⚠ Please select a growth stage"); return }

    setLoading(true)
    try {
      const form = new FormData()
      form.append("image", image)
      form.append("cropName", cropName)
      form.append("growthStage", growthStage)
      form.append("location", location)
      form.append("sowingDate", sowingDate)
      form.append("symptoms", symptoms)
      form.append("userId", user.userId || "DEMO_USER")

      const response = await fetch(`http://${window.location.hostname}:5000/api/analyze`, { method: "POST", body: form })
      const result   = await response.json()
      if (!response.ok) throw new Error(result.message || "Analysis failed")

      setAnalysis(result.data || null)

      if (result.data?.historyComparison?.prescriptionsChanged) {
        showToast(lang === "hi" ? "⚡ पूर्व उपचार अप्रभावी — नए नुस्खे सुझाए गए!" : "⚡ Previous prescriptions ineffective — Adaptive Rx formulated!")
      } else if (result.data?.historyComparison?.efficacyStatus === "Improved") {
        showToast(lang === "hi" ? "📈 सुधार देखा गया — उपचार जारी रखें" : "📈 Improvement observed — Maintain care regimen")
      } else {
        showToast(lang === "hi" ? "✅ AI विश्लेषण पूरा हुआ" : "✅ AI analysis completed")
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Analysis failed. Please try again."
      showErrorToast("❌ " + msg)
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="scan-modal open">
      <div className="scan-box">
        <button className="close" onClick={onClose}>×</button>
        <p className="eyebrow">{t.scanTitle}</p>
        <h2>{t.scanTitle}</h2>
        <p>{t.scanDesc}</p>

        {/* Image upload */}
        <label className="upload">
          {preview ? <img src={preview} alt="Crop preview" /> : <><span>📷</span><br />{t.upload}</>}
          <input type="file" accept="image/*" onChange={e => onImage(e.target.files?.[0])} />
        </label>

        {/* Form fields */}
        <div className="form-grid">
          <select value={cropName} onChange={e => setCropName(e.target.value)} className={!cropName ? "placeholder-select" : ""}>
            <option value="" disabled>🌿 Select Crop Type…</option>
            <option value="Tomato">🍅 Tomato</option>
            <option value="Potato">🥔 Potato</option>
            <option value="Rice">🌾 Rice</option>
            <option value="Wheat">🌾 Wheat</option>
            <option value="Cotton">🌸 Cotton</option>
            <option value="Maize">🌽 Maize</option>
            <option value="Sugarcane">🎋 Sugarcane</option>
            <option value="Groundnut">🥜 Groundnut</option>
            <option value="Mustard">🌻 Mustard</option>
            <option value="Chilli">🌶 Chilli</option>
            <option value="Onion">🧅 Onion</option>
            <option value="Soybean">🫘 Soybean</option>
            <option value="Grape">🍇 Grape</option>
            <option value="Banana">🍌 Banana</option>
          </select>
          <select value={growthStage} onChange={e => setGrowthStage(e.target.value)} className={!growthStage ? "placeholder-select" : ""}>
            <option value="" disabled>📅 Select Growth Stage…</option>
            <option value="Seedling">🌱 Seedling</option>
            <option value="Vegetative">🌿 Vegetative</option>
            <option value="Tillering">🌾 Tillering</option>
            <option value="Flowering">🌸 Flowering</option>
            <option value="Fruiting">🍅 Fruiting</option>
            <option value="Grain filling">🌾 Grain Filling</option>
            <option value="Harvesting">🚜 Harvesting</option>
          </select>
        </div>
        <input className="field" placeholder={`📍 ${t.location}`} value={location} onChange={e => setLocation(e.target.value)} />
        <input className="field" type="date" value={sowingDate} onChange={e => setSowingDate(e.target.value)} />
        <textarea placeholder={`📝 ${t.symptoms} (${t.optional})`} value={symptoms} onChange={e => setSymptoms(e.target.value)} />

        {/* Result card */}
        {analysis?.finalResult && (
          <ScanResultCard finalResult={analysis.finalResult} lang={lang} />
        )}

        {/* Action button */}
        {!analysis ? (
          <button className="wide primary" style={{ marginTop: "14px" }} onClick={runAnalysis} disabled={loading}>
            {loading ? t.analyzing : t.analyze}
          </button>
        ) : (
          <button
            className="wide primary"
            style={{ marginTop: "14px", background: "#15803d", borderColor: "#15803d" }}
            onClick={() => { onAnalysisComplete(analysis, cropName, growthStage, location); onClose() }}
          >
            {t.addToDashboard}
          </button>
        )}
      </div>
    </div>
  )
}
