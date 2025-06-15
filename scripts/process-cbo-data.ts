
import XLSX from 'xlsx';
import * as path from 'path';
import * as fs from 'fs';

// Try to read the CBO file that's already uploaded
const filePath = path.join(process.cwd(), 'attached_assets', 'HR1_HousePassed_6-4-2025_1749952389576.xlsx');

try {
  console.log('Attempting to read CBO Excel file...');
  console.log('File path:', filePath);
  console.log('File exists:', fs.existsSync(filePath));
  
  const workbook = XLSX.readFile(filePath);
  console.log('Available sheets:', workbook.SheetNames);
  
  // Process each sheet
  workbook.SheetNames.forEach(sheetName => {
    console.log(`\n=== Sheet: ${sheetName} ===`);
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON to see the structure
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    // Show first 10 rows to understand structure
    console.log('First 10 rows:');
    jsonData.slice(0, 10).forEach((row, index) => {
      console.log(`Row ${index + 1}:`, row);
    });
  });
  
} catch (error) {
  console.error('Error reading file:', error.message);
  console.log('Available files in attached_assets:');
  
  try {
    const fs = require('fs');
    const files = fs.readdirSync('attached_assets');
    files.forEach(file => console.log(' -', file));
  } catch (e) {
    console.log('Could not list files');
  }
}
