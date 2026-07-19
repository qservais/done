import { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import RealizationsPage from "@/pages/RealizationsPage";
import Legal from "@/pages/Legal";
import Admin from "@/pages/Admin";
import DevisPage from "@/pages/DevisPage";
import Guides from "@/pages/Guides";
import GuideArticle from "@/pages/GuideArticle";
import NotFound from "@/pages/not-found";

function ScrollToTop() {
  const [location] = useLocation();
  
  useEffect(() => {
    // Disable browser's automatic scroll restoration
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    // Force scroll to top immediately
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location]);
  
  // Also scroll on initial mount
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);
  
  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/realisations" component={RealizationsPage} />
        <Route path="/mentions" component={Legal} />
        <Route path="/privacy" component={Legal} />
        <Route path="/cookies" component={Legal} />
        <Route path="/admin" component={Admin} />
        <Route path="/devis" component={DevisPage} />
        <Route path="/guides" component={Guides} />
        <Route path="/guides/:slug" component={GuideArticle} />
        <Route component={NotFound} />
      </Switch>
    </>
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
