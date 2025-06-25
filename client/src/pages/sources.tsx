import { Link } from "wouter";
import { ArrowLeft, ExternalLink, Shield, Database, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Sources() {
  const dataSources = [
    {
      category: "Tax Information",
      icon: <Database className="w-5 h-5" />,
      sources: [
        {
          name: "Internal Revenue Service (IRS)",
          organization: "U.S. Department of Treasury",
          description: "Official tax brackets, standard deductions, and tax calculation methodologies",
          url: "https://www.irs.gov",
          lastUpdated: "2024",
          credibility: "government" as const
        },
        {
          name: "Tax Foundation",
          organization: "Tax Foundation",
          description: "State tax data and policy analysis",
          url: "https://taxfoundation.org",
          lastUpdated: "2024",
          credibility: "nonpartisan" as const
        }
      ]
    },
    {
      category: "Economic Data",
      icon: <BookOpen className="w-5 h-5" />,
      sources: [
        {
          name: "Federal Reserve Economic Data (FRED)",
          organization: "Federal Reserve Bank of St. Louis",
          description: "Economic indicators, unemployment rates, inflation data, and GDP statistics",
          url: "https://fred.stlouisfed.org",
          lastUpdated: "Real-time",
          credibility: "government" as const
        },
        {
          name: "Bureau of Labor Statistics",
          organization: "U.S. Department of Labor",
          description: "Employment data, wage statistics, and Consumer Price Index",
          url: "https://www.bls.gov",
          lastUpdated: "Monthly",
          credibility: "government" as const
        }
      ]
    },
    {
      category: "Healthcare Data",
      icon: <Shield className="w-5 h-5" />,
      sources: [
        {
          name: "Kaiser Family Foundation",
          organization: "Kaiser Family Foundation",
          description: "Healthcare cost data, insurance statistics, and coverage analysis",
          url: "https://www.kff.org",
          lastUpdated: "2024",
          credibility: "nonpartisan" as const
        },
        {
          name: "Centers for Medicare & Medicaid Services",
          organization: "U.S. Department of Health and Human Services",
          description: "Healthcare spending data and Medicare/Medicaid statistics",
          url: "https://www.cms.gov",
          lastUpdated: "2024",
          credibility: "government" as const
        }
      ]
    },
    {
      category: "Policy Analysis",
      icon: <BookOpen className="w-5 h-5" />,
      sources: [
        {
          name: "Congressional Budget Office",
          organization: "U.S. Congress",
          description: "Policy impact analysis and budget projections",
          url: "https://www.cbo.gov",
          lastUpdated: "2024",
          credibility: "government" as const
        },
        {
          name: "Joint Committee on Taxation",
          organization: "U.S. Congress",
          description: "Tax policy analysis and revenue estimates",
          url: "https://www.jct.gov",
          lastUpdated: "2024",
          credibility: "government" as const
        }
      ]
    }
  ];

  const getCredibilityBadge = (credibility: string) => {
    switch (credibility) {
      case "government":
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">Government</span>;
      case "nonpartisan":
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">Non-partisan</span>;
      case "academic":
        return <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded">Academic</span>;
      default:
        return null;
    }
  };

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
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Data Sources</h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              All calculations are based on official government data and trusted non-partisan sources.
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-6 h-6 text-emerald-600" />
              <h2 className="text-lg font-semibold text-emerald-800">Our Commitment to Accuracy</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-emerald-700">Only official government sources</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-emerald-700">Non-partisan research organizations</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-emerald-700">Real-time economic data</span>
              </div>
            </div>
          </div>

          {/* Data Sources by Category */}
          <div className="space-y-8">
            {dataSources.map((category, categoryIndex) => (
              <div key={categoryIndex} className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                    {category.icon}
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">{category.category}</h2>
                </div>

                <div className="space-y-4">
                  {category.sources.map((source, sourceIndex) => (
                    <div key={sourceIndex} className="border border-slate-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-1">
                            <h3 className="font-semibold text-slate-900">{source.name}</h3>
                            {getCredibilityBadge(source.credibility)}
                          </div>
                          <p className="text-sm text-slate-600 mb-1">{source.organization}</p>
                          <p className="text-sm text-slate-700">{source.description}</p>
                        </div>
                        <a 
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm ml-4"
                        >
                          <span>Visit</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <div className="text-xs text-slate-500">
                        Last updated: {source.lastUpdated}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Disclaimer */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-3">Data Disclaimer</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              While we strive for accuracy and use only authoritative sources, this tool provides estimates 
              for educational purposes only. Individual circumstances may vary, and results should not be 
              considered as professional financial, tax, or legal advice. Always consult qualified 
              professionals for specific guidance.
            </p>
          </div>

          {/* Back to Methodology */}
          <div className="text-center">
            <Link href="/methodology">
              <Button variant="outline">
                View Calculation Methodology
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}