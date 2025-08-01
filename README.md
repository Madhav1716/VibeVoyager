# VibeVoyager

A sophisticated AI-powered travel recommendation app that combines cultural intelligence with personalized travel planning.

## 🚀 Features

- **🧠 AI-Powered Recommendations:** Uses OpenAI GPT-4 for intelligent travel planning
- **🔍 Cultural Intelligence:** Integrates Qloo API for taste-based cultural recommendations
- **🎯 Personalized Experiences:** Creates unique travel vibes based on your cultural preferences
- **💾 Save & Share:** Store your favorite itineraries locally
- **📱 Responsive Design:** Beautiful UI that works on all devices
- **🔄 Smart Fallbacks:** Works offline with curated recommendations

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **UI:** shadcn/ui, Tailwind CSS, Radix UI
- **AI:** OpenAI GPT-4, Qloo API
- **State Management:** TanStack Query, React Hooks
- **HTTP Client:** Axios
- **Routing:** React Router DOM

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- OpenAI API key (required)
- Qloo API key (optional but recommended)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd vibe-voyager-ai-main
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env.local
   ```

4. **Add your API keys to `.env.local`:**
   ```bash
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   VITE_QLOO_API_KEY=your_qloo_api_key_here  # Optional
   VITE_OPENAI_MODEL=gpt-4o                  # Optional (default: gpt-4)
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   Navigate to [http://localhost:8080](http://localhost:8080)

## 🤖 AI Integration Setup

VibeVoyager uses a **dual-API architecture** combining **OpenAI GPT-4** and **Qloo API** for sophisticated cultural recommendations.

### 🔄 **Enhanced Flow:**

```
User Input: "I love Kendrick Lamar, ramen, and modern art"
    ↓
Step 1: Qloo API → Taste Profile: "urban, expressive, artistic, bold, poetic"
    ↓
Step 2: Qloo API → Cultural Recommendations: venues, restaurants, cities
    ↓
Step 3: GPT-4 → Personalized Plan: "Start your day with rich tonkotsu ramen..."
    ↓
Step 4: UI → Beautiful display with cultural insights
```

### **Setup Instructions:**

1. **Get API Keys:**
   - **OpenAI:** Visit [OpenAI Platform](https://platform.openai.com/api-keys)
   - **Qloo:** Visit [Qloo API](https://qloo.com/api) (optional but recommended)

2. **Configure Environment Variables:**
   ```bash
   # Copy the example file
   cp env.example .env.local
   
   # Edit .env.local and add your API keys
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   VITE_QLOO_API_KEY=your_qloo_api_key_here  # Optional
   VITE_OPENAI_MODEL=gpt-4o                  # Optional (default: gpt-4)
   ```

3. **Start the Development Server:**
   ```bash
   npm run dev
   ```

### **AI Features:**
- **🧠 Intelligent Taste Analysis:** GPT-4 interprets cultural preferences
- **🔍 Cultural Intelligence:** Qloo provides venue and city recommendations
- **✍️ Personalized Narratives:** AI creates contextual travel stories
- **🔄 Smart Fallbacks:** Works with any combination of APIs
- **🎯 Cultural Matching:** Connects tastes to authentic experiences

### **API Modes:**
- **Full AI Mode:** Both OpenAI + Qloo (best experience)
- **AI Only Mode:** OpenAI only (still excellent)
- **Demo Mode:** Curated recommendations (works offline)

### **Key Files for Modifications:**
- `src/lib/ai-service.ts` - AI orchestration and prompts
- `src/lib/qloo-service.ts` - Cultural intelligence API
- `src/hooks/use-ai.ts` - React integration
- `.env.local` - API configuration

## 📁 Project Structure

```
src/
├── lib/
│   ├── ai-service.ts      # OpenAI + Qloo orchestration
│   ├── qloo-service.ts    # Cultural intelligence API
│   ├── types.ts          # Type definitions
│   └── utils.ts          # Utility functions
├── hooks/
│   ├── use-ai.ts         # React hook for AI calls
│   └── use-toast.ts      # Toast notifications
├── components/
│   ├── TasteInput.tsx    # User input form
│   ├── ProcessingState.tsx    # Loading state
│   ├── VibeResults.tsx   # Results display
│   ├── SavedItineraries.tsx   # Saved trips
│   └── ui/               # shadcn/ui components
├── pages/
│   ├── Index.tsx         # Main application
│   └── NotFound.tsx      # 404 page
├── App.tsx               # App wrapper
└── main.tsx             # Entry point
```

## 🎯 How to Use

1. **Enter Your Tastes:** Type in your cultural preferences (music, food, art, etc.)
2. **AI Analysis:** Our AI analyzes your tastes and creates a cultural profile
3. **Get Recommendations:** Receive personalized travel destinations and activities
4. **Save & Share:** Save your favorite itineraries for later

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy Options

- **Vercel:** Connect your GitHub repo to Vercel for automatic deployments
- **Netlify:** Drag and drop the `dist` folder or connect your repo
- **GitHub Pages:** Use GitHub Actions for automatic deployment
- **Any Static Host:** The built app is a static site that can be hosted anywhere

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenAI](https://openai.com) for GPT-4 API
- [Qloo](https://qloo.com) for cultural intelligence API
- [shadcn/ui](https://ui.shadcn.com) for beautiful UI components
- [Vite](https://vitejs.dev) for fast development experience
# VibeVoyager
