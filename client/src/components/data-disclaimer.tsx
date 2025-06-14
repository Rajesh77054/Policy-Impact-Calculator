import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DataDisclaimer() {
  return (
    <Alert className="mb-8 bg-blue-50 border-blue-200">
      <AlertTriangle className="h-4 w-4 text-blue-600" />
      <AlertDescription className="text-blue-800">
        <div className="space-y-2">
          <p className="font-medium">Data Sources & Accuracy</p>
          <p className="text-sm">
            This calculator uses real data from authoritative sources including the IRS, Kaiser Family Foundation, 
            Congressional Budget Office, and Tax Foundation. All calculations follow established government methodologies.
          </p>
          <div className="flex flex-wrap gap-4 text-xs mt-3">
            <a 
              href="https://www.irs.gov/newsroom/irs-provides-tax-inflation-adjustments-for-tax-year-2024" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-blue-700 hover:text-blue-900 underline"
            >
              IRS Tax Data <ExternalLink className="w-3 h-3 ml-1" />
            </a>
            <a 
              href="https://www.kff.org/health-costs/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-blue-700 hover:text-blue-900 underline"
            >
              Healthcare Costs <ExternalLink className="w-3 h-3 ml-1" />
            </a>
            <a 
              href="https://www.cbo.gov/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-blue-700 hover:text-blue-900 underline"
            >
              CBO Methodology <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </div>
          <p className="text-xs mt-2 text-blue-700">
            Results are estimates for educational purposes. Consult tax professionals for financial planning decisions.
          </p>
        </div>
      </AlertDescription>
    </Alert>
  );
}