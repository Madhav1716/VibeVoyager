import { Card } from "@/components/ui/card";
import { Loader2, Sparkles, Brain, MapPin, Bot, Zap } from "lucide-react";

interface ProcessingStateProps {
  tastes: string[];
  isAIAvailable?: boolean;
}

export const ProcessingState = ({ tastes, isAIAvailable = false }: ProcessingStateProps) => {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Main Processing Card */}
      <Card className="p-10 text-center bg-white/80 backdrop-blur-sm border border-stone-200 shadow-md rounded-2xl">
        <div className="space-y-8">
          <div className="flex items-center justify-center">
            <div className="relative">
              <Loader2 className="h-10 w-10 text-stone-600 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h2 className="text-2xl font-light text-stone-800 tracking-tight">
              Curating your journey...
            </h2>
            <p className="text-stone-500 font-light">
              {isAIAvailable 
                ? "Thoughtfully analyzing your preferences to craft a personalized experience"
                : "Carefully matching your tastes to create the perfect travel experience"
              }
            </p>
            {isAIAvailable && (
              <div className="flex items-center justify-center gap-2 mt-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-xs text-stone-600 font-light tracking-wider uppercase">
                  AI Enhanced
                </span>
              </div>
            )}
          </div>

          {/* Tastes Display */}
          <div className="bg-stone-50/80 rounded-xl p-6">
            <h3 className="text-sm font-light text-stone-600 mb-4 tracking-wider uppercase">
              Your Preferences
            </h3>
            <div className="flex flex-wrap gap-3 justify-center">
              {tastes.map((taste, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-white border border-stone-200 text-stone-700 rounded-full text-sm font-light shadow-sm"
                >
                  {taste}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Processing Steps */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6 bg-white/60 backdrop-blur-sm border border-stone-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-stone-100 rounded-xl flex items-center justify-center">
              <Brain className="h-6 w-6 text-stone-600" />
            </div>
            <div>
              <h3 className="font-light text-stone-800 text-lg">Interpreting</h3>
              <p className="text-xs text-stone-500 font-light">Understanding your aesthetic</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/60 backdrop-blur-sm border border-stone-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h3 className="font-light text-stone-800 text-lg">Matching</h3>
              <p className="text-xs text-stone-500 font-light">Finding resonant places</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/60 backdrop-blur-sm border border-stone-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-stone-100 rounded-xl flex items-center justify-center">
              <MapPin className="h-6 w-6 text-stone-600" />
            </div>
            <div>
              <h3 className="font-light text-stone-800 text-lg">Curating</h3>
              <p className="text-xs text-stone-500 font-light">Crafting your experience</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
