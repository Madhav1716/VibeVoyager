/* ======================================================================= */
/*  🔄  SHARED DOMAIN TYPES                                                */
/* ======================================================================= */

/** A single thing to do in an itinerary */
export interface Activity {
  id: string;
  title: string;
  description: string;
  time: string;                      // “4 PM”, “09:30 AM” …
  category: 'Food' | 'Music' | 'Art' | 'Culture' | 'Adventure' |
            'Nightlife' | 'Lifestyle' | string;
  rating?: number;                   // 1-5
  image?: string;                    // URL
  location?: string;                 // “Shibuya Crossing”
  price?: string;                    // “$$”, “€20”
  duration?: string;                 // “2 h”, “All day”
}

/** Group of 4 activities produced by the AI for a given day */
export interface DayPlan {
  day: number;                       // 1-based index
  activities: Activity[];
}

/** Final bundled itinerary the UI displays / saves */
export interface Itinerary {
  destination: string;
  vibe: string;
  vibeDescription: string;
  days: DayPlan[];                   // ≥1
  qlooDestinations?: string[];       // raw names for attribution
}

/** Original single-day result from the first GPT call */
export interface VibeResult {
  vibe: string;
  vibeDescription: string;
  destination: string;
  activities: Activity[];            // Day-1 activities
  reasoning?: string;
  culturalInsights?: string[];
  tasteProfile?: string[];
  qlooDestinations?: string[];
}

/* ======================================================================= */
/*  🧩  QLOO TYPES                                                          */
/* ======================================================================= */

export interface QlooTasteProfile {
  taste_signals: string[];
  cultural_affinities: string[];
  style_preferences: string[];
}

/** Minimal slice of /v2/insights result used in the app */
export interface QlooInsight {
  entity: { id: string; name: string; description?: string };
  affinity: { score: number };
}

export interface QlooRecommendation {
  id: string;
  name: string;
  category: string;
  location?: string;
  description?: string;
  rating?: number;
  cultural_relevance?: number;
}

export interface QlooResponse {
  restaurants?: QlooRecommendation[];
  venues?: QlooRecommendation[];
  cities?: QlooRecommendation[];
  artists?: QlooRecommendation[];
  cultural_venues?: QlooRecommendation[];
}

/* ======================================================================= */
/*  🧠  AI SERVICE REQUEST / RESPONSE                                       */
/* ======================================================================= */

export interface AIRequest {
  tastes: string[];

  /** Optional user-supplied filters (future-proofed) */
  userPreferences?: {
    budget?: 'budget' | 'mid-range' | 'luxury';
    travelStyle?: 'adventure' | 'relaxation' | 'culture' | 'food' | 'nightlife';
    groupSize?: 'solo' | 'couple' | 'family' | 'group';
  };
}

export interface AIResponseSuccess {
  success: true;
  data: VibeResult | Activity[];     // VibeResult for first call, Activity[] for add-day
  qlooUsed?: boolean;
  fallbackUsed?: false;
}

export interface AIResponseError {
  success: false;
  error: string;
  fallbackUsed?: boolean;
  qlooUsed?: boolean;
}

export type AIResponse = AIResponseSuccess | AIResponseError;

/* ======================================================================= */
/*  ⚠️  GENERIC API ERROR + ENV                                            */
/* ======================================================================= */

export interface APIError {
  message: string;
  code?: string;
  details?: unknown;
}

export interface EnvVars {
  VITE_OPENAI_API_KEY?: string;
  VITE_OPENAI_MODEL?: string;
  VITE_QLOO_API_KEY?: string;
  VITE_QLOO_BASE_URL?: string;
  VITE_API_BASE_URL?: string;
}
