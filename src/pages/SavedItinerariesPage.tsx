import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Star,
  Trash2
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";

import type { SavedItinerary } from "@/components/VibeResults";

const STORAGE_KEY = "vibeVoyagerItineraries";

const SavedItinerariesPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [items, setItems] = useState<SavedItinerary[]>([]);

  /* ---------- helpers ---------- */
  const read = useCallback((): SavedItinerary[] => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? (JSON.parse(raw) as any[]) : [];

      return parsed
        .filter((r) => r && r.destination)
        .map((r) =>
          Array.isArray(r.activities)
            ? r
            : { ...r, activities: (r.days ?? []).flatMap((d: any) => d.activities ?? []) }
        );
    } catch {
      return [];
    }
  }, []);

  const write = (next: SavedItinerary[]) =>
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));

  const fmt = (ts: string) =>
    new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  /* ---------- effects ---------- */
  useEffect(() => setItems(read()), [read]);
  useEffect(() => {
    const h = () => setItems(read());
    window.addEventListener("storage", h);
    return () => window.removeEventListener("storage", h);
  }, [read]);

  /* ---------- delete ---------- */
  const del = (id: string) => {
    const before = items;
    const next = items.filter((i) => i.id !== id);
    setItems(next);
    write(next);

    toast({
      title: "Journey removed",
      description: "The itinerary has been deleted.",
      action: (
        <ToastAction altText="Undo" onClick={() => { setItems(before); write(before); }}>
          Undo
        </ToastAction>
      )
    });
  };

  /* ---------- render ---------- */
  if (items.length === 0) {
    return (
      <div className="container mx-auto p-4 max-w-xl text-center space-y-8">
        <Button variant="ghost" onClick={() => navigate("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <Card className="p-12 bg-white/80 backdrop-blur-sm border border-stone-200 shadow-md rounded-2xl">
          <MapPin className="h-16 w-16 text-stone-300 mx-auto mb-6" />
          <h2 className="text-2xl font-light text-stone-800">No journeys saved yet</h2>
          <p className="text-stone-500 mt-2">Discover a vibe, save it, and it will appear here.</p>
          <Button onClick={() => navigate("/")} className="mt-6 bg-stone-900 text-white hover:bg-stone-800">
            Create your first itinerary
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl space-y-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
        <h1 className="text-3xl font-light flex-1">Your Saved Itineraries</h1>
        <Badge className="bg-stone-100 text-stone-700 rounded-full px-3 py-1">{items.length}</Badge>
      </div>

      <div className="space-y-6">
        {items.map((it) => (
          <Card
            key={it.id}
            onClick={() => navigate(`/itinerary/${it.id}`, { state: it })}
            className="p-8 bg-white/70 backdrop-blur-sm border border-stone-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl font-light mb-1">{it.vibe}</h3>
                <div className="flex items-center gap-2 text-stone-600 text-sm">
                  <MapPin className="h-4 w-4" /> {it.destination}
                </div>
                <div className="flex items-center gap-2 text-xs text-stone-500 mt-1">
                  <Calendar className="h-3 w-3" /> Saved&nbsp;{fmt(it.timestamp)}
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => { e.stopPropagation(); del(it.id); }}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-stone-400 hover:text-rose-600"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {it.tastes.map((t) => (
                <Badge key={t} className="bg-stone-100 text-stone-700 rounded-full px-3 py-1 text-xs">
                  {t}
                </Badge>
              ))}
            </div>

            <div className="space-y-4">
              <h4 className="font-light flex items-center gap-2 text-stone-700">
                <Clock className="h-4 w-4" /> Highlights
              </h4>

              <div className="grid md:grid-cols-2 gap-3">
                {(it.activities ?? []).slice(0, 3).map((a, idx) => (
                  <div key={a.id} className="flex items-center gap-3 text-sm text-stone-600">
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

export default SavedItinerariesPage;
