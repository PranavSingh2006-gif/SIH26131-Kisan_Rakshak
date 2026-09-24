// ── WeatherAdvisory ───────────────────────────────────────────────────────────
// Section 3: Weather forecast card + Pest & Disease advisory card.
import type { Lang } from "../../types"
import { text } from "../../i18n"
import "./WeatherAdvisory.css"

interface Props {
  lang: Lang
  showToast: (msg: string) => void
  onScrollToExperts: () => void
}

const FORECAST = [
  ["Fri", "🌧", "32°", "Rain"],
  ["Sat", "🌦", "31°", "Showers"],
  ["Sun", "🌦", "30°", "Showers"],
  ["Mon", "⛈", "31°", "Storm risk"],
  ["Tue", "🌦", "32°", "Rain"],
]

export default function WeatherAdvisory({ lang, showToast, onScrollToExperts }: Props) {
  const t = text[lang]

  return (
    <section className="grid main-grid" style={{ marginBottom: "0" }}>
      {/* Weather card */}
      <div className="card" id="weather">
        <div className="card-head">
          <div>
            <p className="eyebrow">{t.local}</p>
            <h2>{t.weatherTitle}</h2>
          </div>
          <button className="ghost" onClick={() => showToast(t.refresh)}>{t.refresh}</button>
        </div>
        <div className="weather-main">
          <div className="temp">27°<small>{t.cloudy}</small></div>
          <div className="weather-advice">
            <b>{t.fieldRec}</b>
            <p>{t.weatherAdvice}</p>
            <span>{t.humidity}</span>
          </div>
        </div>
        <div className="forecast">
          {FORECAST.map(x => (
            <div key={x[0]}>
              <b>{x[0]}</b><span>{x[1]}</span><strong>{x[2]}</strong><small>{x[3]}</small>
            </div>
          ))}
        </div>
      </div>

      {/* Pest & Disease card */}
      <div className="card" id="pests">
        <div className="card-head">
          <div>
            <p className="eyebrow">{t.protection}</p>
            <h2>{t.pestTitle}</h2>
          </div>
        </div>
        <div className="pest-alert">
          <div className="pest-image">🐛</div>
          <div>
            <b>{t.possible}</b>
            <p>{t.found}</p>
            <strong>{t.medium}</strong>
          </div>
        </div>
        <div className="advice-box">
          <b>{t.safe}</b>
          <ul>
            <li>{t.pest1}</li>
            <li>{t.pest2}</li>
            <li>{t.pest3}</li>
            <li>{t.pest4}</li>
          </ul>
        </div>
        <button className="wide secondary" onClick={onScrollToExperts}>{t.expertDiagnosis}</button>
      </div>
    </section>
  )
}
