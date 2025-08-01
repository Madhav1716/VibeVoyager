import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TasteInput } from "@/components/TasteInput";
import { ProcessingState } from "@/components/ProcessingState";
import { VibeResults } from "@/components/VibeResults";
import { useAI } from "@/hooks/use-ai";
import { VibeResult, AIResponseSuccess } from "@/lib/types";
import { logger } from "@/lib/logger";
import { toast } from "@/components/ui/use-toast";
import { List } from "lucide-react";
import { Button } from "@/components/ui/button";

type AppState = 'input' | 'processing' | 'results';

const Index = () => {
  const navigate = useNavigate();
  const [appState, setAppState] = useState<AppState>('input');
  const [userTastes, setUserTastes] = useState<string[]>([]);
  const [currentItinerary, setCurrentItinerary] = useState<VibeResult | null>(null);
  
  const { generateRecommendation } = useAI();

  useEffect(() => {
    logger.debug('App state updated', { 
      appState,
      userTastes,
      hasCurrentItinerary: !!currentItinerary
    });
  }, [appState, userTastes, currentItinerary]);

  const handleTastesSubmit = async (tastes: string[]) => {
    logger.info('Submitting user tastes', { tasteCount: tastes.length });
    setUserTastes(tastes);
    setAppState('processing');
    
    try {
      const result = await generateRecommendation.mutateAsync({ tastes });
      logger.debug('Generated recommendation result', result);
      
      if (result.success && 'data' in result) {
        const response = result as AIResponseSuccess;
        if ('vibe' in response.data) {
          const vibeResult = response.data as VibeResult;
          setCurrentItinerary(vibeResult);
          setAppState('results');
          logger.info('Successfully generated recommendation', { 
            vibe: vibeResult.vibe,
            destination: vibeResult.destination,
            activitiesCount: vibeResult.activities.length
          });
        }
      } else {
        throw new Error('Failed to generate recommendation');
      }
    } catch (err) {
      const error = err as Error;
      logger.error('Error generating recommendation', { error: error.message });
      toast({
        title: 'Error',
        description: 'Failed to generate a travel recommendation. Please try again.',
        variant: 'destructive'
      });
      setAppState('input');
    }
  };

  const handleViewSaved = () => {
    navigate('/saved');
  };

  const handleReset = () => {
    setUserTastes([]);
    setCurrentItinerary(null);
    setAppState('input');
  };

  // Render different states
  if (appState === 'processing') {
    return <ProcessingState tastes={userTastes} />;
  }

  if (appState === 'results' && currentItinerary) {
    return (
      <VibeResults
        tastes={userTastes}
        vibe={currentItinerary.vibe}
        vibeDescription={currentItinerary.vibeDescription}
        destination={currentItinerary.destination}
        activities={currentItinerary.activities}
        onReset={handleReset}
        isAIGenerated={true}
        isQlooEnhanced={!!(currentItinerary as any).qlooDestinations}
        tasteProfile={(currentItinerary as any).tasteProfile || []}
      />
    );
  }

  // Default state: Input form
  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="text-center mb-12 mt-8">
        <h1 className="text-4xl font-bold mb-4">VibeVoyager</h1>
        <p className="text-xl text-stone-600">
          Discover your perfect travel destination based on your cultural tastes
        </p>
      </div>
      
      <TasteInput onSubmit={handleTastesSubmit} />
      
      <div className="mt-8 text-center">
        <Button 
          variant="outline" 
          onClick={handleViewSaved}
          className="flex items-center gap-2 mx-auto"
        >
          <List className="h-4 w-4" />
          View Saved Itineraries
        </Button>
      </div>
    </div>
  );
};

export default Index;
