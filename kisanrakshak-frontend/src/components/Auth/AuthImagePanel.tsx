// ── AuthImagePanel.tsx ────────────────────────────────────────────────────────
// Right-side decorative panel on the login screen.
export default function AuthImagePanel() {
  return (
    <div className="login-image-panel">
      <img src="/farmer.jpg" alt="Indian farmer inspecting crops" className="login-bg-img" />
      <div className="login-image-overlay" />
      <div className="login-image-content">
        <div className="login-image-card">
          <p className="login-quote">"Smart farming, stronger harvests"</p>
          <p className="login-quote-sub">
            AI-powered crop disease detection, weather alerts, market prices
            and government scheme guidance — all in one place.
          </p>
          <div className="login-features">
            <span>📷 AI Crop Scan</span>
            <span>🌦 Weather Alerts</span>
            <span>₹ Mandi Prices</span>
            <span>🌾 ICAR Verified</span>
          </div>
        </div>
      </div>
    </div>
  )
}

