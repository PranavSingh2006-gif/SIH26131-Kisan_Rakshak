// ── FieldMonitoring ───────────────────────────────────────────────────────────
// Section 2: My Crops field monitoring grid with scan button.
import type { CropEntry, Lang } from "../../types"
import { text } from "../../i18n"
import CropCard from "./CropCard"
import "./FieldMonitoring.css"

interface Props {
  crops: CropEntry[]
  lang: Lang
  onScanCrop: () => void
  onRemoveCrop: (index: number) => void
  onViewHistory: (cropName: string) => void
  showToast: (msg: string) => void
}

export default function FieldMonitoring({ crops, lang, onScanCrop, onRemoveCrop, onViewHistory, showToast }: Props) {
  const t = text[lang]

  return (
    <section id="crops" className="section">
      <div className="section-head">
        <div>
          <p className="eyebrow">{t.monitoring}</p>
          <h2>{t.crops}</h2>
          <p>{t.track}</p>
        </div>
        <button className="primary" onClick={onScanCrop}>{t.scanCrop}</button>
      </div>
      <div className="crop-grid">
        {crops.map((c, i) => (
          <CropCard
            key={i}
            crop={c}
            index={i}
            lang={lang}
            onRemove={onRemoveCrop}
            onViewHistory={onViewHistory}
            showToast={showToast}
          />
        ))}
      </div>
    </section>
  )
}
