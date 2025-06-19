import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Database, Brain, Shield, Target, BookOpen, Users } from "lucide-react";

export default function Methodology() {
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
            Our Methodology
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Understanding the rigorous approach behind our policy impact calculations
          </p>
        </div>

        {/* Core Principles */}
        <div className="grid gap-8 mb-12">
          <Card className="border-2 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <Database className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-xl">Evidence-Based Analysis</CardTitle>
                  <CardDescription>Grounded in peer-reviewed research</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                Our calculations are built on a foundation of academic research, government data, and peer-reviewed studies. 
                We prioritize:
              </p>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                <li>• Congressional Budget Office (CBO) analysis and scoring</li>
                <li>• Academic studies from reputable institutions</li>
                <li>• Historical data from similar policy implementations</li>
                <li>• Economic modeling from established research organizations</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 dark:border-green-800">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <Brain className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <CardTitle className="text-xl">AI-Assisted Modeling</CardTitle>
                  <CardDescription>Advanced algorithms for complex calculations</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                We use machine learning models trained on historical policy outcomes to estimate impacts:
              </p>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                <li>• Natural language processing to analyze policy text</li>
                <li>• Regression models for economic impact estimation</li>
                <li>• Monte Carlo simulations for uncertainty quantification</li>
                <li>• Demographic matching algorithms for personalization</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 dark:border-purple-800">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-xl">Bias Mitigation</CardTitle>
                  <CardDescription>Ensuring objective, non-partisan analysis</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                We implement multiple safeguards to maintain objectivity:
              </p>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                <li>• Cross-validation with multiple data sources</li>
                <li>• Exclusion of politically biased sources</li>
                <li>• Regular auditing of algorithmic outputs</li>
                <li>• Transparent uncertainty and confidence reporting</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Calculation Framework */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
            <Target className="w-6 h-6 mr-3 text-red-500" />
            Impact Calculation Framework
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Direct Effects</h3>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                <li>• Immediate financial impact</li>
                <li>• Tax burden changes</li>
                <li>• Benefit eligibility modifications</li>
                <li>• Service accessibility changes</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Indirect Effects</h3>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                <li>• Economic multiplier effects</li>
                <li>• Market behavior changes</li>
                <li>• Long-term societal impacts</li>
                <li>• Unintended consequences</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Limitations */}
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-8 shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
            <BookOpen className="w-6 h-6 mr-3 text-amber-600" />
            Limitations & Disclaimers
          </h2>
          <div className="space-y-4 text-slate-700 dark:text-slate-300">
            <p>
              <strong>Predictive Nature:</strong> Our calculations represent informed estimates based on available data. 
              Actual policy outcomes may vary due to implementation details, economic conditions, and unforeseen factors.
            </p>
            <p>
              <strong>Simplification:</strong> Complex policies are simplified for analysis. Real-world implementation 
              often involves nuances not captured in our models.
            </p>
            <p>
              <strong>Data Currency:</strong> Analysis is based on the most recent available data, which may not 
              reflect rapid economic or social changes.
            </p>
            <p>
              <strong>Individual Variation:</strong> Personal circumstances can significantly affect actual impacts 
              beyond what demographic categories capture.
            </p>
          </div>
        </div>

        {/* Validation Process */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
            <Users className="w-6 h-6 mr-3 text-blue-500" />
            Validation & Review
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Expert Review</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Our methodology is regularly reviewed by economists, policy analysts, and data scientists 
                from academic institutions.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Continuous Improvement</h3>
              <p className="text-slate-600 dark:text-slate-300">
                We continuously update our models based on new research, feedback, and observed policy outcomes 
                to improve accuracy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}