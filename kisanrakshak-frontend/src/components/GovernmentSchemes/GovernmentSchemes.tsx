// ── GovernmentSchemes ─────────────────────────────────────────────────────────
// Section 7: PM-KISAN, PMFBY, Farm Mechanization scheme cards.
import type { Lang } from "../../types"
import { text } from "../../i18n"
import "./GovernmentSchemes.css"

interface Props {
  lang: Lang
  showToast: (msg: string) => void
}

const SCHEMES = [
  { icon: "💰", title: "Income Support",     desc: "Discover farmer income-support programmes available for eligible applicants." },
  { icon: "🛡",  title: "Crop Insurance",     desc: "Explore crop-risk protection, enrollment windows and claim guidance." },
  { icon: "🚜", title: "Farm Mechanization", desc: "Find subsidy and support programmes for eligible agricultural machinery." },
]

export default function GovernmentSchemes({ lang, showToast }: Props) {
  const t = text[lang]

  return (
    <section id="schemes" className="section">
      <div className="section-head">
        <div>
          <p className="eyebrow">{t.govt}</p>
          <h2>{t.finder}</h2>
          <p>{t.finderDesc}</p>
        </div>
        <button
          className="primary"
          onClick={() => showToast(lang === "hi" ? "पात्रता प्रश्नावली खोली गई" : "Eligibility questionnaire opened")}
        >
          {t.eligibility}
        </button>
      </div>
      <div className="scheme-grid">
        {SCHEMES.map(s => (
          <div className="scheme" key={s.title}>
            <span>{s.icon}</span>
            <div>
              <b>{s.title}</b>
              <p>{s.desc}</p>
              <button onClick={() => showToast("Scheme details opened")}>View details →</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
