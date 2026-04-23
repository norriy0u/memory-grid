# 🌌 Star Map — Personal Constellation Forge
**VishwaNova 2026 · National Level Weboreel AI Hackathon**

> The night you were born, the sky looked like this. Enter a date and location — we'll show you exactly what the stars saw.

## ✨ Features
- 🌠 **Live Star Field Renderer:** A full-viewport HTML5 Canvas renders thousands of stars using a seeded procedural noise function — star size, opacity, and twinkle frequency all vary based on magnitude data baked into the JS constants.
- 🔭 **Date + Location Input:** Enter any date and a city name. The page recalculates and re-renders a stylized night sky representation unique to that combination via coordinate-seeded random offsets.
- ✏️ **Draw Your Own Constellation:** Click any star to begin a line — drag across multiple stars to draw your own constellation. Named constellations are stored in `localStorage` and persist across sessions.
- 🎙️ **Name & Share:** Type a custom constellation name. A shareable URL is generated with all star coordinates and lines encoded as Base64 query params.
- 💫 **Shooting Star Mode:** A toggle fires randomized Canvas-drawn shooting stars at Poisson-distributed intervals across the viewport, each with a glowing gradient trail.

## 🛠️ Tech Stack
- **HTML5** — Canvas 2D API for all star/line rendering, localStorage API.
- **Vanilla CSS3** — Dark radial gradient sky background, glassmorphism control panel.
- **Vanilla JavaScript** — Seeded PRNG (xmur3 + mulberry32), coordinate math, Base64 URL encoder.

## 📸 Try It Out
Double-click `index.html` in any modern browser. Works fully offline.

---
Built with ❤️ for VishwaNova 2026
