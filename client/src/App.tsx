import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/dashboard";
import ContentLibrary from "@/pages/content-library";
import BatchProcessing from "@/pages/batch-processing";
import ApiServices from "@/pages/api-services";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";
import AppLayout from "@/components/layout/app-layout";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/content-library" component={ContentLibrary} />
      <Route path="/batch-processing" component={BatchProcessing} />
      <Route path="/api-services" component={ApiServices} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppLayout>
          <Router />
        </AppLayout>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
