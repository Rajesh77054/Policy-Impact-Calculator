
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
  breakdown: Array<{
    category: string;
    title: string;
    description: string;
    impact: number;
    details: Array<{
      item: string;
      amount: number;
    }>;
  }>;
  bigBillScenario?: {
    annualTaxImpact: number;
    healthcareCostImpact: number;
    energyCostImpact: number;
    netAnnualImpact: number;
    deficitImpact: number;
    recessionProbability: number;
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
    breakdown: Array<{
      category: string;
      title: string;
      description: string;
      impact: number;
      details: Array<{
        item: string;
        amount: number;
      }>;
    }>;
  };
}
