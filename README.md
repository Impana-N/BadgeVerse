# BADGEVERSE

> **A little world. A whole identity.**

An immersive, dreamy 3D web experience combining personality discovery, procedural digital identity customization, and smartphone-scannable vCard QR code event badge generation.

🌐 **Live Demo:** [https://badgeverse-sand.vercel.app](https://badgeverse-sand.vercel.app)

---

## ✨ Features

- **Immersive 3D Gateway**: Full-screen opening scene built with React Three Fiber, featuring drifting pastel clouds, floating sculptural islands, iridescent glass spheres, and celestial stardust responding to pointer movement.
- **Personality Discovery Quiz**: 5 interactive questions that deterministically calculate your personality archetype:
  - **The Dreamer** — Lavender, drifting clouds & poetic intuition
  - **The Creator** — Soft peach, butter yellow & tactile geometric forms
  - **The Explorer** — Mint, cosmic cobalt & celestial compass lines
  - **The Connector** — Warm peach, rose plum & resonant harmonic rings
  - **The Thinker** — Deep plum, crystalline cyan & faceted symmetry
  - **The Visionary** — Butter yellow, radiant gold & solar starburst
- **Real-Time 3D Identity Customization**:
  - 6 procedural 3D avatar emblems (*Solar Nova, Lumina Bloom, Opal Core, Mobius Prism, Prism Spire, Stratos Cloud*)
  - 6 cosmic accent color frequencies
  - 4 physical surface finishes (*Iridescent Glass, Ethereal Hologram, Velvet Soft Clay, Starlit Metallic*)
  - 3 event badge themes (*Dreamy Atmosphere, Creative Solar, Explorer Aurora*)
- **Validated Attendee Registration**: Real-time validation for first name, last name, and email, with automatic Twitter `@` normalization and GitHub handle verification.
- **Real vCard QR Code Generation**: Purely client-side QR generation using `qrcode-generator` with multi-tier fallback and auto-scaling, scannable by iOS Camera and Android Google Lens to save contacts directly to address books.
- **The Grand Reveal Scene**:
  - Floating 3D badge pass with realistic lanyard clip assembly, physics tilt, and 180° card flip.
  - Dedicated Live Smartphone QR Scanner station.
  - Toggle between 3D Holographic Pass and Official 2D Pass & Scan View.
- **Export & Print**:
  - High-resolution PNG badge export via `html-to-image`.
  - Clean event lanyard pass printing using dedicated `@media print` layout.
- **Procedural Sound Engine**: Generative celestial chimes and harmonic chord synthesis using the Web Audio API (zero external audio files, muted by default).

---

## 🛠️ Tech Stack

- **Framework**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4
- **3D & Graphics**: Three.js, React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`)
- **Animation**: Motion (`motion`)
- **QR Code Engine**: `qrcode-generator`
- **Asset Export**: `html-to-image`, `canvas-confetti`
- **Icons**: Lucide React

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Impana-N/BadgeVerse.git
   cd BadgeVerse
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

---

## 📄 License

Apache-2.0
