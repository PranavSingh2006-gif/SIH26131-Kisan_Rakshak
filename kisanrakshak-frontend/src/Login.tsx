// ── Login.tsx — Shell (refactored) ───────────────────────────────────────────
// Reduced from 320 → ~65 lines. Form and image panels live in src/components/Auth/
import { useState } from "react"
import "./Login.css"
import type { AuthUser } from "./types"
import LoginForm from "./components/Auth/LoginForm"
import SignupForm from "./components/Auth/SignupForm"
import AuthImagePanel from "./components/Auth/AuthImagePanel"

interface Props {
  onLogin: (user: AuthUser, token: string) => void
}

export default function Login({ onLogin }: Props) {
  const [tab, setTab] = useState<"login" | "signup">("login")

  // Demo mode (remove before deployment)
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
            onClick={() => setTab("login")}
          >
            Log In
          </button>
          <button
            className={`login-tab ${tab === "signup" ? "active" : ""}`}
            onClick={() => setTab("signup")}
          >
            Sign Up
          </button>
          <div className={`login-tab-indicator ${tab === "signup" ? "right" : "left"}`} />
        </div>

        {/* Form selection */}
        {tab === "login" ? (
          <LoginForm onLogin={onLogin} onSwitchToSignup={() => setTab("signup")} />
        ) : (
          <SignupForm onLogin={onLogin} onSwitchToLogin={() => setTab("login")} />
        )}

        {/* Demo mode button — REMOVE BEFORE DEPLOYMENT */}
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
      <AuthImagePanel />
    </div>
  )
}
