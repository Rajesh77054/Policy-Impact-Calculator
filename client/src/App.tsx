import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "./contexts/theme-context";
import ErrorBoundary from "./components/error-boundary";
import Home from "./pages/home";
import Calculator from "./pages/calculator";
import Results from "./pages/results";
import HowItWorks from "./pages/how-it-works";
import Methodology from "./pages/methodology";
import Sources from "./pages/sources";
import NotFound from "./pages/not-found";

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/calculator" component={Calculator} />
            <Route path="/results" component={Results} />
            <Route path="/how-it-works" component={HowItWorks} />
            <Route path="/methodology" component={Methodology} />
            <Route path="/sources" component={Sources} />
            <Route component={NotFound} />
          </Switch>
          <Toaster />
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;