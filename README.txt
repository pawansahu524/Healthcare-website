╔══════════════════════════════════════════════════════════╗
║           VitalWatch — Health Monitoring System          ║
║                    Version 1.0                           ║
╚══════════════════════════════════════════════════════════╝

📁 FOLDER STRUCTURE
─────────────────────────────────
VitalWatch/
├── index.html        ← Main website (open this in browser)
├── manifest.json     ← PWA app manifest
├── sw.js             ← Service Worker (offline support)
├── README.txt        ← This file
└── icons/            ← App icons (PWA install icons)
    ├── icon-72.png
    ├── icon-96.png
    ├── icon-128.png
    ├── icon-144.png
    ├── icon-152.png
    ├── icon-192.png
    ├── icon-384.png
    └── icon-512.png

──────────────────────────────────────────────
🚀 HOW TO OPEN
──────────────────────────────────────────────
1. Simply double-click index.html to open in browser
2. OR drag index.html into Chrome/Edge/Firefox

For PWA install (phone/desktop app):
• Serve with a local server:
    npx serve .
    OR python3 -m http.server 8080
• Open http://localhost:8080 in Chrome
• Click "Install" banner or ⋮ menu → "Install VitalWatch"

──────────────────────────────────────────────
🔐 DEMO LOGIN CREDENTIALS
──────────────────────────────────────────────
Patient Login:
  ID       →  VW-2024-001
  Password →  patient123

Doctor Login:
  ID       →  DR-001
  Password →  doctor123

──────────────────────────────────────────────
✨ FEATURES INCLUDED
──────────────────────────────────────────────
📊 Dashboard
  • Live vitals — Heart Rate, BP, Temperature, SpO₂
  • Real-time charts (Chart.js)
  • RPi ON/OFF toggle with offline overlay
  • Sensor event log
  • SpO₂ gauge

🗺️ Find Doctors & Chemists
  • Leaflet.js map (OpenStreetMap — no API key)
  • GPS real user location (browser permission)
  • 6 Doctors with specialty filters
  • 8 Chemists (Apollo, MedPlus, 1mg, Netmeds etc.)
  • Chemist website links (open in new tab)
  • 24hr / Ayurvedic / Online filters
  • Name search for chemists
  • Real distance calculation (Haversine formula)

📤 Patient Health Portal
  • Secure login
  • Vitals snapshot
  • Select doctor & send health report
  • Skin/body image capture (camera or upload)
  • Voice input for notes
  • View doctor messages

🩺 Doctor View
  • Secure login
  • Patient list with unread indicators
  • View patient vitals + reports
  • View skin images (with lightbox)
  • Send notes/messages to patient

🌐 Multilanguage (12 languages)
  English, Hindi, Marathi, Gujarati, Tamil,
  Telugu, Bengali, Kannada, Spanish, French,
  Arabic (RTL), Chinese

🎙️ Voice Recognition
  • Global navigation by voice
  • Voice-to-text in patient note field
  • Works in selected language

📄 PDF Report
  • Download full health report as PDF
  • Includes vitals, history table, RPi info

🌙☀️ Dark / Light Mode toggle

──────────────────────────────────────────────
🔧 CONNECT REAL RPi SENSOR DATA
──────────────────────────────────────────────
In index.html, find generateSensorData() function
and replace with:

  const res = await fetch('http://192.168.1.105:5000/data');
  const data = await res.json();
  return data; // { hr, sbp, dbp, temp, spo2 }

──────────────────────────────────────────────
Built with ❤️  using HTML + CSS + JavaScript
No frameworks, no npm, no build step needed!
──────────────────────────────────────────────
