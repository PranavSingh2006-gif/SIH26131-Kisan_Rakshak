// ── KisanRakshak i18n — all UI text strings ──────────────────────────────────
// Usage: import { text } from "../i18n"
//        const t = text[lang]
import type { Lang } from "./types"

export const text: Record<Lang, {
  app: string; sub: string; live: string
  dashboard: string; companion: string; home: string; crops: string
  pests: string; hotspots: string; weather: string; irrigation: string
  schemes: string; experts: string; urgent: string
  urgentText: string; connect: string
  smart: string; greeting: string
  hero: string; diagnose: string; alertTitle: string
  alertText: string; dismiss: string
  myCrops: string; tasks: string; health: string; good: string; priority: string
  local: string; weatherTitle: string; refresh: string; cloudy: string; fieldRec: string
  weatherAdvice: string; humidity: string
  protection: string; pestTitle: string; scan: string; possible: string
  found: string; medium: string
  safe: string; pest1: string; pest2: string; pest3: string; pest4: string
  expertDiagnosis: string
  monitoring: string; track: string; scanCrop: string; fieldTasks: string
  water: string; irrigationTitle: string; irrigationDesc: string; optimize: string
  govt: string; finder: string; finderDesc: string; eligibility: string
  human: string; askExpert: string; askDesc: string
  scanTitle: string; scanDesc: string; upload: string; choose: string
  crop: string; stage: string; location: string; sowing: string
  symptoms: string; optional: string; analyze: string; analyzing: string; close: string
  addToDashboard: string
  result: string; confidence: string; severity: string; treatment: string
  prevention: string; observed: string; uncertain: string
  icarApproved: string; datasetsUsed: string
  wheat: string; soybean: string; tomato: string; maize: string
  tillering: string; flowering: string; fruiting: string; vegetative: string
}> = {
  en: {
    app: "KISANRAKSHAK", sub: "Digital Agriculture Assistant", live: "LIVE AGRI ADVISORY",
    dashboard: "Farmer Dashboard", companion: "Smart crop companion", home: "Home", crops: "My Crops",
    pests: "Pest & Disease", hotspots: "Hotspot Map", weather: "Weather", irrigation: "Irrigation",
    schemes: "Government Schemes", experts: "Expert Advice", urgent: "Need urgent help?",
    urgentText: "Talk to an agriculture expert about a crop or pest problem.", connect: "Connect Expert",
    smart: "SMART FARM MANAGEMENT", greeting: "Good evening, Kisan 👋",
    hero: "One place for crop health, pest control, weather, irrigation and government support.",
    diagnose: "📷 Diagnose My Crop", alertTitle: "Rain & pest alert",
    alertText: "Rain is expected over the next few days. Avoid unnecessary spraying just before rainfall and inspect leaves for fungal infection after wet conditions.", dismiss: "Dismiss",
    myCrops: "My Crops", tasks: "Tasks Today", health: "Crop Health", good: "Good overall", priority: "1 high priority",
    local: "LOCAL FORECAST", weatherTitle: "Weather & Farm Advisory", refresh: "↻ Refresh", cloudy: "Cloudy", fieldRec: "Field recommendation",
    weatherAdvice: "Prioritize scouting and drainage. Plan pesticide application only when a dry spray window is available.", humidity: "Humidity 78% • Wind 11 km/h",
    protection: "CROP PROTECTION", pestTitle: "Pest & Disease Control", scan: "Scan photo", possible: "Possible: Leaf-eating caterpillar", found: "Found in 2 of your 4 monitored fields.", medium: "Priority: Medium",
    safe: "Expert-safe approach", pest1: "Inspect 5–10 plants in multiple field locations.", pest2: "Remove heavily affected leaves where practical.", pest3: "Use only a crop-labelled, locally approved product and follow its label dose/PPE.", pest4: "Don't spray immediately before expected rain.", expertDiagnosis: "Get Expert Diagnosis →",
    monitoring: "FIELD MONITORING", track: "Track crop stage, health, irrigation and upcoming actions.", scanCrop: "📷 Scan Crop", fieldTasks: "View field tasks →",
    water: "WATER MANAGEMENT", irrigationTitle: "Irrigation Planner", irrigationDesc: "Use weather, crop stage and soil observations to plan irrigation.", optimize: "Optimize Schedule",
    govt: "GOVERNMENT SUPPORT", finder: "Scheme Finder", finderDesc: "Find relevant agricultural schemes, eligibility information and application guidance.", eligibility: "Check Eligibility",
    human: "HUMAN + DIGITAL SUPPORT", askExpert: "Ask a Pest Control Expert", askDesc: "Describe the symptom or upload a crop photo. The platform combines guided triage with expert support.",
    scanTitle: "Diagnose My Crop", scanDesc: "Upload a clear crop image and provide basic field details for AI-assisted analysis.", upload: "Click to upload crop image", choose: "Choose Image", crop: "Crop", stage: "Growth Stage", location: "Location", sowing: "Sowing Date", symptoms: "Visible symptoms", optional: "Optional", analyze: "Analyze with AI", analyzing: "Analyzing…", close: "× Close",
    addToDashboard: "✅ Add to My Crop Dashboard",
    result: "AI Analysis", confidence: "Confidence", severity: "Severity", treatment: "Treatment", prevention: "Prevention", observed: "Observed Symptoms", uncertain: "Uncertain",
    icarApproved: "ICAR Approved", datasetsUsed: "Datasets Used",
    wheat: "Wheat", soybean: "Soybean", tomato: "Tomato", maize: "Maize", tillering: "Tillering", flowering: "Flowering", fruiting: "Fruiting", vegetative: "Vegetative",
  },
  hi: {
    app: "किसानरक्षक", sub: "डिजिटल कृषि सहायक", live: "लाइव कृषि सलाह",
    dashboard: "किसान डैशबोर्ड", companion: "स्मार्ट फसल साथी", home: "होम", crops: "मेरी फसलें",
    pests: "कीट और रोग", hotspots: "हॉटस्पॉट मैप", weather: "मौसम", irrigation: "सिंचाई",
    schemes: "सरकारी योजनाएं", experts: "विशेषज्ञ सलाह", urgent: "तुरंत मदद चाहिए?",
    urgentText: "फसल या कीट की समस्या पर कृषि विशेषज्ञ से बात करें।", connect: "विशेषज्ञ से जुड़ें",
    smart: "स्मार्ट फार्म प्रबंधन", greeting: "शुभ संध्या, किसान 👋",
    hero: "फसल स्वास्थ्य, कीट नियंत्रण, मौसम, सिंचाई और सरकारी सहायता—सब एक जगह।",
    diagnose: "📷 अपनी फसल की जांच करें", alertTitle: "बारिश और कीट चेतावनी",
    alertText: "अगले कुछ दिनों में बारिश की संभावना है। बारिश से ठीक पहले अनावश्यक छिड़काव न करें और गीली परिस्थितियों के बाद पत्तियों में फंगल संक्रमण की जांच करें।", dismiss: "हटाएं",
    myCrops: "मेरी फसलें", tasks: "आज के कार्य", health: "फसल स्वास्थ्य", good: "कुल मिलाकर अच्छा", priority: "1 उच्च प्राथमिकता",
    local: "स्थानीय पूर्वानुमान", weatherTitle: "मौसम और खेत सलाह", refresh: "↻ रिफ्रेश", cloudy: "बादल", fieldRec: "खेत के लिए सुझाव",
    weatherAdvice: "निगरानी और जल निकासी को प्राथमिकता दें। कीटनाशक का उपयोग तभी करें जब सूखे मौसम की उचित अवधि उपलब्ध हो।", humidity: "नमी 78% • हवा 11 किमी/घंटा",
    protection: "फसल सुरक्षा", pestTitle: "कीट और रोग नियंत्रण", scan: "फोटो स्कैन करें", possible: "संभावित: पत्ती खाने वाली इल्ली", found: "आपके 4 मॉनिटर किए गए खेतों में से 2 में पाई गई।", medium: "प्राथमिकता: मध्यम",
    safe: "विशेषज्ञ-सुरक्षित तरीका", pest1: "खेत के अलग-अलग स्थानों पर 5–10 पौधों की जांच करें।", pest2: "जहां संभव हो, बहुत प्रभावित पत्तियों को हटा दें।", pest3: "केवल फसल के लिए स्वीकृत स्थानीय उत्पाद का लेबल अनुसार उपयोग करें।", pest4: "बारिश से ठीक पहले छिड़काव न करें।", expertDiagnosis: "विशेषज्ञ जांच लें →",
    monitoring: "खेत निगरानी", track: "फसल अवस्था, स्वास्थ्य, सिंचाई और आने वाले कार्यों पर नजर रखें।", scanCrop: "📷 फसल स्कैन करें", fieldTasks: "खेत के कार्य देखें →",
    water: "जल प्रबंधन", irrigationTitle: "सिंचाई प्लानर", irrigationDesc: "मौसम, फसल अवस्था और मिट्टी की स्थिति के आधार पर सिंचाई की योजना बनाएं।", optimize: "शेड्यूल अनुकूलित करें",
    govt: "सरकारी सहायता", finder: "योजना खोजक", finderDesc: "कृषि योजनाएं, पात्रता और आवेदन संबंधी जानकारी खोजें।", eligibility: "पात्रता जांचें",
    human: "मानव + डिजिटल सहायता", askExpert: "कीट नियंत्रण विशेषज्ञ से पूछें", askDesc: "लक्षण बताएं या फसल की फोटो अपलोड करें। प्लेटफॉर्म मार्गदर्शित जांच और विशेषज्ञ सहायता को जोड़ता है।",
    scanTitle: "अपनी फसल की जांच करें", scanDesc: "AI-सहायता प्राप्त विश्लेषण के लिए साफ फसल फोटो और खेत की जानकारी दें।", upload: "फसल की फोटो अपलोड करने के लिए क्लिक करें", choose: "फोटो चुनें", crop: "फसल", stage: "फसल अवस्था", location: "स्थान", sowing: "बुवाई की तारीख", symptoms: "दिखने वाले लक्षण", optional: "वैकल्पिक", analyze: "AI से विश्लेषण करें", analyzing: "विश्लेषण हो रहा है…", close: "× बंद करें",
    addToDashboard: "✅ मेरे क्रॉप डैशबोर्ड में जोड़ें",
    result: "AI विश्लेषण", confidence: "विश्वास स्तर", severity: "गंभीरता", treatment: "उपचार", prevention: "बचाव", observed: "देखे गए लक्षण", uncertain: "अनिश्चित",
    icarApproved: "ICAR अनुमोदित", datasetsUsed: "उपयोग किए डेटासेट",
    wheat: "गेहूं", soybean: "सोयाबीन", tomato: "टमाटर", maize: "मक्का", tillering: "टिलरिंग", flowering: "फूल अवस्था", fruiting: "फल अवस्था", vegetative: "वानस्पतिक अवस्था",
  },
  mr: {
    app: "किसानरक्षक", sub: "डिजिटल शेती सहाय्यक", live: "थेट कृषी सल्ला",
    dashboard: "शेतकरी डॅशबोर्ड", companion: "स्मार्ट पीक सोबती", home: "मुख्यपृष्ठ", crops: "माझी पिके",
    pests: "किड व रोग", hotspots: "हॉटस्पॉट नकाशा", weather: "हवामान", irrigation: "सिंचन",
    schemes: "शासकीय योजना", experts: "तज्ञ सल्ला", urgent: "तातडीची मदत हवी आहे का?",
    urgentText: "पीक किंवा कीड समस्येबाबत कृषी तज्ञाशी बोला.", connect: "तज्ञाशी जोडा",
    smart: "स्मार्ट शेत व्यवस्थापन", greeting: "शुभ संध्याकाळ, शेतकरी 👋",
    hero: "पीक आरोग्य, कीड नियंत्रण, हवामान, सिंचन आणि शासकीय सहाय्य — सर्व एकाच ठिकाणी.",
    diagnose: "📷 माझ्या पिकाचे निदान करा", alertTitle: "पाऊस आणि कीड सूचना",
    alertText: "पुढील काही दिवसांत पावसाची शक्यता आहे. पावसाआधी अनावश्यक फवारणी टाळा आणि ओल्या परिस्थितीनंतर पानांवर बुरशीजन्य संसर्गाची तपासणी करा.", dismiss: "बंद करा",
    myCrops: "माझी पिके", tasks: "आजची कामे", health: "पीक आरोग्य", good: "एकूण चांगले", priority: "1 उच्च प्राधान्य",
    local: "स्थानिक अंदाज", weatherTitle: "हवामान व शेत सल्ला", refresh: "↻ रिफ्रेश", cloudy: "ढगाळ", fieldRec: "शेतासाठी शिफारस",
    weatherAdvice: "सर्वेक्षण व निचऱ्याला प्राधान्य द्या. कीटकनाशक फवारणी फक्त कोरड्या वेळेतच करा.", humidity: "आर्द्रता 78% • वारा 11 किमी/तास",
    protection: "पीक संरक्षण", pestTitle: "कीड व रोग नियंत्रण", scan: "फोटो स्कॅन करा", possible: "संभाव्य: पान खाणारी अळी", found: "तुमच्या 4 निरीक्षण केलेल्या शेतांपैकी 2 मध्ये आढळले.", medium: "प्राधान्य: मध्यम",
    safe: "तज्ञ-सुरक्षित पद्धत", pest1: "शेतातील वेगवेगळ्या ठिकाणी 5–10 झाडांची तपासणी करा.", pest2: "जिथे शक्य असेल तिथे जास्त प्रभावित पाने काढा.", pest3: "फक्त पिकासाठी मान्यताप्राप्त स्थानिक उत्पाद लेबलनुसार वापरा.", pest4: "पाऊस येण्याआधी लगेच फवारणी करू नका.", expertDiagnosis: "तज्ञ निदान मिळवा →",
    monitoring: "शेत निरीक्षण", track: "पीक अवस्था, आरोग्य, सिंचन व येणाऱ्या कामांवर नजर ठेवा.", scanCrop: "📷 पीक स्कॅन करा", fieldTasks: "शेत कामे पहा →",
    water: "जल व्यवस्थापन", irrigationTitle: "सिंचन नियोजक", irrigationDesc: "हवामान, पीक अवस्था व मातीच्या निरीक्षणाच्या आधारे सिंचनाचे नियोजन करा.", optimize: "वेळापत्रक सुधारा",
    govt: "शासकीय सहाय्य", finder: "योजना शोधक", finderDesc: "संबंधित कृषी योजना, पात्रता माहिती व अर्ज मार्गदर्शन शोधा.", eligibility: "पात्रता तपासा",
    human: "मानव + डिजिटल सहाय्य", askExpert: "कीड नियंत्रण तज्ञाला विचारा", askDesc: "लक्षण सांगा किंवा पिकाचा फोटो अपलोड करा. प्लॅटफॉर्म मार्गदर्शित तपासणी व तज्ञ सहाय्य एकत्र आणतो.",
    scanTitle: "माझ्या पिकाचे निदान करा", scanDesc: "AI-सहाय्यित विश्लेषणासाठी स्पष्ट पीक प्रतिमा आणि मूलभूत शेत माहिती द्या.", upload: "पीक प्रतिमा अपलोड करण्यासाठी क्लिक करा", choose: "प्रतिमा निवडा", crop: "पीक", stage: "वाढीची अवस्था", location: "स्थान", sowing: "पेरणीची तारीख", symptoms: "दिसणारी लक्षणे", optional: "पर्यायी", analyze: "AI ने विश्लेषण करा", analyzing: "विश्लेषण होत आहे…", close: "× बंद करा",
    addToDashboard: "✅ माझ्या पीक डॅशबोर्डमध्ये जोडा",
    result: "AI विश्लेषण", confidence: "आत्मविश्वास पातळी", severity: "तीव्रता", treatment: "उपचार", prevention: "प्रतिबंध", observed: "निरीक्षित लक्षणे", uncertain: "अनिश्चित",
    icarApproved: "ICAR मान्यताप्राप्त", datasetsUsed: "वापरलेले डेटासेट",
    wheat: "गहू", soybean: "सोयाबीन", tomato: "टोमॅटो", maize: "मका", tillering: "फुटवा अवस्था", flowering: "फुलोरा अवस्था", fruiting: "फळ अवस्था", vegetative: "वनस्पती अवस्था",
  },
}