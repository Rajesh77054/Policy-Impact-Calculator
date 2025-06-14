import { Link } from "wouter";
import { Calculator, Shield, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingHero() {
  return (
    <section className="bg-gradient-to-br from-primary/5 to-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
          Understand How Policies <span className="text-primary">Affect You</span>
        </h2>
        <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
          Get personalized insights into how different government policies might impact your finances, 
          healthcare, and daily life. Educational, non-partisan, and completely anonymous.
        </p>
        
        {/* Key Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Calculator className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Personal Impact</h3>
            <p className="text-sm text-slate-600">See exactly how policies might affect your taxes, healthcare costs, and job prospects.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">100% Private</h3>
            <p className="text-sm text-slate-600">Your information stays with you. No accounts, no tracking, no data storage.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Educational</h3>
            <p className="text-sm text-slate-600">Learn how policies work with clear explanations and reliable sources.</p>
          </div>
        </div>

        <Link href="/calculator">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-4 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
            Start Your Analysis
          </Button>
        </Link>
        
        <p className="text-sm text-slate-500 mt-4">Takes about 3 minutes • No registration needed</p>
      </div>
    </section>
  );
}
