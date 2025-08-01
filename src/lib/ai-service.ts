// ---------------------------------------------------------------------------
// ai-service.ts – merges GPT-4 storytelling with Qloo destination insights
// and can extend an itinerary one day at a time.
// ---------------------------------------------------------------------------
import OpenAI from "openai";
import type {
  AIRequest,
  AIResponse,
  VibeResult,
  QlooInsight,
  DayPlan,          // <- add to types.ts if not present
  Activity
} from "@/lib/types";
import { qlooService } from "@/lib/qloo-service";
import { logger } from "@/lib/logger";

/* ──────────────────── ENV CONFIG ──────────────────── */
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY!;
const OPENROUTER_MODEL   = import.meta.env.VITE_OPENROUTER_MODEL || "qwen/qwen3-coder:free";
const SITE_URL           = import.meta.env.VITE_SITE_URL  || "https://your-app.com";
const SITE_NAME          = import.meta.env.VITE_SITE_NAME || "VibeVoyager";

/* ──────────────────── OPENROUTER CLIENT ──────────────────── */
const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey : OPENROUTER_API_KEY,
  dangerouslyAllowBrowser: true,
  defaultHeaders: {
    "HTTP-Referer": SITE_URL,
    "X-Title": SITE_NAME
  }
});

/* ──────────────────── SYSTEM PROMPT ──────────────────── */
const SYSTEM_PROMPT = `You are VibeVoyager, an AI travel expert that creates personalized travel recommendations based on cultural tastes.

Your task: analyse the user's cultural preferences and build an itinerary that contains
1. A unique "vibe" name
2. A short description of their travel style
3. A perfect destination
4. Exactly four activities for **Day 1**

You MUST respond with a single, valid JSON object – no prose before or after.

{
  "vibe": "...",
  "vibeDescription": "...",
  "destination": "...",
  "activities": [
    { "id":"1","title":"...","description":"...","time":"4 PM","category":"Art","rating":4.8 },
    …
  ]
}`;

/* ========================================================================== */
/*                              AI SERVICE                                    */
/* ========================================================================== */
class AIService {
  private static inst: AIService;
  private constructor() {}
  static getInstance() { return (this.inst ??= new AIService()); }

  /* ------------------------------ PUBLIC ------------------------------ */
  async generateVibeRecommendation(req: AIRequest): Promise<AIResponse> {
    logger.info("Generate vibe", { tastes: req.tastes });

    if (!OPENROUTER_API_KEY) {
      return { success:false, error:"AI key missing", fallbackUsed:false };
    }

    /* 1️⃣  Optional Qloo enrichment */
    let qlooHits: QlooInsight[] = [];
    try {
      qlooHits = await qlooService.destinationsFromVibes(req.tastes, 3);
    } catch (err) {
      logger.warn("Qloo failed – continuing GPT-only", { err });
    }

    /* 2️⃣  Prompt & completion */
    const userPrompt = this.buildUserPrompt(req.tastes, qlooHits);
    const aiResp     = await this.callOpenRouter(userPrompt);

    if (!aiResp.success) return { ...aiResp, qlooUsed:false };

    /* 3️⃣  Attach destinations for UI */
    if (qlooHits.length) {
      aiResp.data!.qlooDestinations = qlooHits.map(h => h.entity.name);
    }
    return { ...aiResp, qlooUsed: qlooHits.length>0 };
  }

  /* -------------- Add A New Day (multi-day builder) -------------- */
  async addItineraryDay(
    destination: string,
    previous: DayPlan[],
    tastes: string[]
  ): Promise<Activity[]> {

    const summary = previous.map(p =>
      `Day ${p.day}: ${p.activities.map(a => a.title).join(", ")}`
    ).join("\n");

    const userPrompt = `
We already have this itinerary for ${destination}:
${summary}

Create **four brand-new activities for Day ${previous.length + 1}**
(no duplicates), still matching these tastes: ${tastes.join(", ")}.
Respond ONLY with the JSON array of activities in the earlier schema.
`.trim();

    const result = await this.callOpenRouter(userPrompt, true);
    if (!result.success) throw new Error(result.error);

    return (result.data as Activity[]);
  }

  /* --------------------------- HELPERS --------------------------- */
  private buildUserPrompt(tastes: string[], hits: QlooInsight[]) {
    const base = `Analyse these tastes: ${tastes.join(", ")}.\n\n`;
    return hits.length
      ? base +
        `Destinations that match: ${hits.map(h => h.entity.name).join(", ")}.\n\n` +
        "Create a personalised recommendation using these insights."
      : base + "Create a personalised recommendation that matches their tastes.";
  }

  private async callOpenRouter(
    prompt: string,
    arrayOnly = false
  ): Promise<AIResponse> {
    try {
      const completion = await openrouter.chat.completions.create({
        model: OPENROUTER_MODEL,
        messages: [
          { role:"system", content: arrayOnly ? "" : SYSTEM_PROMPT },
          { role:"user",   content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 1000
      });

      const raw = completion.choices[0]?.message?.content ?? "";
      const json = JSON.parse(raw.match(/\{[\s\S]*\}|\[[\s\S]*\]/)?.[0] || raw);

      if (!arrayOnly && !this.validateAIResponse(json)) {
        throw new Error("Schema mismatch");
      }
      return { success:true, data: json };
    } catch (err) {
      logger.error("OpenRouter error", err);
      return {
        success:false,
        error: err instanceof Error ? err.message : String(err),
        fallbackUsed:false
      };
    }
  }

  private validateAIResponse(d:any): d is VibeResult {
    return (
      d && typeof d==="object" &&
      ["vibe","vibeDescription","destination"].every(k => typeof d[k]==="string") &&
      Array.isArray(d.activities) && d.activities.length===4
    );
  }

  /* ---------- ping ---------- */
  async testConnection(): Promise<boolean> {
    try {
      const r = await openrouter.chat.completions.create({
        model: OPENROUTER_MODEL,
        messages:[{ role:"user", content:"ping" }],
        max_tokens:1
      });
      return !!r.choices?.length;
    } catch { return false; }
  }
}

export const aiService = AIService.getInstance();
