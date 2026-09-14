import multer from "multer"
import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { GoogleGenAI } from "@google/genai"
import fs from "fs"
import path from "path"
import mongoose from "mongoose"
import authRouter from "./routes/auth"
import User from "./models/User"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI || ""

app.use(cors())
app.use(express.json())

const upload = multer({ storage: multer.memoryStorage() })

// ── Mount auth routes ───────────────────────────────────────────────────────
app.use("/api/auth", authRouter)

// ── Connect MongoDB + seed admin ────────────────────────────────────────────
async function connectDB() {
  if (!MONGO_URI || MONGO_URI.includes("cluster0.mongodb.net")) {
    console.warn("⚠️  No valid MONGO_URI set. Auth features require MongoDB Atlas.")
    console.warn("   👉 See kisanrakshak-backend/.env — replace MONGO_URI with your Atlas connection string.")
    return
  }
  try {
    await mongoose.connect(MONGO_URI)
    console.log("🍃 MongoDB connected")

    // Seed default admin (only if not exists)
    const adminExists = await User.findOne({ role: "admin" })
    if (!adminExists) {
      try {
        await User.create({
          fullName: "KisanRakshak Admin",
          userId: "ADMIN_001",
          phone: "0000000000",
          password: "admin@KR123",
          role: "admin",
        })
        console.log("🔑 Default admin seeded — userId: ADMIN_001 | phone: 0000000000 | password: admin@KR123")
      } catch {
        // Admin already exists (duplicate key) — safe to ignore
      }
    }
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err)
  }
}
connectDB()

// Gemini AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

// ─── Types ─────────────────────────────────────────────────────────────────────
interface Disease {
  name: string
  pathogen?: string
  aliases?: string[]
  severity_potential?: string
  symptoms: string[]
  favorable_conditions?: string
  growth_stages_affected?: string[]
  treatments?: string[]
  prevention?: string[]
  icar_recommendation?: boolean
}

interface CropEntry {
  local_names: string[]
  importance: string
  datasets_covered: string[]
  diseases: Disease[]
}

interface KnowledgeBase {
  _meta: { version: string; sources: string[]; indian_crops_priority: boolean }
  crops: Record<string, CropEntry>
}

// ─── Load Knowledge Base ────────────────────────────────────────────────────────
let knowledgeBase: KnowledgeBase | null = null
try {
  const kbPath = path.join(__dirname, "data", "disease_knowledge.json")
  knowledgeBase = JSON.parse(fs.readFileSync(kbPath, "utf-8"))
  console.log(`📚 Loaded knowledge base: ${Object.keys(knowledgeBase!.crops).length} crops`)
} catch {
  console.warn("⚠️ Could not load disease_knowledge.json")
}

// ─── KB Helpers ────────────────────────────────────────────────────────────────
function normalizeName(name: string) { return name.toLowerCase().trim() }

function findCropEntry(cropName: string): { key: string; entry: CropEntry } | null {
  if (!knowledgeBase) return null
  const n = normalizeName(cropName)
  for (const [key, entry] of Object.entries(knowledgeBase.crops)) {
    if (key === n || entry.local_names.some(ln => ln.toLowerCase() === n) || n.includes(key) || key.includes(n))
      return { key, entry }
  }
  return null
}

function findDiseaseInKB(cropMatch: { key: string; entry: CropEntry } | null, diseaseName: string): Disease | null {
  if (!cropMatch || !diseaseName) return null
  const n = normalizeName(diseaseName)
  for (const d of cropMatch.entry.diseases) {
    if (
      d.name.toLowerCase() === n ||
      (d.aliases || []).some(a => a.toLowerCase() === n) ||
      n.includes(d.name.toLowerCase()) ||
      d.name.toLowerCase().includes(n)
    ) return d
  }
  return null
}

/** Symptom text overlap score (0–100) between AI symptoms and KB symptoms */
function symptomOverlapScore(aiSymptoms: string[], kbSymptoms: string[]): number {
  if (!aiSymptoms.length || !kbSymptoms.length) return 0
  const kbWords = new Set(kbSymptoms.join(" ").toLowerCase().split(/\W+/).filter(w => w.length > 3))
  let matchCount = 0
  for (const s of aiSymptoms) {
    const aiWords = s.toLowerCase().split(/\W+/).filter(w => w.length > 3)
    if (aiWords.some(w => kbWords.has(w))) matchCount++
  }
  return Math.round((matchCount / Math.max(aiSymptoms.length, 1)) * 100)
}

/** Build dataset result from knowledge base for a given disease */
function buildDatasetResult(cropMatch: { key: string; entry: CropEntry } | null, disease: Disease | null, cropName: string) {
  if (!cropMatch || !disease) return null
  return {
    source: "Knowledge Base",
    datasets: cropMatch.entry.datasets_covered,
    disease: disease.name,
    pathogen: disease.pathogen || null,
    severity: disease.severity_potential || "Unknown",
    knownSymptoms: disease.symptoms || [],
    treatment: disease.treatments || [],
    prevention: disease.prevention || [],
    icarRecommended: !!disease.icar_recommendation,
    cropImportance: cropMatch.entry.importance,
  }
}

/** Merge AI + Dataset into a final best result */
function buildFinalResult(
  aiResult: any,
  datasetResult: ReturnType<typeof buildDatasetResult>,
  overlapScore: number
) {
  const hasDataset = !!datasetResult
  const highOverlap = overlapScore >= 50

  // Disease name: prefer AI (it sees the image), but use KB name if very close match
  const diseaseName = hasDataset ? datasetResult!.disease : aiResult.disease

  // Confidence: boost if dataset confirms
  let confidence = aiResult.confidence || "Unknown"
  if (hasDataset && highOverlap) {
    const num = parseInt(confidence)
    if (!isNaN(num)) confidence = `${Math.min(num + 8, 97)}% (Dataset Confirmed)`
    else confidence = `${confidence} (Dataset Confirmed)`
  }

  // Severity: use whichever is more specific (dataset has calibrated severity)
  const severity = (hasDataset && datasetResult!.severity !== "Unknown")
    ? datasetResult!.severity
    : aiResult.severity

  // Symptoms: union of AI-observed (what it actually sees) + KB known (educational)
  const aiSymptoms: string[] = aiResult.symptoms || []
  const kbSymptoms: string[] = hasDataset ? datasetResult!.knownSymptoms : []
  const allSymptoms = [
    ...aiSymptoms.map((s: string) => `👁 ${s}`),        // AI-observed
    ...kbSymptoms.slice(0, 3).map((s: string) => `📚 ${s}`)  // KB-known (up to 3)
  ]

  // Treatment: KB (ICAR-verified) preferred, AI supplements
  const kbTreatment = hasDataset ? datasetResult!.treatment : []
  const aiTreatment: string[] = aiResult.treatment || []
  const mergedTreatment = kbTreatment.length >= 2
    ? kbTreatment
    : [...kbTreatment, ...aiTreatment].slice(0, 5)

  // Prevention: same logic
  const kbPrevention = hasDataset ? datasetResult!.prevention : []
  const aiPrevention: string[] = aiResult.prevention || []
  const mergedPrevention = kbPrevention.length >= 2
    ? kbPrevention
    : [...kbPrevention, ...aiPrevention].slice(0, 4)

  return {
    disease: diseaseName,
    pathogen: hasDataset ? datasetResult!.pathogen : null,
    confidence,
    severity,
    symptoms: allSymptoms,
    treatment: mergedTreatment,
    prevention: mergedPrevention,
    icarRecommended: hasDataset ? datasetResult!.icarRecommended : (aiResult.icarRecommended || false),
    datasetMatch: hasDataset,
    overlapScore,
    datasetsUsed: hasDataset ? datasetResult!.datasets : [],
    agreementLevel: overlapScore >= 70 ? "High" : overlapScore >= 40 ? "Medium" : overlapScore > 0 ? "Low" : "None",
  }
}

function buildKnowledgeContext(cropMatch: { key: string; entry: CropEntry } | null): string {
  if (!cropMatch) return "NOTE: This crop is not in the Indian crops knowledge base. Use your general agricultural knowledge."
  const { key, entry } = cropMatch
  const diseaseList = entry.diseases.map((d, i) => {
    const lines = [
      `  ${i + 1}. ${d.name}${d.pathogen ? ` (${d.pathogen})` : ""}`,
      `     Aliases: ${(d.aliases || []).join(", ")}`,
      `     Key Symptoms: ${d.symptoms.slice(0, 3).join(" | ")}`,
    ]
    if (d.icar_recommendation) lines.push(`     ✓ ICAR Recommended`)
    return lines.join("\n")
  }).join("\n\n")

  return `VERIFIED KNOWLEDGE BASE (Sources: ${entry.datasets_covered.join(", ")} + ICAR)
Crop: ${key.toUpperCase()} — ${entry.importance}

KNOWN DISEASES (${entry.diseases.length} in database):
${diseaseList}

Use the EXACT disease name from this list if it matches what you see.`
}

// ─── Routes ────────────────────────────────────────────────────────────────────
app.get("/", (_req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>KisanRakshak Backend API</title>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; background: #f0fdf4; color: #166534; display: grid; place-content: center; height: 100vh; margin: 0; text-align: center; }
          .card { background: white; padding: 40px; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); max-width: 480px; border: 1px solid #bbf7d0; }
          h1 { margin-top: 0; font-size: 24px; color: #15803d; }
          p { color: #374151; font-size: 15px; line-height: 1.6; }
          .badge { display: inline-block; background: #dcfce7; color: #166534; font-weight: bold; padding: 6px 14px; border-radius: 999px; margin-bottom: 16px; font-size: 14px; }
          a.btn { display: inline-block; margin-top: 14px; background: #16a34a; color: white; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-weight: bold; }
          a.btn:hover { background: #15803d; }
          code { background: #f3f4f6; color: #1f2937; padding: 2px 6px; border-radius: 4px; font-size: 13px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="badge">● Status: Running</div>
          <h1>🌾 KisanRakshak Backend API</h1>
          <p>The backend server is live and accepting requests at port <code>5000</code>.</p>
          <p>For the user dashboard and UI, please open:</p>
          <a class="btn" href="http://localhost:5173" target="_blank">Go to Frontend UI (Port 5173) →</a>
          <p style="margin-top: 24px; font-size: 13px; color: #6b7280;">API Endpoints: <code>/api/health</code> | <code>/api/analyze</code></p>
        </div>
      </body>
    </html>
  `)
})

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "KisanRakshak API is running",
    knowledgeBase: knowledgeBase
      ? { loaded: true, crops: Object.keys(knowledgeBase.crops).length }
      : { loaded: false },
  })
})

app.post("/api/analyze", upload.single("image"), async (req, res) => {
  try {
    const { cropName, growthStage, symptoms } = req.body || {}
    const location  = req.body?.location  || "India"
    const sowingDate = req.body?.sowingDate || new Date().toISOString().slice(0, 10)

    if (!cropName || !growthStage) {
      return res.status(400).json({ success: false, message: "Crop type and growth stage are required" })
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Crop image is required" })
    }

    console.log("🌱 Analyzing:", { cropName, growthStage, location })

    // ── Step 1: KB lookup ──────────────────────────────────────────────────────
    const cropMatch = findCropEntry(cropName)
    if (cropMatch) console.log(`📖 KB match: "${cropMatch.key}" (${cropMatch.entry.diseases.length} diseases)`)
    else console.log(`📖 No KB match for "${cropName}"`)

    // ── Step 2: Gemini AI analysis (image-based) ───────────────────────────────
    const prompt = `You are an expert Indian agricultural crop disease diagnostician.

FARMER CONTEXT:
Crop: ${cropName} | Stage: ${growthStage} | Location: ${location} | Sowing: ${sowingDate}
Reported Symptoms: ${symptoms || "None"}

${buildKnowledgeContext(cropMatch)}

Analyze the image carefully. Return ONLY valid JSON (no markdown):
{
  "disease": "exact disease name or Healthy or Uncertain",
  "confidence": "percentage e.g. 85%",
  "severity": "Low, Medium, High, or Very High",
  "symptoms": ["visual symptom observed 1", "visual symptom observed 2", "visual symptom observed 3"],
  "treatment": ["treatment 1", "treatment 2", "treatment 3"],
  "prevention": ["prevention 1", "prevention 2"],
  "reasoning": "brief explanation of what you saw in the image"
}`

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: [{
        role: "user",
        parts: [
          { inlineData: { mimeType: req.file.mimetype, data: req.file.buffer.toString("base64") } },
          { text: prompt },
        ],
      }],
    })

    const aiText = response.text || ""
    console.log("🤖 AI:", aiText.substring(0, 200))

    let aiRaw: any
    try {
      aiRaw = JSON.parse(aiText.replace(/```json\n?|```\n?/g, "").trim())
    } catch {
      aiRaw = { disease: "Uncertain", confidence: "Unknown", severity: "Unknown", symptoms: [], treatment: [], prevention: [], reasoning: aiText }
    }

    // ── Step 3: Dataset lookup for the AI-identified disease ───────────────────
    const kbDisease = findDiseaseInKB(cropMatch, aiRaw.disease)
    const datasetResult = buildDatasetResult(cropMatch, kbDisease, cropName)

    // ── Step 4: Compute symptom overlap ───────────────────────────────────────
    const overlapScore = datasetResult
      ? symptomOverlapScore(aiRaw.symptoms || [], datasetResult.knownSymptoms)
      : 0

    console.log(`🔗 Overlap score: ${overlapScore}% | Dataset match: ${!!datasetResult}`)

    // ── Step 5: Build final merged result ─────────────────────────────────────
    const finalResult = buildFinalResult(aiRaw, datasetResult, overlapScore)

    // ── Step 6: Build AI-only result (clean, for comparison panel) ────────────
    const aiResult = {
      source: "Gemini AI Vision",
      disease: aiRaw.disease,
      confidence: aiRaw.confidence,
      severity: aiRaw.severity,
      symptoms: aiRaw.symptoms || [],
      treatment: aiRaw.treatment || [],
      prevention: aiRaw.prevention || [],
      reasoning: aiRaw.reasoning || "",
    }

    res.json({
      success: true,
      message: "Dual-source crop analysis completed",
      data: {
        cropName, growthStage, location, sowingDate,
        symptoms: symptoms || "",
        imageReceived: true,
        // Three result objects for the frontend
        aiResult,
        datasetResult,
        finalResult,
        // Meta
        comparison: {
          overlapScore,
          agreementLevel: finalResult.agreementLevel,
          datasetFound: !!datasetResult,
          cropInDatabase: cropMatch?.key || null,
          datasetsConsulted: datasetResult?.datasets || [],
        },
      },
    })
  } catch (error) {
    console.error("❌ Analysis error:", error)
    res.status(500).json({ success: false, message: "AI crop analysis failed" })
  }
})

app.listen(PORT as number, "0.0.0.0", () => {
  console.log(`🌾 KisanRakshak API running on http://0.0.0.0:${PORT}`)
})