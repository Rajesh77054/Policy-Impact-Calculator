
import * as fs from 'fs';
import * as path from 'path';

export interface CBOData {
  title: string;
  outlays: { [year: string]: number };
  revenues: { [year: string]: number };
  netDeficit: { [year: string]: number };
}

export function parseCBOCSV(filePath: string): CBOData[] {
  try {
    const csvContent = fs.readFileSync(filePath, 'utf-8');
    const lines = csvContent.split('\n');
    
    const cboData: CBOData[] = [];
    let currentTitle = '';
    
    // Find the year headers (2025, 2026, etc.)
    const yearHeaderLine = lines.find(line => line.includes('2025') && line.includes('2026'));
    if (!yearHeaderLine) {
      throw new Error('Could not find year headers in CSV');
    }
    
    const yearColumns = yearHeaderLine.split(',').map(col => col.trim().replace(/"/g, ''));
    const years = yearColumns.filter(col => /^\d{4}$/.test(col));
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip empty lines
      if (!line) continue;
      
      // Check for title lines (Committee on...)
      if (line.includes('Committee on') || line.includes('Ways and Means')) {
        currentTitle = line.split(',')[0].replace(/"/g, '').trim();
        
        // Initialize data structure for this title
        const titleData: CBOData = {
          title: currentTitle,
          outlays: {},
          revenues: {},
          netDeficit: {}
        };
        
        // Look for the next few lines containing outlays, revenues, and net effect
        for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
          const dataLine = lines[j];
          const columns = dataLine.split(',').map(col => col.trim().replace(/"/g, ''));
          
          if (columns[1] === 'Estimated Outlays') {
            years.forEach((year, index) => {
              const value = parseFloat(columns[index + 3]?.replace(/,/g, '') || '0');
              titleData.outlays[year] = isNaN(value) ? 0 : value;
            });
          } else if (columns[1] === 'Estimated Revenues') {
            years.forEach((year, index) => {
              const value = parseFloat(columns[index + 3]?.replace(/,/g, '') || '0');
              titleData.revenues[year] = isNaN(value) ? 0 : value;
            });
          } else if (columns[1] === 'Net Effect on the Deficit') {
            years.forEach((year, index) => {
              const value = parseFloat(columns[index + 3]?.replace(/,/g, '') || '0');
              titleData.netDeficit[year] = isNaN(value) ? 0 : value;
            });
          }
        }
        
        cboData.push(titleData);
      }
    }
    
    return cboData;
  } catch (error) {
    console.error('Error parsing CBO CSV:', error);
    throw new Error(`Failed to parse CBO CSV: ${error.message}`);
  }
}

export function extractRealCBOProvisions(cboData: CBOData[]) {
  // Extract key provisions from the CBO data that map to calculator features
  const provisions = {
    tax_changes: {
      // Ways and Means Committee handles tax provisions
      total_revenue_impact: 0,
      middle_class_impact: 0,
      high_income_impact: 0
    },
    healthcare_changes: {
      // Energy and Commerce Committee handles healthcare
      medicare_savings: 0,
      premium_changes: 0,
      coverage_changes: 0
    },
    education_workforce: {
      // Education and Workforce Committee
      total_impact: 0,
      annual_savings: 0
    },
    agriculture: {
      // Agriculture Committee
      total_impact: 0,
      annual_savings: 0
    },
    defense: {
      // Armed Services Committee
      total_spending: 0,
      annual_impact: 0
    },
    infrastructure: {
      // Transportation and Infrastructure Committee
      total_investment: 0,
      annual_impact: 0
    }
  };

  cboData.forEach(titleData => {
    const title = titleData.title.toLowerCase();
    
    if (title.includes('ways and means')) {
      // Tax provisions - massive revenue impact
      provisions.tax_changes.total_revenue_impact = titleData.revenues['2026'] || 0; // -483,642 million
      provisions.tax_changes.middle_class_impact = Math.abs(titleData.revenues['2026'] || 0) * 0.6; // Estimate 60% middle class
      provisions.tax_changes.high_income_impact = Math.abs(titleData.revenues['2026'] || 0) * 0.4; // Estimate 40% high income
    } else if (title.includes('energy and commerce')) {
      // Healthcare provisions
      provisions.healthcare_changes.medicare_savings = Math.abs(titleData.outlays['2026'] || 0); // 28,487 million savings
      provisions.healthcare_changes.premium_changes = -12.2; // 12.2% reduction per CBO note
      provisions.healthcare_changes.coverage_changes = 10.9; // 10.9 million lose coverage per CBO note
    } else if (title.includes('education and workforce')) {
      provisions.education_workforce.total_impact = titleData.netDeficit['2026'] || 0; // -14,271 million
      provisions.education_workforce.annual_savings = Math.abs(titleData.netDeficit['2026'] || 0);
    } else if (title.includes('agriculture')) {
      provisions.agriculture.total_impact = titleData.netDeficit['2026'] || 0; // -12,597 million
      provisions.agriculture.annual_savings = Math.abs(titleData.netDeficit['2026'] || 0);
    } else if (title.includes('armed services')) {
      provisions.defense.total_spending = titleData.outlays['2026'] || 0; // 40,299 million
      provisions.defense.annual_impact = titleData.outlays['2026'] || 0;
    } else if (title.includes('transportation')) {
      provisions.infrastructure.total_investment = titleData.outlays['2026'] || 0; // 536 million
      provisions.infrastructure.annual_impact = titleData.netDeficit['2026'] || 0; // 113 million net
    }
  });

  return provisions;
}
