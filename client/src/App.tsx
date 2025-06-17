import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "./contexts/theme-context";
import { BackgroundProvider } from "./contexts/BackgroundContext";
import ErrorBoundary from "./components/error-boundary";
import Home from "./pages/home";
import Calculator from "./pages/calculator";
import Results from "./pages/results";
import ThemeDemoPage from "./pages/theme-demo";
import NotFound from "./pages/not-found";

function App() {
  return (
    <ErrorBoundary>
      <BackgroundProvider>
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/calculator" component={Calculator} />
              <Route path="/results" component={Results} />
              <Route path="/theme-demo" component={ThemeDemoPage} />
              <Route component={NotFound} />
            </Switch>
            <Toaster />
          </QueryClientProvider>
        </ThemeProvider>
      </BackgroundProvider>
    </ErrorBoundary>
  );
}

export default App;