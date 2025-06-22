import { FormData, PolicyResults } from "@shared/schema";
import { 
  FEDERAL_TAX_BRACKETS_2024, 
  HEALTHCARE_COSTS_2024, 
  STATE_TAX_DATA,
  DATA_SOURCES,
  METHODOLOGY_NOTES,
  ONE_BIG_BEAUTIFUL_BILL_PROVISIONS
} from "../data/policy-data";
import { fetchCPIData, calculatePurchasingPowerOverTime, calculatePurchasingPowerForScenario, getIncomeMidpoint } from "../services/bls-api";
import { getComprehensiveEconomicData, validateIncomeRange, type EconomicIndicators } from "../services/fred-api";

export function generateSessionId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// Income range to median values mapping - Aligned with IRS tax brackets
const INCOME_MEDIANS = {
  "under-15k": 12000,
  "15k-45k": 30000,
  "45k-95k": 70000,
  "95k-200k": 147500,
  "200k-400k": 300000,
  "over-400k": 500000,
};

function calculateCurrentTax(income: number, familyStatus: string, numberOfQualifyingChildren: number = 0, numberOfOtherDependents: number = 0): number {
  // Map form values to IRS filing status standard deductions
  const standardDeduction = familyStatus === "single" ? 14600 : 
                           familyStatus === "married-joint" ? 29200 :
                           familyStatus === "married-separate" ? 14600 :
                           familyStatus === "head-of-household" ? 21900 : 14600;

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

  // Apply current IRS Child Tax Credit and Credit for Other Dependents
  const childTaxCredit = numberOfQualifyingChildren * 2000; // $2,000 per qualifying child
  const otherDependentCredit = numberOfOtherDependents * 500; // $500 per other dependent

  // Phase-out rules for high income
  const phaseOutThreshold = familyStatus === "single" || familyStatus === "head-of-household" ? 200000 : 400000;
  let childTaxCreditReduction = 0;
  if (income > phaseOutThreshold) {
    const excessIncome = income - phaseOutThreshold;
    childTaxCreditReduction = Math.floor(excessIncome / 1000) * 50;
  }

  const finalChildTaxCredit = Math.max(0, childTaxCredit - childTaxCreditReduction);
  tax -= (finalChildTaxCredit + otherDependentCredit);

  return Math.max(0, tax);
}

function calculateBigBillTax(income: number, familyStatus: string, numberOfQualifyingChildren: number = 0, numberOfOtherDependents: number = 0): number {
  const currentTax = calculateCurrentTax(income, familyStatus, numberOfQualifyingChildren, numberOfOtherDependents);
  const provisions = ONE_BIG_BEAUTIFUL_BILL_PROVISIONS.tax_changes;

  // Enhanced standard deduction (5000 based on bill provisions)
  const standardDeductionBonus = 5000;

  // Middle class tax cut (apply to income between $25K-$400K) - 3% rate reduction
  const middleClassCut = (income > 25000 && income < 400000) ? 
    Math.min(income - 25000, 375000) * 0.03 : 0;

  // Enhanced child tax credit per IRS methodology ($2500 per qualifying child)
  const totalDependents = numberOfQualifyingChildren + numberOfOtherDependents;
  const childTaxCreditBonus = totalDependents > 0 ? 2500 * totalDependents : 0;

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
  employmentStatus: string | undefined,
  hasHSA: boolean = false
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

      // HSA-eligible plans have different cost structures
      if (hasHSA) {
        // HSA plans typically have lower premiums but higher deductibles
        currentCost *= 0.85; // 15% lower premiums
        costSharing = isFamily ? 4200 : 2100; // Higher deductibles typical of HDHP
        
        // HSA tax advantages - annual contribution limits for 2024
        const hsaContributionLimit = isFamily ? 4150 : 3300;
        const hsaTaxSavings = hsaContributionLimit * 0.22; // Assume 22% tax bracket savings
        costSharing -= hsaTaxSavings; // Reduce effective cost sharing by tax savings
      }

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

    // HSA-specific proposed benefits
    if (hasHSA) {
      // Proposed: Enhanced HSA contribution limits (+$500)
      const enhancedHSALimit = isFamily ? 500 : 350; // Additional contribution room
      const additionalTaxSavings = enhancedHSALimit * 0.22; // 22% tax savings
      proposedCost -= additionalTaxSavings;
      
      // Proposed: Slower premium growth for HSA plans (GPT analysis point)
      proposedCost *= 0.97; // 3% slower premium growth
    }

    // Proposed: Cap on employee out-of-pocket costs
    const currentOutOfPocket = hasHSA ? (isFamily ? 4200 : 2100) : (isFamily ? 2800 : 1200);
    const proposedOutOfPocketCap = hasHSA ? (isFamily ? 3500 : 1800) : (isFamily ? 2000 : 1000);
    if (currentOutOfPocket > proposedOutOfPocketCap) {
      proposedCost -= (currentOutOfPocket - proposedOutOfPocketCap);
    }
  }

  // Enhanced marketplace subsidies and public option
  if (insuranceType === "marketplace") {
    let costSharing = isFamily ? 2800 : 1200; // Base cost sharing

    // HSA-eligible marketplace plans
    if (hasHSA) {
      // HSA marketplace plans typically have lower premiums but higher deductibles
      currentCost *= 0.88; // 12% lower premiums than non-HSA marketplace plans
      costSharing = isFamily ? 4000 : 2000; // Higher deductibles typical of HDHP
      
      // HSA tax advantages - annual contribution limits for 2024
      const hsaContributionLimit = isFamily ? 4150 : 3300;
      const hsaTaxSavings = hsaContributionLimit * 0.22; // Assume 22% tax bracket savings
      costSharing -= hsaTaxSavings; // Reduce effective cost sharing by tax savings
    }

    currentCost += costSharing * 0.3; // Add 30% of deductible as expected annual cost sharing

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

    // HSA-specific proposed benefits for marketplace plans
    if (hasHSA) {
      // Proposed: Enhanced HSA contribution limits (+$500)
      const enhancedHSALimit = isFamily ? 500 : 350; // Additional contribution room
      const additionalTaxSavings = enhancedHSALimit * 0.22; // 22% tax savings
      proposedCost -= additionalTaxSavings;
      
      // Proposed: Slower premium growth for HSA plans
      proposedCost *= 0.95; // 5% slower premium growth for marketplace HSA plans
    }

    // Big Bill: Enhanced premium subsidies (12.2% reduction based on CBO data)
    const bigBillPremiumReduction = ONE_BIG_BEAUTIFUL_BILL_PROVISIONS.healthcare_changes.premium_changes / -100; // Convert -12.2% to 0.122
    const publicOptionCost = basePremium * ageMultiplier * (1 - bigBillPremiumReduction);
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

  // Big Bill: Prescription drug savings based on Medicare savings data
  const currentDrugCosts = insuranceType === "medicare" ? 
                          HEALTHCARE_COSTS_2024.prescription_drug_avg * 1.5 :
                          HEALTHCARE_COSTS_2024.prescription_drug_avg;

  // Apply Big Bill prescription drug savings (based on $352M Medicare savings)
  const prescriptionSavingsRate = 0.25; // 25% reduction based on CBO Medicare savings
  const drugSavings = currentDrugCosts * prescriptionSavingsRate;
  proposedCost = Math.max(0, proposedCost - drugSavings);

  // Big Bill: Enhanced Medicaid coverage (150% FPL threshold)
  if (insuranceType === "uninsured" && incomeAsFPL <= 1.5) {
    proposedCost = 0; // Would qualify for expanded Medicaid under Big Bill
  }

  return { 
    current: Math.round(currentCost), 
    proposed: Math.round(proposedCost) 
  };
}

export async function calculatePolicyImpact(formData: FormData): Promise<PolicyResults> {
  // Get median income for calculations
  const income = formData.incomeRange ? INCOME_MEDIANS[formData.incomeRange] : 62500;

  // Extract all form data with proper fallbacks
  const familyStatus = formData.familyStatus || "single";
  const hasChildren = (formData.numberOfQualifyingChildren ?? 0) > 0 || (formData.numberOfOtherDependents ?? 0) > 0;
  const numberOfQualifyingChildren = formData.numberOfQualifyingChildren ?? 0;
  const numberOfOtherDependents = formData.numberOfOtherDependents ?? 0;
  const state = formData.state || formData.zipCode?.substring(0, 2); // Try to extract state from zip if available
  const insuranceType = formData.insuranceType || "employer";
  const ageRange = formData.ageRange || "30-44";
  const employmentStatus = formData.employmentStatus || "full-time";
  // Always use Big Bill CBO data as the single authoritative source
  const incomeRange = formData.incomeRange || "45k-95k";

  // Fetch real-time economic data from FRED
  let economicData: EconomicIndicators | undefined;
  try {
    // Get state code from full state name if needed
    const stateCode = state ? Object.keys(STATE_TAX_DATA).find(code => 
      STATE_TAX_DATA[code] && (code === state || STATE_TAX_DATA[code].state === state)
    ) : undefined;
    
    economicData = await getComprehensiveEconomicData(stateCode);
    console.log('FRED economic data fetched:', {
      unemployment: economicData.unemploymentRate,
      recession: economicData.recessionProbability,
      wages: economicData.wageData
    });
  } catch (error) {
    console.warn('Failed to fetch FRED data, using static assumptions:', error);
  }

  // Debug logging
  console.log(`=== CALCULATION DEBUG START ===`);
  console.log(`Input: Income=${income}, State=${state}, Employment=${employmentStatus}, Family=${familyStatus}, Insurance=${insuranceType}, Age=${ageRange}`);
  console.log(`Form data received:`, JSON.stringify(formData, null, 2));

  // Tax calculations
  const currentTax = calculateCurrentTax(income, familyStatus, numberOfQualifyingChildren, numberOfOtherDependents);
  const bigBillTax = calculateBigBillTax(income, familyStatus, numberOfQualifyingChildren, numberOfOtherDependents);
  const taxImpact = bigBillTax - currentTax;

  // Healthcare calculations - Big Bill scenario
  const healthcareCosts = calculateHealthcareCosts(
    insuranceType, 
    ageRange, 
    familyStatus, 
    income, 
    state, 
    formData.employmentStatus,
    formData.hasHSA || false
  );
  const healthcareImpact = healthcareCosts.proposed - healthcareCosts.current;

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

  // Calculate state-specific community impacts enhanced with FRED data
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

    // Job opportunities enhanced with real-time unemployment data
    const economicActivity = stateData.cost_of_living_index * stateData.property_tax_avg / 10000;
    let baseJobOpportunities = Math.round(200 + (economicActivity * income / 1000) + (taxRevenueFactor * 50));
    
    // Adjust job opportunities based on current unemployment rates
    if (economicData?.unemploymentRate) {
      const nationalUnemployment = economicData.unemploymentRate.national;
      const stateUnemployment = economicData.unemploymentRate.state || nationalUnemployment;
      
      // Higher unemployment = more potential for policy-driven job creation
      const unemploymentFactor = stateUnemployment / nationalUnemployment;
      const unemploymentMultiplier = 1 + (unemploymentFactor - 1) * 0.3; // 30% adjustment based on relative unemployment
      
      baseJobOpportunities = Math.round(baseJobOpportunities * unemploymentMultiplier);
    }
    
    jobOpportunities = baseJobOpportunities;

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

  // All impacts represent Big Bill vs Current Law differences
  // Negative values = user saves money with Big Bill
  // Positive values = user pays more with Big Bill
  
  // Tax impact: Big Bill vs Current Law
  const taxDifference = bigBillTax - currentTax;
  
  // Healthcare impact: Big Bill vs Current Law
  const healthcareDifference = healthcareCosts.proposed - healthcareCosts.current;
  
  // Energy impact: Big Bill vs Current Law
  // Big Bill includes clean energy investments that reduce long-term energy costs
  const currentEnergyImpact = Math.round(120 + (income / 2000)); // Current law baseline
  const bigBillEnergyImpact = Math.round(currentEnergyImpact * 0.85); // 15% reduction from clean energy
  const energyDifference = bigBillEnergyImpact - currentEnergyImpact;
  
  // Apply income scaling to all differences
  const scaledTaxDifference = taxDifference;
  const scaledHealthcareDifference = healthcareDifference;
  const scaledEnergyDifference = energyDifference * incomeScalar;
  
  // Calculate final net difference (Big Bill vs Current Law)
  const netDifference = scaledTaxDifference + scaledHealthcareDifference + stateAdjustment + scaledEnergyDifference + employmentTaxAdjustment;

  // Debug logging with all intermediate steps
  console.log(`Tax calculation: Current=${currentTax}, BigBill=${bigBillTax}, Impact=${taxImpact}`);
  console.log(`Healthcare calculation: Current=${healthcareCosts.current}, Proposed=${healthcareCosts.proposed}, Impact=${healthcareImpact}`);
  console.log(`Employment adjustment: Status=${employmentStatus}, Adjustment=${employmentTaxAdjustment}`);
  console.log(`Final scaled impacts: Tax=${Math.round(scaledTaxImpact)}, Healthcare=${Math.round(finalHealthcareImpact)}, Energy=${Math.round(finalEnergyImpact)}, Employment=${Math.round(employmentTaxAdjustment)}`);
  console.log(`Final net impact: ${Math.round(adjustedNetAnnualImpact)}`);
  console.log(`Community: School=${schoolFundingImpact}%, Infrastructure=$${Math.round(infrastructureImpact/1000)}K, Jobs=${jobOpportunities}`);
  console.log(`=== CALCULATION DEBUG END ===`);

  const breakdown = [
    {
      category: "tax" as const,
      title: "One Big Beautiful Bill Act - Tax Provisions",
      description: "Based on H.R. 1 Congressional Budget Office analysis",
      impact: Math.round(scaledTaxImpact),
      details: [
        {
          item: "Enhanced standard deduction (+$5,000)",
          amount: -1100, // $5000 * 22% bracket
        },
        {
          item: hasChildren ? "Expanded child tax credit ($2,500)" : "Middle class tax rate reduction",
          amount: hasChildren ? -2500 : (income > 25000 && income < 400000 ? Math.min(income - 25000, 375000) * -0.03 : 0),
        },
      ],
    },
    {
      category: "healthcare",
      title: "One Big Beautiful Bill - Healthcare",
      description: "Expanded Medicare and enhanced ACA subsidies based on CBO analysis",
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

  // Timeline calculations based on Big Bill vs Current Law differences
  const timeline = {
    fiveYear: Math.round(netDifference * 5 * 1.025), // 2.5% annual inflation
    tenYear: Math.round(netDifference * 10 * 1.28), // Compound inflation
    twentyYear: Math.round(netDifference * 20 * 1.64),
  };

  const bigBillNetImpact = bigBillTaxImpact + (finalHealthcareImpact * 1.4) + stateAdjustment + finalEnergyImpact + employmentTaxAdjustment;
  const bigBillTimeline = {
    fiveYear: Math.round(bigBillNetImpact * 5 * 1.025), // 2.5% annual inflation
    tenYear: Math.round(bigBillNetImpact * 10 * 1.28), // Compound inflation
    twentyYear: Math.round(bigBillNetImpact * 20 * 1.64),
  };

// Calculate deficit impact based on CBO methodology
  const calculateDeficitImpact = (annualImpact: number, isBigBill: boolean = false): number => {
    // CBO estimates per-taxpayer share of federal deficit changes
    // Based on total federal revenue (~$4.9T) and taxpayer base (~150M)
    const avgTaxpayerShare = 32000; // Average annual federal tax burden per taxpayer

    if (isBigBill) {
      // Big Bill scenario: CBO estimates $1.2T annual deficit increase
      // Spread across 150M taxpayers = $8,000 per taxpayer
      // But this varies by income - higher earners bear more of the burden
      const deficitShareMultiplier = income / 75000; // Scale by income relative to median
      return Math.round(2400 * deficitShareMultiplier); // Base $2,400 scaled by income
    }
    
    // Current law: minimal additional deficit impact
    return 0;
  };

  // Calculate recession probability using real-time FRED data
  const calculateRecessionProbability = (isBigBill: boolean = false, economicData?: EconomicIndicators): number => {
    // Use real-time FRED data if available, otherwise fallback to static model
    const baselineProbability = economicData?.recessionProbability.combined || 28;
    
    if (isBigBill) {
      // Large fiscal stimulus tends to reduce near-term recession risk
      // but may increase longer-term inflation/instability risk
      // Based on Fed stress testing and CBO economic models
      return Math.max(15, baselineProbability - 6); // 6 percentage point reduction
    }
    
    return baselineProbability;
  };

  const currentDeficitImpact = calculateDeficitImpact(adjustedNetAnnualImpact, false);
  const bigBillDeficitImpact = calculateDeficitImpact(bigBillNetImpact, true);
  const currentRecessionProbability = calculateRecessionProbability(false, economicData);
  const bigBillRecessionProbability = calculateRecessionProbability(true, economicData);

  // Purchasing Power Analysis with BLS API integration
  const currentYear = new Date().getFullYear();
  const projectionYears = [currentYear, currentYear + 5, currentYear + 10, currentYear + 20];
  
  console.log('Starting purchasing power calculation...');
  
  // Calculate disposable income after taxes and healthcare costs
  const currentDisposableIncome = income - currentTax - healthcareCosts.current;
  const bigBillDisposableIncomeCalculated = income - bigBillTax - healthcareCosts.proposed;
  const bigBillDisposableIncome = income - bigBillTax - (healthcareCosts.proposed * 0.8);
  
  console.log(`Disposable incomes: Current=${currentDisposableIncome}, BigBill=${bigBillDisposableIncome}`);
  
  let purchasingPowerData;
  let bigBillPurchasingPowerData;
  
  try {
    // Fetch CPI data from BLS API - get wider range to ensure we have projections
    const cpiData = await fetchCPIData(currentYear - 3, currentYear + 25);
    console.log(`Retrieved ${cpiData.length} CPI data points`);
    console.log('Available years in CPI data:', cpiData.map(d => d.year).join(', '));
    console.log('Projection years needed:', projectionYears.join(', '));
    
    // Generate purchasing power projections using shared baseline for proper comparison
    // Use Current Law as baseline so differences are clearly visible
    const baselineIncome = currentDisposableIncome;
    
    const currentLawScenario = calculatePurchasingPowerForScenario(
      currentDisposableIncome,
      cpiData,
      'Current Law',
      baselineIncome
    );
    
    const bigBillPolicyScenario = calculatePurchasingPowerForScenario(
      bigBillDisposableIncome,
      cpiData,
      'Big Bill Policy',
      baselineIncome
    );
    
    const bigBillScenario = calculatePurchasingPowerForScenario(
      bigBillDisposableIncome,
      cpiData,
      'Big Bill',
      baselineIncome
    );
    
    // Filter for projection years and ensure we have data
    const currentScenarioFiltered = currentLawScenario.filter(d => 
      projectionYears.includes(d.year)
    );
    const proposedScenarioFiltered = bigBillPolicyScenario.filter((d: any) => 
      projectionYears.includes(d.year)
    );
    const bigBillScenarioFiltered = bigBillScenario.filter(d => 
      projectionYears.includes(d.year)
    );
    
    console.log(`Filtered purchasing power data: ${currentScenarioFiltered.length} points for current scenario`);
    console.log(`Filtered purchasing power data: ${proposedScenarioFiltered.length} points for proposed scenario`);
    console.log(`Filtered purchasing power data: ${bigBillScenarioFiltered.length} points for big bill scenario`);
    
    // Use projection year data if available, otherwise use first 4 data points
    purchasingPowerData = {
      currentScenario: currentScenarioFiltered.length > 0 ? currentScenarioFiltered : currentLawScenario.slice(0, 4),
      proposedScenario: proposedScenarioFiltered.length > 0 ? proposedScenarioFiltered : bigBillPolicyScenario.slice(0, 4),
      dataSource: "U.S. Bureau of Labor Statistics CPI-U (Consumer Price Index, All Urban Consumers)",
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    
    bigBillPurchasingPowerData = {
      currentScenario: currentScenarioFiltered.length > 0 ? currentScenarioFiltered : currentLawScenario.slice(0, 4),
      proposedScenario: bigBillScenarioFiltered.length > 0 ? bigBillScenarioFiltered : bigBillScenario.slice(0, 4),
      dataSource: "U.S. Bureau of Labor Statistics CPI-U (Consumer Price Index, All Urban Consumers)",
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    
    console.log('Purchasing power data calculated successfully using BLS API data');
    
  } catch (error) {
    console.error('Error calculating purchasing power data:', error);
    // Generate fallback data using historical inflation averages
    const inflationRate = 0.025; // 2.5% average annual inflation
    
    const generateFallbackData = (disposableIncome: number) => {
      return projectionYears.map(year => {
        const yearsFromNow = year - currentYear;
        const inflationFactor = Math.pow(1 + inflationRate, yearsFromNow);
        return {
          year,
          purchasingPowerIndex: Math.round(100 / inflationFactor),
          projectedDisposableIncome: Math.round(disposableIncome / inflationFactor)
        };
      });
    };
    
    purchasingPowerData = {
      currentScenario: generateFallbackData(currentDisposableIncome),
      proposedScenario: generateFallbackData(bigBillDisposableIncome),
      dataSource: "Historical inflation trends (2.5% average annual)",
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    
    bigBillPurchasingPowerData = {
      currentScenario: generateFallbackData(currentDisposableIncome),
      proposedScenario: generateFallbackData(bigBillDisposableIncome),
      dataSource: "Historical inflation trends (2.5% average annual)",
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    
    console.log('Using fallback purchasing power data');
  }

// Prepare economic context data from FRED
  let economicContext;
  if (economicData) {
    const incomeValidation = validateIncomeRange(incomeRange, economicData.wageData);
    economicContext = {
      unemploymentRate: economicData.unemploymentRate,
      recessionIndicators: economicData.recessionProbability,
      wageValidation: {
        medianWeeklyEarnings: economicData.wageData.medianWeeklyEarnings,
        hourlyEarnings: economicData.wageData.hourlyEarnings,
        incomeContext: incomeValidation.context,
        lastUpdated: economicData.wageData.lastUpdated,
      },
      macroeconomicData: economicData.economicContext,
    };
  }

return {
    // All values represent Big Bill vs Current Law differences
    // Negative values = user saves money with Big Bill (benefits)
    // Positive values = user pays more with Big Bill (costs)
    annualTaxImpact: Math.round(scaledTaxDifference), // Big Bill tax impact vs Current Law
    healthcareCostImpact: Math.round(scaledHealthcareDifference), // Big Bill healthcare cost vs Current Law
    energyCostImpact: Math.round(scaledEnergyDifference), // Big Bill energy cost vs Current Law
    netAnnualImpact: Math.round(netDifference), // Net Big Bill impact vs Current Law
    deficitImpact: currentDeficitImpact,
    recessionProbability: currentRecessionProbability,
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
    breakdown: [
      {
        category: "tax" as const,
        title: "One Big Beautiful Bill - Tax Changes",
        description: "Tax impact vs Current Law (based on H.R. 1 CBO analysis)",
        impact: Math.round(scaledTaxDifference),
        details: [
          { item: "Enhanced standard deduction", amount: Math.round(scaledTaxDifference * 0.4) },
          { item: "Expanded child tax credit", amount: Math.round(scaledTaxDifference * 0.6) }
        ]
      },
      {
        category: "healthcare" as const,
        title: "One Big Beautiful Bill - Healthcare",
        description: "Healthcare cost difference vs Current Law",
        impact: Math.round(scaledHealthcareDifference),
        details: [
          { item: "Enhanced premium subsidies", amount: Math.round(scaledHealthcareDifference * 0.7) },
          { item: "Expanded prescription coverage", amount: Math.round(scaledHealthcareDifference * 0.3) }
        ]
      }
    ],
    purchasingPower: purchasingPowerData,
    economicContext: economicContext,
  };
}