import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Sparkles,
  Heart,
  Coffee,
  Music,
  Book,
  Utensils,
  Palette,
  Beer,
  Fish,
  Mountain,
  ShoppingBag,
  Camera,
} from "lucide-react";

interface TasteInputProps {
  onSubmit: (tastes: string[]) => void;
}

/* ───────────────────────  pre-baked suggestions  ─────────────────────── */
const suggestedTastes = [
  { label: "Jazz Music",        icon: Music },
  { label: "Vietnamese Food",   icon: Utensils },
  { label: "Cyberpunk Novels",  icon: Book },
  { label: "Specialty Coffee",  icon: Coffee },
  { label: "Street Art",        icon: Heart },
  { label: "Indie Folk",        icon: Music },
  { label: "Modern Art",        icon: Palette },
  { label: "Craft Beer",        icon: Beer },
  { label: "Sushi",             icon: Fish },
  { label: "Hiking Trails",     icon: Mountain },
  { label: "Vintage Shopping",  icon: ShoppingBag },
  { label: "Photography",       icon: Camera },
];

/* ─────────────────────────── component  ─────────────────────────── */
export const TasteInput = ({ onSubmit }: TasteInputProps) => {
  const [inputValue, setInputValue] = useState("");
  const [selected,  setSelected]    = useState<string[]>([]);

  /* helpers -------------------------------------------------------- */
  const addTaste = (raw: string) => {
    const taste = raw.trim();
    if (taste && !selected.includes(taste) && selected.length < 3) {
      setSelected((prev) => [...prev, taste]);
    }
  };

  const removeTaste = (idx: number) =>
    setSelected((prev) => prev.filter((_, i) => i !== idx));

  /* handlers ------------------------------------------------------- */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    // comma-split paste / typing
    if (val.includes(",")) {
      const parts = val.split(",");
      parts.slice(0, -1).forEach(addTaste);
      setInputValue(parts.at(-1) ?? "");
    } else {
      setInputValue(val);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTaste(inputValue);
      setInputValue("");
    }
    // 🆕 back-space removes last chip when input empty
    if (e.key === "Backspace" && !inputValue && selected.length) {
      removeTaste(selected.length - 1);
    }
    // 🆕 esc clears current input
    if (e.key === "Escape") {
      setInputValue("");
    }
  };

  const handleAddClick = () => {
    addTaste(inputValue);
    setInputValue("");
  };

  /* UI ------------------------------------------------------------- */
  return (
    <Card className="p-10 max-w-2xl mx-auto bg-white/80 backdrop-blur-sm border border-stone-200 shadow-md rounded-2xl">
      {/* Heading */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Sparkles className="h-5 w-5 text-amber-500" />
          <h2 className="text-2xl font-light text-stone-800 tracking-tight">
            Tell us what you love
          </h2>
        </div>
        <p className="text-stone-500 text-sm">
          Share 2–3 cultural preferences to discover your perfect travel vibe.
        </p>
      </div>

      {/* Input row */}
      <div className="flex gap-3 mb-8">
        <Input
          placeholder="e.g. Frank Ocean, ramen, cyberpunk novels…"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-white/90 focus:ring-0 border-stone-300 rounded-lg text-stone-800 placeholder-stone-400"
          disabled={selected.length >= 3}
        />
        <Button
          onClick={handleAddClick}
          disabled={!inputValue.trim() || selected.length >= 3}
          className="bg-stone-900 text-stone-100 hover:bg-stone-800 disabled:bg-stone-300 disabled:text-stone-500 rounded-lg"
        >
          Add
        </Button>
      </div>

      {/* Selected tastes */}
      {selected.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xs font-medium text-stone-600 mb-2">Your tastes</h3>
          <div className="flex flex-wrap gap-2">
            {selected.map((taste, i) => (
              <Badge
                key={taste}
                onClick={() => removeTaste(i)}
                className="cursor-pointer bg-stone-100 text-stone-700 hover:bg-rose-100 hover:text-rose-600 transition-colors"
              >
                {taste} ×
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      {selected.length < 3 && (
        <div className="mb-10">
          <h3 className="text-xs font-medium text-stone-500 mb-2">
            Need inspiration?
          </h3>
          <div className="flex flex-wrap gap-2">
            {suggestedTastes.map(({ label, icon: Icon }) => {
              const disabled = selected.includes(label) || selected.length >= 3;
              return (
                <Badge
                  key={label}
                  onClick={() => !disabled && addTaste(label)}
                  className={`flex items-center gap-1 cursor-pointer border text-stone-600 ${
                    disabled
                      ? "bg-stone-100 opacity-50 cursor-not-allowed"
                      : "bg-transparent hover:bg-stone-100"
                  }`}
                >
                  <Icon className="h-3 w-3" />
                  {label}
                </Badge>
              );
            })}
          </div>
        </div>
      )}

      {/* Submit */}
      <Button
        onClick={() => selected.length >= 2 && onSubmit(selected)}
        disabled={selected.length < 2}
        className="w-full bg-stone-900 text-stone-100 hover:bg-stone-800 disabled:bg-stone-300 disabled:text-stone-500 rounded-lg"
      >
        <Sparkles className="h-4 w-4 mr-2" />
        Discover My Vibe&nbsp;({selected.length}/3)
      </Button>

      {selected.length < 2 && (
        <p className="text-center text-xs text-stone-500 mt-3">
          Add at least 2 preferences to continue
        </p>
      )}
    </Card>
  );
};

/* ---------- util ---------- */
function readItineraries(): unknown[] {
  try {
    return JSON.parse(localStorage.getItem("vibeVoyagerItineraries") || "[]");
  } catch {
    return [];
  }
}
