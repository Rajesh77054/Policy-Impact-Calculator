import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import ErrorBoundary from "./components/error-boundary";
import Home from "./pages/home";
import Calculator from "./pages/calculator";
import Results from "./pages/results";
import NotFound from "./pages/not-found";

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/calculator" component={Calculator} />
          <Route path="/results" component={Results} />
          <Route component={NotFound} />
        </Switch>
        <Toaster />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;