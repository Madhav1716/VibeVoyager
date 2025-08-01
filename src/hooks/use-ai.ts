import { useMutation, useQuery } from '@tanstack/react-query';
import { aiService } from '@/lib/ai-service';
import { AIRequest, AIResponse } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

export const useAI = () => {
  const { toast } = useToast();

  // Test AI connection
  const connectionTest = useQuery({
    queryKey: ['ai-connection'],
    queryFn: async () => {
      logger.debug('Testing AI connection');
      const isConnected = await aiService.testConnection();
      logger.info('AI connection test completed', { isConnected });
      return isConnected;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });

  // Generate vibe recommendation
  const generateRecommendation = useMutation({
    mutationFn: async (request: AIRequest) => {
      logger.info('Starting AI recommendation generation', { tasteCount: request.tastes.length });
      const result = await aiService.generateVibeRecommendation(request);
      logger.info('Completed AI recommendation generation', { 
        success: result.success,
        fallbackUsed: result.fallbackUsed,
        qlooUsed: result.qlooUsed
      });
      return result;
    },
    onSuccess: (response: AIResponse) => {
      if (response.fallbackUsed) {
        logger.warn('Using fallback recommendations');
        toast({
          title: "Using Demo Mode 🎭",
          description: "AI is offline, showing you curated recommendations instead.",
          variant: "default",
        });
      } else if (response.qlooUsed) {
        logger.info('Successfully used AI with Qloo cultural data');
        toast({
          title: "AI + Cultural Intelligence! 🧠",
          description: "Your vibe was generated using AI and cultural data analysis.",
          variant: "default",
        });
      } else {
        logger.info('Successfully used AI without Qloo data');
        toast({
          title: "AI Powered! 🤖",
          description: "Your personalized travel vibe has been generated with AI.",
          variant: "default",
        });
      }
    },
    onError: (error: Error) => {
      logger.error('AI recommendation generation failed', error instanceof Error ? error : new Error(String(error)));
      toast({
        title: "Oops! Something went wrong",
        description: "We're using our curated recommendations for now. Please try again later.",
        variant: "destructive",
      });
    },
  });

  return {
    connectionTest,
    generateRecommendation,
    isAIAvailable: connectionTest.data,
    isLoading: generateRecommendation.isPending,
    isError: generateRecommendation.isError,
    error: generateRecommendation.error,
  };
}; 