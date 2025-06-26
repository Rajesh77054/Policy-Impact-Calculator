export interface PolicyComparison {
  policyArea: string;
  currentLaw: string;
  bigBillChange: string;
  category: "tax" | "healthcare" | "energy" | "benefits" | "other";
  impactType: "beneficial" | "cost" | "neutral";
  explanation?: string;
}

export const POLICY_COMPARISONS: PolicyComparison[] = [
  {
    policyArea: "Child Tax Credit",
    currentLaw: "$2,000/child",
    bigBillChange: "$2,500 (temp); then $2,500 (temp); then $2,000, tighter SSN rules, indexed after 2029",
    category: "tax",
    impactType: "beneficial",
    explanation: "Temporary increase in child tax credit amount with stricter eligibility requirements"
  },
  {
    policyArea: "Standard Deduction",
    currentLaw: "TCJA expires 2025",
    bigBillChange: "TCJA made permanent; +1k/1k/2k through 2028",
    category: "tax",
    impactType: "beneficial",
    explanation: "Makes current tax cuts permanent and adds temporary increases"
  },
  {
    policyArea: "State/Local Tax Deduction Cap (SALT)",
    currentLaw: "$10k",
    bigBillChange: "Raised to $40.4k, phased for high-income",
    category: "tax",
    impactType: "beneficial",
    explanation: "Significant increase in SALT deduction cap, primarily benefiting higher-income households"
  },
  {
    policyArea: "SNAP Work Requirements",
    currentLaw: "18-55 ABAWD; broad waivers; parents <18 exempt",
    bigBillChange: "18-65; narrow waivers, parents <7 exempt; higher state cost share",
    category: "benefits",
    impactType: "cost",
    explanation: "Stricter work requirements with reduced exemptions and state flexibility"
  },
  {
    policyArea: "Major Energy Credits",
    currentLaw: "Wide EV/solar credits & subsidies",
    bigBillChange: "Terminates most credits; expands fossil extraction",
    category: "energy",
    impactType: "cost",
    explanation: "Removes clean energy incentives while promoting fossil fuel production"
  },
  {
    policyArea: "Health Savings Accounts",
    currentLaw: "Low limit, restrictive",
    bigBillChange: "Higher limits, more eligible",
    category: "healthcare",
    impactType: "beneficial",
    explanation: "Expanded HSA contribution limits and eligibility requirements"
  },
  {
    policyArea: "Employer Childcare Credit",
    currentLaw: "25%, $150k cap",
    bigBillChange: "40-50%, $500-600k cap",
    category: "benefits",
    impactType: "beneficial",
    explanation: "Increased credit percentage and higher income caps for employer childcare benefits"
  },
  {
    policyArea: "Student Loans",
    currentLaw: "Subsidized loans exist, flexible repayment",
    bigBillChange: "Eliminates subsidized/grads, tighter caps/repayment",
    category: "benefits",
    impactType: "cost",
    explanation: "Removes loan subsidies and reduces repayment flexibility"
  },
  {
    policyArea: "Federal Employee Retirement",
    currentLaw: "FERS supplement",
    bigBillChange: "Eliminated, higher employee contribution or at-will",
    category: "benefits",
    impactType: "cost",
    explanation: "Reduces federal employee retirement benefits and job security"
  },
  {
    policyArea: "EV/Hybrid Registration Fees",
    currentLaw: "No federal",
    bigBillChange: "New 100/100/250 annual fees",
    category: "energy",
    impactType: "cost",
    explanation: "New federal registration fees for electric and hybrid vehicles"
  },
  {
    policyArea: "Debt Limit",
    currentLaw: "-",
    bigBillChange: "+$4 trillion",
    category: "other",
    impactType: "neutral",
    explanation: "Increases federal debt ceiling capacity"
  }
];

export const POLICY_COMPARISON_METADATA = {
  title: "How Big Bill Compares to Current Law",
  description: "This table shows general policy changes under the Big Bill. Your personalized results above show your specific financial impact.",
  disclaimer: "Policy comparisons are based on Congressional Budget Office analysis and legislative text. Individual impacts may vary based on personal circumstances.",
  lastUpdated: "2024-12-26"
};