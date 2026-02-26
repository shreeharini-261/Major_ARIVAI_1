import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import Recipes from "@/pages/Recipes";
import Meditation from "@/pages/Meditation";
import Education from "@/pages/Education";
import Chat from "@/pages/Chat";
import Profile from "@/pages/Profile";
import Onboarding from "@/pages/Onboarding";

interface OnboardingData {
  isCompleted: boolean;
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  const { data: onboardingData, isLoading: onboardingLoading } = useQuery<OnboardingData>({
    queryKey: ["/api/onboarding"],
    enabled: isAuthenticated,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1C0D0A] flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-[#E67E22]/20 flex items-center justify-center mx-auto mb-6 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-[#E67E22]" />
          </div>
          <h2 className="text-2xl font-serif text-[#F5E6D3] mb-2">ARIVAI</h2>
          <p className="text-[#F5E6D3]/60 italic">Nurturing your cycle, naturally...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/" component={Landing} />
        <Route component={Landing} />
      </Switch>
    );
  }

  if (onboardingLoading) {
    return (
      <div className="min-h-screen bg-[#1C0D0A] flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-[#E67E22]/20 flex items-center justify-center mx-auto mb-6 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-[#E67E22]" />
          </div>
          <h2 className="text-2xl font-serif text-[#F5E6D3] mb-2">ARIVAI</h2>
          <p className="text-[#F5E6D3]/60 italic">Nurturing your cycle, naturally...</p>
        </div>
      </div>
    );
  }

  if (!onboardingData?.isCompleted) {
    return <Onboarding />;
  }

  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/recipes" component={Recipes} />
      <Route path="/meditation" component={Meditation} />
      <Route path="/education" component={Education} />
      <Route path="/chat" component={Chat} />
      <Route path="/profile" component={Profile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
