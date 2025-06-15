
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, ChevronDown, ChevronUp, Lightbulb, Clock, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContextualHelpProps {
  step: number;
  title: string;
  className?: string;
}

const helpContent = {
  1: {
    why: "Your location helps us calculate state-specific taxes, cost of living adjustments, and regional policy impacts.",
    tips: [
      "ZIP code auto-detects your state for more accurate calculations",
      "State tax rates vary significantly (0% in TX/FL to 13%+ in CA)",
      "Cost of living affects how policy changes impact your budget"
    ],
    timeAdvice: "This usually takes 30 seconds if you know your ZIP code"
  },
  2: {
    why: "Age and family status affect tax brackets, healthcare costs, and benefit eligibility.",
    tips: [
      "Family status determines standard deduction amounts",
      "Age affects healthcare cost estimates",
      "Children may qualify for additional tax credits and benefits"
    ],
    timeAdvice: "Quick demographic info - about 1 minute"
  },
  3: {
    why: "Employment status affects healthcare access, tax withholdings, and policy benefit eligibility.",
    tips: [
      "Full-time employees often have employer health insurance",
      "Self-employed individuals face different tax implications",
      "Student status may affect healthcare and tax calculations"
    ],
    timeAdvice: "Select your primary employment situation"
  },
  4: {
    why: "Current healthcare coverage determines how health policy changes would affect your costs.",
    tips: [
      "Employer insurance vs. marketplace plans have different cost structures",
      "Uninsured individuals see the biggest potential healthcare savings",
      "Government programs (Medicare/Medicaid) have specific policy implications"
    ],
    timeAdvice: "Healthcare info affects major cost calculations"
  },
  5: {
    why: "Income determines tax brackets, benefit eligibility, and the scale of policy impacts.",
    tips: [
      "Higher incomes see larger absolute tax changes",
      "Income affects healthcare subsidy eligibility",
      "Tax bracket changes vary significantly by income level"
    ],
    timeAdvice: "Use the slider for precision or ranges for privacy"
  },
  6: {
    why: "Your priorities help us highlight the most relevant policy impacts for your situation.",
    tips: [
      "Focus on what matters most to your family's financial planning",
      "Different priorities emphasize different calculation aspects",
      "This helps customize your results presentation"
    ],
    timeAdvice: "Final step - rank what matters most to you"
  }
};

export default function ContextualHelp({ step, title, className }: ContextualHelpProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const content = helpContent[step as keyof typeof helpContent];

  if (!content) return null;

  return (
    <Card className={cn("border-blue-100 bg-blue-50/30", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            <CardTitle className="text-sm font-medium text-blue-900">
              Why do we need this information?
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-6 px-2 text-blue-700"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-0">
          <div className="space-y-4">
            <p className="text-sm text-blue-800">{content.why}</p>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-1">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-medium text-slate-700">Helpful Tips:</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-1 ml-5">
                {content.tips.map((tip, index) => (
                  <li key={index} className="list-disc">{tip}</li>
                ))}
              </ul>
            </div>

            <div className="flex items-center space-x-2 pt-2 border-t border-blue-200">
              <Clock className="w-4 h-4 text-slate-500" />
              <span className="text-xs text-slate-600">{content.timeAdvice}</span>
            </div>

            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-green-600" />
              <span className="text-xs text-slate-600">All information is anonymous and never stored</span>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
