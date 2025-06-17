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
          <div className="p-6 rounded-xl" style={{
            background: 'rgba(255, 255, 255, 0.09)',
            backdropFilter: 'blur(25px) saturate(200%) brightness(115%)',
            WebkitBackdropFilter: 'blur(25px) saturate(200%) brightness(115%)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            borderRadius: '20px',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
          }}>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4" style={{ background: 'transparent' }}>
              <Calculator className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="font-semibold text-white mb-2">Your Personal Impact</h3>
            <p className="text-sm text-white/80">See exactly how new policies might affect your taxes, healthcare costs, energy bills, and job opportunities in 3 minutes.</p>
          </div>
          
          <div className="p-6 rounded-xl" style={{
            background: 'rgba(255, 255, 255, 0.09)',
            backdropFilter: 'blur(25px) saturate(200%) brightness(115%)',
            WebkitBackdropFilter: 'blur(25px) saturate(200%) brightness(115%)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            borderRadius: '20px',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
          }}>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4" style={{ background: 'transparent' }}>
              <Shield className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="font-semibold text-white mb-2">100% Private</h3>
            <p className="text-sm text-white/80">Your information stays with you. No accounts, no tracking, no data storage.</p>
          </div>
          
          <div className="p-6 rounded-xl" style={{
            background: 'rgba(255, 255, 255, 0.09)',
            backdropFilter: 'blur(25px) saturate(200%) brightness(115%)',
            WebkitBackdropFilter: 'blur(25px) saturate(200%) brightness(115%)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            borderRadius: '20px',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
          }}>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4" style={{ background: 'transparent' }}>
              <BookOpen className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="font-semibold text-white mb-2">Educational</h3>
            <p className="text-sm text-white/80">Learn how policies work with clear explanations and reliable sources.</p>
          </div>
        </div>

        <Link href="/calculator">
          <Button 
            size="lg" 
            className="text-lg px-8 py-4 text-white hover:text-white"
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(20px) saturate(180%) brightness(110%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%) brightness(110%)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              borderRadius: '12px',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
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
