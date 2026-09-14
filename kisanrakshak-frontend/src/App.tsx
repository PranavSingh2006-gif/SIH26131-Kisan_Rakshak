import { useEffect, useState } from "react"
import "./App.css"
import HotspotSurveillance from "./components/HotspotSurveillance"
import IrrigationPlanner from "./components/IrrigationPlanner"

type Lang = "en" | "hi" | "mr"

// ── Crop emoji map ──────────────────────────────────────────
const CROP_EMOJI: Record<string, string> = {
  Tomato:"🍅", Potato:"🥔", Rice:"🌾", Wheat:"🌾", Cotton:"🌸",
  Maize:"🌽", Sugarcane:"🎋", Groundnut:"🥜", Mustard:"🌻",
  Chilli:"🌶", Onion:"🧅", Soybean:"🫘", Grape:"🍇", Banana:"🍌",
}

type CropEntry = {
  emoji: string; name: string; field: string
  status: string; health: number; stage: string
  statusClass: "good"|"warn"|"danger"
  disease?: string; severity?: string
}

const DEFAULT_CROPS: CropEntry[] = [
  { emoji:"🌾", name:"Wheat",   field:"Field A • 2.4 acres", status:"Healthy",   health:88, stage:"Tillering",  statusClass:"good"   },
  { emoji:"🫘", name:"Soybean", field:"Field B • 3.1 acres", status:"Monitor",   health:72, stage:"Flowering",  statusClass:"warn"   },
  { emoji:"🍅", name:"Tomato",  field:"Field C • 1.2 acres", status:"Healthy",   health:84, stage:"Fruiting",   statusClass:"good"   },
  { emoji:"🌽", name:"Maize",   field:"Field D • 2.0 acres", status:"Attention", health:59, stage:"Vegetative", statusClass:"danger" },
]

const text = {
  en: {
    app:"KISANRAKSHAK", sub:"Digital Agriculture Assistant", live:"LIVE AGRI ADVISORY",
    dashboard:"Farmer Dashboard", companion:"Smart crop companion", home:"Home", crops:"My Crops",
    pests:"Pest & Disease", hotspots:"Hotspot Map", weather:"Weather", irrigation:"Irrigation",
    schemes:"Government Schemes", experts:"Expert Advice", urgent:"Need urgent help?",
    urgentText:"Talk to an agriculture expert about a crop or pest problem.", connect:"Connect Expert",
    smart:"SMART FARM MANAGEMENT", greeting:"Good evening, Kisan 👋",
    hero:"One place for crop health, pest control, weather, irrigation and government support.",
    diagnose:"📷 Diagnose My Crop", alertTitle:"Rain & pest alert",
    alertText:"Rain is expected over the next few days. Avoid unnecessary spraying just before rainfall and inspect leaves for fungal infection after wet conditions.", dismiss:"Dismiss",
    myCrops:"My Crops", tasks:"Tasks Today", health:"Crop Health", good:"Good overall", priority:"1 high priority",
    local:"LOCAL FORECAST", weatherTitle:"Weather & Farm Advisory", refresh:"↻ Refresh", cloudy:"Cloudy", fieldRec:"Field recommendation",
    weatherAdvice:"Prioritize scouting and drainage. Plan pesticide application only when a dry spray window is available.", humidity:"Humidity 78% • Wind 11 km/h",
    protection:"CROP PROTECTION", pestTitle:"Pest & Disease Control", scan:"Scan photo", possible:"Possible: Leaf-eating caterpillar", found:"Found in 2 of your 4 monitored fields.", medium:"Priority: Medium",
    safe:"Expert-safe approach", pest1:"Inspect 5–10 plants in multiple field locations.", pest2:"Remove heavily affected leaves where practical.", pest3:"Use only a crop-labelled, locally approved product and follow its label dose/PPE.", pest4:"Don't spray immediately before expected rain.", expertDiagnosis:"Get Expert Diagnosis →",
    monitoring:"FIELD MONITORING", track:"Track crop stage, health, irrigation and upcoming actions.", scanCrop:"📷 Scan Crop", fieldTasks:"View field tasks →",
    water:"WATER MANAGEMENT", irrigationTitle:"Irrigation Planner", irrigationDesc:"Use weather, crop stage and soil observations to plan irrigation.", optimize:"Optimize Schedule",
    govt:"GOVERNMENT SUPPORT", finder:"Scheme Finder", finderDesc:"Find relevant agricultural schemes, eligibility information and application guidance.", eligibility:"Check Eligibility",
    human:"HUMAN + DIGITAL SUPPORT", askExpert:"Ask a Pest Control Expert", askDesc:"Describe the symptom or upload a crop photo. The platform combines guided triage with expert support.",
    scanTitle:"Diagnose My Crop", scanDesc:"Upload a clear crop image and provide basic field details for AI-assisted analysis.", upload:"Click to upload crop image", choose:"Choose Image", crop:"Crop", stage:"Growth Stage", location:"Location", sowing:"Sowing Date", symptoms:"Visible symptoms", optional:"Optional", analyze:"Analyze with AI", analyzing:"Analyzing…", close:"× Close",
    addToDashboard:"✅ Add to My Crop Dashboard",
    result:"AI Analysis", confidence:"Confidence", severity:"Severity", treatment:"Treatment", prevention:"Prevention", observed:"Observed Symptoms", uncertain:"Uncertain",
    icarApproved:"ICAR Approved", datasetsUsed:"Datasets Used",
    wheat:"Wheat", soybean:"Soybean", tomato:"Tomato", maize:"Maize", tillering:"Tillering", flowering:"Flowering", fruiting:"Fruiting", vegetative:"Vegetative",
  },
  hi: {
    app:"किसानरक्षक", sub:"डिजिटल कृषि सहायक", live:"लाइव कृषि सलाह",
    dashboard:"किसान डैशबोर्ड", companion:"स्मार्ट फसल साथी", home:"होम", crops:"मेरी फसलें",
    pests:"कीट और रोग", hotspots:"हॉटस्पॉट मैप", weather:"मौसम", irrigation:"सिंचाई",
    schemes:"सरकारी योजनाएं", experts:"विशेषज्ञ सलाह", urgent:"तुरंत मदद चाहिए?",
    urgentText:"फसल या कीट की समस्या पर कृषि विशेषज्ञ से बात करें।", connect:"विशेषज्ञ से जुड़ें",
    smart:"स्मार्ट फार्म प्रबंधन", greeting:"शुभ संध्या, किसान 👋",
    hero:"फसल स्वास्थ्य, कीट नियंत्रण, मौसम, सिंचाई और सरकारी सहायता—सब एक जगह।",
    diagnose:"📷 अपनी फसल की जांच करें", alertTitle:"बारिश और कीट चेतावनी",
    alertText:"अगले कुछ दिनों में बारिश की संभावना है। बारिश से ठीक पहले अनावश्यक छिड़काव न करें और गीली परिस्थितियों के बाद पत्तियों में फंगल संक्रमण की जांच करें।", dismiss:"हटाएं",
    myCrops:"मेरी फसलें", tasks:"आज के कार्य", health:"फसल स्वास्थ्य", good:"कुल मिलाकर अच्छा", priority:"1 उच्च प्राथमिकता",
    local:"स्थानीय पूर्वानुमान", weatherTitle:"मौसम और खेत सलाह", refresh:"↻ रिफ्रेश", cloudy:"बादल", fieldRec:"खेत के लिए सुझाव",
    weatherAdvice:"निगरानी और जल निकासी को प्राथमिकता दें। कीटनाशक का उपयोग तभी करें जब सूखे मौसम की उचित अवधि उपलब्ध हो।", humidity:"नमी 78% • हवा 11 किमी/घंटा",
    protection:"फसल सुरक्षा", pestTitle:"कीट और रोग नियंत्रण", scan:"फोटो स्कैन करें", possible:"संभावित: पत्ती खाने वाली इल्ली", found:"आपके 4 मॉनिटर किए गए खेतों में से 2 में पाई गई।", medium:"प्राथमिकता: मध्यम",
    safe:"विशेषज्ञ-सुरक्षित तरीका", pest1:"खेत के अलग-अलग स्थानों पर 5–10 पौधों की जांच करें।", pest2:"जहां संभव हो, बहुत प्रभावित पत्तियों को हटा दें।", pest3:"केवल फसल के लिए स्वीकृत स्थानीय उत्पाद का लेबल अनुसार उपयोग करें।", pest4:"बारिश से ठीक पहले छिड़काव न करें।", expertDiagnosis:"विशेषज्ञ जांच लें →",
    monitoring:"खेत निगरानी", track:"फसल अवस्था, स्वास्थ्य, सिंचाई और आने वाले कार्यों पर नजर रखें।", scanCrop:"📷 फसल स्कैन करें", fieldTasks:"खेत के कार्य देखें →",
    water:"जल प्रबंधन", irrigationTitle:"सिंचाई प्लानर", irrigationDesc:"मौसम, फसल अवस्था और मिट्टी की स्थिति के आधार पर सिंचाई की योजना बनाएं।", optimize:"शेड्यूल अनुकूलित करें",
    govt:"सरकारी सहायता", finder:"योजना खोजक", finderDesc:"कृषि योजनाएं, पात्रता और आवेदन संबंधी जानकारी खोजें।", eligibility:"पात्रता जांचें",
    human:"मानव + डिजिटल सहायता", askExpert:"कीट नियंत्रण विशेषज्ञ से पूछें", askDesc:"लक्षण बताएं या फसल की फोटो अपलोड करें। प्लेटफॉर्म मार्गदर्शित जांच और विशेषज्ञ सहायता को जोड़ता है।",
    scanTitle:"अपनी फसल की जांच करें", scanDesc:"AI-सहायता प्राप्त विश्लेषण के लिए साफ फसल फोटो और खेत की जानकारी दें।", upload:"फसल की फोटो अपलोड करने के लिए क्लिक करें", choose:"फोटो चुनें", crop:"फसल", stage:"फसल अवस्था", location:"स्थान", sowing:"बुवाई की तारीख", symptoms:"दिखने वाले लक्षण", optional:"वैकल्पिक", analyze:"AI से विश्लेषण करें", analyzing:"विश्लेषण हो रहा है…", close:"× बंद करें",
    addToDashboard:"✅ मेरे क्रॉप डैशबोर्ड में जोड़ें",
    result:"AI विश्लेषण", confidence:"विश्वास स्तर", severity:"गंभीरता", treatment:"उपचार", prevention:"बचाव", observed:"देखे गए लक्षण", uncertain:"अनिश्चित",
    icarApproved:"ICAR अनुमोदित", datasetsUsed:"उपयोग किए डेटासेट",
    wheat:"गेहूं", soybean:"सोयाबीन", tomato:"टमाटर", maize:"मक्का", tillering:"टिलरिंग", flowering:"फूल अवस्था", fruiting:"फल अवस्था", vegetative:"वानस्पतिक अवस्था",
  },
  mr: {
    app:"किसानरक्षक", sub:"डिजिटल शेती सहाय्यक", live:"थेट कृषी सल्ला",
    dashboard:"शेतकरी डॅशबोर्ड", companion:"स्मार्ट पीक सोबती", home:"मुख्यपृष्ठ", crops:"माझी पिके",
    pests:"किड व रोग", hotspots:"हॉटस्पॉट नकाशा", weather:"हवामान", irrigation:"सिंचन",
    schemes:"शासकीय योजना", experts:"तज्ञ सल्ला", urgent:"तातडीची मदत हवी आहे का?",
    urgentText:"पीक किंवा कीड समस्येबाबत कृषी तज्ञाशी बोला.", connect:"तज्ञाशी जोडा",
    smart:"स्मार्ट शेत व्यवस्थापन", greeting:"शुभ संध्याकाळ, शेतकरी 👋",
    hero:"पीक आरोग्य, कीड नियंत्रण, हवामान, सिंचन आणि शासकीय सहाय्य — सर्व एकाच ठिकाणी.",
    diagnose:"📷 माझ्या पिकाचे निदान करा", alertTitle:"पाऊस आणि कीड सूचना",
    alertText:"पुढील काही दिवसांत पावसाची शक्यता आहे. पावसाआधी अनावश्यक फवारणी टाळा आणि ओल्या परिस्थितीनंतर पानांवर बुरशीजन्य संसर्गाची तपासणी करा.", dismiss:"बंद करा",
    myCrops:"माझी पिके", tasks:"आजची कामे", health:"पीक आरोग्य", good:"एकूण चांगले", priority:"1 उच्च प्राधान्य",
    local:"स्थानिक अंदाज", weatherTitle:"हवामान व शेत सल्ला", refresh:"↻ रिफ्रेश", cloudy:"ढगाळ", fieldRec:"शेतासाठी शिफारस",
    weatherAdvice:"सर्वेक्षण व निचऱ्याला प्राधान्य द्या. कीटकनाशक फवारणी फक्त कोरड्या वेळेतच करा.", humidity:"आर्द्रता 78% • वारा 11 किमी/तास",
    protection:"पीक संरक्षण", pestTitle:"कीड व रोग नियंत्रण", scan:"फोटो स्कॅन करा", possible:"संभाव्य: पान खाणारी अळी", found:"तुमच्या 4 निरीक्षण केलेल्या शेतांपैकी 2 मध्ये आढळले.", medium:"प्राधान्य: मध्यम",
    safe:"तज्ञ-सुरक्षित पद्धत", pest1:"शेतातील वेगवेगळ्या ठिकाणी 5–10 झाडांची तपासणी करा.", pest2:"जिथे शक्य असेल तिथे जास्त प्रभावित पाने काढा.", pest3:"फक्त पिकासाठी मान्यताप्राप्त स्थानिक उत्पाद लेबलनुसार वापरा.", pest4:"पाऊस येण्याआधी लगेच फवारणी करू नका.", expertDiagnosis:"तज्ञ निदान मिळवा →",
    monitoring:"शेत निरीक्षण", track:"पीक अवस्था, आरोग्य, सिंचन व येणाऱ्या कामांवर नजर ठेवा.", scanCrop:"📷 पीक स्कॅन करा", fieldTasks:"शेत कामे पहा →",
    water:"जल व्यवस्थापन", irrigationTitle:"सिंचन नियोजक", irrigationDesc:"हवामान, पीक अवस्था व मातीच्या निरीक्षणाच्या आधारे सिंचनाचे नियोजन करा.", optimize:"वेळापत्रक सुधारा",
    govt:"शासकीय सहाय्य", finder:"योजना शोधक", finderDesc:"संबंधित कृषी योजना, पात्रता माहिती व अर्ज मार्गदर्शन शोधा.", eligibility:"पात्रता तपासा",
    human:"मानव + डिजिटल सहाय्य", askExpert:"कीड नियंत्रण तज्ञाला विचारा", askDesc:"लक्षण सांगा किंवा पिकाचा फोटो अपलोड करा. प्लॅटफॉर्म मार्गदर्शित तपासणी व तज्ञ सहाय्य एकत्र आणतो.",
    scanTitle:"माझ्या पिकाचे निदान करा", scanDesc:"AI-सहाय्यित विश्लेषणासाठी स्पष्ट पीक प्रतिमा आणि मूलभूत शेत माहिती द्या.", upload:"पीक प्रतिमा अपलोड करण्यासाठी क्लिक करा", choose:"प्रतिमा निवडा", crop:"पीक", stage:"वाढीची अवस्था", location:"स्थान", sowing:"पेरणीची तारीख", symptoms:"दिसणारी लक्षणे", optional:"पर्यायी", analyze:"AI ने विश्लेषण करा", analyzing:"विश्लेषण होत आहे…", close:"× बंद करा",
    addToDashboard:"✅ माझ्या पीक डॅशबोर्डमध्ये जोडा",
    result:"AI विश्लेषण", confidence:"आत्मविश्वास पातळी", severity:"तीव्रता", treatment:"उपचार", prevention:"प्रतिबंध", observed:"निरीक्षित लक्षणे", uncertain:"अनिश्चित",
    icarApproved:"ICAR मान्यताप्राप्त", datasetsUsed:"वापरलेले डेटासेट",
    wheat:"गहू", soybean:"सोयाबीन", tomato:"टोमॅटो", maize:"मका", tillering:"फुटवा अवस्था", flowering:"फुलोरा अवस्था", fruiting:"फळ अवस्था", vegetative:"वनस्पती अवस्था",
  }
}

import type { AuthUser } from "./types"

export default function App({ user, onLogout }: { user: AuthUser; onLogout: () => void }) {
  const [lang, setLang] = useState<Lang>("en")
  const [dark, setDark] = useState(false)
  const [alertBanner, setAlertBanner] = useState(true)
  const [scanOpen, setScanOpen] = useState(false)
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState("")
  const [cropName, setCropName] = useState("")
  const [growthStage, setGrowthStage] = useState("")
  const [location, setLocation] = useState("")
  const [sowingDate, setSowingDate] = useState("")
  const [symptoms, setSymptoms] = useState("")
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<any>(null)
  const [toast, setToast] = useState("")
  const [errorToast, setErrorToast] = useState("")
  const [crops, setCrops] = useState<CropEntry[]>(DEFAULT_CROPS)
  const t = text[lang]

  useEffect(() => { document.body.classList.toggle("dark", dark) }, [dark])
  useEffect(() => { document.body.style.overflow = scanOpen ? "hidden" : "" }, [scanOpen])
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview) }, [preview])

  const showToast = (msg: string) => { setToast(msg); window.setTimeout(() => setToast(""), 2800) }
  const showErrorToast = (msg: string) => { setErrorToast(msg); window.setTimeout(() => setErrorToast(""), 3500) }
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  const openScan = () => { setAnalysis(null); setScanOpen(true) }
  const onImage = (file?: File) => { if (!file) return; setImage(file); if (preview) URL.revokeObjectURL(preview); setPreview(URL.createObjectURL(file)) }

  const runAnalysis = async () => {
    if (!image)       { showErrorToast(lang === "hi" ? "⚠ पहले फसल की फोटो चुनें" : lang === "mr" ? "⚠ आधी पिकाचा फोटो निवडा" : "⚠ Please upload a crop image before analyzing"); return }
    if (!cropName)    { showErrorToast(lang === "hi" ? "⚠ कृपया फसल का प्रकार चुनें" : lang === "mr" ? "⚠ कृपया पिकाचा प्रकार निवडा" : "⚠ Please select a crop type"); return }
    if (!growthStage) { showErrorToast(lang === "hi" ? "⚠ कृपया वृद्धि अवस्था चुनें" : lang === "mr" ? "⚠ कृपया वाढीची अवस्था निवडा" : "⚠ Please select a growth stage"); return }
    setLoading(true)
    try {
      const form = new FormData()
      form.append("image", image)
      form.append("cropName", cropName)
      form.append("growthStage", growthStage)
      form.append("location", location)
      form.append("sowingDate", sowingDate)
      form.append("symptoms", symptoms)
      const response = await fetch(`http://${window.location.hostname}:5000/api/analyze`, { method: "POST", body: form })
      const result = await response.json()
      if (!response.ok) throw new Error(result.message || "Analysis failed")
      setAnalysis(result.data || null)
      showToast(lang === "hi" ? "✅ AI विश्लेषण पूरा हुआ" : "✅ AI analysis completed")
    } catch (e: any) {
      showErrorToast("❌ " + (e.message || "Analysis failed. Please try again."))
    } finally { setLoading(false) }
  }

  // ── Add / update crop in Field Monitoring ───────────────────
  const addToDashboard = () => {
    const fin = analysis?.finalResult
    if (!fin) return
    const emoji = CROP_EMOJI[cropName] || "🌱"
    const sev = fin.severity || ""
    const statusClass: "good"|"warn"|"danger" =
      sev === "Low" ? "good" : sev === "Medium" ? "warn" : "danger"
    const status = sev === "Low" ? "Healthy" : sev === "Medium" ? "Monitor" : "Attention"
    const healthVal = sev === "Low" ? 85 : sev === "Medium" ? 68 : 45

    setCrops(prev => {
      const idx = prev.findIndex(c =>
        c.name.toLowerCase() === cropName.toLowerCase() &&
        c.stage.toLowerCase() === growthStage.toLowerCase()
      )
      const entry: CropEntry = {
        emoji, name: cropName,
        field: location ? `${location}` : `Field ${prev.length + 1}`,
        status, health: healthVal, stage: growthStage,
        statusClass,
        disease: fin.disease,
        severity: fin.severity,
      }
      if (idx >= 0) {
        const updated = [...prev]
        updated[idx] = entry
        return updated
      }
      return [...prev, entry]
    })

    const alreadyAdded = crops.find((c: CropEntry) => c.name.toLowerCase() === cropName.toLowerCase())
    showToast(
      lang === "hi"
        ? `✅ ${cropName} ${alreadyAdded ? "अपडेट" : "जोड़ा"} गया`
        : lang === "mr"
        ? `✅ ${cropName} ${alreadyAdded ? "अपडेट" : "जोडले"} गेले`
        : `✅ ${cropName} ${alreadyAdded ? "updated" : "added"} in Field Monitoring`
    )
    setScanOpen(false)
  }

  const removeCrop = (indexToRemove: number) => {
    const crop = crops[indexToRemove]
    setCrops(prev => prev.filter((_, i) => i !== indexToRemove))
    showToast(lang === "hi" ? `${crop?.name || "फसल"} खेत निगरानी से हटाई गई` : `${crop?.name || "Crop"} removed from Field Monitoring`)
  }

  return <div className="app-shell">
    {/* Demo mode ribbon — REMOVE BEFORE DEPLOYMENT */}
    {user.role === "demo" && (
      <div style={{background:"#fef08a",borderBottom:"1px solid #fde047",textAlign:"center",fontSize:"12px",fontWeight:700,padding:"5px",color:"#713f12",zIndex:200,position:"relative"}}>
        🚀 DEMO MODE — Data is not saved | <span style={{opacity:0.7}}>Remove this bar before deployment</span>
      </div>
    )}
    <header className="topbar">
      <div className="logo"><div className="logo-mark">🌾</div><div><b>{t.app}</b><small>{t.sub}</small></div></div>
      <div className="top-center"><span>📍 Jhansi, Uttar Pradesh</span><span className="live">● {t.live}</span></div>
      <div className="actions">
        <button
          onClick={() => setLang(lang === "en" ? "hi" : lang === "hi" ? "mr" : "en")}
          style={{fontWeight:700, fontSize:"12px", minWidth:"86px", display:"flex", alignItems:"center", gap:"4px", justifyContent:"center"}}
          title="Switch language"
        >
          {lang === "en" && <>🇮🇳 हिंदी</>}
          {lang === "hi" && <>🇮🇳 मराठी</>}
          {lang === "mr" && <>🇬🇧 English</>}
        </button>
        <button onClick={() => setDark(!dark)}>◐</button>
        {user.role === "admin" && (
          <span style={{background:"#1d4ed8",color:"#fff",fontSize:"11px",fontWeight:700,padding:"3px 10px",borderRadius:"999px"}}>👑 Admin</span>
        )}
        <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",lineHeight:1.2}}>
          <span style={{fontSize:"13px",fontWeight:700,color:"#15803d"}}>{user.fullName}</span>
          <span style={{fontSize:"11px",color:"#9ca3af"}}>{user.userId}</span>
        </div>
        <button
          onClick={onLogout}
          style={{background:"#fee2e2",color:"#b91c1c",border:"none",borderRadius:"8px",padding:"6px 12px",fontWeight:700,fontSize:"12px",cursor:"pointer"}}
        >
          Logout
        </button>
        <div className="avatar">{user.fullName.charAt(0).toUpperCase()}</div>
      </div>
    </header>

    <aside className="sidebar">
      <div className="farmer-card"><div className="avatar big">KR</div><div><b>{t.dashboard}</b><small>{t.companion}</small></div></div>
      <nav>
        <a className="active" href="#home">⌂ <span>{t.home}</span></a>
        <a href="#crops">🌱 <span>{t.crops}</span></a>
        <a href="#irrigation">💧 <span>{t.irrigation}</span></a>
        <a href="#hotspots">📍 <span>{t.hotspots}</span></a>
        <a href="#pests">🐛 <span>{t.pests}</span></a>
        <a href="#weather">☁ <span>{t.weather}</span></a>
        <a href="#schemes">▣ <span>{t.schemes}</span></a>
        <a href="#experts">👨‍🌾 <span>{t.experts}</span></a>
      </nav>
      <div className="side-help"><b>{t.urgent}</b><p>{t.urgentText}</p><button onClick={() => scrollTo("experts")}>{t.connect}</button></div>
    </aside>

    <main>
      <section id="home" className="hero">
        <div><p className="eyebrow">{t.smart}</p><h1>{t.greeting}</h1><p className="hero-sub">{t.hero}</p></div>
        <button className="primary" onClick={openScan}>{t.diagnose}</button>
      </section>

      {alertBanner && (
        <section className="alert">
          <span className="alert-icon">⚠</span>
          <div><b>{t.alertTitle}</b><p>{t.alertText}</p></div>
          <button onClick={() => { setAlertBanner(false); showToast(t.dismiss) }}>{t.dismiss}</button>
        </section>
      )}

      <section className="stats">
        <div className="stat"><span>{t.myCrops}</span><strong>{crops.length}</strong><small>{crops.map(c => c.name).join(" • ")}</small></div>
        <div className="stat"><span>{t.tasks}</span><strong>3</strong><small className="amber">{t.priority}</small></div>
        <div className="stat"><span>{t.health}</span><strong>82%</strong><small className="green">{t.good}</small></div>
      </section>

      <section className="grid main-grid">
        {/* Weather */}
        <div className="card" id="weather">
          <div className="card-head"><div><p className="eyebrow">{t.local}</p><h2>{t.weatherTitle}</h2></div><button className="ghost" onClick={() => showToast(t.refresh)}>{t.refresh}</button></div>
          <div className="weather-main"><div className="temp">27°<small>{t.cloudy}</small></div><div className="weather-advice"><b>{t.fieldRec}</b><p>{t.weatherAdvice}</p><span>{t.humidity}</span></div></div>
          <div className="forecast">{[["Fri","🌧","32°","Rain"],["Sat","🌦","31°","Showers"],["Sun","🌦","30°","Showers"],["Mon","⛈","31°","Storm risk"],["Tue","🌦","32°","Rain"]].map(x=><div key={x[0]}><b>{x[0]}</b><span>{x[1]}</span><strong>{x[2]}</strong><small>{x[3]}</small></div>)}</div>
        </div>

        {/* Pest & Disease — scan button REMOVED from card-head */}
        <div className="card" id="pests">
          <div className="card-head"><div><p className="eyebrow">{t.protection}</p><h2>{t.pestTitle}</h2></div></div>
          <div className="pest-alert"><div className="pest-image">🐛</div><div><b>{t.possible}</b><p>{t.found}</p><strong>{t.medium}</strong></div></div>
          <div className="advice-box"><b>{t.safe}</b><ul><li>{t.pest1}</li><li>{t.pest2}</li><li>{t.pest3}</li><li>{t.pest4}</li></ul></div>
          <button className="wide secondary" onClick={() => scrollTo("experts")}>{t.expertDiagnosis}</button>
        </div>
      </section>

      {/* Field Monitoring — + Add Crop → 📷 Scan Crop */}
      <section id="crops" className="section">
        <div className="section-head">
          <div><p className="eyebrow">{t.monitoring}</p><h2>{t.crops}</h2><p>{t.track}</p></div>
          <button className="primary" onClick={openScan}>{t.scanCrop}</button>
        </div>
        <div className="crop-grid">
          {crops.map((c, i) => (
            <div className="crop-card" key={i}>
              <div className="crop-top">
                <span className="crop-emoji">{c.emoji}</span>
                <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                  <span className={`health ${c.statusClass}`}>{c.status}</span>
                  <button
                    className="crop-delete-btn"
                    onClick={(e) => { e.stopPropagation(); removeCrop(i); }}
                    title="Remove crop"
                    style={{
                      border:"none",
                      background:"#f3f4f6",
                      color:"#6b7280",
                      borderRadius:"50%",
                      width:"24px",
                      height:"24px",
                      cursor:"pointer",
                      fontSize:"14px",
                      fontWeight:"bold",
                      display:"inline-flex",
                      alignItems:"center",
                      justifyContent:"center",
                      padding:0,
                      lineHeight:1,
                      transition:"all 0.2s"
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#fee2e2"; e.currentTarget.style.color = "#dc2626" }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#f3f4f6"; e.currentTarget.style.color = "#6b7280" }}
                  >
                    ✕
                  </button>
                </div>
              </div>
              <h3>{c.name}</h3>
              <p>{c.field}</p>
              {c.disease && (
                <p style={{fontSize:"0.75rem",color:"#b45309",marginTop:"4px",fontWeight:600}}>⚠ {c.disease}{c.severity ? ` · ${c.severity}` : ""}</p>
              )}
              <div className="progress"><i style={{width:`${c.health}%`}} /></div>
              <div className="crop-meta"><span>Stage: {c.stage}</span><b>{c.health}%</b></div>
              <button onClick={() => showToast(`${c.name} task list opened`)}>{t.fieldTasks}</button>
            </div>
          ))}
        </div>
      </section>

      {/* ── Water Management — Smart Irrigation Planner ── */}
      <section id="irrigation" className="section">
        <IrrigationPlanner lang={lang} />
      </section>

      {/* ── District Surveillance — Maharashtra Pest & Disease Hotspots ── */}
      <section id="hotspots" className="section">
        <HotspotSurveillance />
      </section>

      <section id="schemes" className="section"><div className="section-head"><div><p className="eyebrow">{t.govt}</p><h2>{t.finder}</h2><p>{t.finderDesc}</p></div><button className="primary" onClick={() => showToast(lang === "hi" ? "पात्रता प्रश्नावली खोली गई" : "Eligibility questionnaire opened")}>{t.eligibility}</button></div><div className="scheme-grid">{[["💰","Income Support","Discover farmer income-support programmes available for eligible applicants."],["🛡","Crop Insurance","Explore crop-risk protection, enrollment windows and claim guidance."],["🚜","Farm Mechanization","Find subsidy and support programmes for eligible agricultural machinery."]].map(s=><div className="scheme" key={s[1]}><span>{s[0]}</span><div><b>{s[1]}</b><p>{s[2]}</p><button onClick={() => showToast("Scheme details opened")}>View details →</button></div></div>)}</div></section>

      <section id="experts" className="section"><div className="section-head"><div><p className="eyebrow">{t.human}</p><h2>{t.askExpert}</h2><p>{t.askDesc}</p></div><button className="primary" onClick={openScan}>{t.diagnose}</button></div><div className="expert-panel"><div className="expert-copy"><div className="expert-avatar">👨‍🌾</div><h3>{t.dashboard}</h3><p>{t.urgentText}</p><div className="expert-points"><span>AI crop scan</span><span>Weather context</span><span>Stage-specific advice</span><span>Multilingual support</span></div></div><div className="chat"><div className="chat-head">KisanRakshak Assistant <span className="online">● Online</span></div><div className="messages"><div className="msg bot">Share your crop, growth stage, affected plant part and a clear photo. I can help you decide what to inspect next.</div><div className="msg user">My tomato leaves have spots.</div><div className="msg bot">Upload a clear photo using Diagnose My Crop for AI-assisted analysis.</div></div><div className="chat-input"><input placeholder={lang === "hi" ? "अपना सवाल लिखें…" : "Type your question…"} onKeyDown={e => { if(e.key === "Enter") showToast(lang === "hi" ? "विशेषज्ञ चैट तैयार है" : "Expert chat is ready") }} /><button onClick={() => showToast(lang === "hi" ? "विशेषज्ञ चैट तैयार है" : "Expert chat is ready")}>Send</button></div></div></div></section>
    </main>

    {/* ── Scan Modal ─────────────────────────────────────────── */}
    {scanOpen && (
      <div className="scan-modal open">
        <div className="scan-box">
          <button className="close" onClick={() => setScanOpen(false)}>×</button>
          <p className="eyebrow">{t.scanTitle}</p>
          <h2>{t.scanTitle}</h2>
          <p>{t.scanDesc}</p>

          <label className="upload">
            {preview ? <img src={preview} alt="Crop preview" /> : <><span>📷</span><br />{t.upload}</>}
            <input type="file" accept="image/*" onChange={e => onImage(e.target.files?.[0])} />
          </label>

          <div className="form-grid">
            <select value={cropName} onChange={e => setCropName(e.target.value)} className={!cropName ? "placeholder-select" : ""}>
              <option value="" disabled>🌿 Select Crop Type…</option>
              <option value="Tomato">🍅 Tomato</option>
              <option value="Potato">🥔 Potato</option>
              <option value="Rice">🌾 Rice</option>
              <option value="Wheat">🌾 Wheat</option>
              <option value="Cotton">🌸 Cotton</option>
              <option value="Maize">🌽 Maize</option>
              <option value="Sugarcane">🎋 Sugarcane</option>
              <option value="Groundnut">🥜 Groundnut</option>
              <option value="Mustard">🌻 Mustard</option>
              <option value="Chilli">🌶 Chilli</option>
              <option value="Onion">🧅 Onion</option>
              <option value="Soybean">🫘 Soybean</option>
              <option value="Grape">🍇 Grape</option>
              <option value="Banana">🍌 Banana</option>
            </select>
            <select value={growthStage} onChange={e => setGrowthStage(e.target.value)} className={!growthStage ? "placeholder-select" : ""}>
              <option value="" disabled>📅 Select Growth Stage…</option>
              <option value="Seedling">🌱 Seedling</option>
              <option value="Vegetative">🌿 Vegetative</option>
              <option value="Tillering">🌾 Tillering</option>
              <option value="Flowering">🌸 Flowering</option>
              <option value="Fruiting">🍅 Fruiting</option>
              <option value="Grain filling">🌾 Grain Filling</option>
              <option value="Harvesting">🚜 Harvesting</option>
            </select>
          </div>
          <input className="field" placeholder={`📍 ${t.location}`} value={location} onChange={e => setLocation(e.target.value)} />
          <input className="field" type="date" value={sowingDate} onChange={e => setSowingDate(e.target.value)} />
          <textarea placeholder={`📝 ${t.symptoms} (${t.optional})`} value={symptoms} onChange={e => setSymptoms(e.target.value)} />

          {/* ── Result card (only shown after analysis) ── */}
          {analysis && (() => {
            const fin = analysis.finalResult
            if (!fin) return null

            const sevColor: Record<string, string> = { Low:"#22c55e", Medium:"#f59e0b", High:"#ef4444", "Very High":"#7c3aed" }
            const sc = sevColor[fin.severity] || "#6b7280"

            const Badge = ({bg, text: label}: {bg: string, text: string}) => (
              <span style={{background:bg,color:"#fff",borderRadius:"999px",padding:"2px 9px",fontSize:"0.7rem",fontWeight:700,whiteSpace:"nowrap"}}>{label}</span>
            )
            const SectionTitle = ({icon, label}: {icon: string, label: string}) => (
              <div style={{fontWeight:700,fontSize:"0.8rem",marginBottom:"4px"}}>{icon} {label}</div>
            )
            const List = ({items, ordered}: {items: string[], ordered?: boolean}) => ordered
              ? <ol style={{margin:"2px 0 0 16px",padding:0}}>{items.map((s,i) => <li key={i} style={{fontSize:"0.8rem",marginBottom:"3px",lineHeight:1.4}}>{s}</li>)}</ol>
              : <ul style={{margin:"2px 0 0 14px",padding:0}}>{items.map((s,i) => <li key={i} style={{fontSize:"0.8rem",marginBottom:"2px",lineHeight:1.4}}>{s}</li>)}</ul>

            return (
              <div style={{marginTop:"14px"}}>
                <div style={{border:"2px solid #fcd34d",borderRadius:"12px",padding:"14px",background:"linear-gradient(135deg,#fffbeb,#fefce8)"}}>
                  <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"10px",flexWrap:"wrap"}}>
                    <span style={{fontSize:"1.1rem"}}>⭐</span>
                    <span style={{fontWeight:800,fontSize:"0.95rem",color:"#92400e"}}>Result</span>
                    {fin.icarRecommended && <Badge bg="#1d4ed8" text={`🏛 ${t.icarApproved}`} />}
                  </div>

                  <div style={{fontWeight:800,fontSize:"1.05rem",color:"#78350f",marginBottom:"4px"}}>{fin.disease}</div>
                  {fin.pathogen && <div style={{fontSize:"0.75rem",color:"#92400e",marginBottom:"6px",fontStyle:"italic"}}>{fin.pathogen}</div>}

                  {/* 1. Confidence block — no Dataset badge */}
                  <div style={{display:"flex",gap:"10px",flexWrap:"wrap",marginBottom:"10px"}}>
                    <span style={{background:"#fef3c7",border:"1px solid #fcd34d",borderRadius:"6px",padding:"3px 10px",fontSize:"0.8rem"}}>
                      <b>Confidence:</b> {fin.confidence}
                    </span>
                    <span style={{background:sc+"22",color:sc,border:`1px solid ${sc}55`,borderRadius:"6px",padding:"3px 10px",fontSize:"0.8rem",fontWeight:700}}>
                      <b>Severity:</b> {fin.severity}
                    </span>
                  </div>

                  {fin.symptoms?.length > 0 && <div style={{marginBottom:"10px"}}>
                    <SectionTitle icon="🔍" label="Symptoms (👁 AI-observed · 📚 Dataset-known):" />
                    <List items={fin.symptoms} />
                  </div>}

                  {fin.treatment?.length > 0 && <div style={{marginBottom:"10px"}}>
                    <SectionTitle icon="💊" label={`${t.treatment}:`} />
                    <List items={fin.treatment} ordered />
                  </div>}

                  {fin.prevention?.length > 0 && <div style={{marginBottom:"8px"}}>
                    <SectionTitle icon="🛡" label={`${t.prevention}:`} />
                    <List items={fin.prevention} />
                  </div>}

                  {fin.datasetsUsed?.length > 0 && (
                    <div style={{fontSize:"0.72rem",color:"#78350f",borderTop:"1px solid #fcd34d",paddingTop:"6px",marginTop:"4px"}}>
                      📊 {t.datasetsUsed}: {fin.datasetsUsed.join(", ")}
                    </div>
                  )}
                </div>
              </div>
            )
          })()}

          {/* 2. Button: Analyze → Add to Dashboard after result */}
          {!analysis ? (
            <button className="wide primary" style={{marginTop:"14px"}} onClick={runAnalysis} disabled={loading}>
              {loading ? t.analyzing : t.analyze}
            </button>
          ) : (
            <button className="wide primary" style={{marginTop:"14px",background:"#15803d",borderColor:"#15803d"}} onClick={addToDashboard}>
              {t.addToDashboard}
            </button>
          )}
        </div>
      </div>
    )}

    {toast && <div className="toast show">{toast}</div>}
    {errorToast && <div className="toast error-toast show">{errorToast}</div>}
  </div>
}
