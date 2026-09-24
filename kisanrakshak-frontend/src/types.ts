// ── Auth ─────────────────────────────────────────────────────────────────────
export interface AuthUser {
  id: string
  fullName: string
  userId: string
  phone: string
  role: "user" | "admin" | "demo"
}

// ── Language ──────────────────────────────────────────────────────────────────
export type Lang = "en" | "hi" | "mr"

// ── Field Monitoring ──────────────────────────────────────────────────────────
export interface CropEntry {
  emoji: string
  name: string
  field: string
  status: string
  health: number
  stage: string
  statusClass: "good" | "warn" | "danger"
  disease?: string
  severity?: string
  efficacyStatus?: "Initial Scan" | "Improved" | "No Improvement / Persistent" | "Worsened"
  prescriptionsChanged?: boolean
  progressNotes?: string
  lastScanDate?: string
}

// ── Chat ──────────────────────────────────────────────────────────────────────
export interface ChatMessage {
  role: "bot" | "user"
  text: string
  sender?: string
}

// ── AI Analysis Result ────────────────────────────────────────────────────────
export interface HistoryComparison {
  hasHistory: boolean
  previousTreatmentWorked: boolean | null
  efficacyStatus: "Initial Scan" | "Improved" | "No Improvement / Persistent" | "Worsened"
  progressNotes: string
  prescriptionsChanged: boolean
  prescriptionReason: string
  previousScanDate: string | null
  previousDisease: string | null
  previousSeverity: string | null
  previousTreatments: string[]
}

export interface FinalResult {
  disease: string
  pathogen: string | null
  confidence: string
  severity: string
  symptoms: string[]
  treatment: string[]
  prevention: string[]
  icarRecommended: boolean
  datasetMatch: boolean
  overlapScore: number
  datasetsUsed: string[]
  agreementLevel: string
  historyComparison: HistoryComparison
}

export interface AnalysisResult {
  userId: string
  cropName: string
  growthStage: string
  location: string
  sowingDate: string
  symptoms: string
  imageReceived: boolean
  aiResult: {
    source: string
    disease: string
    confidence: string
    severity: string
    symptoms: string[]
    treatment: string[]
    prevention: string[]
    reasoning: string
  }
  datasetResult: {
    source: string
    datasets: string[]
    disease: string
    pathogen: string | null
    severity: string
    knownSymptoms: string[]
    treatment: string[]
    prevention: string[]
    icarRecommended: boolean
    cropImportance: string
  } | null
  finalResult: FinalResult
  historyComparison: HistoryComparison
  pastScansTimeline: object[]
  comparison: {
    overlapScore: number
    agreementLevel: string
    datasetFound: boolean
    cropInDatabase: string | null
    datasetsConsulted: string[]
  }
}

