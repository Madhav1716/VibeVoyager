import { useParams } from "react-router-dom";
import { VibeResults } from "@/components/VibeResults";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ItineraryPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // TODO: Fetch the specific itinerary by ID from your data store
  // For now, we'll use a placeholder
  
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      
      <h1 className="text-3xl font-bold mb-8">Your Itinerary</h1>
      
      {/* Replace with actual data fetching */}
      <div className="text-center py-12">
        <p className="text-lg text-stone-600">Loading itinerary #{id}...</p>
      </div>
    </div>
  );
};

export default ItineraryPage;
