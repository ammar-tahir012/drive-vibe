# 🚗 DriveVibes — Cinematic 4K City Drives

DriveVibes brings the world's most iconic streets to your screen. Experience 4K POV driving footage paired with real-time, live local radio streams for a truly immersive atmosphere.

![DriveVibes Hero](https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?q=80&w=1200&auto=format&fit=crop)

## 🌟 Features

- **Live City Drives**: High-quality 4K POV driving videos from around the globe.
- **Local Radio Integration**: Real-time streaming of local radio stations based on the city's location.
- **Atmospheric "Moods"**: Explore cities based on your vibe — *Night Drive*, *Rainy Cities*, *Golden Hour*, and more.
- **Immersive UI**: A premium, glassmorphism-inspired interface with animated equalizers and cinematic transport controls.
- **Dynamic City Search**: Global city database exploration via GeoDB Cities.

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **Media**: `react-youtube` for immersive video backgrounds.
- **APIs**:
  - **YouTube Data API v3**: For 4K POV driving content.
  - **Radio-Browser API**: To fetch live local radio streams globally.
  - **GeoDB Cities API**: For intelligent city search and metadata.
  - **REST Countries API**: For localized metadata and flags.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/ammar-tahir012/drive-vibe.git
   cd drive-vibe
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory:
   ```env
   VITE_YOUTUBE_API_KEY=your_youtube_key
   VITE_GEODB_API_KEY=your_rapidapi_geodb_key
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 🎥 Screenshots & Demos
*Screenshots of the dark-themed dashboard and immersive city page coming soon.*

---
Designed with ❤️ for urban explorers and night-drive lovers.
