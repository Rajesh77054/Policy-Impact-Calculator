import { Link } from "wouter";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import MethodologyModal from "@/components/methodology-modal";

export default function Methodology() {
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

        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Methodology</h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our calculations are based on official government data and established economic methodologies.
            </p>
          </div>

          {/* Methodology Overview */}
          <div className="bg-white rounded-xl border border-slate-200 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Calculation Overview</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Tax Impact Calculations</h3>
                <p className="text-slate-600 mb-3">
                  We calculate your tax impact using current IRS tax brackets and standard deductions, then compare them to proposed policy changes:
                </p>
                <ul className="list-disc list-inside text-slate-600 space-y-1 ml-4">
                  <li>Federal income tax brackets for 2024</li>
                  <li>Standard deductions by filing status</li>
                  <li>Child Tax Credit and other dependent credits</li>
                  <li>State-specific income tax rates</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Healthcare Cost Analysis</h3>
                <p className="text-slate-600 mb-3">
                  Healthcare cost calculations use data from the Kaiser Family Foundation and include:
                </p>
                <ul className="list-disc list-inside text-slate-600 space-y-1 ml-4">
                  <li>Average premium costs by coverage type</li>
                  <li>Typical deductible amounts</li>
                  <li>Prescription drug costs</li>
                  <li>Regional cost variations</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Economic Context</h3>
                <p className="text-slate-600 mb-3">
                  We incorporate real-time economic indicators from the Federal Reserve:
                </p>
                <ul className="list-disc list-inside text-slate-600 space-y-1 ml-4">
                  <li>Unemployment rates (national and state)</li>
                  <li>Inflation trends</li>
                  <li>GDP growth projections</li>
                  <li>Interest rate impacts</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Detailed Methodology Modal */}
          <div className="text-center">
            <MethodologyModal 
              trigger={
                <Button variant="outline" size="lg">
                  View Detailed Methodology
                </Button>
              }
            />
          </div>

          {/* Limitations */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-amber-800 mb-3">Important Limitations</h3>
            <ul className="list-disc list-inside text-amber-700 space-y-2 text-sm">
              <li>Calculations are estimates based on current law and available data</li>
              <li>Individual circumstances may vary significantly</li>
              <li>Economic projections are subject to uncertainty</li>
              <li>State and local tax variations may not be fully captured</li>
              <li>This tool is for educational purposes only, not financial advice</li>
            </ul>
          </div>

          {/* Data Sources Link */}
          <div className="text-center">
            <Link href="/sources">
              <Button variant="ghost" className="inline-flex items-center space-x-2">
                <span>View Data Sources</span>
                <ExternalLink className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}