// ── Shared auth types (exported as a plain object trick for Vite OXC compat) ─
export interface AuthUser {
  id: string
  fullName: string
  userId: string
  phone: string
  role: "user" | "admin" | "demo"
}

