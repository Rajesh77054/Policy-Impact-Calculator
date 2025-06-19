import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calculator, Users, BarChart3, Lightbulb } from "lucide-react";

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 space-x-2 cursor-pointer">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </div>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PC</span>
              </div>
              <span className="font-semibold text-lg">Policy Impact Calculator</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            How It Works
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Understanding how our Policy Impact Calculator analyzes and presents policy effects
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid gap-8 mb-12">
          <Card className="border-2 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-xl">Step 1: Personal Profile</CardTitle>
                  <CardDescription>Tell us about your situation</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-300">
                We collect basic demographic and economic information to understand how policies might affect someone in your situation. 
                This includes your location, income range, family status, and other relevant factors that influence policy impact.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 dark:border-green-800">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <Calculator className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <CardTitle className="text-xl">Step 2: Policy Analysis</CardTitle>
                  <CardDescription>AI-powered impact calculation</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-300">
                Our AI analyzes the selected policy using verified data sources and academic research. 
                We calculate potential impacts across multiple dimensions including financial, social, and long-term effects 
                based on your specific profile.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 dark:border-purple-800">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-xl">Step 3: Results & Insights</CardTitle>
                  <CardDescription>Personalized impact visualization</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-300">
                We present the analysis through clear visualizations, showing both immediate and long-term impacts. 
                Results include confidence levels, uncertainty ranges, and explanations of how we arrived at each conclusion.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Key Features */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
            <Lightbulb className="w-6 h-6 mr-3 text-yellow-500" />
            Key Features
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Non-Partisan Analysis</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Our calculations are based on academic research and verified data, not political opinions or advocacy positions.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Personalized Results</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Every analysis is tailored to your specific circumstances, providing relevant and actionable insights.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Transparent Methodology</h3>
              <p className="text-slate-600 dark:text-slate-300">
                We show our work, including data sources, assumptions, and confidence levels for complete transparency.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Educational Focus</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Designed to inform and educate, helping users understand policy implications beyond headlines.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link href="/calculator">
            <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 space-x-2 cursor-pointer">
              <Calculator className="w-5 h-5" />
              <span>Try the Calculator</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}