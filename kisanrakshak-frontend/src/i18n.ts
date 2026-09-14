import i18n from "i18next"
import { initReactI18next } from "react-i18next"

const resources = {
  en: {
    translation: {
      appName: "KisanRakshak AI",
      dashboard: "Dashboard",
      myFarms: "My Farms",
      cropScan: "Crop Scan",
      weather: "Weather",
      diseaseMap: "Disease Map",
      aiAssistant: "AI Assistant",
      alerts: "Alerts",

      namaste: "Namaste, Farmer 👋",
      overview: "Here's your crop health overview.",

      cropHealth: "Crop Health",
      good: "Good",
      diseaseRisk: "Disease Risk",
      high: "HIGH",
      earlyWarning: "Early warning detected",
      todaysWeather: "Today's Weather",
      humidity: "Humidity",

      checkCropHealth: "Check Your Crop Health 📸",
      uploadPhoto: "Upload a crop photo and let AI analyze possible diseases.",
      scanYourCrop: "📸 Scan Your Crop",

      scanner: "Crop Health Scanner 📸",
      scannerDescription:
        "Upload a clear photo of your crop leaf for AI analysis.",

      uploadCropImage: "Upload Crop Image",
      clearPhoto: "Take a clear photo of the affected leaf.",
      chooseImage: "Choose Image",
      chooseAnother: "Choose another image",
      imageSelected: "Crop image selected ✓",

      cropDetails: "🌱 Crop Details",
      betterAnalysis: "Tell us about your crop for better analysis.",

      cropName: "Crop Name",
      growthStage: "Growth Stage",
      location: "Location",
      sowingDate: "Sowing Date",
      symptoms: "Symptoms",
      optional: "Optional",

      selectCrop: "Select Crop",
      selectStage: "Select Stage",
      villageCity: "Village / City",

      analyze: "🔍 Analyze Crop with AI",
      sending: "⏳ Sending to AI Server...",

      analysisSubmitted: "Analysis Submitted",
      disease: "Detected Disease",
      confidence: "AI Confidence",
      severity: "Severity",
      observedSymptoms: "🌿 Observed Symptoms",
      treatment: "💊 Recommended Treatment",
      prevention: "🛡️ Prevention",

      editDetails: "← Edit Crop Details",

      betterResults: "💡 For better results",
      clearImage: "Use a clear, well-lit image.",
      affectedLeaf: "Keep the affected leaf visible.",
      avoidBlur: "Avoid blurry photographs.",
      cropOnly: "Try to capture only the crop, not the entire field.",
    },
  },

  hi: {
    translation: {
      appName: "किसानरक्षक AI",
      dashboard: "डैशबोर्ड",
      myFarms: "मेरे खेत",
      cropScan: "फसल स्कैन",
      weather: "मौसम",
      diseaseMap: "रोग मानचित्र",
      aiAssistant: "AI सहायक",
      alerts: "सूचनाएँ",

      namaste: "नमस्ते, किसान जी 👋",
      overview: "यह आपकी फसल के स्वास्थ्य का विवरण है।",

      cropHealth: "फसल स्वास्थ्य",
      good: "अच्छा",
      diseaseRisk: "रोग का जोखिम",
      high: "अधिक",
      earlyWarning: "शुरुआती चेतावनी मिली",
      todaysWeather: "आज का मौसम",
      humidity: "नमी",

      checkCropHealth: "अपनी फसल का स्वास्थ्य जाँचें 📸",
      uploadPhoto: "फसल की फोटो अपलोड करें और AI से संभावित रोगों की जाँच करवाएँ।",
      scanYourCrop: "📸 अपनी फसल स्कैन करें",

      scanner: "फसल स्वास्थ्य स्कैनर 📸",
      scannerDescription:
        "AI विश्लेषण के लिए अपनी फसल की पत्ती की साफ फोटो अपलोड करें।",

      uploadCropImage: "फसल की फोटो अपलोड करें",
      clearPhoto: "प्रभावित पत्ती की साफ फोटो लें।",
      chooseImage: "फोटो चुनें",
      chooseAnother: "दूसरी फोटो चुनें",
      imageSelected: "फसल की फोटो चुनी गई ✓",

      cropDetails: "🌱 फसल का विवरण",
      betterAnalysis: "बेहतर विश्लेषण के लिए अपनी फसल के बारे में जानकारी दें।",

      cropName: "फसल का नाम",
      growthStage: "विकास अवस्था",
      location: "स्थान",
      sowingDate: "बुवाई की तारीख",
      symptoms: "लक्षण",
      optional: "वैकल्पिक",

      selectCrop: "फसल चुनें",
      selectStage: "अवस्था चुनें",
      villageCity: "गाँव / शहर",

      analyze: "🔍 AI से फसल का विश्लेषण करें",
      sending: "⏳ AI सर्वर को भेज रहे हैं...",

      analysisSubmitted: "विश्लेषण पूरा हुआ",
      disease: "पहचाना गया रोग",
      confidence: "AI का विश्वास स्तर",
      severity: "गंभीरता",
      observedSymptoms: "🌿 देखे गए लक्षण",
      treatment: "💊 सुझाया गया उपचार",
      prevention: "🛡️ बचाव",

      editDetails: "← फसल का विवरण बदलें",

      betterResults: "💡 बेहतर परिणाम के लिए",
      clearImage: "साफ और अच्छी रोशनी वाली फोटो लें।",
      affectedLeaf: "प्रभावित पत्ती साफ दिखाई देनी चाहिए।",
      avoidBlur: "धुंधली फोटो से बचें।",
      cropOnly: "पूरे खेत के बजाय केवल फसल की फोटो लेने की कोशिश करें।",
    },
  },
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "hi",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n