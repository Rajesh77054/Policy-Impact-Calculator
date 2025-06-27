import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  BookOpen,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react";
import { POLICY_COMPARISONS, POLICY_COMPARISON_METADATA, PolicyComparison } from "../data/policy-comparison-data";
import MethodologyModal from "./methodology-modal";

interface PolicyComparisonTableProps {
  className?: string;
}

const getImpactIcon = (impactType: PolicyComparison["impactType"]) => {
  switch (impactType) {
    case "beneficial":
      return <TrendingDown className="w-4 h-4 text-green-600" />;
    case "cost":
      return <TrendingUp className="w-4 h-4 text-red-600" />;
    case "neutral":
      return <Minus className="w-4 h-4 text-gray-600" />;
    default:
      return <Minus className="w-4 h-4 text-gray-600" />;
  }
};

const getImpactColorScheme = (impactType: PolicyComparison["impactType"]) => {
  switch (impactType) {
    case "beneficial":
      return {
        bg: "bg-green-50 dark:bg-green-950/30",
        border: "border-green-200 dark:border-green-800",
        text: "text-green-800 dark:text-green-200",
        badge: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      };
    case "cost":
      return {
        bg: "bg-red-50 dark:bg-red-950/30",
        border: "border-red-200 dark:border-red-800", 
        text: "text-red-800 dark:text-red-200",
        badge: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      };
    case "neutral":
      return {
        bg: "bg-gray-50 dark:bg-gray-950/30",
        border: "border-gray-200 dark:border-gray-800",
        text: "text-gray-800 dark:text-gray-200", 
        badge: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      };
    default:
      return {
        bg: "bg-gray-50 dark:bg-gray-950/30",
        border: "border-gray-200 dark:border-gray-800",
        text: "text-gray-800 dark:text-gray-200",
        badge: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      };
  }
};

const getCategoryBadgeColor = (category: PolicyComparison["category"]) => {
  switch (category) {
    case "tax":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "healthcare":
      return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200";
    case "energy":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "benefits":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
    case "other":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
};

export default function PolicyComparisonTable({ className = "" }: PolicyComparisonTableProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <TooltipProvider>
      <Card className={`border border-border shadow-lg ${className}`}>
        <div>
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            variant="outline"
            className="w-full justify-between p-4 h-auto border-2 border-slate-200 hover:border-slate-300"
          >
            <div className="flex items-center space-x-3">
              <BookOpen className="w-5 h-5 text-slate-600" />
              <div className="text-left">
                <div className="font-semibold text-slate-900 text-[20px]">{POLICY_COMPARISON_METADATA.title}</div>
                <div className="text-sm text-slate-600">{POLICY_COMPARISON_METADATA.description}</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-slate-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-600" />
              )}
            </div>
          </Button>
        </div>

        {/* Learn More Button - positioned outside the main clickable area */}
        <div className="px-4 pb-2 flex justify-end">
          <MethodologyModal 
            trigger={
              <Button variant="outline" size="sm" className="flex items-center space-x-1">
                <BookOpen className="w-4 h-4" />
                <span>Learn More</span>
              </Button>
            }
          />
        </div>

        {isExpanded && (
          <CardContent>
            <div className="overflow-x-auto">
              <div className="min-w-[600px]">
                {/* Table Header */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-t-lg border-b border-border font-medium text-sm">
                  <div className="text-foreground">Policy Area</div>
                  <div className="text-foreground">Current Law</div>
                  <div className="text-foreground">Big Bill Change</div>
                </div>

                {/* Table Body */}
                <div className="space-y-1">
                  {POLICY_COMPARISONS.map((comparison: PolicyComparison, index: number) => {
                    const colorScheme = getImpactColorScheme(comparison.impactType);
                    return (
                      <div
                        key={index}
                        className={`grid grid-cols-3 gap-4 p-4 border ${colorScheme.border} ${colorScheme.bg} transition-colors hover:opacity-90`}
                      >
                        {/* Policy Area Column */}
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <h4 className={`font-medium ${colorScheme.text}`}>
                              {comparison.policyArea}
                            </h4>
                            <div className="flex items-center space-x-1 ml-2">
                              {getImpactIcon(comparison.impactType)}
                              {comparison.explanation && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <HelpCircle className="w-3 h-3 text-muted-foreground cursor-help" />
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-sm">
                                    <p className="text-sm">{comparison.explanation}</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${getCategoryBadgeColor(comparison.category)}`}
                            >
                              {comparison.category.charAt(0).toUpperCase() + comparison.category.slice(1)}
                            </Badge>
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${colorScheme.badge}`}
                            >
                              {comparison.impactType === "beneficial" ? "Benefit" : 
                               comparison.impactType === "cost" ? "Cost" : "Neutral"}
                            </Badge>
                          </div>
                        </div>

                        {/* Current Law Column */}
                        <div className={`text-sm ${colorScheme.text}`}>
                          {comparison.currentLaw}
                        </div>

                        {/* Big Bill Change Column */}
                        <div className={`text-sm ${colorScheme.text} font-medium`}>
                          {comparison.bigBillChange}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border">
              <div className="flex items-start space-x-2">
                <HelpCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="text-xs text-muted-foreground">
                  <p className="mb-1">
                    <strong>Disclaimer:</strong> {POLICY_COMPARISON_METADATA.disclaimer}
                  </p>
                  <p>
                    Last updated: {POLICY_COMPARISON_METADATA.lastUpdated}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </TooltipProvider>
  );
}