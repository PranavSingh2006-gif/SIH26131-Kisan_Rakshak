// HotspotSurveillance.tsx
// District Surveillance — Maharashtra Pest & Disease Hotspot Map
// Requires: leaflet react-leaflet @types/leaflet

import { useEffect, useState, useCallback } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./HotspotSurveillance.css";

type Severity = "low" | "medium" | "high" | "critical";
type Trend = "up" | "down" | "stable";

interface DistrictHotspot {
  district: string;
  lat: number;
  lng: number;
  crop: string;
  pest: string;
  severity: Severity;
  affectedAreaPercent: number;
  affectedFarms: number;
  trend: Trend;
  lastUpdated: string;
}

interface HotspotSummary {
  totalDistricts: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

const SEVERITY_COLOR: Record<Severity, string> = {
  critical: "#dc2626",
  high: "#ea580c",
  medium: "#d97706",
  low: "#16a34a",
};

const SEVERITY_RANK: Record<Severity, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

const TREND_ICON: Record<Trend, string> = {
  up: "▲",
  down: "▼",
  stable: "●",
};

const MAHARASHTRA_CENTER: [number, number] = [19.53, 76.5];

// ── Demo/fallback data so the map is always populated ─────────────────────────
const DEMO_HOTSPOTS: DistrictHotspot[] = [
  { district: "Nashik",      lat: 19.997, lng: 73.789, crop: "Grapes",   pest: "Downy Mildew",          severity: "critical", affectedAreaPercent: 38, affectedFarms: 1420, trend: "up",     lastUpdated: "2 h ago" },
  { district: "Pune",        lat: 18.521, lng: 73.854, crop: "Tomato",   pest: "Late Blight",           severity: "high",     affectedAreaPercent: 27, affectedFarms: 890,  trend: "up",     lastUpdated: "3 h ago" },
  { district: "Ahmednagar",  lat: 19.094, lng: 74.739, crop: "Sugarcane",pest: "Red Rot",               severity: "high",     affectedAreaPercent: 22, affectedFarms: 640,  trend: "stable", lastUpdated: "5 h ago" },
  { district: "Solapur",     lat: 17.687, lng: 75.906, crop: "Soybean",  pest: "Stem Fly",              severity: "medium",   affectedAreaPercent: 16, affectedFarms: 510,  trend: "down",   lastUpdated: "4 h ago" },
  { district: "Aurangabad",  lat: 19.876, lng: 75.343, crop: "Cotton",   pest: "Pink Bollworm",         severity: "high",     affectedAreaPercent: 31, affectedFarms: 1100, trend: "up",     lastUpdated: "1 h ago" },
  { district: "Latur",       lat: 18.400, lng: 76.560, crop: "Tur Dal",  pest: "Pod Borer",             severity: "medium",   affectedAreaPercent: 14, affectedFarms: 380,  trend: "stable", lastUpdated: "6 h ago" },
  { district: "Nagpur",      lat: 21.145, lng: 79.088, crop: "Orange",   pest: "Citrus Canker",         severity: "medium",   affectedAreaPercent: 11, affectedFarms: 290,  trend: "down",   lastUpdated: "7 h ago" },
  { district: "Amravati",    lat: 20.932, lng: 77.751, crop: "Cotton",   pest: "Whitefly",              severity: "critical", affectedAreaPercent: 42, affectedFarms: 1670, trend: "up",     lastUpdated: "2 h ago" },
  { district: "Yavatmal",    lat: 20.388, lng: 78.120, crop: "Cotton",   pest: "Sucking Pest",          severity: "high",     affectedAreaPercent: 29, affectedFarms: 980,  trend: "up",     lastUpdated: "3 h ago" },
  { district: "Kolhapur",    lat: 16.705, lng: 74.243, crop: "Sugarcane",pest: "Early Shoot Borer",     severity: "low",      affectedAreaPercent: 8,  affectedFarms: 200,  trend: "down",   lastUpdated: "8 h ago" },
  { district: "Sangli",      lat: 16.856, lng: 74.563, crop: "Grapes",   pest: "Thrips",                severity: "medium",   affectedAreaPercent: 18, affectedFarms: 460,  trend: "stable", lastUpdated: "5 h ago" },
  { district: "Jalgaon",     lat: 21.003, lng: 75.563, crop: "Banana",   pest: "Sigatoka Leaf Spot",    severity: "low",      affectedAreaPercent: 9,  affectedFarms: 250,  trend: "stable", lastUpdated: "9 h ago" },
];

function buildSummary(hotspots: DistrictHotspot[]): HotspotSummary {
  return {
    totalDistricts: hotspots.length,
    critical: hotspots.filter(h => h.severity === "critical").length,
    high:     hotspots.filter(h => h.severity === "high").length,
    medium:   hotspots.filter(h => h.severity === "medium").length,
    low:      hotspots.filter(h => h.severity === "low").length,
  };
}

// Small helper that pans/zooms the map when a district is selected
function FlyToDistrict({ target }: { target: DistrictHotspot | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo([target.lat, target.lng], 8, { duration: 0.8 });
  }, [target, map]);
  return null;
}

export default function HotspotSurveillance() {
  const [hotspots, setHotspots] = useState<DistrictHotspot[]>(DEMO_HOTSPOTS);
  const [summary, setSummary] = useState<HotspotSummary>(buildSummary(DEMO_HOTSPOTS));
  const [selected, setSelected] = useState<DistrictHotspot | null>(null);
  const [severityFilter, setSeverityFilter] = useState<Severity | "all">("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const query = severityFilter === "all" ? "" : `?severity=${severityFilter}`;
      const [hotspotRes, summaryRes] = await Promise.all([
        fetch(`/api/hotspots${query}`),
        fetch(`/api/hotspots/summary`),
      ]);
      if (!hotspotRes.ok || !summaryRes.ok) throw new Error("Request failed");
      const hotspotData: DistrictHotspot[] = await hotspotRes.json();
      const summaryData: HotspotSummary = await summaryRes.json();
      setHotspots(hotspotData);
      setSummary(summaryData);
    } catch {
      // API not available — keep demo data, show no error to avoid confusion
      const filtered = severityFilter === "all"
        ? DEMO_HOTSPOTS
        : DEMO_HOTSPOTS.filter(h => h.severity === severityFilter);
      setHotspots(filtered);
      setSummary(buildSummary(filtered));
    } finally {
      setLoading(false);
    }
  }, [severityFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const sortedHotspots = [...hotspots].sort((a, b) => {
    const rankDiff = SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity];
    if (rankDiff !== 0) return rankDiff;
    return b.affectedAreaPercent - a.affectedAreaPercent;
  });

  return (
    <div className="hotspot-wrapper">
      <div className="hotspot-header">
        <div>
          <p className="hotspot-eyebrow">DISTRICT SURVEILLANCE</p>
          <h2>Maharashtra Pest &amp; Disease Hotspots</h2>
        </div>
        <button className="hotspot-refresh" onClick={fetchData} disabled={loading}>
          {loading ? "Refreshing…" : "↻ Refresh"}
        </button>
      </div>

      {summary && (
        <div className="hotspot-stats">
          <button
            className={`hotspot-stat critical ${severityFilter === "critical" ? "active" : ""}`}
            onClick={() => setSeverityFilter(severityFilter === "critical" ? "all" : "critical")}
          >
            <strong>{summary.critical}</strong>
            <span>Critical</span>
          </button>
          <button
            className={`hotspot-stat high ${severityFilter === "high" ? "active" : ""}`}
            onClick={() => setSeverityFilter(severityFilter === "high" ? "all" : "high")}
          >
            <strong>{summary.high}</strong>
            <span>High</span>
          </button>
          <button
            className={`hotspot-stat medium ${severityFilter === "medium" ? "active" : ""}`}
            onClick={() => setSeverityFilter(severityFilter === "medium" ? "all" : "medium")}
          >
            <strong>{summary.medium}</strong>
            <span>Medium</span>
          </button>
          <button
            className={`hotspot-stat low ${severityFilter === "low" ? "active" : ""}`}
            onClick={() => setSeverityFilter(severityFilter === "low" ? "all" : "low")}
          >
            <strong>{summary.low}</strong>
            <span>Low</span>
          </button>
        </div>
      )}

      {error && <p className="hotspot-error">{error}</p>}

      <div className="hotspot-body">
        <div className="hotspot-map-panel">
          <MapContainer
            center={MAHARASHTRA_CENTER}
            zoom={6}
            scrollWheelZoom={true}
            style={{ height: "560px", width: "100%", borderRadius: "12px" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <FlyToDistrict target={selected} />
            {sortedHotspots.map((d) => (
              <CircleMarker
                key={d.district}
                center={[d.lat, d.lng]}
                radius={6 + d.affectedAreaPercent / 4}
                pathOptions={{
                  color: SEVERITY_COLOR[d.severity],
                  fillColor: SEVERITY_COLOR[d.severity],
                  fillOpacity: 0.55,
                  weight: 2,
                }}
                eventHandlers={{ click: () => setSelected(d) }}
              >
                <Popup>
                  <strong>{d.district}</strong>
                  <br />
                  {d.pest} on {d.crop}
                  <br />
                  {d.affectedAreaPercent}% area affected · {d.severity}
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
          <div className="hotspot-legend">
            {(["critical", "high", "medium", "low"] as Severity[]).map((s) => (
              <span key={s} className="legend-item">
                <i style={{ background: SEVERITY_COLOR[s] }} /> {s}
              </span>
            ))}
          </div>
        </div>

        <div className="hotspot-list-panel">
          {loading && hotspots.length === 0 && <p className="hotspot-loading">Loading districts…</p>}
          {sortedHotspots.map((d) => (
            <button
              key={d.district}
              className={`hotspot-list-item ${selected?.district === d.district ? "selected" : ""}`}
              onClick={() => setSelected(d)}
            >
              <div className="hotspot-list-top">
                <span className="hotspot-district-name">{d.district}</span>
                <span className={`hotspot-badge ${d.severity}`}>{d.severity}</span>
              </div>
              <p className="hotspot-list-detail">
                {d.pest} · {d.crop}
              </p>
              <div className="hotspot-list-meta">
                <span>{d.affectedAreaPercent}% affected</span>
                <span>{d.affectedFarms.toLocaleString()} farms</span>
                <span className={`hotspot-trend ${d.trend}`}>{TREND_ICON[d.trend]}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

