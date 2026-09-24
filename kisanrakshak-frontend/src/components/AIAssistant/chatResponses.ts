// ── chatResponses.ts ──────────────────────────────────────────────────────────
// Standalone keyword-based response engine for the KisanRakshak AI assistant.
// Extracted from App.tsx getBotResponse() — pure logic, no React dependency.
// Extend this file to add new crop topics, languages, or response categories.
import type { Lang } from "../../types"

export function getBotResponse(input: string, _lang: Lang = "en"): string {
  const m = input.toLowerCase()

  if (/\b(hello|hi|namaste|namaskar|hey|नमस्ते|हेलो)\b/.test(m))
    return "Namaste! 🙏 I'm here to help with your crop health, pest and disease queries. Tell me — which crop are you growing and what problem have you noticed?"

  if (/\b(spot|spots|yellow|yellowing|blight|wilt|rot|rust|mold|mildew|fungus|lesion|brown|black|dead|dry|curl|curling|धब्बे|पीला|पीली|सूखना|सडन)\b/.test(m))
    return "Those sound like potential disease symptoms. Common causes include fungal blight, bacterial infection, or nutrient deficiency. 📸 Use **Diagnose My Crop** to upload a photo for AI analysis. Meanwhile, avoid overhead irrigation and ensure good air circulation."

  if (/\b(pest|insect|bug|worm|caterpillar|aphid|whitefly|mite|spider|thrips|borer|locust|कीट|इल्ली|माहू|सफेद मक्खी)\b/.test(m))
    return "Pest damage can spread quickly! 🐛 Check the underside of leaves for eggs or small insects. For sucking pests like aphids or whiteflies, neem-based spray (5 ml/L) works well. Upload a photo via **Diagnose My Crop** for precise identification and ICAR-approved treatment."

  if (/\b(tomato|टमाटर|टोमॅटो)\b/.test(m))
    return "Tomato is a common crop I help with! 🍅 Key issues include Early Blight, Late Blight, Leaf Curl Virus (TLCV), and Fusarium Wilt. Are you seeing spots on leaves, wilting, or fruit damage? Describe the symptoms or upload a photo."

  if (/\b(wheat|गेहूं|गहू)\b/.test(m))
    return "Wheat problems are often fungal. 🌾 Look out for Yellow Rust (stripe rust), Brown Rust, or Powdery Mildew. These show up as colored stripes or powdery patches on leaves. Early spraying with propiconazole can help. Upload a photo for confirmation."

  if (/\b(rice|paddy|chawal|dhan|धान|चावल)\b/.test(m))
    return "Rice faces threats from Blast disease, Bacterial Leaf Blight (BLB), Sheath Blight, and Brown Planthopper. 🌾 Early signs include water-soaked lesions or brown spots. Drain the field if BLB is suspected. Use the **Diagnose My Crop** scanner for AI-based identification."

  if (/\b(potato|aloo|आलू|बटाटा)\b/.test(m))
    return "Potato Late Blight (Phytophthora infestans) is the #1 concern — it spreads fast in wet, cool conditions. 🥔 Look for dark, water-soaked patches on leaves. Apply mancozeb or cymoxanil+mancozeb fungicide immediately. Upload a photo for accurate diagnosis."

  if (/\b(cotton|kapas|कपास|कापूस)\b/.test(m))
    return "Cotton crop issues include Bollworm, Whitefly (causing leaf curl), and Bacterial Blight. 🌸 For bollworm, use pheromone traps and Bt-based spray. For whitefly, apply imidacloprid sparingly. Upload a photo for AI-backed advice."

  if (/\b(maize|corn|makka|मक्का|मका)\b/.test(m))
    return "Maize faces Fall Armyworm (FAW), Northern Corn Leaf Blight, and Downy Mildew. 🌽 FAW damage shows as irregular holes with frass (excreta) in the whorl. Apply chlorpyrifos or lambda-cyhalothrin in the whorl. Upload a photo for precise guidance."

  if (/\b(rain|weather|cloud|humid|irrigation|water|पानी|बारिश|सिंचाई|हवामान)\b/.test(m))
    return "Weather affects crop health significantly. 🌦️ During high humidity and rain, fungal diseases like blight and mildew spread fast. Avoid spraying before rain. Check the **Weather & Farm Advisory** section for local forecast-linked recommendations."

  if (/\b(fertilizer|nutrient|nitrogen|urea|npk|manure|खाद|उर्वरक|खत)\b/.test(m))
    return "Proper nutrition is key to crop health. 🌱 Yellowing of older leaves often means nitrogen deficiency — apply urea (20-25 kg/acre). Reddish-purple color = phosphorus deficiency. For a soil-specific plan, visit your nearest KVK (Krishi Vigyan Kendra)."

  if (/\b(scheme|yojana|subsidy|pmfby|insurance|government|सब्सिडी|योजना|बीमा)\b/.test(m))
    return "Several government schemes support farmers! 🏛️ Key ones include **PM-KISAN** (income support), **PMFBY** (crop insurance), and **PMKSY** (irrigation subsidy). Visit the **Scheme Finder** section for eligibility check and application guidance."

  if (/\b(scan|diagnose|analyze|photo|image|picture|फोटो|स्कैन|निदान)\b/.test(m))
    return "Great idea! 📷 Use the **'Diagnose My Crop'** button at the top of the page. Upload a clear photo of the affected plant part, select crop type and growth stage — the AI will provide disease identification, severity rating, and ICAR-approved treatment."

  if (/\b(treatment|prescription|medicine|spray|fungicide|pesticide|herbicide|दवा|उपचार|इलाज|फवारणी)\b/.test(m))
    return "Treatment depends on the disease. 💊 For fungal diseases: copper oxychloride, mancozeb, or propiconazole. For bacterial: copper-based bactericides. Always follow label dosage and avoid spraying in rain or strong wind. For personalized treatment, run an AI scan."

  if (/\b(organic|natural|neem|jeevamrit|jivamrit|bio|जैविक|नीम|जीवामृत)\b/.test(m))
    return "Organic solutions are excellent! 🌿 Neem oil (5 ml/L + 1 ml soap emulsifier) controls aphids, whitefly, and mites. Jeevamrit boosts soil microbes. Trichoderma viride prevents soil-borne fungal disease. Apply in the evening to avoid leaf burn."

  if (/\b(thanks|thank you|dhanyawad|shukriya|धन्यवाद|शुक्रिया)\b/.test(m))
    return "You're welcome! 🙏 Feel free to ask anytime — healthy crops, happy farmer! If you need AI-powered analysis, use **Diagnose My Crop** for the most accurate results."

  return "I can help with crop diseases, pest control, weather advice, fertilizers, government schemes, and more. 🌾 Please describe your crop issue in detail (crop name + symptoms), or use **📷 Diagnose My Crop** for AI-powered photo analysis."
}
