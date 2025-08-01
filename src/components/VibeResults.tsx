import {
  MapPin,
  Clock,
  Star,
  ArrowLeft,
  ExternalLink,
  Heart,
  Circle,
  Plus,
} from "lucide-react";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useItinerary } from "@/hooks/use-itinerary";
import type { Activity } from "@/lib/types";

/* ---------------------------------------------------- */
/*  CONSTANTS & TYPES                                   */
/* ---------------------------------------------------- */
const STORAGE_KEY = "vibeVoyagerItineraries";
const MAX_ITINERARIES = 10;

export interface SavedItinerary {
  id: string;
  timestamp: string;
  tastes: string[];
  vibe: string;
  vibeDescription: string;
  destination: string;
  activities: Activity[];        // flattened list (all days)
}

interface Props {
  tastes: string[];
  vibe: string;
  vibeDescription: string;
  destination: string;
  activities: Activity[];        // Day-1 starter from GPT
  onReset: () => void;
  isAIGenerated?: boolean;
  isQlooEnhanced?: boolean;
  tasteProfile?: string[];
}

/* ---------------------------------------------------- */
/*  COMPONENT                                           */
/* ---------------------------------------------------- */
export const VibeResults = ({
  tastes,
  vibe,
  vibeDescription,
  destination,
  activities,
  onReset,
  isAIGenerated = false,
  isQlooEnhanced = false,
  tasteProfile = [],
}: Props) => {
  const { toast } = useToast();

  /* build / extend itinerary (max 7 days) */
  const { days, addDay, isAdding } = useItinerary(
    destination,
    { day: 1, activities },
    tastes,
  );
  const [currentDay, setCurrentDay] = useState(1);

  /* taste chips */
  const tasteBadges = useMemo(
    () =>
      tastes.map((t) => (
        <Badge key={t} className="bg-stone-100 text-stone-700">
          {t}
        </Badge>
      )),
    [tastes],
  );

  /* explicit colour class so Tailwind keeps it */
  const statusClass = isAIGenerated ? "text-emerald-500" : "text-amber-500";

  /* save to localStorage (with UNDO) */
  const saveItinerary = () => {
    const newItinerary: SavedItinerary = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      tastes,
      vibe,
      vibeDescription,
      destination,
      activities: days.flatMap((d) => d.activities),
    };

    try {
      const previous: SavedItinerary[] = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]",
      );

      const next = [newItinerary, ...previous].slice(0, MAX_ITINERARIES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));

      toast({
        title: "Journey saved",
        description: `Your ${vibe} trip to ${destination} was stored.`,
        action: (
          <ToastAction
            altText="Undo save"
            onClick={() => {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(previous));
              toast({ title: "Save undone" });
              window.dispatchEvent(new StorageEvent("storage"));
            }}
          >
            Undo
          </ToastAction>
        ),
      });

      /* trigger refresh inside this tab too */
      window.dispatchEvent(new StorageEvent("storage"));
    } catch (e) {
      console.error(e);
      toast({
        title: "Error",
        description: "Could not save this itinerary.",
        variant: "destructive",
      });
    }
  };

  /* -------------------------------------------------- */
  /*  RENDER                                            */
  /* -------------------------------------------------- */
  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* header */}
      <div className="text-center space-y-6">
        <Button variant="ghost" onClick={onReset} className="text-stone-600 hover:text-stone-800">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Discover another vibe
        </Button>

        <div className="space-y-3">
          <div className="flex justify-center items-center gap-3">
            <h1 className="text-4xl font-light tracking-tight text-stone-800">
              Your vibe:&nbsp;<span className="italic">{vibe}</span>
            </h1>
            <Circle className={`h-3 w-3 ${statusClass} fill-current`} />
          </div>

          <p className="max-w-2xl mx-auto text-lg font-light leading-relaxed text-stone-600">
            {vibeDescription}
          </p>

          {isAIGenerated && (
            <button
              onClick={() =>
                toast({
                  title: "How was this built?",
                  description: isQlooEnhanced
                    ? "AI crafted the narrative and Qloo supplied cultural signals."
                    : "Generated entirely by large-language-model analysis.",
                })
              }
              className="inline-flex items-center gap-2 px-4 py-2 bg-stone-100 rounded-full text-xs text-stone-700 hover:bg-stone-200"
            >
              <Circle className={`h-2 w-2 ${statusClass} fill-current`} />
              AI Enhanced{isQlooEnhanced && " • Cultural Insight"}
            </button>
          )}
        </div>

        {tasteProfile.length > 0 && (
          <Card className="bg-stone-50/80 p-6 rounded-xl">
            <p className="uppercase text-xs font-medium tracking-wider text-stone-600 mb-3">
              Cultural profile
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {tasteProfile.map((tp) => (
                <Badge
                  key={tp}
                  className="bg-white border border-stone-200 text-stone-700 rounded-full px-3 py-1 text-xs font-light"
                >
                  {tp}
                </Badge>
              ))}
            </div>
          </Card>
        )}

        <div className="flex flex-wrap gap-3 justify-center">{tasteBadges}</div>
      </div>

      {/* destination card */}
      <Card className="p-8 bg-gradient-to-r from-stone-800 to-stone-700 text-stone-100 rounded-2xl shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <MapPin className="h-6 w-6" />
          <h2 className="text-2xl font-light tracking-tight">
            Perfect destination:&nbsp;{destination}
          </h2>
        </div>
        <p className="font-light leading-relaxed">
          {destination} pairs beautifully with your chosen vibes—expect culture,
          cuisine and experiences that resonate with you.
        </p>
      </Card>

      {/* day selector */}
      <div className="flex items-center gap-3 justify-center">
        {days.map((d) => (
          <Button
            key={d.day}
            size="sm"
            variant={currentDay === d.day ? "default" : "outline"}
            onClick={() => setCurrentDay(d.day)}
          >
            Day&nbsp;{d.day}
          </Button>
        ))}

        {days.length < 7 && (
          <Button
            size="sm"
            variant="ghost"
            disabled={isAdding}
            onClick={addDay}
            className="text-emerald-600 hover:bg-emerald-50"
          >
            <Plus className="h-4 w-4 mr-1" />
            {isAdding ? "Adding…" : "Add day"}
          </Button>
        )}
      </div>

      {/* activities for selected day */}
      <section className="space-y-8">
        <h3 className="flex items-center gap-3 text-2xl font-light text-stone-800">
          <Clock className="h-6 w-6 text-stone-600" />
          Your curated day&nbsp;{currentDay}&nbsp;in&nbsp;{destination}
        </h3>

        {days
          .find((d) => d.day === currentDay)!
          .activities.map((a, idx) => (
            <Card
              key={a.id}
              className="p-8 bg-white/70 backdrop-blur-sm border border-stone-200 rounded-2xl hover:shadow-md transition-shadow"
            >
              <div className="flex gap-6">
                <img
                  src={a.image || "/placeholder.svg"}
                  alt={a.title}
                  className="hidden sm:block w-32 h-32 rounded-xl object-cover"
                />
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="w-10 h-10 bg-stone-200 text-stone-700 flex items-center justify-center rounded-xl font-medium">
                      {idx + 1}
                    </span>
                    <h4 className="text-xl font-light text-stone-800">{a.title}</h4>
                    <Badge className="bg-stone-100 text-stone-700 rounded-full px-3 py-1 text-xs font-light">
                      {a.category}
                    </Badge>
                  </div>

                  <p className="ml-14 font-light leading-relaxed text-stone-600">
                    {a.description}
                  </p>

                  <div className="ml-14 flex gap-6 text-sm text-stone-500">
                    <span className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {a.time}
                    </span>
                    {/* {a.rating && (
                      <span className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-amber-500 fill-current" />
                        {a.rating}
                      </span>
                    )} */}
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/80 border-stone-200 text-stone-600 hover:bg-white hover:text-stone-800 rounded-lg"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
      </section>

      {/* CTA */}
      <Card className="p-8 text-center bg-stone-50/80 backdrop-blur-sm border border-stone-200 rounded-2xl">
        <h3 className="text-xl font-light mb-3 text-stone-800">
          Resonate with this journey?
        </h3>
        <p className="mb-6 font-light leading-relaxed text-stone-600">
          Save this itinerary or craft another vibe-driven trip.
        </p>
        <div className="flex justify-center gap-4">
          <Button
            onClick={saveItinerary}
            className="bg-stone-900 text-stone-100 hover:bg-stone-800"
          >
            <Heart className="mr-2 h-4 w-4" />
            Save journey
          </Button>
          <Button
            variant="outline"
            onClick={onReset}
            className="border-stone-200 text-stone-700 hover:text-stone-900"
          >
            Explore another essence
          </Button>
        </div>
      </Card>
    </div>
  );
};
