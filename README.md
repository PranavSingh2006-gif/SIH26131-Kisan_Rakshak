# Kisan-Rakshak-agriscan-

> **Kisan Rakshak (AgriScan):** AI-powered crop pathology diagnostic platform with progressive disease tracking, smart irrigation scheduling, and adaptive treatment recommendations.

---

# Kisan Rakshak (AgriScan) Project

The project is structured into two completely independent, standalone modules:

```
HackDevenger/
├── agriscan-frontend/     # React + Vite + Tailwind CSS User Interface
├── agriscan-backend/      # Node.js + Nest.js + Gemini AI Pathology Engine
└── package.json           # Workspace helper scripts
```

---

## 1. Frontend (`agriscan-frontend`)
- **Location:** `./agriscan-frontend`
- **Tech Stack:** React 18, Vite 5, Tailwind CSS, Lucide Icons, Leaflet.
- **Port:** `5173` (with proxy to backend on `5000`)
- **Commands:**
  ```bash
  cd agriscan-frontend
  npm install
  npm run dev
  ```

---

## 2. Backend (`agriscan-backend`)
- **Location:** `./agriscan-backend`
- **Tech Stack:** Node.js, Express, Google GenAI SDK (`gemini-3.1-flash-lite`, etc.), CORS, Dotenv.
- **Port:** `5000`
- **Commands:**
  ```bash
  cd agriscan-backend
  npm install
  npm start
  ```

---

## 3. Running from Workspace Root
You can also launch either part directly from the root:
```bash
# Start frontend
npm run dev:frontend

# Start backend
npm run dev:backend

# Build frontend for production
npm run build:frontend
```
