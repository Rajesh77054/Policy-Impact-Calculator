import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "./contexts/theme-context";
import ErrorBoundary from "./components/error-boundary";
import { useAuth } from "@/hooks/useAuth";
import Landing from "./components/landing";
import Home from "./components/home";
import Calculator from "./pages/calculator";
import Results from "./pages/results";
import HowItWorks from "./pages/how-it-works";
import Methodology from "./pages/methodology";
import Sources from "./pages/sources";
import NotFound from "./pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/calculator" component={Calculator} />
          <Route path="/results" component={Results} />
          <Route path="/how-it-works" component={HowItWorks} />
          <Route path="/methodology" component={Methodology} />
          <Route path="/sources" component={Sources} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <Router />
          <Toaster />
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;