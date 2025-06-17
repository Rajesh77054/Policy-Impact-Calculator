import { Link } from "wouter";
import { Calculator, Shield, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingHero() {
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 gradient-text">
          Discover How Trump's Policies Impact Your <span className="text-primary">Finances, Work & Future</span>
        </h1>
        <h2 className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          See what changes to taxes, healthcare, energy costs and more could mean for your household - no spin, just the facts.
        </h2>
        
        {/* Key Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="glass-droplet glow-on-hover floating-content p-6 rounded-xl">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 floating">
              <Calculator className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-card-foreground mb-2">Your Personal Impact</h3>
            <p className="text-sm text-muted-foreground">See exactly how new policies might affect your taxes, healthcare costs, energy bills, and job opportunities in 3 minutes.</p>
          </div>
          
          <div className="glass-droplet glow-on-hover floating-content p-6 rounded-xl" style={{ animationDelay: '1s' }}>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 floating" style={{ animationDelay: '2s' }}>
              <Shield className="w-6 h-6 text-emerald-500" />
            </div>
            <h3 className="font-semibold text-card-foreground mb-2">100% Private</h3>
            <p className="text-sm text-muted-foreground">Your information stays with you. No accounts, no tracking, no data storage.</p>
          </div>
          
          <div className="glass-droplet glow-on-hover floating-content p-6 rounded-xl" style={{ animationDelay: '2s' }}>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 floating" style={{ animationDelay: '4s' }}>
              <BookOpen className="w-6 h-6 text-amber-500" />
            </div>
            <h3 className="font-semibold text-card-foreground mb-2">Educational</h3>
            <p className="text-sm text-muted-foreground">Learn how policies work with clear explanations and reliable sources.</p>
          </div>
        </div>

        <Link href="/calculator">
          <Button 
            size="lg" 
            className="glass-button glow-on-hover text-lg px-8 py-4 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            onClick={(e) => {
              // Add ripple effect
              const button = e.currentTarget;
              const rect = button.getBoundingClientRect();
              const size = Math.max(rect.width, rect.height);
              const x = e.clientX - rect.left - size / 2;
              const y = e.clientY - rect.top - size / 2;
              
              const ripple = document.createElement('span');
              ripple.className = 'ripple';
              ripple.style.width = ripple.style.height = size + 'px';
              ripple.style.left = x + 'px';
              ripple.style.top = y + 'px';
              
              button.appendChild(ripple);
              setTimeout(() => ripple.remove(), 600);
            }}
          >
            Start Your Analysis
          </Button>
        </Link>
        
        <p className="text-sm text-muted-foreground mt-4">Takes about 3 minutes • No registration needed</p>
      </div>
    </section>
  );
}
