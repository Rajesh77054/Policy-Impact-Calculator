export interface EconomicContext {
  unemploymentRate: {
    national: number;
    state?: number;
    lastUpdated: string;
  };
  recessionIndicators: {
    yieldCurveInversion: number;
    unemploymentTrend: number;
    combined: number;
    lastUpdated: string;
  };
  wageValidation: {
    medianWeeklyEarnings: number;
    hourlyEarnings: number;
    incomeContext: string;
    lastUpdated: string;
  };
  macroeconomicData: {
    gdpGrowth: number;
    inflationRate: number;
    federalFundsRate: number;
    lastUpdated: string;
  };
  fiscalData?: {
    totalPublicDebt: number;
    debtToGdpRatio: number;
    deficitToGdpRatio: number;
    lastUpdated: string;
  };
}

export interface PolicyResults {
  annualTaxImpact: number;
  healthcareCostImpact: number;
  energyCostImpact: number;
  netAnnualImpact: number;
  deficitImpact: number;
  recessionProbability: number;
  healthcareCosts: {
    current: number;
    proposed: number;
  };
  communityImpact: {
    schoolFunding: number;
    infrastructure: number;
    jobOpportunities: number;
  };
  timeline: {
    fiveYear: number;
    tenYear: number;
    twentyYear: number;
  };
  purchasingPower: {
    currentScenario: Array<{
      year: number;
      purchasingPowerIndex: number;
      projectedDisposableIncome: number;
    }>;
    proposedScenario: Array<{
      year: number;
      purchasingPowerIndex: number;
      projectedDisposableIncome: number;
    }>;
    dataSource: string;
    lastUpdated: string;
  };
  economicContext?: EconomicContext;
  breakdown: Array<{
    category: "tax" | "healthcare" | "energy" | "housing" | "education" | "employment";
    title: string;
    description: string;
    impact: number;
    details: Array<{
      item: string;
      amount: number;
    }>;
  }>;
}

export interface BreakdownItem {
  category: "tax" | "healthcare" | "energy" | "housing" | "education" | "employment";
  title: string;
  description: string;
  impact: number;
  details?: Array<{
    item: string;
    amount: number;
  }>;
}