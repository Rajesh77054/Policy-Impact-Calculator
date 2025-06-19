import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ExternalLink, Building, GraduationCap, FileText, Users } from "lucide-react";

export default function Sources() {
  const sources = [
    {
      category: "Government Sources",
      icon: Building,
      color: "blue",
      items: [
        {
          name: "Congressional Budget Office (CBO)",
          description: "Non-partisan federal agency providing budget and economic analysis",
          url: "https://www.cbo.gov",
          usage: "Primary source for budget impact analysis and economic projections"
        },
        {
          name: "Bureau of Labor Statistics (BLS)",
          description: "Federal statistical agency measuring labor market activity",
          url: "https://www.bls.gov",
          usage: "Employment data, wage statistics, and economic indicators"
        },
        {
          name: "U.S. Census Bureau",
          description: "Principal agency of the U.S. Federal Statistical System",
          url: "https://www.census.gov",
          usage: "Demographic data, income statistics, and population characteristics"
        },
        {
          name: "Federal Reserve Economic Data (FRED)",
          description: "Economic data from the Federal Reserve Bank of St. Louis",
          url: "https://fred.stlouisfed.org",
          usage: "Macroeconomic indicators and financial market data"
        }
      ]
    },
    {
      category: "Academic Institutions",
      icon: GraduationCap,
      color: "green",
      items: [
        {
          name: "National Bureau of Economic Research (NBER)",
          description: "Leading economic research organization",
          url: "https://www.nber.org",
          usage: "Peer-reviewed economic studies and working papers"
        },
        {
          name: "Brookings Institution",
          description: "Non-profit public policy organization",
          url: "https://www.brookings.edu",
          usage: "Policy analysis and research on economic and social issues"
        },
        {
          name: "American Enterprise Institute (AEI)",
          description: "Conservative-leaning think tank",
          url: "https://www.aei.org",
          usage: "Economic policy research and analysis"
        },
        {
          name: "Center on Budget and Policy Priorities",
          description: "Non-partisan research organization",
          url: "https://www.cbpp.org",
          usage: "Federal and state budget analysis and policy research"
        }
      ]
    },
    {
      category: "Research Organizations",
      icon: FileText,
      color: "purple",
      items: [
        {
          name: "Tax Policy Center",
          description: "Joint venture of Urban Institute and Brookings Institution",
          url: "https://www.taxpolicycenter.org",
          usage: "Tax policy analysis and microsimulation modeling"
        },
        {
          name: "Committee for a Responsible Federal Budget",
          description: "Non-partisan organization focused on fiscal responsibility",
          url: "https://www.crfb.org",
          usage: "Federal budget analysis and deficit projections"
        },
        {
          name: "Joint Committee on Taxation (JCT)",
          description: "Non-partisan committee of the U.S. Congress",
          url: "https://www.jct.gov",
          usage: "Official tax analysis for Congress"
        },
        {
          name: "Kaiser Family Foundation",
          description: "Non-profit organization focused on health policy",
          url: "https://www.kff.org",
          usage: "Healthcare policy analysis and data"
        }
      ]
    },
    {
      category: "International Sources",
      icon: Users,
      color: "orange",
      items: [
        {
          name: "Organisation for Economic Co-operation and Development (OECD)",
          description: "International organization promoting economic development",
          url: "https://www.oecd.org",
          usage: "International economic data and policy comparisons"
        },
        {
          name: "International Monetary Fund (IMF)",
          description: "International financial institution",
          url: "https://www.imf.org",
          usage: "Global economic projections and financial stability analysis"
        },
        {
          name: "World Bank",
          description: "International financial institution providing loans and grants",
          url: "https://www.worldbank.org",
          usage: "Development data and poverty statistics"
        }
      ]
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20",
      green: "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20",
      purple: "border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20",
      orange: "border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20"
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const getIconColorClasses = (color: string) => {
    const colorMap = {
      blue: "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400",
      green: "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400",
      purple: "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400",
      orange: "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400"
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" className="inline-flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Button>
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Data Sources
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Our analysis relies on authoritative, non-partisan sources to ensure accuracy and credibility
          </p>
        </div>

        {/* Sources by Category */}
        <div className="space-y-12">
          {sources.map((category) => (
            <div key={category.category}>
              <div className="flex items-center mb-6">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${getIconColorClasses(category.color)}`}>
                  <category.icon className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {category.category}
                </h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {category.items.map((source) => (
                  <Card key={source.name} className={`border-2 ${getColorClasses(category.color)}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{source.name}</CardTitle>
                          <CardDescription className="mt-1">{source.description}</CardDescription>
                        </div>
                        <a 
                          href={source.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-slate-900 dark:text-white mb-1">How We Use It:</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-300">{source.usage}</p>
                        </div>
                        <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                          <a 
                            href={source.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center"
                          >
                            Visit Source
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Data Quality Standards */}
        <div className="mt-16 bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            Data Quality Standards
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Source Selection Criteria</h3>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                <li>• Non-partisan or balanced political perspective</li>
                <li>• Peer-reviewed or institutionally validated</li>
                <li>• Transparent methodology and data collection</li>
                <li>• Regular updates and data maintenance</li>
                <li>• Established reputation in relevant field</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Data Validation Process</h3>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                <li>• Cross-verification with multiple sources</li>
                <li>• Regular auditing of data accuracy</li>
                <li>• Version control and update tracking</li>
                <li>• Expert review of source reliability</li>
                <li>• Continuous monitoring for data quality</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-amber-50 dark:bg-amber-900/20 rounded-xl p-6 shadow-lg">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Important Note</h3>
          <p className="text-slate-700 dark:text-slate-300">
            While we strive to use the most reliable and current data available, policy analysis involves 
            inherent uncertainties. Our calculations represent informed estimates based on the best available 
            information and should be considered as educational tools rather than definitive predictions.
          </p>
        </div>
      </div>
    </div>
  );
}