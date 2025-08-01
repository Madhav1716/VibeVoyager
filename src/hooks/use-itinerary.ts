import { useState } from "react";
import type { DayPlan, Activity } from "@/lib/types";
import { aiService } from "@/lib/ai-service";
import { logger } from "@/lib/logger";

export function useItinerary(
  destination: string,
  initialDay: DayPlan,
  tastes: string[]
) {
  const [days, setDays] = useState<DayPlan[]>([initialDay]);
  const [isAdding, setIsAdding] = useState(false);

  const addDay = async () => {
    if (days.length >= 7) return;
    setIsAdding(true);
    try {
      const acts: Activity[] = await aiService.addItineraryDay(
        destination,
        days,
        tastes
      );
      setDays([...days, { day: days.length + 1, activities: acts }]);
    } catch (err) {
      logger.error("Add-day failed", err);
    } finally {
      setIsAdding(false);
    }
  };

  return { days, addDay, isAdding };
}
