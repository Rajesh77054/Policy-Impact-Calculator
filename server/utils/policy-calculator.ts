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
  let previousMax = 0;
  
  for (const bracket of FEDERAL_TAX_BRACKETS_2024) {
    if (taxableIncome <= previousMax) break;
    
    const taxableAtThisBracket = Math.min(taxableIncome, bracket.max) - Math.max(previousMax, bracket.min);
    if (taxableAtThisBracket > 0) {
      tax += taxableAtThisBracket * bracket.rate;
    }
    previousMax = bracket.max;
  }
  
  return tax;
}

function calculateProposedTax(income: number, familyStatus: string, hasChildren: boolean): number {
  const enhancedStandardDeduction = (familyStatus === "single" ? 14600 : 29200) + 
                                   PROPOSED_TAX_CHANGES.standard_deduction_increase;
  
  const taxableIncome = Math.max(0, income - enhancedStandardDeduction);
  let tax = 0;
  let previousMax = 0;
  
  // Apply modified brackets with correct progressive calculation
  for (const bracket of FEDERAL_TAX_BRACKETS_2024) {
    if (taxableIncome <= previousMax) break;
    
    const taxableAtThisBracket = Math.min(taxableIncome, bracket.max) - Math.max(previousMax, bracket.min);
    if (taxableAtThisBracket > 0) {
      const rate = bracket.max === Infinity ? 
                   bracket.rate + PROPOSED_TAX_CHANGES.top_bracket_rate_change : 
                   bracket.rate;
      tax += taxableAtThisBracket * rate;
    }
    previousMax = bracket.max;
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
  familyStatus: string,
  income: number,
  state: string | undefined,
  employmentStatus: string | undefined
): { current: number; proposed: number } {
  
  const isFamily = familyStatus === "family";
  const basePremium = isFamily ? 
                     HEALTHCARE_COSTS_2024.average_premium_family : 
                     HEALTHCARE_COSTS_2024.average_premium_individual;
  
  let currentCost = basePremium;
  let proposedCost = basePremium;
  
  // Age-based adjustments (from ACA rating rules)
  const ageMultiplier = ageRange === "65+" ? 3.0 : 
                       ageRange === "45-64" ? 1.4 : 
                       ageRange === "30-44" ? 1.0 : 
                       ageRange === "18-29" ? 0.9 : 1.0;
  
  currentCost *= ageMultiplier;
  
  // State-based cost adjustments (geographic rating)
  if (state && STATE_TAX_DATA[state]) {
    const stateMultiplier = STATE_TAX_DATA[state].cost_of_living_index / 100;
    currentCost *= stateMultiplier;
  }
  
  // Federal Poverty Level calculations for subsidies
  const fpl2024 = isFamily ? 31200 : 15060; // Federal Poverty Level
  const incomeAsFPL = income / fpl2024;
  
  // Insurance type adjustments with income-based calculations
  switch (insuranceType) {
    case "employer":
      // Employer coverage varies significantly by employment status and income
      let employerContribution = 0.72; // Default 72% employer contribution
      let costSharing = isFamily ? 2800 : 1200; // Base cost sharing
      
      if (employmentStatus === "part-time") {
        employerContribution = 0.35; // Much lower for part-time
        costSharing *= 1.4; // Higher deductibles/copays
      } else if (employmentStatus === "self-employed") {
        employerContribution = 0; // Self-employed pay full premium
        costSharing *= 1.8; // Typically higher deductible plans
      } else if (employmentStatus === "contract") {
        employerContribution = 0.15; // Minimal contractor benefits
        costSharing *= 1.6;
      } else if (income > 150000) {
        employerContribution = 0.85; // Executive/professional benefits
        costSharing *= 0.7; // Better plans with lower cost sharing
      } else if (income > 100000) {
        employerContribution = 0.78; // Mid-level professional
        costSharing *= 0.85;
      } else if (income < 35000) {
        employerContribution = 0.60; // Lower-wage jobs
        costSharing *= 1.2;
      }
      
      currentCost *= (1 - employerContribution);
      currentCost += costSharing;
      break;
      
    case "marketplace":
      // ACA marketplace with income-based subsidies
      if (incomeAsFPL <= 4.0) { // Eligible for premium tax credits
        const subsidyAmount = incomeAsFPL <= 1.5 ? 0.85 :
                             incomeAsFPL <= 2.0 ? 0.65 :
                             incomeAsFPL <= 2.5 ? 0.45 :
                             incomeAsFPL <= 3.0 ? 0.25 : 0.15;
        currentCost *= (1 - subsidyAmount);
      }
      // Add deductible costs for marketplace plans
      currentCost += HEALTHCARE_COSTS_2024.average_deductible * 0.3;
      break;
      
    case "medicare":
      // Medicare Part B + D + Supplement
      currentCost = 2004 + 480 + 1200; // Part B + Part D + Medigap
      if (income > 91000) { // IRMAA surcharges
        currentCost += income > 228000 ? 3060 : 
                      income > 182000 ? 2448 : 
                      income > 142000 ? 1836 : 1224;
      }
      break;
      
    case "medicaid":
      currentCost = 0; // Fully covered
      break;
      
    case "military":
      currentCost = 600; // TRICARE Prime
      break;
      
    case "uninsured":
      // Estimated annual out-of-pocket costs
      currentCost = HEALTHCARE_COSTS_2024.prescription_drug_avg + 
                   (isFamily ? 3500 : 1800); // Medical services
      break;
  }
  
  // Apply proposed policy changes
  proposedCost = currentCost;
  
  // Enhanced employer coverage benefits
  if (insuranceType === "employer") {
    // Proposed: Enhanced employer premium support for small businesses
    if (income < 75000) {
      const smallBusinessCredit = currentCost * 0.25; // 25% additional employer support
      proposedCost = currentCost - smallBusinessCredit;
    } else {
      proposedCost = currentCost;
    }
    
    // Proposed: Cap on employee out-of-pocket costs
    const currentOutOfPocket = isFamily ? 2800 : 1200;
    const proposedOutOfPocketCap = isFamily ? 2000 : 1000;
    if (currentOutOfPocket > proposedOutOfPocketCap) {
      proposedCost -= (currentOutOfPocket - proposedOutOfPocketCap);
    }
  }

  // Enhanced marketplace subsidies and public option
  if (insuranceType === "marketplace") {
    if (incomeAsFPL <= 6.0) { // Expanded eligibility
      const enhancedSubsidy = incomeAsFPL <= 1.5 ? 0.95 :
                             incomeAsFPL <= 2.0 ? 0.80 :
                             incomeAsFPL <= 3.0 ? 0.65 :
                             incomeAsFPL <= 4.0 ? 0.50 :
                             incomeAsFPL <= 5.0 ? 0.35 : 0.20;
      proposedCost = basePremium * ageMultiplier * (1 - enhancedSubsidy);
      if (state && STATE_TAX_DATA[state]) {
        proposedCost *= STATE_TAX_DATA[state].cost_of_living_index / 100;
      }
    }
    
    // Public option availability (15% lower than marketplace average)
    const publicOptionCost = basePremium * ageMultiplier * (1 - PROPOSED_HEALTHCARE_CHANGES.public_option_premium_reduction);
    if (state && STATE_TAX_DATA[state]) {
      const adjustedPublicOption = publicOptionCost * (STATE_TAX_DATA[state].cost_of_living_index / 100);
      proposedCost = Math.min(proposedCost, adjustedPublicOption);
    } else {
      proposedCost = Math.min(proposedCost, publicOptionCost);
    }
  }
  
  // Medicare expansion to age 60+ (for 45-64 age group)
  if (ageRange === "45-64" && insuranceType !== "medicare" && insuranceType !== "medicaid") {
    const medicareOption = 2004 + 480 + 600; // Simplified Medicare option
    proposedCost = Math.min(proposedCost, medicareOption);
  }
  
  // Prescription drug cost cap
  const currentDrugCosts = insuranceType === "medicare" ? 
                          HEALTHCARE_COSTS_2024.prescription_drug_avg * 1.5 :
                          HEALTHCARE_COSTS_2024.prescription_drug_avg;
  
  if (currentDrugCosts > PROPOSED_HEALTHCARE_CHANGES.prescription_drug_cap) {
    const drugSavings = currentDrugCosts - PROPOSED_HEALTHCARE_CHANGES.prescription_drug_cap;
    proposedCost = Math.max(0, proposedCost - drugSavings);
  }
  
  // Medicaid expansion
  if (insuranceType === "uninsured" && 
      incomeAsFPL <= PROPOSED_HEALTHCARE_CHANGES.medicaid_expansion_income_limit) {
    proposedCost = 0; // Would qualify for expanded Medicaid
  }
  
  return { 
    current: Math.round(currentCost), 
    proposed: Math.round(proposedCost) 
  };
}

export function calculatePolicyImpact(formData: FormData): PolicyResults {
  // Get median income for calculations
  const income = formData.incomeRange ? INCOME_MEDIANS[formData.incomeRange] : 62500;
  
  // Debug logging
  console.log(`Calculating for: Income=${income}, State=${formData.state}, Employment=${formData.employmentStatus}, Family=${formData.familyStatus}`);
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
  const healthcareCosts = calculateHealthcareCosts(
    insuranceType, 
    ageRange, 
    familyStatus, 
    income, 
    state, 
    formData.employmentStatus
  );
  const healthcareImpact = healthcareCosts.proposed - healthcareCosts.current;
  
  // State-specific adjustments
  let stateAdjustment = 0;
  let energyImpact = 120; // Default energy cost impact
  
  if (state && STATE_TAX_DATA[state]) {
    const stateData = STATE_TAX_DATA[state];
    
    // State income tax impact (positive = more tax, negative = savings)
    const stateIncomeTax = income * stateData.income_tax_rate;
    
    // Cost of living adjustment affecting all costs
    const costAdjustment = (stateData.cost_of_living_index - 100) * (income / 100000) * 200;
    
    // State-specific energy costs based on regulations and climate
    energyImpact = state === "CA" ? 250 + (income / 1000) : 
                   state === "TX" ? 180 + (income / 2000) : 
                   state === "NY" ? 220 + (income / 1500) :
                   state === "FL" ? 160 + (income / 1800) :
                   state === "WA" ? 90 + (income / 2500) :
                   120 + (income / 2000);
    
    stateAdjustment = stateIncomeTax + costAdjustment;
  }
  
  // Apply income-based scaling to impacts
  const incomeScalar = Math.log10(income / 10000); // Logarithmic scaling
  const scaledTaxImpact = taxImpact * (1 + incomeScalar * 0.1);
  const scaledHealthcareImpact = healthcareImpact * (1 + incomeScalar * 0.05);
  const scaledEnergyImpact = energyImpact * (1 + incomeScalar * 0.08);
  
  const netAnnualImpact = scaledTaxImpact + scaledHealthcareImpact + stateAdjustment + scaledEnergyImpact;
  
  // Debug logging
  console.log(`Results: Tax=${Math.round(scaledTaxImpact)}, Healthcare=${Math.round(scaledHealthcareImpact)}, State=${Math.round(stateAdjustment)}, Energy=${Math.round(scaledEnergyImpact)}, Net=${Math.round(netAnnualImpact)}`);
  
  // Community impact estimates based on state data
  const stateData = state ? STATE_TAX_DATA[state] : null;
  const infrastructureImpact = stateData ? 
                              stateData.property_tax_avg * 500 : 2100000;
  
  return {
    annualTaxImpact: Math.round(scaledTaxImpact),
    healthcareCostImpact: Math.round(scaledHealthcareImpact),
    energyCostImpact: Math.round(scaledEnergyImpact),
    netAnnualImpact: Math.round(netAnnualImpact),
    healthcareCosts: {
      current: Math.round(healthcareCosts.current),
      proposed: Math.round(healthcareCosts.proposed),
    },
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
        impact: Math.round(scaledTaxImpact),
        details: [
          { 
            item: "Standard deduction increase", 
            amount: Math.round(-PROPOSED_TAX_CHANGES.standard_deduction_increase * 0.22) 
          },
          { 
            item: hasChildren ? "Enhanced child tax credit" : "Tax bracket adjustment", 
            amount: hasChildren ? 
                   -PROPOSED_TAX_CHANGES.child_tax_credit_increase : 
                   Math.round(scaledTaxImpact * 0.6)
          },
        ],
      },
      {
        category: "healthcare",
        title: "Healthcare Policy Reforms",
        description: "Based on Kaiser Family Foundation data and proposed Medicare expansion",
        impact: Math.round(scaledHealthcareImpact),
        details: [
          { 
            item: "Premium subsidies", 
            amount: Math.round(scaledHealthcareImpact * 0.7) 
          },
          { 
            item: "Prescription drug cap", 
            amount: Math.round(scaledHealthcareImpact * 0.3) 
          },
        ],
      },
    ],
  };
}