
import { parseCBOCSV, extractRealCBOProvisions } from '../server/utils/csv-reader';
import * as path from 'path';

// Process the CBO CSV file
const csvPath = path.join(process.cwd(), 'attached_assets', 'One Big Beautiful Bill Act CBO Analysis - Summary_1749953405700.csv');

try {
  console.log('Processing CBO CSV data...');
  console.log('File path:', csvPath);
  
  const cboData = parseCBOCSV(csvPath);
  console.log('\n=== CBO Data Summary ===');
  
  cboData.forEach(titleData => {
    console.log(`\nTitle: ${titleData.title}`);
    console.log(`2026 Outlays: $${titleData.outlays['2026']?.toLocaleString() || 0} million`);
    console.log(`2026 Revenues: $${titleData.revenues['2026']?.toLocaleString() || 0} million`);
    console.log(`2026 Net Deficit Impact: $${titleData.netDeficit['2026']?.toLocaleString() || 0} million`);
  });
  
  console.log('\n=== Extracted Policy Provisions ===');
  const provisions = extractRealCBOProvisions(cboData);
  console.log(JSON.stringify(provisions, null, 2));
  
  console.log('\n=== Key Findings ===');
  console.log(`Tax Revenue Impact (2026): $${provisions.tax_changes.total_revenue_impact.toLocaleString()} million`);
  console.log(`Healthcare Savings (2026): $${provisions.healthcare_changes.medicare_savings.toLocaleString()} million`);
  console.log(`Defense Spending (2026): $${provisions.defense.total_spending.toLocaleString()} million`);
  console.log(`Education Savings (2026): $${provisions.education_workforce.annual_savings.toLocaleString()} million`);
  
} catch (error) {
  console.error('Error processing CBO data:', error.message);
}
