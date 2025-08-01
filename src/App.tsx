import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SavedItinerariesPage from "./pages/SavedItinerariesPage";
import ItineraryPage from "./pages/ItineraryPage";

const queryClient = new QueryClient();

// Layout component that includes shared UI elements
const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-stone-50">
    <main className="container mx-auto px-4 py-8">
      {children}
    </main>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <AppLayout>
              <Index />
            </AppLayout>
          } />
          
          <Route path="/saved" element={
            <AppLayout>
              <SavedItinerariesPage />
            </AppLayout>
          } />
          
          <Route path="/itinerary/:id" element={
            <AppLayout>
              <ItineraryPage />
            </AppLayout>
          } />
          
          <Route path="/404" element={
            <AppLayout>
              <NotFound />
            </AppLayout>
          } />
          
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
