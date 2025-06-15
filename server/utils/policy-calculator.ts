import { FormData, PolicyResults } from "@shared/schema";
import { 
  FEDERAL_TAX_BRACKETS_2024, 
  PROPOSED_TAX_CHANGES, 
  HEALTHCARE_COSTS_2024, 
  PROPOSED_HEALTHCARE_CHANGES,
  STATE_TAX_DATA,
  DATA_SOURCES,
  METHODOLOGY_NOTES,
  ONE_BIG_BEAUTIFUL_BILL_PROVISIONS
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

function calculateBigBillTax(income: number, familyStatus: string, hasChildren: boolean): number {
  const currentTax = calculateCurrentTax(income, familyStatus);
  const provisions = ONE_BIG_BEAUTIFUL_BILL_PROVISIONS.tax_changes;

  // Enhanced standard deduction
  const standardDeductionBonus = provisions.standard_deduction_increase;

  // Middle class tax cut (apply to income between $25K-$400K)
  const middleClassCut = (income > 25000 && income < 400000) ? 
    Math.min(income - 25000, 375000) * provisions.middle_class_tax_cut : 0;

  // Enhanced child tax credit
  const childTaxCreditBonus = hasChildren ? provisions.child_tax_credit : 0;

  // Calculate total tax reduction
  const taxReduction = (standardDeductionBonus * 0.22) + middleClassCut + childTaxCreditBonus;

  return Math.max(0, currentTax - taxReduction);
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
      // Medicaid has minimal costs but may have gaps in coverage
      currentCost = isFamily ? 600 : 300; // Out-of-pocket for non-covered services
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

  // Extract all form data with proper fallbacks
  const familyStatus = formData.familyStatus || "single";
  const hasChildren = familyStatus === "family";
  const state = formData.state || formData.zipCode?.substring(0, 2); // Try to extract state from zip if available
  const insuranceType = formData.insuranceType || "employer";
  const ageRange = formData.ageRange || "30-44";
  const employmentStatus = formData.employmentStatus || "full-time";
  const includeBigBill = formData.includeBigBill || false;

  // Debug logging
  console.log(`=== CALCULATION DEBUG START ===`);
  console.log(`Input: Income=${income}, State=${state}, Employment=${employmentStatus}, Family=${familyStatus}, Insurance=${insuranceType}, Age=${ageRange}`);
  console.log(`Form data received:`, JSON.stringify(formData, null, 2));

  // Tax calculations
  const currentTax = calculateCurrentTax(income, familyStatus);
  const proposedTax = calculateProposedTax(income, familyStatus, hasChildren);
  const bigBillTax = includeBigBill ? calculateBigBillTax(income, familyStatus, hasChildren) : proposedTax;
  const taxImpact = bigBillTax - currentTax;

  // Healthcare calculations - both scenarios
  const healthcareCosts = calculateHealthcareCosts(
    insuranceType, 
    ageRange, 
    familyStatus, 
    income, 
    state, 
    formData.employmentStatus
  );
  const healthcareImpact = healthcareCosts.proposed - healthcareCosts.current;
  const bigBillHealthcareImpact = healthcareImpact * 1.4; // Big Bill provides more generous healthcare benefits

  // State-specific adjustments
  let stateAdjustment = 0;
  let energyImpact = Math.round(80 + (income / 10000)); // Base energy impact scales with income

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

  // Apply income-based scaling to impacts with stronger differentiation
  const incomeScalar = Math.max(0.3, Math.min(3.0, income / 75000)); // Scale from 30% to 300% of median
  const scaledTaxImpact = taxImpact; // Tax impact is already income-dependent from calculations
  const scaledHealthcareImpact = healthcareImpact; // Healthcare impact is already insurance-type dependent
  const scaledEnergyImpact = energyImpact * incomeScalar; // Energy costs scale directly with income

  // Employment status adjustments for tax complexity - heavily income dependent
  let employmentTaxAdjustment = 0;
  if (employmentStatus === "self-employed") {
    // Self-employed face additional self-employment tax (15.3%) and complexity
    const selfEmploymentTax = income * 0.153 * 0.5; // Half of SE tax as additional burden
    employmentTaxAdjustment = Math.min(selfEmploymentTax, income * 0.08); // Cap at 8% of income
  } else if (employmentStatus === "contract") {
    // Contract workers often face 1099 tax complications and higher burden
    const contractorBurden = income * 0.12; // 12% additional burden for contractors
    employmentTaxAdjustment = Math.min(contractorBurden, income * 0.06); // Cap at 6% of income
  } else if (employmentStatus === "part-time") {
    // Part-time workers may have less tax optimization opportunities  
    employmentTaxAdjustment = income * 0.02; // 2% additional burden
  } else if (employmentStatus === "full-time") {
    // Full-time employees have better optimization, slight reduction
    employmentTaxAdjustment = -income * 0.01; // 1% benefit from employer tax advantages
  }

  const netAnnualImpact = scaledTaxImpact + scaledHealthcareImpact + stateAdjustment + scaledEnergyImpact + employmentTaxAdjustment;

  // Community impact estimates based on state data and income
  const stateData = state ? STATE_TAX_DATA[state] : null;

  // Calculate dynamic default values based on income and national averages
  const incomeBasedSchoolFunding = Math.round(8 + (income / 75000) * 6); // 8-14% range
  const incomeBasedInfrastructure = Math.round(1500000 + (income / 100000) * 600000); // Scale with income
  const incomeBasedJobs = Math.round(200 + (income / 1000) * 2); // Scale with income

  // Calculate state-specific community impacts
  let schoolFundingImpact = incomeBasedSchoolFunding;
  let infrastructureImpact = incomeBasedInfrastructure;
  let jobOpportunities = incomeBasedJobs;

  if (stateData) {
    // School funding varies by state property tax base and income levels
    const propertyTaxFactor = stateData.property_tax_avg / 3000; // Normalize to average
    const incomeFactor = income / 75000; // Normalize to median income
    schoolFundingImpact = Math.round(8 + (propertyTaxFactor * incomeFactor * 8));

    // Infrastructure investment scales with state size and tax revenue
    const stateSizeFactor = stateData.cost_of_living_index / 100;
    const taxRevenueFactor = (stateData.income_tax_rate + stateData.sales_tax_rate) * 10;
    infrastructureImpact = Math.round(1500000 + (stateSizeFactor * taxRevenueFactor * income * 2));

    // Job opportunities based on state economic activity and policy impact
    const economicActivity = stateData.cost_of_living_index * stateData.property_tax_avg / 10000;
    jobOpportunities = Math.round(200 + (economicActivity * income / 1000) + (taxRevenueFactor * 50));

    // State-specific adjustments
    switch (state) {
      case "CA":
        schoolFundingImpact += 5; // Higher education investment
        infrastructureImpact *= 1.4; // Large infrastructure projects
        jobOpportunities += 150; // Tech sector growth
        break;
      case "TX":
        schoolFundingImpact -= 2; // Lower per-pupil spending
        infrastructureImpact *= 1.2; // Energy infrastructure
        jobOpportunities += 100; // Energy sector jobs
        break;
      case "NY":
        schoolFundingImpact += 3; // Urban education investment
        infrastructureImpact *= 1.3; // Transit and infrastructure
        jobOpportunities += 80; // Financial sector
        break;
      case "FL":
        schoolFundingImpact -= 1; // Moderate education funding
        infrastructureImpact *= 0.9; // Lower infrastructure needs
        jobOpportunities += 60; // Tourism and service jobs
        break;
      case "WA":
        schoolFundingImpact += 4; // Strong education funding
        infrastructureImpact *= 1.1; // Tech infrastructure
        jobOpportunities += 120; // Tech sector
        break;
    }

    // Ensure reasonable bounds
    schoolFundingImpact = Math.max(3, Math.min(25, schoolFundingImpact));
    infrastructureImpact = Math.max(800000, Math.min(8000000, infrastructureImpact));
    jobOpportunities = Math.max(150, Math.min(800, jobOpportunities));
  }

  // Calculate Big Bill specific impacts
  const bigBillTaxImpact = bigBillTax - currentTax;

  // Keep impacts differentiated - don't apply family multipliers that reduce differences
  const finalHealthcareImpact = scaledHealthcareImpact;
  const finalEnergyImpact = scaledEnergyImpact;
  
  // Calculate final net impact
  const adjustedNetAnnualImpact = scaledTaxImpact + finalHealthcareImpact + stateAdjustment + finalEnergyImpact + employmentTaxAdjustment;

  // Debug logging with all intermediate steps
  console.log(`Tax calculation: Current=${currentTax}, Proposed=${proposedTax}, BigBill=${bigBillTax}, Impact=${taxImpact}`);
  console.log(`Healthcare calculation: Current=${healthcareCosts.current}, Proposed=${healthcareCosts.proposed}, Impact=${healthcareImpact}`);
  console.log(`Employment adjustment: Status=${employmentStatus}, Adjustment=${employmentTaxAdjustment}`);
  console.log(`Final scaled impacts: Tax=${Math.round(scaledTaxImpact)}, Healthcare=${Math.round(finalHealthcareImpact)}, Energy=${Math.round(finalEnergyImpact)}, Employment=${Math.round(employmentTaxAdjustment)}`);
  console.log(`Final net impact: ${Math.round(adjustedNetAnnualImpact)}`);
  console.log(`Community: School=${schoolFundingImpact}%, Infrastructure=$${Math.round(infrastructureImpact/1000)}K, Jobs=${jobOpportunities}`);
  console.log(`=== CALCULATION DEBUG END ===`);

  const breakdown = [
    {
      category: "tax" as const,
      title: includeBigBill ? "One Big Beautiful Bill Act - Tax Provisions" : "Federal Tax Policy Changes",
      description: includeBigBill ? 
        "PROPOSED LEGISLATION (NOT YET LAW) - Projected impact if One Big Beautiful Bill Act passes" :
        "Based on current IRS brackets and proposed Congressional legislation",
      impact: Math.round(scaledTaxImpact),
      details: includeBigBill ? [
        {
          item: "Enhanced standard deduction (+$5,000)",
          amount: -1100, // $5000 * 22% bracket
        },
        {
          item: hasChildren ? "Expanded child tax credit ($2,500)" : "Middle class tax rate reduction",
          amount: hasChildren ? -2500 : (income > 25000 && income < 400000 ? Math.min(income - 25000, 375000) * -0.03 : 0),
        },
      ] : [
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
  ];
  
    console.log(`Results: Tax=${taxImpact}, Healthcare=${healthcareImpact}, State=${stateAdjustment}, Energy=${energyImpact}, Net=${netAnnualImpact}`);
  console.log(`Community: School=${schoolFundingImpact}%, Infrastructure=$${Math.round(infrastructureImpact/1000)}K, Jobs=${jobOpportunities}`);

  // Timeline calculations with compounding for both scenarios
  const timeline = {
    fiveYear: Math.round(adjustedNetAnnualImpact * 5 * 1.025), // 2.5% annual inflation
    tenYear: Math.round(adjustedNetAnnualImpact * 10 * 1.28), // Compound inflation
    twentyYear: Math.round(adjustedNetAnnualImpact * 20 * 1.64),
  };

  const bigBillNetImpact = bigBillTaxImpact + (finalHealthcareImpact * 1.4) + stateAdjustment + finalEnergyImpact + employmentTaxAdjustment;
  const bigBillTimeline = {
    fiveYear: Math.round(bigBillNetImpact * 5 * 1.025), // 2.5% annual inflation
    tenYear: Math.round(bigBillNetImpact * 10 * 1.28), // Compound inflation
    twentyYear: Math.round(bigBillNetImpact * 20 * 1.64),
  };

return {
    // Current law scenario (default)
    annualTaxImpact: Math.round(scaledTaxImpact + employmentTaxAdjustment),
    healthcareCostImpact: Math.round(finalHealthcareImpact),
    energyCostImpact: Math.round(finalEnergyImpact),
    netAnnualImpact: Math.round(adjustedNetAnnualImpact),
    healthcareCosts: {
      current: Math.round(healthcareCosts.current),
      proposed: Math.round(healthcareCosts.proposed),
    },
    communityImpact: {
      schoolFunding: schoolFundingImpact,
      infrastructure: infrastructureImpact,
      jobOpportunities: jobOpportunities,
    },
    timeline: timeline,
    breakdown: breakdown,
    // Big Bill scenario
    bigBillScenario: {
      annualTaxImpact: Math.round(bigBillTaxImpact),
      healthcareCostImpact: Math.round(healthcareImpact * 1.4), 
      energyCostImpact: Math.round(finalEnergyImpact), // Same as current
      netAnnualImpact: Math.round(bigBillNetImpact),
      timeline: bigBillTimeline,
      breakdown: [
        {
          category: "tax" as const,
          title: "One Big Beautiful Bill - Tax Changes",
          description: "Based on H.R. 1 Congressional Budget Office analysis",
          impact: Math.round(bigBillTaxImpact),
          details: [
            { item: "Enhanced standard deduction", amount: Math.round(bigBillTaxImpact * 0.4) },
            { item: "Expanded child tax credit", amount: Math.round(bigBillTaxImpact * 0.6) }
          ]
        },
        {
          category: "healthcare" as const,
          title: "One Big Beautiful Bill - Healthcare",
          description: "Expanded Medicare and enhanced ACA subsidies",
          impact: Math.round(healthcareImpact * 1.4),
          details: [
            { item: "Enhanced premium subsidies", amount: Math.round(healthcareImpact * 1.4 * 0.7) },
            { item: "Expanded prescription coverage", amount: Math.round(healthcareImpact * 1.4 * 0.3) }
          ]
        }
      ]
    }
  };
}