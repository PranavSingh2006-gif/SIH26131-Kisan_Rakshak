import mongoose, { Document, Schema } from "mongoose"

export interface IHistoryComparison {
  hasHistory: boolean
  previousTreatmentWorked?: boolean | null
  efficacyStatus: "Initial Scan" | "Improved" | "No Improvement / Persistent" | "Worsened"
  progressNotes: string
  prescriptionsChanged: boolean
  prescriptionReason?: string
  previousScanDate?: Date
  previousDisease?: string
  previousSeverity?: string
  previousTreatments?: string[]
}

export interface ICropScanHistory extends Document {
  userId: string
  cropName: string
  growthStage: string
  location?: string
  sowingDate?: string
  symptoms?: string
  disease: string
  pathogen?: string | null
  confidence: string
  severity: string
  treatment: string[]
  prevention: string[]
  scanDate: Date
  historyComparison?: IHistoryComparison
  createdAt: Date
}

const CropScanHistorySchema = new Schema<ICropScanHistory>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    cropName: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    growthStage: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      default: "India",
    },
    sowingDate: {
      type: String,
    },
    symptoms: {
      type: String,
      default: "",
    },
    disease: {
      type: String,
      required: true,
    },
    pathogen: {
      type: String,
      default: null,
    },
    confidence: {
      type: String,
      required: true,
    },
    severity: {
      type: String,
      required: true,
    },
    treatment: {
      type: [String],
      default: [],
    },
    prevention: {
      type: [String],
      default: [],
    },
    scanDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
    historyComparison: {
      hasHistory: { type: Boolean, default: false },
      previousTreatmentWorked: { type: Boolean, default: null },
      efficacyStatus: {
        type: String,
        enum: ["Initial Scan", "Improved", "No Improvement / Persistent", "Worsened"],
        default: "Initial Scan",
      },
      progressNotes: { type: String, default: "" },
      prescriptionsChanged: { type: Boolean, default: false },
      prescriptionReason: { type: String, default: "" },
      previousScanDate: { type: Date },
      previousDisease: { type: String },
      previousSeverity: { type: String },
      previousTreatments: { type: [String], default: [] },
    },
  },
  { timestamps: true }
)

// Compound index to quickly fetch history for a specific user and crop
CropScanHistorySchema.index({ userId: 1, cropName: 1, scanDate: -1 })

export default mongoose.model<ICropScanHistory>("CropScanHistory", CropScanHistorySchema)

