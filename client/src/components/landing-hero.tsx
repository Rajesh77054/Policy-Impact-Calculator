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
          <div className="p-6 rounded-xl relative overflow-hidden" style={{
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(3px) saturate(140%) brightness(105%)',
            WebkitBackdropFilter: 'blur(3px) saturate(140%) brightness(105%)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            boxShadow: '0 6px 24px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.15), inset -1px -1px 3px rgba(255, 255, 255, 0.05), inset 1px 1px 3px rgba(255, 255, 255, 0.1)'
          }}>
            <div 
              className="absolute inset-0 rounded-xl pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, transparent 25%, transparent 75%, rgba(255, 255, 255, 0.04) 100%)',
                borderRadius: '20px'
              }}
            />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4" style={{ background: 'transparent' }}>
                <Calculator className="w-6 h-6 text-blue-300" />
              </div>
              <h3 className="font-semibold text-white mb-2 drop-shadow-lg">Your Personal Impact</h3>
              <p className="text-sm text-white/90 drop-shadow-md">See exactly how new policies might affect your taxes, healthcare costs, energy bills, and job opportunities in 3 minutes.</p>
            </div>
          </div>
          
          <div className="p-6 rounded-xl relative overflow-hidden" style={{
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(3px) saturate(140%) brightness(105%)',
            WebkitBackdropFilter: 'blur(3px) saturate(140%) brightness(105%)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            boxShadow: '0 6px 24px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.15), inset -1px -1px 3px rgba(255, 255, 255, 0.05), inset 1px 1px 3px rgba(255, 255, 255, 0.1)'
          }}>
            <div 
              className="absolute inset-0 rounded-xl pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, transparent 25%, transparent 75%, rgba(255, 255, 255, 0.04) 100%)',
                borderRadius: '20px'
              }}
            />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4" style={{ background: 'transparent' }}>
                <Shield className="w-6 h-6 text-emerald-300" />
              </div>
              <h3 className="font-semibold text-white mb-2 drop-shadow-lg">100% Private</h3>
              <p className="text-sm text-white/90 drop-shadow-md">Your information stays with you. No accounts, no tracking, no data storage.</p>
            </div>
          </div>
          
          <div className="p-6 rounded-xl relative overflow-hidden" style={{
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(3px) saturate(140%) brightness(105%)',
            WebkitBackdropFilter: 'blur(3px) saturate(140%) brightness(105%)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            boxShadow: '0 6px 24px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.15), inset -1px -1px 3px rgba(255, 255, 255, 0.05), inset 1px 1px 3px rgba(255, 255, 255, 0.1)'
          }}>
            <div 
              className="absolute inset-0 rounded-xl pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, transparent 25%, transparent 75%, rgba(255, 255, 255, 0.04) 100%)',
                borderRadius: '20px'
              }}
            />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4" style={{ background: 'transparent' }}>
                <BookOpen className="w-6 h-6 text-amber-300" />
              </div>
              <h3 className="font-semibold text-white mb-2 drop-shadow-lg">Educational</h3>
              <p className="text-sm text-white/90 drop-shadow-md">Learn how policies work with clear explanations and reliable sources.</p>
            </div>
          </div>
        </div>

        <Link href="/calculator">
          <div className="relative inline-block">
            <Button 
              size="lg" 
              className="text-lg px-8 py-4 text-white hover:text-white drop-shadow-lg relative overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(3px) saturate(130%) brightness(108%)',
                WebkitBackdropFilter: 'blur(3px) saturate(130%) brightness(108%)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '12px',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.18), inset -1px -1px 3px rgba(255, 255, 255, 0.08), inset 1px 1px 3px rgba(255, 255, 255, 0.12)'
              }}
            >
              <div 
                className="absolute inset-0 rounded-xl pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 30%, transparent 70%, rgba(255, 255, 255, 0.05) 100%)',
                  borderRadius: '12px'
                }}
              />
              <span className="relative z-10">Start Your Analysis</span>
            </Button>
          </div>
        </Link>
        
        <p className="text-sm text-muted-foreground mt-4">Takes about 3 minutes • No registration needed</p>
      </div>
    </section>
  );
}
