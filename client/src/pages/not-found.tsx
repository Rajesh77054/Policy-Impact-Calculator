import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-slate-300 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">Page Not Found</h2>
          <p className="text-slate-600 max-w-md mx-auto">
            The page you're looking for doesn't exist. Let's get you back to the calculator.
          </p>
        </div>
        
        <Link href="/">
          <Button className="inline-flex items-center space-x-2">
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}