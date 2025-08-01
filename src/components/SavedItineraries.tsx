import {
  MapPin,
  Clock,
  Star,
  ArrowLeft,
  Trash2,
  Calendar,
} from "lucide-react";
import { useEffect, useState, useCallback } from "react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";

import type { SavedItinerary } from "@/components/VibeResults";

const STORAGE_KEY = "vibeVoyagerItineraries";

/* ------------------------------------------------------------------ */
/*  PROPS                                                              */
/* ------------------------------------------------------------------ */
interface Props {
  onBack: () => void;
  onSelectItinerary: (itinerary: SavedItinerary) => void;
}

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */
export const SavedItineraries = ({ onBack, onSelectItinerary }: Props) => {
  const { toast } = useToast();
  const [items, setItems] = useState<SavedItinerary[]>([]);

  /* -------- helpers ------------------------------------------------ */
  const read = useCallback((): SavedItinerary[] => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? (JSON.parse(raw) as SavedItinerary[]) : [];
      return parsed.filter((row) => row && row.id && row.destination);
    } catch {
      return [];
    }
  }, []);

  const write = (next: SavedItinerary[]) =>
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));

  const fmt = (ts: string) =>
    new Date(ts).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  /* -------- effects ------------------------------------------------ */
  useEffect(() => setItems(read()), [read]);

  /* sync with other tabs / VibeResults save */
  useEffect(() => {
    const handler = () => setItems(read());
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [read]);

  /* -------- delete ------------------------------------------------- */
  const deleteItinerary = (id: string) => {
    const before = items;
    const next = items.filter((it) => it.id !== id);

    setItems(next);
    write(next);

    toast({
      title: "Itinerary removed",
      description: "The trip has been deleted from your collection.",
      action: (
        <ToastAction
          altText="Undo delete"
          onClick={() => {
            setItems(before);
            write(before);
          }}
        >
          Undo
        </ToastAction>
      ),
    });
  };

  /* ------------------------------------------------------------------ */
  /*  RENDER                                                             */
  /* ------------------------------------------------------------------ */
  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto text-center space-y-8">
        <Button variant="ghost" onClick={onBack} className="self-start">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>

        <Card className="p-12 bg-white/80 backdrop-blur-sm border border-stone-200 shadow-md rounded-2xl">
          <MapPin className="h-16 w-16 text-stone-300 mx-auto mb-6" />
          <h2 className="text-2xl font-light text-stone-800">
            No journeys saved yet
          </h2>
          <p className="text-stone-500 mt-2">
            Discover your vibe and save itineraries to build your personal
            travel archive.
          </p>
          <Button
            onClick={onBack}
            className="mt-6 bg-stone-900 text-stone-100 hover:bg-stone-800 rounded-lg px-6 py-2"
          >
            Start exploring
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>

        <h1 className="text-3xl font-light text-stone-800 flex-1">
          Saved Journeys
        </h1>

        <Badge className="bg-stone-100 text-stone-700 rounded-full px-3 py-1">
          {items.length}
        </Badge>
      </div>

      {/* cards */}
      <div className="space-y-6">
        {items.map((it) => (
          <Card
            key={it.id}
            onClick={() => onSelectItinerary(it)}
            className="p-8 bg-white/70 backdrop-blur-sm border border-stone-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
          >
            {/* top row */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl font-light text-stone-800 mb-1">
                  {it.vibe}
                </h3>
                <div className="flex items-center gap-2 text-stone-600 text-sm">
                  <MapPin className="h-4 w-4" />
                  <span>{it.destination}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-stone-500 mt-1">
                  <Calendar className="h-3 w-3" />
                  <span>Saved&nbsp;{fmt(it.timestamp)}</span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteItinerary(it.id);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-stone-400 hover:text-rose-600"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {/* tastes */}
            <div className="flex flex-wrap gap-2 mb-6">
              {it.tastes.map((taste) => (
                <Badge
                  key={taste}
                  className="bg-stone-100 text-stone-700 rounded-full px-3 py-1 text-xs"
                >
                  {taste}
                </Badge>
              ))}
            </div>

            {/* highlights */}
            <div className="space-y-4">
              <h4 className="font-light text-stone-700 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Highlights
              </h4>

              <div className="grid md:grid-cols-2 gap-3">
                {it.activities.slice(0, 4).map((a, idx) => (
                  <div
                    key={a.id}
                    className="flex items-center gap-3 text-sm text-stone-600"
                  >
                    <span className="w-6 h-6 bg-stone-200 text-stone-700 rounded-full flex items-center justify-center text-xs font-medium">
                      {idx + 1}
                    </span>
                    <span className="truncate">{a.title}</span>
                    {a.rating && (
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-amber-500 fill-current" />
                        <span className="text-xs">{a.rating}</span>
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-stone-500 mt-8 border-t border-stone-200 pt-4">
              Click to view the full itinerary
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
};
