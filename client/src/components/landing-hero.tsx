import { Link } from "wouter";
import { Calculator, Shield, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingHero() {
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg">
          Discover How Trump's Policies Impact Your <span className="text-[#ffffff]">Finances, Work & Future</span>
        </h1>
        <h2 className="text-xl text-white/90 mb-8 max-w-3xl mx-auto drop-shadow-md">
          See what changes to taxes, healthcare, energy costs and more could mean for your household - no spin, just the facts.
        </h2>
        
        {/* Key Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="apple-glass-card apple-glass-tertiary">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 apple-glass-secondary">
              <Calculator className="w-6 h-6 text-blue-300" />
            </div>
            <h3 className="font-semibold text-white mb-2 drop-shadow-lg">Your Personal Impact</h3>
            <p className="text-sm text-white/90 drop-shadow-md">See exactly how new policies might affect your taxes, healthcare costs, energy bills, and job opportunities in 3 minutes.</p>
          </div>
          
          <div className="apple-glass-card apple-glass-tertiary">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 apple-glass-secondary">
              <Shield className="w-6 h-6 text-emerald-300" />
            </div>
            <h3 className="font-semibold text-white mb-2 drop-shadow-lg">100% Private</h3>
            <p className="text-sm text-white/90 drop-shadow-md">Your information stays with you. No accounts, no tracking, no data storage.</p>
          </div>
          
          <div className="apple-glass-card apple-glass-tertiary">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 apple-glass-secondary">
              <BookOpen className="w-6 h-6 text-amber-300" />
            </div>
            <h3 className="font-semibold text-white mb-2 drop-shadow-lg">Educational</h3>
            <p className="text-sm text-white/90 drop-shadow-md">Learn how policies work with clear explanations and reliable sources.</p>
          </div>
        </div>

        <Link href="/calculator">
          <Button 
            size="lg" 
            className="apple-glass-card apple-glass-tertiary text-lg px-8 py-4 text-white hover:text-white drop-shadow-lg border-0.5 border-white/18"
          >
            Start Your Analysis
          </Button>
        </Link>
        
        <p className="text-sm text-muted-foreground mt-4">Takes about 3 minutes • No registration needed</p>
      </div>
    </section>
  );
}
