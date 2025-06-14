import { FormData, PolicyResults } from "@shared/schema";

export function calculatePolicyImpact(formData: FormData): PolicyResults {
  // This is client-side calculation logic for preview purposes
  // The actual calculation happens on the server
  
  const baseValues = {
    taxImpact: 1240,
    healthcareImpact: -480,
    energyImpact: 120,
  };

  // Apply multipliers based on form data
  let taxImpact = baseValues.taxImpact;
  let healthcareImpact = baseValues.healthcareImpact;
  let energyImpact = baseValues.energyImpact;

  // Income-based adjustments
  if (formData.incomeRange) {
    const incomeMultipliers = {
      "under-25k": 0.5,
      "25k-50k": 0.8,
      "50k-75k": 1.0,
      "75k-100k": 1.3,
      "100k-150k": 1.6,
      "over-150k": 2.0,
    };
    taxImpact *= incomeMultipliers[formData.incomeRange] || 1.0;
  }

  // Family status adjustments
  if (formData.familyStatus) {
    const familyMultipliers = {
      "single": 1.0,
      "married": 1.4,
      "family": 1.8,
    };
    taxImpact *= familyMultipliers[formData.familyStatus] || 1.0;
  }

  const netAnnual = taxImpact + healthcareImpact + energyImpact;

  return {
    annualTaxImpact: Math.round(taxImpact),
    healthcareCostImpact: Math.round(healthcareImpact),
    energyCostImpact: Math.round(energyImpact),
    netAnnualImpact: Math.round(netAnnual),
    communityImpact: {
      schoolFunding: 12,
      infrastructure: 2100000,
      jobOpportunities: 340,
    },
    timeline: {
      fiveYear: Math.round(netAnnual * 5 * 1.1),
      tenYear: Math.round(netAnnual * 10 * 1.15),
      twentyYear: Math.round(netAnnual * 20 * 1.2),
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
