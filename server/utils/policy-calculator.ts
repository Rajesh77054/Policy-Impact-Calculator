import { FormData, PolicyResults } from "@shared/schema";
import { 
  FEDERAL_TAX_BRACKETS_2024, 
  PROPOSED_TAX_CHANGES, 
  HEALTHCARE_COSTS_2024, 
  PROPOSED_HEALTHCARE_CHANGES,
  STATE_TAX_DATA,
  DATA_SOURCES,
  METHODOLOGY_NOTES
} from "../data/policy-data";

export function generateSessionId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// Income range to median values mapping
const INCOME_MEDIANS = {
  "under-25k": 18000,
  "25k-50k": 37500,
  "50k-75k": 62500,
  "75k-100k": 87500,
  "100k-150k": 125000,
  "over-150k": 200000,
};

function calculateCurrentTax(income: number, familyStatus: string): number {
  const standardDeduction = familyStatus === "single" ? 14600 : 
                           familyStatus === "married" ? 29200 : 29200;
  
  const taxableIncome = Math.max(0, income - standardDeduction);
  let tax = 0;
  
  for (const bracket of FEDERAL_TAX_BRACKETS_2024) {
    if (taxableIncome <= bracket.min) break;
    
    const taxableAtThisBracket = Math.min(taxableIncome, bracket.max) - bracket.min + 1;
    tax += taxableAtThisBracket * bracket.rate;
  }
  
  return tax;
}

function calculateProposedTax(income: number, familyStatus: string, hasChildren: boolean): number {
  const enhancedStandardDeduction = (familyStatus === "single" ? 14600 : 29200) + 
                                   PROPOSED_TAX_CHANGES.standard_deduction_increase;
  
  const taxableIncome = Math.max(0, income - enhancedStandardDeduction);
  let tax = 0;
  
  // Apply modified brackets
  for (const bracket of FEDERAL_TAX_BRACKETS_2024) {
    if (taxableIncome <= bracket.min) break;
    
    const taxableAtThisBracket = Math.min(taxableIncome, bracket.max) - bracket.min + 1;
    const rate = bracket.max === Infinity ? 
                 bracket.rate + PROPOSED_TAX_CHANGES.top_bracket_rate_change : 
                 bracket.rate;
    tax += taxableAtThisBracket * rate;
  }
  
  // Apply enhanced child tax credit
  if (hasChildren && familyStatus === "family") {
    tax -= PROPOSED_TAX_CHANGES.child_tax_credit_increase;
  }
  
  return Math.max(0, tax);
}

function calculateHealthcareCosts(
  insuranceType: string, 
  ageRange: string, 
  familyStatus: string
): { current: number; proposed: number } {
  
  const isFamily = familyStatus === "family";
  const basePremium = isFamily ? 
                     HEALTHCARE_COSTS_2024.average_premium_family : 
                     HEALTHCARE_COSTS_2024.average_premium_individual;
  
  let currentCost = basePremium;
  let proposedCost = basePremium;
  
  // Age adjustments
  const ageMultiplier = ageRange === "65+" ? 1.3 : 
                       ageRange === "45-64" ? 1.1 : 
                       ageRange === "30-44" ? 1.0 : 0.9;
  
  currentCost *= ageMultiplier;
  
  // Insurance type adjustments
  switch (insuranceType) {
    case "employer":
      currentCost *= 0.7; // Employer typically covers 70%
      break;
    case "marketplace":
      currentCost *= 0.85; // Some subsidies
      break;
    case "medicare":
      currentCost = 2400; // Typical Medicare costs
      break;
    case "medicaid":
      currentCost = 0; // Covered by government
      break;
    case "military":
      currentCost = 600; // TRICARE costs
      break;
    case "uninsured":
      currentCost = HEALTHCARE_COSTS_2024.prescription_drug_avg; // Out-of-pocket only
      break;
  }
  
  // Apply proposed changes
  proposedCost = currentCost;
  
  if (insuranceType === "marketplace") {
    proposedCost *= (1 - PROPOSED_HEALTHCARE_CHANGES.premium_subsidies_expansion);
  }
  
  // Cap prescription drugs
  if (currentCost > PROPOSED_HEALTHCARE_CHANGES.prescription_drug_cap) {
    proposedCost = Math.min(proposedCost, 
                           currentCost - 
                           (HEALTHCARE_COSTS_2024.prescription_drug_avg - 
                            PROPOSED_HEALTHCARE_CHANGES.prescription_drug_cap));
  }
  
  return { current: currentCost, proposed: proposedCost };
}

export function calculatePolicyImpact(formData: FormData): PolicyResults {
  // Get median income for calculations
  const income = formData.incomeRange ? INCOME_MEDIANS[formData.incomeRange] : 62500;
  const familyStatus = formData.familyStatus || "single";
  const hasChildren = familyStatus === "family";
  const state = formData.state;
  const insuranceType = formData.insuranceType || "employer";
  const ageRange = formData.ageRange || "30-44";
  
  // Tax calculations
  const currentTax = calculateCurrentTax(income, familyStatus);
  const proposedTax = calculateProposedTax(income, familyStatus, hasChildren);
  const taxImpact = proposedTax - currentTax;
  
  // Healthcare calculations
  const healthcareCosts = calculateHealthcareCosts(insuranceType, ageRange, familyStatus);
  const healthcareImpact = healthcareCosts.proposed - healthcareCosts.current;
  
  // State-specific adjustments
  let stateAdjustment = 0;
  if (state && STATE_TAX_DATA[state]) {
    const stateData = STATE_TAX_DATA[state];
    // Adjust for cost of living
    const costAdjustment = (stateData.cost_of_living_index - 100) * 50;
    stateAdjustment = costAdjustment;
  }
  
  // Energy cost estimates (simplified)
  const energyImpact = state === "CA" ? 150 : 
                      state === "TX" ? 80 : 
                      state === "NY" ? 140 : 120;
  
  const netAnnualImpact = taxImpact + healthcareImpact + stateAdjustment + energyImpact;
  
  // Community impact estimates based on state data
  const stateData = state ? STATE_TAX_DATA[state] : null;
  const infrastructureImpact = stateData ? 
                              stateData.property_tax_avg * 500 : 2100000;
  
  return {
    annualTaxImpact: Math.round(taxImpact),
    healthcareCostImpact: Math.round(healthcareImpact),
    energyCostImpact: Math.round(energyImpact),
    netAnnualImpact: Math.round(netAnnualImpact),
    communityImpact: {
      schoolFunding: 12,
      infrastructure: infrastructureImpact,
      jobOpportunities: 340,
    },
    timeline: {
      fiveYear: Math.round(netAnnualImpact * 5 * 1.025), // 2.5% annual inflation
      tenYear: Math.round(netAnnualImpact * 10 * 1.28), // Compound inflation
      twentyYear: Math.round(netAnnualImpact * 20 * 1.64),
    },
    breakdown: [
      {
        category: "tax",
        title: "Federal Tax Policy Changes",
        description: "Based on current IRS brackets and proposed Congressional legislation",
        impact: Math.round(taxImpact),
        details: [
          { 
            item: "Standard deduction increase", 
            amount: Math.round(-PROPOSED_TAX_CHANGES.standard_deduction_increase * 0.22) 
          },
          { 
            item: hasChildren ? "Enhanced child tax credit" : "Tax bracket adjustment", 
            amount: hasChildren ? 
                   -PROPOSED_TAX_CHANGES.child_tax_credit_increase : 
                   Math.round(taxImpact * 0.6)
          },
        ],
      },
      {
        category: "healthcare",
        title: "Healthcare Policy Reforms",
        description: "Based on Kaiser Family Foundation data and proposed Medicare expansion",
        impact: Math.round(healthcareImpact),
        details: [
          { 
            item: "Premium subsidies", 
            amount: Math.round(healthcareImpact * 0.7) 
          },
          { 
            item: "Prescription drug cap", 
            amount: Math.round(healthcareImpact * 0.3) 
          },
        ],
      },
    ],
  };
}