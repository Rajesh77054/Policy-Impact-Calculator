import { Link } from "wouter";
import { Calculator, Shield, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/theme-context";

export default function LandingHero() {
  const { theme } = useTheme();
  const isLiquidGlass = theme === 'liquid-glass';
  
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${
          isLiquidGlass 
            ? 'text-white drop-shadow-lg' 
            : 'text-slate-900'
        }`}>
          Discover How Trump's Policies Impact Your <span className={isLiquidGlass ? 'text-[#ffffff]' : 'text-blue-600'}>Finances, Work & Future</span>
        </h1>
        <h2 className={`text-xl mb-8 max-w-3xl mx-auto ${
          isLiquidGlass 
            ? 'text-white/90 drop-shadow-md' 
            : 'text-slate-700'
        }`}>
          See what changes to taxes, healthcare, energy costs and more could mean for your household - no spin, just the facts.
        </h2>
        
        {/* Key Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className={isLiquidGlass ? 'apple-glass-card apple-glass-tertiary' : 'bg-white p-6 rounded-xl shadow-lg border border-slate-200'}>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 ${
              isLiquidGlass 
                ? 'apple-glass-secondary' 
                : 'bg-blue-100'
            }`}>
              <Calculator className={`w-6 h-6 ${isLiquidGlass ? 'text-blue-300' : 'text-blue-600'}`} />
            </div>
            <h3 className={`font-semibold mb-2 ${
              isLiquidGlass 
                ? 'text-white drop-shadow-lg' 
                : 'text-slate-900'
            }`}>Your Personal Impact</h3>
            <p className={`text-sm ${
              isLiquidGlass 
                ? 'text-white/90 drop-shadow-md' 
                : 'text-slate-600'
            }`}>See exactly how new policies might affect your taxes, healthcare costs, energy bills, and job opportunities in 3 minutes.</p>
          </div>
          
          <div className={isLiquidGlass ? 'apple-glass-card apple-glass-tertiary' : 'bg-white p-6 rounded-xl shadow-lg border border-slate-200'}>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 ${
              isLiquidGlass 
                ? 'apple-glass-secondary' 
                : 'bg-emerald-100'
            }`}>
              <Shield className={`w-6 h-6 ${isLiquidGlass ? 'text-emerald-300' : 'text-emerald-600'}`} />
            </div>
            <h3 className={`font-semibold mb-2 ${
              isLiquidGlass 
                ? 'text-white drop-shadow-lg' 
                : 'text-slate-900'
            }`}>100% Private</h3>
            <p className={`text-sm ${
              isLiquidGlass 
                ? 'text-white/90 drop-shadow-md' 
                : 'text-slate-600'
            }`}>Your information stays with you. No accounts, no tracking, no data storage.</p>
          </div>
          
          <div className={isLiquidGlass ? 'apple-glass-card apple-glass-tertiary' : 'bg-white p-6 rounded-xl shadow-lg border border-slate-200'}>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 ${
              isLiquidGlass 
                ? 'apple-glass-secondary' 
                : 'bg-amber-100'
            }`}>
              <BookOpen className={`w-6 h-6 ${isLiquidGlass ? 'text-amber-300' : 'text-amber-600'}`} />
            </div>
            <h3 className={`font-semibold mb-2 ${
              isLiquidGlass 
                ? 'text-white drop-shadow-lg' 
                : 'text-slate-900'
            }`}>Educational</h3>
            <p className={`text-sm ${
              isLiquidGlass 
                ? 'text-white/90 drop-shadow-md' 
                : 'text-slate-600'
            }`}>Learn how policies work with clear explanations and reliable sources.</p>
          </div>
        </div>

        <Link href="/calculator">
          <Button 
            size="lg" 
            className="text-lg px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold border-0 rounded-lg transition-colors duration-200"
          >
            Start Your Analysis
          </Button>
        </Link>
        
        <p className={`text-sm mt-4 ${
          isLiquidGlass 
            ? 'text-muted-foreground' 
            : 'text-slate-500'
        }`}>Takes about 3 minutes • No registration needed</p>
      </div>
    </section>
  );
}
