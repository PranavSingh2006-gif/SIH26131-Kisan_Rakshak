import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Login from './Login.tsx'
import type { AuthUser } from './types'

const API = "http://localhost:5000/api/auth"

function Root() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [_token, setToken] = useState<string | null>(null)
  const [checking, setChecking] = useState(true)

  // On mount: check for saved JWT
  useEffect(() => {
    const saved = localStorage.getItem("kr_token")
    const savedUser = localStorage.getItem("kr_user")
    if (!saved || !savedUser) { setChecking(false); return }

    // Demo token — restore directly without network call
    if (saved === "demo_token") {
      setUser(JSON.parse(savedUser))
      setToken(saved)
      setChecking(false)
      return
    }

    // Verify real JWT with backend
    fetch(`${API}/verify`, { headers: { Authorization: `Bearer ${saved}` } })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setUser(data.user)
          setToken(saved)
        } else {
          localStorage.removeItem("kr_token")
          localStorage.removeItem("kr_user")
        }
      })
      .catch(() => {
        // Backend offline — restore from localStorage silently
        setUser(JSON.parse(savedUser))
        setToken(saved)
      })
      .finally(() => setChecking(false))
  }, [])

  const handleLogin = (u: AuthUser, t: string) => {
    localStorage.setItem("kr_token", t)
    localStorage.setItem("kr_user", JSON.stringify(u))
    setUser(u)
    setToken(t)
  }

  const handleLogout = () => {
    localStorage.removeItem("kr_token")
    localStorage.removeItem("kr_user")
    setUser(null)
    setToken(null)
  }

  if (checking) {
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        height: "100vh", background: "#f0fdf4", flexDirection: "column", gap: 12
      }}>
        <span style={{ fontSize: 36 }}>🌾</span>
        <p style={{ color: "#15803d", fontWeight: 700, fontFamily: "Inter, sans-serif", margin: 0 }}>
          Loading KisanRakshak…
        </p>
      </div>
    )
  }

  if (!user) return <Login onLogin={handleLogin} />

  return <App user={user} onLogout={handleLogout} />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
