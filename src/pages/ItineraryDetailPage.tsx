import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { SavedItinerary } from "@/components/VibeResults";

const STORAGE_KEY = "vibeVoyagerItineraries";

const ItineraryDetailPage = () => {
  const nav = useNavigate();
  const { id } = useParams();
  const { state } = useLocation();              // maybe passed in

  /* 1️⃣  try the state first (instant) */
  let itinerary: SavedItinerary | undefined = state as SavedItinerary;

  /* 2️⃣  fallback to localStorage if we came via hard-refresh or deep-link */
  if (!itinerary && typeof window !== "undefined") {
    try {
      const all: SavedItinerary[] = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
      );
      itinerary = all.find(
        (i) => i.id === id || i.timestamp === id  // legacy fallback
      );
    } catch {
      // ignore JSON errors
    }
  }

  /* 3️⃣  graceful 404 */
  if (!itinerary) {
    return (
      <div className="container mx-auto p-4 max-w-xl text-center space-y-8">
        <Button variant="ghost" onClick={() => nav("/saved")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to list
        </Button>

        <Card className="p-12">
          <h2 className="text-2xl font-light mb-4">Itinerary not found</h2>
          <p className="text-stone-500 mb-6">
            We couldn’t find that journey in your saved collection.
          </p>
          <Button onClick={() => nav("/saved")}>Return to saved list</Button>
        </Card>
      </div>
    );
  }

  /* ------------------------------------------------------------------ */
  /*  Render the full itinerary (you can make this fancier later)       */
  /* ------------------------------------------------------------------ */
  return (
    <div className="container mx-auto p-4 max-w-3xl space-y-10">
      <Button variant="ghost" onClick={() => nav("/saved")}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to list
      </Button>

      <h1 className="text-3xl font-light">{itinerary.vibe}</h1>

      <Card className="p-8 bg-gradient-to-r from-stone-800 to-stone-700 text-stone-100 rounded-2xl shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <MapPin className="h-6 w-6" />
          <h2 className="text-2xl font-light tracking-tight">
            {itinerary.destination}
          </h2>
        </div>
        <p className="font-light leading-relaxed">{itinerary.vibeDescription}</p>
      </Card>

      {itinerary.activities.map((a, idx) => (
        <Card key={a.id} className="p-6 space-y-2">
          <h3 className="text-lg font-medium flex gap-2">
            <span className="text-stone-500">{idx + 1}.</span> {a.title}
          </h3>
          <p className="text-stone-600">{a.description}</p>
          <p className="text-xs text-stone-500">{a.time}</p>
        </Card>
      ))}
    </div>
  );
};

export default ItineraryDetailPage;
