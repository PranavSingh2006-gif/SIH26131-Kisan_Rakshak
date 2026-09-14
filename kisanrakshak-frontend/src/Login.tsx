import { useState, useEffect } from "react"
import "./Login.css"
import type { AuthUser } from "./types"

interface Props {
  onLogin: (user: AuthUser, token: string) => void
}

// ── UserID suggestion helper ─────────────────────────────────────────────────
function suggestUserId(name: string, phone: string): string {
  const namePart = name.trim().toUpperCase().replace(/[^A-Z]/g, "").slice(0, 4)
  const phonePart = phone.replace(/\D/g, "").slice(-4)
  if (!namePart && !phonePart) return ""
  return `${namePart || "USER"}_${phonePart || "0000"}`
}

const API = "http://localhost:5000/api/auth"

export default function Login({ onLogin }: Props) {
  const [tab, setTab] = useState<"login" | "signup">("login")

  // ── Login state ────────────────────────────────────────────────────────────
  const [loginId, setLoginId] = useState("")
  const [loginPw, setLoginPw] = useState("")
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [showLoginPw, setShowLoginPw] = useState(false)

  // ── Signup state ───────────────────────────────────────────────────────────
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [userId, setUserId] = useState("")
  const [userIdEdited, setUserIdEdited] = useState(false)
  const [signupPw, setSignupPw] = useState("")
  const [confirmPw, setConfirmPw] = useState("")
  const [signupLoading, setSignupLoading] = useState(false)
  const [signupError, setSignupError] = useState("")
  const [showSignupPw, setShowSignupPw] = useState(false)

  // Auto-suggest userId as user types name/phone
  useEffect(() => {
    if (!userIdEdited) setUserId(suggestUserId(fullName, phone))
  }, [fullName, phone, userIdEdited])

  // ── Login submit ───────────────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")
    if (!loginId.trim() || !loginPw) { setLoginError("Please enter your User ID / Phone and Password"); return }
    setLoginLoading(true)
    try {
      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: loginId.trim(), password: loginPw }),
      })
      const data = await res.json()
      if (!res.ok) { setLoginError(data.message || "Login failed"); return }
      onLogin(data.user, data.token)
    } catch {
      setLoginError("Could not connect to server. Make sure the backend is running.")
    } finally {
      setLoginLoading(false)
    }
  }

  // ── Signup submit ──────────────────────────────────────────────────────────
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setSignupError("")
    if (!fullName.trim()) { setSignupError("Please enter your full name"); return }
    if (!/^[0-9]{10}$/.test(phone)) { setSignupError("Phone number must be exactly 10 digits"); return }
    if (!userId.trim()) { setSignupError("Please enter a User ID"); return }
    if (signupPw.length < 6) { setSignupError("Password must be at least 6 characters"); return }
    if (signupPw !== confirmPw) { setSignupError("Passwords do not match"); return }
    setSignupLoading(true)
    try {
      const res = await fetch(`${API}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: fullName.trim(), userId: userId.trim(), phone, password: signupPw }),
      })
      const data = await res.json()
      if (!res.ok) { setSignupError(data.message || "Sign up failed"); return }
      onLogin(data.user, data.token)
    } catch {
      setSignupError("Could not connect to server. Make sure the backend is running.")
    } finally {
      setSignupLoading(false)
    }
  }

  // ── Demo mode (remove before deployment) ─────────────────────────────────
  const enterDemo = () => {
    const demoUser: AuthUser = {
      id: "demo",
      fullName: "Demo User",
      userId: "DEMO_MODE",
      phone: "0000000000",
      role: "demo",
    }
    onLogin(demoUser, "demo_token")
  }

  return (
    <div className="login-shell">
      {/* ── Left: Form panel ─────────────────────────────────────────────── */}
      <div className="login-form-panel">
        <div className="login-brand">
          <span className="login-logo">🌾</span>
          <span className="login-brand-name">KisanRakshak</span>
        </div>

        {/* Tab switcher */}
        <div className="login-tabs">
          <button
            className={`login-tab ${tab === "login" ? "active" : ""}`}
            onClick={() => { setTab("login"); setLoginError("") }}
          >
            Log In
          </button>
          <button
            className={`login-tab ${tab === "signup" ? "active" : ""}`}
            onClick={() => { setTab("signup"); setSignupError("") }}
          >
            Sign Up
          </button>
          <div className={`login-tab-indicator ${tab === "signup" ? "right" : "left"}`} />
        </div>

        {/* ── Login form ─────────────────────────────────────────────────── */}
        {tab === "login" && (
          <form className="login-form" onSubmit={handleLogin} noValidate>
            <div className="login-heading">
              <h1>Welcome Back! 👋</h1>
              <p>Log in to your KisanRakshak account</p>
            </div>

            <div className="field-group">
              <label>User ID or Phone Number</label>
              <input
                type="text"
                placeholder="e.g. RAJE_3210 or 9876543210"
                value={loginId}
                onChange={e => setLoginId(e.target.value)}
                autoComplete="username"
              />
            </div>

            <div className="field-group">
              <label>Password</label>
              <div className="pw-wrap">
                <input
                  type={showLoginPw ? "text" : "password"}
                  placeholder="Enter your password"
                  value={loginPw}
                  onChange={e => setLoginPw(e.target.value)}
                  autoComplete="current-password"
                />
                <button type="button" className="pw-eye" onClick={() => setShowLoginPw(v => !v)}>
                  {showLoginPw ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            {loginError && <div className="auth-error">⚠ {loginError}</div>}

            <button className="login-btn primary" type="submit" disabled={loginLoading}>
              {loginLoading ? "Logging in…" : "Log In →"}
            </button>

            <p className="switch-tab">
              Don't have an account?{" "}
              <button type="button" className="link-btn" onClick={() => setTab("signup")}>
                Sign Up
              </button>
            </p>
          </form>
        )}

        {/* ── Signup form ────────────────────────────────────────────────── */}
        {tab === "signup" && (
          <form className="login-form" onSubmit={handleSignup} noValidate>
            <div className="login-heading">
              <h1>Create Account 🌱</h1>
              <p>Join KisanRakshak — your digital crop companion</p>
            </div>

            <div className="field-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="e.g. Rajesh Kumar"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                autoComplete="name"
              />
            </div>

            <div className="signup-row">
              <div className="field-group">
                <label>Phone Number <span className="field-note">(used as unique key)</span></label>
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={phone}
                  maxLength={10}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, ""))}
                  autoComplete="tel"
                />
              </div>

              <div className="field-group">
                <label>
                  User ID
                  {suggestUserId(fullName, phone) && !userIdEdited && (
                    <span className="userid-badge">auto-suggested</span>
                  )}
                </label>
                <input
                  type="text"
                  placeholder="e.g. RAJE_3210"
                  value={userId}
                  onChange={e => { setUserId(e.target.value.toUpperCase()); setUserIdEdited(true) }}
                  autoComplete="username"
                />
                {!userIdEdited && suggestUserId(fullName, phone) && (
                  <span className="userid-hint">Format: First4Letters_Last4Digits</span>
                )}
              </div>
            </div>

            <div className="signup-row">
              <div className="field-group">
                <label>Password</label>
                <div className="pw-wrap">
                  <input
                    type={showSignupPw ? "text" : "password"}
                    placeholder="At least 6 characters"
                    value={signupPw}
                    onChange={e => setSignupPw(e.target.value)}
                    autoComplete="new-password"
                  />
                  <button type="button" className="pw-eye" onClick={() => setShowSignupPw(v => !v)}>
                    {showSignupPw ? "🙈" : "👁"}
                  </button>
                </div>
              </div>

              <div className="field-group">
                <label>Confirm Password</label>
                <div className="pw-wrap">
                  <input
                    type={showSignupPw ? "text" : "password"}
                    placeholder="Re-enter password"
                    value={confirmPw}
                    onChange={e => setConfirmPw(e.target.value)}
                    autoComplete="new-password"
                  />
                  {confirmPw && (
                    <span className="pw-match-icon">{confirmPw === signupPw ? "✅" : "❌"}</span>
                  )}
                </div>
              </div>
            </div>

            {signupError && <div className="auth-error">⚠ {signupError}</div>}

            <button className="login-btn primary" type="submit" disabled={signupLoading}>
              {signupLoading ? "Creating account…" : "Create Account →"}
            </button>

            <p className="switch-tab">
              Already have an account?{" "}
              <button type="button" className="link-btn" onClick={() => setTab("login")}>
                Log In
              </button>
            </p>
          </form>
        )}

        {/* ── Demo mode button — REMOVE BEFORE DEPLOYMENT ─────────────────
            To remove: delete the entire <div className="demo-zone">…</div> block below
        ─────────────────────────────────────────────────────────────────── */}
        <div className="demo-zone">
          <div className="demo-divider"><span>OR</span></div>
          <button className="login-btn demo" type="button" onClick={enterDemo}>
            🚀 Continue as Demo (No Login Required)
          </button>
          <p className="demo-note">
            ⚠ Demo mode — data is not saved. Remove this option before final deployment.
          </p>
        </div>
      </div>

      {/* ── Right: Image panel ───────────────────────────────────────────── */}
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
    </div>
  )
}

