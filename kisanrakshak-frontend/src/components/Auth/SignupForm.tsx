// ── SignupForm.tsx ────────────────────────────────────────────────────────────
// Handles signup state, validation, userId auto-suggestion, and API call.
import { useEffect, useState } from "react"
import type { AuthUser } from "../../types"

interface Props {
  onLogin: (user: AuthUser, token: string) => void
  onSwitchToLogin: () => void
}

const API = "http://localhost:5000/api/auth"

function suggestUserId(name: string, phone: string): string {
  const namePart = name.trim().toUpperCase().replace(/[^A-Z]/g, "").slice(0, 4)
  const phonePart = phone.replace(/\D/g, "").slice(-4)
  if (!namePart && !phonePart) return ""
  return `${namePart || "USER"}_${phonePart || "0000"}`
}

export default function SignupForm({ onLogin, onSwitchToLogin }: Props) {
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [userId, setUserId] = useState("")
  const [userIdEdited, setUserIdEdited] = useState(false)
  const [signupPw, setSignupPw] = useState("")
  const [confirmPw, setConfirmPw] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPw, setShowPw] = useState(false)

  // Auto-suggest userId as user types name/phone
  useEffect(() => {
    if (!userIdEdited) setUserId(suggestUserId(fullName, phone))
  }, [fullName, phone, userIdEdited])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!fullName.trim()) {
      setError("Please enter your full name")
      return
    }
    if (!/^[0-9]{10}$/.test(phone)) {
      setError("Phone number must be exactly 10 digits")
      return
    }
    if (!userId.trim()) {
      setError("Please enter a User ID")
      return
    }
    if (signupPw.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }
    if (signupPw !== confirmPw) {
      setError("Passwords do not match")
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`${API}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: fullName.trim(), userId: userId.trim(), phone, password: signupPw }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || "Sign up failed")
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
              type={showPw ? "text" : "password"}
              placeholder="At least 6 characters"
              value={signupPw}
              onChange={e => setSignupPw(e.target.value)}
              autoComplete="new-password"
            />
            <button type="button" className="pw-eye" onClick={() => setShowPw(v => !v)}>
              {showPw ? "🙈" : "👁"}
            </button>
          </div>
        </div>

        <div className="field-group">
          <label>Confirm Password</label>
          <div className="pw-wrap">
            <input
              type={showPw ? "text" : "password"}
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

      {error && <div className="auth-error">⚠ {error}</div>}

      <button className="login-btn primary" type="submit" disabled={loading}>
        {loading ? "Creating account…" : "Create Account →"}
      </button>

      <p className="switch-tab">
        Already have an account?{" "}
        <button type="button" className="link-btn" onClick={onSwitchToLogin}>
          Log In
        </button>
      </p>
    </form>
  )
}

