// ── LoginForm.tsx ─────────────────────────────────────────────────────────────
// Handles login state, validation, and API call to /api/auth/login.
import { useState } from "react"
import type { AuthUser } from "../../types"

interface Props {
  onLogin: (user: AuthUser, token: string) => void
  onSwitchToSignup: () => void
}

const API = "http://localhost:5000/api/auth"

export default function LoginForm({ onLogin, onSwitchToSignup }: Props) {
  const [loginId, setLoginId] = useState("")
  const [loginPw, setLoginPw] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPw, setShowPw] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!loginId.trim() || !loginPw) {
      setError("Please enter your User ID / Phone and Password")
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: loginId.trim(), password: loginPw }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || "Login failed")
        return
      }
      onLogin(data.user, data.token)
    } catch {
      setError("Could not connect to server. Make sure the backend is running.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="login-form" onSubmit={handleSubmit} noValidate>
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
            type={showPw ? "text" : "password"}
            placeholder="Enter your password"
            value={loginPw}
            onChange={e => setLoginPw(e.target.value)}
            autoComplete="current-password"
          />
          <button type="button" className="pw-eye" onClick={() => setShowPw(v => !v)}>
            {showPw ? "🙈" : "👁"}
          </button>
        </div>
      </div>

      {error && <div className="auth-error">⚠ {error}</div>}

      <button className="login-btn primary" type="submit" disabled={loading}>
        {loading ? "Logging in…" : "Log In →"}
      </button>

      <p className="switch-tab">
        Don't have an account?{" "}
        <button type="button" className="link-btn" onClick={onSwitchToSignup}>
          Sign Up
        </button>
      </p>
    </form>
  )
}

