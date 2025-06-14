// Data Sources and Methodology Information
// This provides transparency about where calculations come from

export interface DataSource {
  id: string;
  name: string;
  organization: string;
  url: string;
  lastUpdated: string;
  credibility: "government" | "nonpartisan" | "academic";
  description: string;
}

export const DATA_SOURCES: DataSource[] = [
  {
    id: "irs-tax-brackets",
    name: "Federal Income Tax Brackets and Standard Deductions",
    organization: "Internal Revenue Service",
    url: "https://www.irs.gov/newsroom/irs-provides-tax-inflation-adjustments-for-tax-year-2024",
    lastUpdated: "2024-01-01",
    credibility: "government",
    description: "Official federal tax brackets, standard deductions, and tax calculations from the IRS"
  },
  {
    id: "kff-healthcare",
    name: "Employer Health Benefits Survey",
    organization: "Kaiser Family Foundation",
    url: "https://www.kff.org/health-costs/report/2023-employer-health-benefits-survey/",
    lastUpdated: "2023-10-01",
    credibility: "nonpartisan",
    description: "Annual survey of employer-sponsored health insurance premiums and worker contributions"
  },
  {
    id: "cms-healthcare-spending",
    name: "National Health Expenditure Data",
    organization: "Centers for Medicare & Medicaid Services",
    url: "https://www.cms.gov/Research-Statistics-Data-and-Systems/Statistics-Trends-and-Reports/NationalHealthExpendData",
    lastUpdated: "2023-12-01",
    credibility: "government",
    description: "Official healthcare spending data including Medicare, Medicaid, and private insurance costs"
  },
  {
    id: "tax-foundation-state",
    name: "State Tax Data",
    organization: "Tax Foundation",
    url: "https://taxfoundation.org/data/all/state/",
    lastUpdated: "2024-01-01",
    credibility: "nonpartisan",
    description: "Comprehensive state-by-state tax rate data including income, sales, and property taxes"
  },
  {
    id: "bea-cost-living",
    name: "Regional Price Parities",
    organization: "Bureau of Economic Analysis",
    url: "https://www.bea.gov/data/prices-inflation/regional-price-parities-state-and-metro-area",
    lastUpdated: "2023-12-01",
    credibility: "government",
    description: "Official cost of living adjustments by state and metropolitan area"
  },
  {
    id: "cbo-budget-outlook",
    name: "Budget and Economic Outlook",
    organization: "Congressional Budget Office",
    url: "https://www.cbo.gov/publication/59946",
    lastUpdated: "2024-02-01",
    credibility: "government",
    description: "Official federal budget projections and economic forecasts used for policy scoring"
  }
];

export const METHODOLOGY = {
  overview: "This calculator uses data from authoritative government and nonpartisan sources to estimate policy impacts. All calculations are based on established economic methodologies used by government agencies.",
  
  tax_calculations: {
    description: "Tax impact calculations use current IRS tax brackets, standard deductions, and proposed legislative changes as scored by the Congressional Budget Office.",
    methodology: [
      "Apply current federal tax brackets to estimated income",
      "Calculate standard deduction based on filing status",
      "Apply proposed policy changes (standard deduction increases, tax credit enhancements)",
      "Factor in state-specific tax rates and cost of living adjustments"
    ],
    limitations: "Calculations use median income estimates within ranges. Actual impact varies based on specific deductions, credits, and individual circumstances."
  },
  
  healthcare_calculations: {
    description: "Healthcare cost estimates use Kaiser Family Foundation employer survey data and CMS national health expenditure data.",
    methodology: [
      "Base costs from KFF annual employer health benefits survey",
      "Age and family size adjustments based on actuarial data",
      "Insurance type adjustments (employer vs. marketplace vs. government programs)",
      "Apply proposed policy changes (premium subsidies, prescription drug caps, Medicare expansion)"
    ],
    limitations: "Estimates represent typical costs. Actual healthcare expenses vary significantly based on health status, plan selection, and geographic location."
  },
  
  state_adjustments: {
    description: "State-specific impacts account for varying tax rates, cost of living, and local policy implementation.",
    methodology: [
      "State income tax rates from Tax Foundation data",
      "Cost of living adjustments from Bureau of Economic Analysis",
      "Local policy variations based on state implementation of federal programs"
    ],
    limitations: "State calculations use statewide averages. Local variations within states can be significant."
  },
  
  timeline_projections: {
    description: "Multi-year projections include inflation adjustments and policy phase-in schedules.",
    methodology: [
      "Apply CBO inflation projections (typically 2.5% annually)",
      "Account for policy implementation timelines",
      "Include compound effects over time"
    ],
    limitations: "Long-term projections are estimates only. Actual economic conditions and policy changes may differ significantly."
  },
  
  disclaimer: "This tool provides estimates for educational purposes only. Results should not be used for financial planning or tax preparation. Consult qualified professionals for specific financial advice."
};