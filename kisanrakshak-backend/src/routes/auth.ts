import { Router, Request, Response } from "express"
import jwt from "jsonwebtoken"
import User from "../models/User"

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || "kisanrakshak_secret_dev"
const JWT_EXPIRES = "7d"

function makeToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES })
}

// ── POST /api/auth/signup ────────────────────────────────────────────────────
router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { fullName, userId, phone, password } = req.body

    if (!fullName || !userId || !phone || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" })
    }
    if (!/^[0-9]{10}$/.test(phone)) {
      return res.status(400).json({ success: false, message: "Phone must be exactly 10 digits" })
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" })
    }

    // Check duplicates
    const existingPhone = await User.findOne({ phone })
    if (existingPhone) {
      return res.status(409).json({ success: false, message: "A user with this phone number already exists" })
    }
    const existingId = await User.findOne({ userId: userId.toUpperCase() })
    if (existingId) {
      return res.status(409).json({ success: false, message: "This User ID is already taken — try a different one" })
    }

    const user = await User.create({ fullName, userId, phone, password })
    const token = makeToken({ id: user._id, userId: user.userId, role: user.role })

    res.status(201).json({
      success: true,
      message: "Account created successfully! Welcome to KisanRakshak 🌾",
      token,
      user: { id: user._id, fullName: user.fullName, userId: user.userId, phone: user.phone, role: user.role },
    })
  } catch (err: any) {
    console.error("Signup error:", err)
    res.status(500).json({ success: false, message: "Server error during signup" })
  }
})

// ── POST /api/auth/login ─────────────────────────────────────────────────────
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body   // identifier = userId OR phone

    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: "Please enter User ID / Phone and Password" })
    }

    // Find by userId OR phone
    const user = await User.findOne({
      $or: [
        { userId: identifier.toUpperCase() },
        { phone: identifier }
      ]
    })

    if (!user) {
      return res.status(401).json({ success: false, message: "No account found with that User ID or Phone number" })
    }

    const match = await user.comparePassword(password)
    if (!match) {
      return res.status(401).json({ success: false, message: "Incorrect password. Please try again" })
    }

    const token = makeToken({ id: user._id, userId: user.userId, role: user.role })

    res.json({
      success: true,
      message: `Welcome back, ${user.fullName}! 🌾`,
      token,
      user: { id: user._id, fullName: user.fullName, userId: user.userId, phone: user.phone, role: user.role },
    })
  } catch (err: any) {
    console.error("Login error:", err)
    res.status(500).json({ success: false, message: "Server error during login" })
  }
})

// ── GET /api/auth/verify ─────────────────────────────────────────────────────
router.get("/verify", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "No token" })
    }
    const token = authHeader.split(" ")[1]
    const decoded = jwt.verify(token, JWT_SECRET) as any
    const user = await User.findById(decoded.id).select("-password")
    if (!user) return res.status(401).json({ success: false, message: "User not found" })
    res.json({ success: true, user: { id: user._id, fullName: user.fullName, userId: user.userId, phone: user.phone, role: user.role } })
  } catch {
    res.status(401).json({ success: false, message: "Invalid or expired token" })
  }
})

export default router

