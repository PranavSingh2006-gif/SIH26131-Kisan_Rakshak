// IrrigationPlanner.tsx
// Smart Irrigation Planner — field report cards that correlate with
// the Field Monitoring section in sihproject's App.tsx.
//
// Each card matches a crop entry from Field Monitoring:
//   Field A — Wheat (Tillering, health 88%)
//   Field B — Soybean (Flowering, health 72%)
//   Field C — Tomato (Fruiting, health 84%)
//   Field D — Maize (Vegetative, health 59%)
//
// The component first tries the live API. If unavailable (no server)
// it falls back to demo data seeded from the same fields.

import { useCallback, useEffect, useState } from "react";
import "./IrrigationPlanner.css";

type CropStage = "Seedling" | "Vegetative" | "Tillering" | "Flowering" | "Fruiting" | "Harvesting";
type IrrigationAction = "irrigate_now" | "wait_rain" | "no_action_needed" | "monitor";

interface IrrigationRecommendation {
  field: string;
  crop: string;
  areaAcres: number;
  stage: CropStage;
  soilMoisturePercent: number;
  idealMoistureMin: number;
  idealMoistureMax: number;
  rainForecastMm: number;
  rainProbabilityPercent: number;
  tempC: number;
  lastIrrigated: string;
  action: IrrigationAction;
  reason: string;
  nextWindow: string;
  waterNeededMm: number;
}

interface IrrigationSummary {
  totalFields: number;
  needIrrigation: number;
  waitingOnRain: number;
  healthy: number;
  estimatedWaterSavedLitres: number;
}

type Status = "idle" | "locating" | "loading" | "ready" | "error";

const ACTION_LABEL: Record<IrrigationAction, { en: string; hi: string; mr: string }> = {
  irrigate_now:     { en: "Irrigate Now",    hi: "अभी सिंचाई करें",       mr: "आत्ता सिंचन करा" },
  wait_rain:        { en: "Wait for Rain",   hi: "बारिश का इंतज़ार करें",  mr: "पावसाची वाट पहा" },
  no_action_needed: { en: "Healthy",         hi: "ठीक है",                mr: "निरोगी" },
  monitor:          { en: "Monitor",         hi: "निगरानी रखें",           mr: "निरीक्षण करा" },
};

const ACTION_CLASS: Record<IrrigationAction, string> = {
  irrigate_now:     "danger",
  wait_rain:        "info",
  no_action_needed: "good",
  monitor:          "warn",
};

// ── Demo data aligned with Field Monitoring crops ─────────────────────────────
const DEMO_PLAN: IrrigationRecommendation[] = [
  {
    field: "Field A",
    crop: "Wheat",
    areaAcres: 2.4,
    stage: "Tillering",
    soilMoisturePercent: 68,
    idealMoistureMin: 60,
    idealMoistureMax: 80,
    rainForecastMm: 14,
    rainProbabilityPercent: 72,
    tempC: 27,
    lastIrrigated: "3 days ago",
    action: "wait_rain",
    reason: "Soil moisture is within the ideal range and rain is forecast with 72% probability. Skip irrigation to conserve water.",
    nextWindow: "Re-assess after rain event (est. Friday)",
    waterNeededMm: 0,
  },
  {
    field: "Field B",
    crop: "Soybean",
    areaAcres: 3.1,
    stage: "Flowering",
    soilMoisturePercent: 72,
    idealMoistureMin: 65,
    idealMoistureMax: 85,
    rainForecastMm: 8,
    rainProbabilityPercent: 58,
    tempC: 29,
    lastIrrigated: "2 days ago",
    action: "monitor",
    reason: "Moisture is adequate but near the lower ideal limit. Monitor daily during critical flowering stage; irrigate lightly if moisture drops below 60%.",
    nextWindow: "Monitor tomorrow morning",
    waterNeededMm: 0,
  },
  {
    field: "Field C",
    crop: "Tomato",
    areaAcres: 1.2,
    stage: "Fruiting",
    soilMoisturePercent: 84,
    idealMoistureMin: 70,
    idealMoistureMax: 90,
    rainForecastMm: 5,
    rainProbabilityPercent: 35,
    tempC: 30,
    lastIrrigated: "1 day ago",
    action: "no_action_needed",
    reason: "Soil moisture is optimal for fruiting stage. Consistent moisture prevents blossom-end rot. No irrigation needed today.",
    nextWindow: "Next irrigation in 2–3 days if no rainfall",
    waterNeededMm: 0,
  },
  {
    field: "Field D",
    crop: "Maize",
    areaAcres: 2.0,
    stage: "Vegetative",
    soilMoisturePercent: 42,
    idealMoistureMin: 55,
    idealMoistureMax: 75,
    rainForecastMm: 3,
    rainProbabilityPercent: 20,
    tempC: 31,
    lastIrrigated: "5 days ago",
    action: "irrigate_now",
    reason: "Soil moisture is critically low at 42% — well below the ideal 55–75% range for vegetative growth. Low rain probability means irrigation cannot be deferred.",
    nextWindow: "Irrigate today (morning preferred to reduce evaporation)",
    waterNeededMm: 28,
  },
];

const DEMO_SUMMARY: IrrigationSummary = {
  totalFields: 4,
  needIrrigation: 1,
  waitingOnRain: 1,
  healthy: 2,
  estimatedWaterSavedLitres: 84000,
};

export default function IrrigationPlanner({ lang = "en" as "en" | "hi" | "mr" }) {
  const [plan, setPlan] = useState<IrrigationRecommendation[]>([]);
  const [summary, setSummary] = useState<IrrigationSummary | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchData = useCallback((lat: number, lon: number) => {
    setStatus("loading");
    setErrorMsg("");
    Promise.all([
      fetch(`http://localhost:5000/api/irrigation?lat=${lat}&lon=${lon}`),
      fetch(`http://localhost:5000/api/irrigation/summary?lat=${lat}&lon=${lon}`),
    ])
      .then(async ([planRes, summaryRes]) => {
        if (!planRes.ok || !summaryRes.ok) throw new Error("Request failed");
        setPlan(await planRes.json());
        setSummary(await summaryRes.json());
        setStatus("ready");
      })
      .catch(() => {
        // API not available — use demo data aligned with Field Monitoring crops
        setPlan(DEMO_PLAN);
        setSummary(DEMO_SUMMARY);
        setStatus("ready");
      });
  }, []);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      // No geolocation — load demo data directly
      setPlan(DEMO_PLAN);
      setSummary(DEMO_SUMMARY);
      setStatus("ready");
      return;
    }
    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchData(pos.coords.latitude, pos.coords.longitude),
      () => {
        // Permission denied — fall back to demo data
        setPlan(DEMO_PLAN);
        setSummary(DEMO_SUMMARY);
        setStatus("ready");
      },
      { timeout: 8000 }
    );
  }, [fetchData]);

  useEffect(() => { requestLocation(); }, [requestLocation]);

  const loading = status === "locating" || status === "loading";

  return (
    <div className="irrigation-wrapper">
      <div className="irrigation-header">
        <div>
          <p className="irrigation-eyebrow">
            {lang === "hi" ? "जल प्रबंधन" : lang === "mr" ? "जल व्यवस्थापन" : "WATER MANAGEMENT"}
          </p>
          <h2>
            {lang === "hi" ? "स्मार्ट सिंचाई प्लानर" : lang === "mr" ? "स्मार्ट सिंचन नियोजक" : "Smart Irrigation Planner"}
          </h2>
        </div>
        <button className="irrigation-refresh" onClick={requestLocation} disabled={loading}>
          {loading
            ? (lang === "hi" ? "लोड हो रहा है…" : lang === "mr" ? "लोड होत आहे…" : "Loading…")
            : "↻ " + (lang === "hi" ? "रिफ्रेश" : lang === "mr" ? "रिफ्रेश" : "Refresh")}
        </button>
      </div>

      {status === "locating" && <p className="irrigation-loading">{lang === "hi" ? "आपकी लोकेशन ढूंढी जा रही है…" : lang === "mr" ? "तुमचे स्थान शोधत आहे…" : "Finding your location…"}</p>}
      {status === "loading" && <p className="irrigation-loading">{lang === "hi" ? "सिंचाई डेटा लाया जा रहा है…" : lang === "mr" ? "लाइव माती व पाऊस डेटा आणत आहे…" : "Fetching live soil & rain data…"}</p>}
      {status === "error" && (
        <div className="irrigation-error">
          <p>{errorMsg}</p>
          <button className="irrigation-refresh" onClick={requestLocation}>{lang === "hi" ? "फिर कोशिश करें" : lang === "mr" ? "पुन्हा प्रयत्न करा" : "Try again"}</button>
        </div>
      )}

      {status === "ready" && summary && (
        <div className="irrigation-stats">
          <div className="irrigation-stat danger">
            <strong>{summary.needIrrigation}</strong>
            <span>{lang === "hi" ? "तुरंत सिंचाई चाहिए" : lang === "mr" ? "ताबडतोब सिंचन हवे" : "Need Irrigation"}</span>
          </div>
          <div className="irrigation-stat info">
            <strong>{summary.waitingOnRain}</strong>
            <span>{lang === "hi" ? "बारिश का इंतज़ार" : lang === "mr" ? "पावसाची वाट" : "Waiting on Rain"}</span>
          </div>
          <div className="irrigation-stat good">
            <strong>{summary.healthy}</strong>
            <span>{lang === "hi" ? "स्वस्थ खेत" : lang === "mr" ? "निरोगी शेत" : "Healthy Fields"}</span>
          </div>
          <div className="irrigation-stat water">
            <strong>{(summary.estimatedWaterSavedLitres / 1000).toLocaleString()}k L</strong>
            <span>{lang === "hi" ? "पानी की बचत (अनुमानित)" : lang === "mr" ? "पाण्याची बचत (अंदाजे)" : "Water Saved (est.)"}</span>
          </div>
        </div>
      )}

      {status === "ready" && (
        <div className="irrigation-grid">
          {plan.map((f) => (
            <div className="irrigation-card" key={f.field}>
              <div className="irrigation-card-top">
                <h3>{f.field} — {f.crop}</h3>
                <span className={`irrigation-badge ${ACTION_CLASS[f.action]}`}>
                  {ACTION_LABEL[f.action][lang]}
                </span>
              </div>
              <div className="moisture-bar">
                <div className="moisture-fill" style={{ width: `${Math.min(f.soilMoisturePercent, 100)}%` }} />
                <div
                  className="moisture-ideal-range"
                  style={{ left: `${f.idealMoistureMin}%`, width: `${f.idealMoistureMax - f.idealMoistureMin}%` }}
                />
              </div>
              <div className="moisture-label">
                <span>{f.soilMoisturePercent}% {lang === "hi" ? "नमी" : lang === "mr" ? "आर्द्रता" : "moisture"}</span>
                <span className="ideal-label">{lang === "hi" ? "आदर्श" : lang === "mr" ? "आदर्श" : "ideal"}: {f.idealMoistureMin}–{f.idealMoistureMax}%</span>
              </div>
              <p className="irrigation-reason">{f.reason}</p>
              <div className="irrigation-meta">
                <span>🌧 {f.rainProbabilityPercent}% · {f.rainForecastMm}mm</span>
                <span>🌡 {f.tempC}°C</span>
                {f.waterNeededMm > 0 && <span>💧 {f.waterNeededMm}mm {lang === "hi" ? "चाहिए" : lang === "mr" ? "हवे" : "needed"}</span>}
              </div>
              <div className="irrigation-window">
                <b>{lang === "hi" ? "अगला कदम" : lang === "mr" ? "पुढील पाऊल" : "Next"}:</b> {f.nextWindow}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

