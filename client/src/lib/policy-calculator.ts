
import { FormData, PolicyResults } from "@shared/schema";

// Income range to median values mapping (matches server)
const INCOME_MEDIANS = {
  "under-15k": 12000,
  "15k-45k": 30000,
  "45k-95k": 70000,
  "95k-200k": 147500,
  "200k-400k": 300000,
  "over-400k": 500000,
};

// State-specific data (simplified version for client-side preview)
const STATE_TAX_DATA: { [key: string]: any } = {
  "AL": { income_tax_rate: 0.05, sales_tax_rate: 0.04, cost_of_living_index: 89.2 },
  "CA": { income_tax_rate: 0.133, sales_tax_rate: 0.0775, cost_of_living_index: 138.5 },
  "FL": { income_tax_rate: 0.0, sales_tax_rate: 0.06, cost_of_living_index: 103.1 },
  "TX": { income_tax_rate: 0.0, sales_tax_rate: 0.0625, cost_of_living_index: 94.7 },
  "NY": { income_tax_rate: 0.0882, sales_tax_rate: 0.08, cost_of_living_index: 139.1 },
  "WA": { income_tax_rate: 0.0, sales_tax_rate: 0.065, cost_of_living_index: 113.8 },
  "GA": { income_tax_rate: 0.0575, sales_tax_rate: 0.04, cost_of_living_index: 91.4 },
  "PA": { income_tax_rate: 0.0307, sales_tax_rate: 0.06, cost_of_living_index: 96.9 },
  "IL": { income_tax_rate: 0.0495, sales_tax_rate: 0.0625, cost_of_living_index: 95.2 },
  "OH": { income_tax_rate: 0.0399, sales_tax_rate: 0.0575, cost_of_living_index: 90.8 },
};

export function calculatePolicyImpact(formData: FormData): PolicyResults {
  // Get actual income from form data
  const income = formData.incomeRange ? INCOME_MEDIANS[formData.incomeRange] : 62500;
  const state = formData.state;
  const familyStatus = formData.familyStatus || "single";
  const employmentStatus = formData.employmentStatus;

  // Base calculations with income scaling
  let taxImpact = income * 0.02; // 2% of income as base tax impact
  let healthcareImpact = -Math.min(2000, income * 0.01); // Healthcare savings capped at $2000
  let energyImpact = 120; // Base energy impact

  // State-specific adjustments
  if (state && STATE_TAX_DATA[state]) {
    const stateData = STATE_TAX_DATA[state];
    
    // Apply state income tax
    taxImpact += income * stateData.income_tax_rate * 0.1; // 10% change in state tax impact
    
    // Adjust costs by state cost of living
    const costMultiplier = stateData.cost_of_living_index / 100;
    healthcareImpact *= costMultiplier;
    
    // State-specific energy costs
    energyImpact = state === "CA" ? 250 : 
                   state === "TX" ? 180 : 
                   state === "NY" ? 220 :
                   state === "FL" ? 160 :
                   state === "WA" ? 90 : 120;
  }

  // Employment status adjustments
  if (employmentStatus === "part-time") {
    healthcareImpact *= 1.3; // Higher healthcare costs for part-time
    taxImpact *= 0.8; // Lower tax impact
  } else if (employmentStatus === "self-employed") {
    healthcareImpact *= 1.5; // Much higher healthcare costs
    taxImpact *= 1.2; // Higher tax complexity
  } else if (employmentStatus === "contract") {
    healthcareImpact *= 1.4;
    taxImpact *= 1.1;
  }

  // Family status adjustments
  const familyMultipliers = {
    "single": 1.0,
    "married": 1.3,
    "family": 1.7,
  };
  const familyMultiplier = familyMultipliers[familyStatus] || 1.0;
  taxImpact *= familyMultiplier;
  healthcareImpact *= familyMultiplier;

  const netAnnual = taxImpact + healthcareImpact + energyImpact;

  // Dynamic community impact calculations
  let schoolFunding = 8;
  let infrastructure = 1500000;
  let jobOpportunities = 250;

  if (state && STATE_TAX_DATA[state]) {
    const stateData = STATE_TAX_DATA[state];
    const incomeFactor = income / 75000;
    
    schoolFunding = Math.round(8 + (stateData.income_tax_rate * incomeFactor * 20));
    infrastructure = Math.round(1500000 * (stateData.cost_of_living_index / 100) * incomeFactor);
    jobOpportunities = Math.round(200 + (stateData.cost_of_living_index * income / 100000));

    // State-specific adjustments
    switch (state) {
      case "CA":
        schoolFunding += 5;
        infrastructure *= 1.4;
        jobOpportunities += 150;
        break;
      case "TX":
        schoolFunding -= 2;
        infrastructure *= 1.2;
        jobOpportunities += 100;
        break;
      case "NY":
        schoolFunding += 3;
        infrastructure *= 1.3;
        jobOpportunities += 80;
        break;
      case "FL":
        schoolFunding -= 1;
        infrastructure *= 0.9;
        jobOpportunities += 60;
        break;
      case "WA":
        schoolFunding += 4;
        infrastructure *= 1.1;
        jobOpportunities += 120;
        break;
    }
  }

  return {
    annualTaxImpact: Math.round(taxImpact),
    healthcareCostImpact: Math.round(healthcareImpact),
    energyCostImpact: Math.round(energyImpact),
    netAnnualImpact: Math.round(netAnnual),
    healthcareCosts: {
      current: Math.round(7000 * familyMultiplier),
      proposed: Math.round(7000 * familyMultiplier + healthcareImpact),
    },
    communityImpact: {
      schoolFunding: Math.max(3, Math.min(25, schoolFunding)),
      infrastructure: Math.max(800000, Math.min(8000000, infrastructure)),
      jobOpportunities: Math.max(150, Math.min(800, jobOpportunities)),
    },
    timeline: {
      fiveYear: Math.round(netAnnual * 5 * 1.025),
      tenYear: Math.round(netAnnual * 10 * 1.28),
      twentyYear: Math.round(netAnnual * 20 * 1.64),
    },
    breakdown: [
      {
        category: "tax",
        title: "Tax Policy Changes",
        description: "Proposed adjustments to federal tax brackets and deductions",
        impact: Math.round(taxImpact),
        details: [
          { item: "Standard deduction increase", amount: Math.round(taxImpact * 0.55) },
          { item: "Tax bracket adjustment", amount: Math.round(taxImpact * 0.45) },
        ],
      },
      {
        category: "healthcare",
        title: "Healthcare Policy",
        description: "Changes to insurance regulations and prescription drug costs",
        impact: Math.round(healthcareImpact),
        details: [
          { item: "Prescription drug costs", amount: Math.round(healthcareImpact * 0.6) },
          { item: "Insurance premium impact", amount: Math.round(healthcareImpact * 0.4) },
        ],
      },
    ],
  };
}
