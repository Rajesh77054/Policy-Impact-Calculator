import { Link } from "wouter";
import { ArrowLeft, CheckCircle, Shield, Calculator, BarChart3, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">PC</span>
              </div>
              <h1 className="text-xl font-semibold text-foreground">Policy Impact Calculator</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-6">
                <div className="flex items-center space-x-2 text-emerald-600">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm font-medium">100% Anonymous</span>
                </div>
                <div className="flex items-center space-x-2 text-emerald-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">No Political Agenda</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Navigation */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="inline-flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Button>
          </Link>
        </div>

        <div className="space-y-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">How It Works</h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our calculator uses real government data to show you exactly how policy changes would affect your personal finances.
            </p>
          </div>

          {/* Process Steps */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">1. Share Your Info</h3>
              <p className="text-slate-600">
                Tell us about your location, family situation, income, and priorities. All information is anonymous.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calculator className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">2. We Calculate</h3>
              <p className="text-slate-600">
                Our system uses official IRS tax brackets, healthcare data, and economic indicators to calculate your impact.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">3. See Results</h3>
              <p className="text-slate-600">
                Get personalized charts showing how policies affect your taxes, healthcare costs, and long-term finances.
              </p>
            </div>
          </div>

          {/* Key Features */}
          <div className="bg-slate-50 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">What Makes Us Different</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-slate-900">Real Government Data</h4>
                  <p className="text-slate-600 text-sm">
                    We use official sources like IRS tax brackets, Bureau of Labor Statistics, and Federal Reserve data.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-slate-900">Completely Anonymous</h4>
                  <p className="text-slate-600 text-sm">
                    No registration required. Your data is never stored or shared.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-slate-900">Non-Partisan Analysis</h4>
                  <p className="text-slate-600 text-sm">
                    We present facts and calculations without political bias or recommendations.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-slate-900">Personalized Results</h4>
                  <p className="text-slate-600 text-sm">
                    Every calculation is tailored to your specific situation and location.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link href="/calculator">
              <Button size="lg" className="px-8 py-3">
                Try the Calculator
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}