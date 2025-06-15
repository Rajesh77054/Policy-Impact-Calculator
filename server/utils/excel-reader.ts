
import * as XLSX from 'xlsx';
import * as fs from 'fs';

export interface ExcelData {
  [sheetName: string]: any[][];
}

export function readExcelFile(filePath: string): ExcelData {
  try {
    // Read the file
    const workbook = XLSX.readFile(filePath);
    
    // Get all sheet names
    const sheetNames = workbook.SheetNames;
    
    // Convert each sheet to JSON
    const data: ExcelData = {};
    
    sheetNames.forEach(sheetName => {
      const worksheet = workbook.Sheets[sheetName];
      // Convert to array of arrays (like CSV data)
      const sheetData = XLSX.utils.sheet_to_json(worksheet, { 
        header: 1,  // Use array of arrays format
        defval: ''  // Default value for empty cells
      });
      data[sheetName] = sheetData as any[][];
    });
    
    return data;
  } catch (error) {
    console.error('Error reading Excel file:', error);
    throw new Error(`Failed to read Excel file: ${error.message}`);
  }
}

export function extractCBOData(excelData: ExcelData) {
  // This function will parse the specific CBO HR1 data structure
  // You'll need to customize this based on the actual structure of the CBO file
  
  const cboProvisions = {
    tax_changes: {
      standard_deduction_increase: 0,
      middle_class_tax_cut: 0,
      child_tax_credit: 0,
      top_bracket_changes: 0
    },
    healthcare_changes: {
      medicare_expansion: 0,
      prescription_drug_savings: 0,
      premium_subsidies: 0
    },
    infrastructure: {
      total_investment: 0,
      timeline_years: 10
    },
    revenue_sources: {
      corporate_tax_changes: 0,
      high_income_tax_changes: 0
    }
  };

  // Parse the Excel data to extract actual CBO provisions
  // This will need to be customized based on the actual file structure
  Object.keys(excelData).forEach(sheetName => {
    const sheetData = excelData[sheetName];
    console.log(`Processing sheet: ${sheetName}`);
    
    // Look for specific data patterns in the CBO file
    // You'll need to inspect the file structure and adjust this logic
    sheetData.forEach((row, index) => {
      if (Array.isArray(row) && row.length > 0) {
        const firstCell = String(row[0]).toLowerCase();
        
        // Example parsing logic - adjust based on actual file structure
        if (firstCell.includes('standard deduction')) {
          // Extract standard deduction changes
        }
        if (firstCell.includes('child tax credit')) {
          // Extract child tax credit changes
        }
        // Add more parsing logic as needed
      }
    });
  });

  return cboProvisions;
}
