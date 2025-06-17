import { Link } from "wouter";
import LandingHero from "@/components/landing-hero";
import ThemeSelector from "@/components/theme-selector";
import { Shield, CheckCircle, BookOpen } from "lucide-react";
// Using direct path to public directory

export default function Home() {
  return (
    <div className="min-h-screen cyberpunk-bg">
      {/* Navigation Header */}
      <header className="backdrop-blur-md border-b border-white/20 sticky top-0 z-50 glass-droplet">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">PC</span>
              </div>
              <h1 className="text-xl font-semibold text-foreground">Policy Impact Calculator</h1>
            </div>
            {/* Trust Indicators and Theme Selector */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-6">
                <div className="flex items-center space-x-2 text-emerald-600">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm font-medium">100% Anonymous - No Data Shared</span>
                </div>
                <div className="flex items-center space-x-2 text-emerald-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">No Political Agenda</span>
                </div>
              </div>
              <ThemeSelector />
            </div>
          </div>
        </div>
      </header>

      <LandingHero />

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">PC</span>
                </div>
                <span className="font-semibold">Policy Impact Calculator</span>
              </div>
              <p className="text-sm text-slate-400">
                Educational, non-partisan policy analysis tool. Understand how policies affect you personally.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">About</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">How it works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Methodology</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Sources</a></li>
                <li><Link href="/theme-demo" className="hover:text-white transition-colors">Theme Demo</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Privacy</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Use</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Data Security</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Feedback</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Report Issue</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-8 pt-8 text-sm text-slate-400">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <p>&copy; 2024 Policy Impact Calculator. Educational use only.</p>
              <p className="mt-2 sm:mt-0">Made with ❤️ for civic education</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
