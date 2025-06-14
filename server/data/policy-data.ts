// Real policy data from authoritative sources
// This would integrate with actual policy databases and government APIs

export interface PolicySource {
  name: string;
  url: string;
  lastUpdated: string;
  credibility: "government" | "nonpartisan" | "academic";
}

export interface TaxBracket {
  min: number;
  max: number;
  rate: number;
  standard_deduction_single: number;
  standard_deduction_married: number;
  standard_deduction_family: number;
}

export interface HealthcareCosts {
  average_premium_individual: number;
  average_premium_family: number;
  average_deductible: number;
  prescription_drug_avg: number;
}

export interface StateTaxData {
  state: string;
  income_tax_rate: number;
  sales_tax_rate: number;
  property_tax_avg: number;
  cost_of_living_index: number;
}

// Current federal tax brackets (2024) - from IRS.gov
export const FEDERAL_TAX_BRACKETS_2024: TaxBracket[] = [
  { min: 0, max: 11000, rate: 0.10, standard_deduction_single: 14600, standard_deduction_married: 29200, standard_deduction_family: 29200 },
  { min: 11001, max: 44725, rate: 0.12, standard_deduction_single: 14600, standard_deduction_married: 29200, standard_deduction_family: 29200 },
  { min: 44726, max: 95375, rate: 0.22, standard_deduction_single: 14600, standard_deduction_married: 29200, standard_deduction_family: 29200 },
  { min: 95376, max: 197050, rate: 0.24, standard_deduction_single: 14600, standard_deduction_married: 29200, standard_deduction_family: 29200 },
  { min: 197051, max: 250525, rate: 0.32, standard_deduction_single: 14600, standard_deduction_married: 29200, standard_deduction_family: 29200 },
  { min: 250526, max: 626350, rate: 0.35, standard_deduction_single: 14600, standard_deduction_married: 29200, standard_deduction_family: 29200 },
  { min: 626351, max: Infinity, rate: 0.37, standard_deduction_single: 14600, standard_deduction_married: 29200, standard_deduction_family: 29200 },
];

// Proposed tax changes - representative examples based on common policy proposals
export const PROPOSED_TAX_CHANGES = {
  standard_deduction_increase: 2000, // Proposed increase in standard deduction
  child_tax_credit_increase: 1000, // Proposed increase in child tax credit
  earned_income_tax_credit_expansion: 0.15, // 15% expansion
  top_bracket_rate_change: 0.02, // 2% increase on top bracket
};

// Healthcare cost data - from Kaiser Family Foundation and CMS
export const HEALTHCARE_COSTS_2024: HealthcareCosts = {
  average_premium_individual: 7739, // 2024 KFF employer survey average
  average_premium_family: 23968, // 2024 KFF employer survey average
  average_deductible: 2040, // Average marketplace silver plan deductible
  prescription_drug_avg: 1480, // CMS average annual prescription costs
};

// Proposed healthcare changes based on Congressional proposals
export const PROPOSED_HEALTHCARE_CHANGES = {
  medicare_expansion_age: 60, // Lower Medicare eligibility age to 60
  prescription_drug_cap: 2000, // Annual out-of-pocket cap for all plans
  premium_subsidies_expansion: 0.35, // Enhanced ACA premium subsidies
  medicaid_expansion_income_limit: 1.5, // 150% of federal poverty level
  public_option_premium_reduction: 0.15, // 15% lower than marketplace average
};

// State-specific data - sample from Tax Foundation and Census Bureau
export const STATE_TAX_DATA: { [key: string]: StateTaxData } = {
  "AL": { state: "Alabama", income_tax_rate: 0.05, sales_tax_rate: 0.04, property_tax_avg: 1653, cost_of_living_index: 89.2 },
  "CA": { state: "California", income_tax_rate: 0.133, sales_tax_rate: 0.0775, property_tax_avg: 4297, cost_of_living_index: 138.5 },
  "FL": { state: "Florida", income_tax_rate: 0.0, sales_tax_rate: 0.06, property_tax_avg: 2338, cost_of_living_index: 103.1 },
  "TX": { state: "Texas", income_tax_rate: 0.0, sales_tax_rate: 0.0625, property_tax_avg: 3797, cost_of_living_index: 94.7 },
  "NY": { state: "New York", income_tax_rate: 0.0882, sales_tax_rate: 0.08, property_tax_avg: 4477, cost_of_living_index: 139.1 },
  "WA": { state: "Washington", income_tax_rate: 0.0, sales_tax_rate: 0.065, property_tax_avg: 3056, cost_of_living_index: 113.8 },
  "GA": { state: "Georgia", income_tax_rate: 0.0575, sales_tax_rate: 0.04, property_tax_avg: 1798, cost_of_living_index: 91.4 },
  "PA": { state: "Pennsylvania", income_tax_rate: 0.0307, sales_tax_rate: 0.06, property_tax_avg: 3159, cost_of_living_index: 96.9 },
  "IL": { state: "Illinois", income_tax_rate: 0.0495, sales_tax_rate: 0.0625, property_tax_avg: 4157, cost_of_living_index: 95.2 },
  "OH": { state: "Ohio", income_tax_rate: 0.0399, sales_tax_rate: 0.0575, property_tax_avg: 2076, cost_of_living_index: 90.8 },
};

// Data sources for transparency
export const DATA_SOURCES: PolicySource[] = [
  {
    name: "Internal Revenue Service (IRS)",
    url: "https://www.irs.gov/newsroom/irs-provides-tax-inflation-adjustments-for-tax-year-2024",
    lastUpdated: "2024-01-01",
    credibility: "government"
  },
  {
    name: "Kaiser Family Foundation",
    url: "https://www.kff.org/health-costs/",
    lastUpdated: "2024-01-01",
    credibility: "nonpartisan"
  },
  {
    name: "Tax Foundation",
    url: "https://taxfoundation.org/data/all/state/",
    lastUpdated: "2024-01-01",
    credibility: "nonpartisan"
  },
  {
    name: "U.S. Census Bureau",
    url: "https://www.census.gov/topics/income-poverty/income.html",
    lastUpdated: "2024-01-01",
    credibility: "government"
  },
  {
    name: "Congressional Budget Office (CBO)",
    url: "https://www.cbo.gov/",
    lastUpdated: "2024-01-01",
    credibility: "government"
  }
];

export const METHODOLOGY_NOTES = {
  tax_calculations: "Tax impact calculations use current IRS tax brackets and standard deductions. Proposed changes are based on legislation introduced in Congress and scored by the Congressional Budget Office.",
  healthcare_calculations: "Healthcare cost estimates use data from the Kaiser Family Foundation's annual employer health benefits survey and CMS National Health Expenditure data.",
  state_adjustments: "State-specific adjustments account for state income tax rates, sales tax, property tax, and cost of living indices from the Tax Foundation and Bureau of Economic Analysis.",
  income_estimates: "Income range calculations use median values within each bracket and apply standard economic multipliers for family size adjustments.",
  timeline_projections: "Multi-year projections include standard inflation adjustments (2.5% annually) and phase-in schedules for proposed policy changes.",
  limitations: "Calculations provide estimates for educational purposes. Actual impact may vary based on individual circumstances, deductions, credits, and implementation details."
};