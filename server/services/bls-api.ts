/**
 * Bureau of Labor Statistics API Integration
 * Fetches Consumer Price Index (CPI-U) data for purchasing power calculations
 */

export interface CPIData {
  year: string;
  period: string;
  periodName: string;
  value: string;
  footnotes: Array<{
    code: string;
    text: string;
  }>;
}

export interface BLSResponse {
  status: string;
  responseTime: number;
  message: string[];
  Results: {
    series: Array<{
      seriesID: string;
      data: CPIData[];
    }>;
  };
}

export interface PurchasingPowerData {
  year: number;
  cpiValue: number;
  purchasingPowerIndex: number;
  projectedDisposableIncome: number;
}

const BLS_API_URL = 'https://api.bls.gov/publicAPI/v2/timeseries/data/';
const CPI_SERIES_ID = 'CUUR0000SA0'; // Consumer Price Index - All Urban Consumers, All Items

/**
 * Fetches CPI data from BLS API v2.0 with authentication
 */
export async function fetchCPIData(startYear: number, endYear: number): Promise<CPIData[]> {
  try {
    const apiKey = process.env.BLS_API_KEY;
    if (!apiKey) {
      console.warn('BLS API key not found, using historical data');
      return getHistoricalCPIData(startYear, endYear);
    }

    const requestBody = {
      seriesid: [CPI_SERIES_ID],
      startyear: startYear.toString(),
      endyear: endYear.toString(),
      calculations: true,
      annualaverage: true,
      registrationkey: apiKey
    };

    console.log(`Fetching CPI data from BLS API for ${startYear}-${endYear}`);

    const response = await fetch(BLS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`BLS API request failed: ${response.status} ${response.statusText}`);
    }

    const data: BLSResponse = await response.json();
    
    console.log('BLS API Response Status:', data.status);
    console.log('BLS API Response Messages:', data.message);
    
    if (data.status !== 'REQUEST_SUCCEEDED') {
      throw new Error(`BLS API error: ${data.message?.join(', ') || 'Unknown error'}`);
    }

    if (!data.Results?.series?.[0]?.data) {
      throw new Error('No data returned from BLS API');
    }

    // Return annual average data (period M13)
    const cpiData = data.Results.series[0].data.filter(item => item.period === 'M13');
    console.log(`Retrieved ${cpiData.length} CPI data points from BLS API`);
    
    // Enhance with projections for future years
    const enhancedData = enhanceCPIDataWithProjections(cpiData, endYear);
    console.log(`Enhanced to ${enhancedData.length} data points including projections`);
    
    return enhancedData;
  } catch (error) {
    console.warn('BLS API error, falling back to historical data:', error);
    return getHistoricalCPIData(startYear, endYear);
  }
}

/**
 * Returns actual historical CPI data and projections when BLS API is unavailable
 */
function getHistoricalCPIData(startYear: number, endYear: number): CPIData[] {
  // Actual CPI-U annual averages from BLS historical data
  const historicalCPI: { [year: number]: number } = {
    2020: 258.811,
    2021: 271.696,
    2022: 292.655,
    2023: 307.026,
    2024: 314.0, // Projected based on current trends
  };

  const data: CPIData[] = [];
  const averageInflationRate = 0.025; // 2.5% historical average
  
  for (let year = startYear; year <= endYear; year++) {
    let cpiValue: number;
    
    if (historicalCPI[year]) {
      cpiValue = historicalCPI[year];
    } else if (year > 2024) {
      // Project forward using 2.5% inflation
      const yearsFromBase = year - 2024;
      cpiValue = historicalCPI[2024] * Math.pow(1 + averageInflationRate, yearsFromBase);
    } else {
      // Estimate backward using 2.5% inflation
      const yearsFromBase = 2024 - year;
      cpiValue = historicalCPI[2024] / Math.pow(1 + averageInflationRate, yearsFromBase);
    }
    
    data.push({
      year: year.toString(),
      period: 'M13',
      periodName: 'Annual',
      value: cpiValue.toFixed(3),
      footnotes: [{
        code: year <= 2023 ? 'HIST' : 'PROJ',
        text: year <= 2023 ? 'Historical BLS data' : 'Projected based on historical trends'
      }]
    });
  }
  
  return data.sort((a, b) => parseInt(a.year) - parseInt(b.year)); // Sort chronologically
}

/**
 * Enhances BLS API data with projections for future years
 */
function enhanceCPIDataWithProjections(blsData: CPIData[], endYear: number): CPIData[] {
  const sortedData = [...blsData].sort((a, b) => parseInt(a.year) - parseInt(b.year));
  const latestYear = Math.max(...sortedData.map(d => parseInt(d.year)));
  const latestCPI = parseFloat(sortedData[sortedData.length - 1].value);
  
  const averageInflationRate = 0.025; // 2.5% historical average
  const enhancedData = [...sortedData];
  
  // Add projected years beyond the latest BLS data
  for (let year = latestYear + 1; year <= endYear; year++) {
    const yearsFromLatest = year - latestYear;
    const projectedCPI = latestCPI * Math.pow(1 + averageInflationRate, yearsFromLatest);
    
    enhancedData.push({
      year: year.toString(),
      period: 'M13',
      periodName: 'Annual',
      value: projectedCPI.toFixed(3),
      footnotes: [{
        code: 'PROJ',
        text: 'Projected based on historical inflation trends'
      }]
    });
  }
  
  return enhancedData;
}

/**
 * Calculates purchasing power over time for a single policy scenario
 * Uses a shared baseline to show relative differences between scenarios
 */
export function calculatePurchasingPowerForScenario(
  disposableIncome: number,
  cpiData: CPIData[],
  scenarioName: string,
  baselineIncome?: number
): PurchasingPowerData[] {
  const currentYear = new Date().getFullYear();
  
  // Find base CPI for current year, or use most recent available
  const baseCPIData = cpiData.find(d => d.year === currentYear.toString()) || 
                     cpiData.find(d => parseInt(d.year) <= currentYear) ||
                     cpiData[cpiData.length - 1];
  
  const baseCPI = parseFloat(baseCPIData?.value || '314.0');
  console.log(`Using base CPI: ${baseCPI} for ${scenarioName} scenario`);
  
  // Use provided baseline or the scenario's own income for purchasing power calculation
  const purchasingPowerBaseline = baselineIncome || disposableIncome;
  
  const scenario: PurchasingPowerData[] = [];
  
  // Sort CPI data by year to ensure proper ordering
  const sortedCPIData = [...cpiData].sort((a, b) => parseInt(a.year) - parseInt(b.year));
  
  sortedCPIData.forEach(item => {
    const year = parseInt(item.year);
    const cpiValue = parseFloat(item.value);
    
    if (isNaN(cpiValue) || cpiValue <= 0) {
      console.warn(`Invalid CPI value for year ${year}: ${item.value}`);
      return;
    }
    
    // Calculate purchasing power index relative to baseline income and current year CPI
    // This preserves the relative differences between scenarios
    const inflationAdjustmentFactor = baseCPI / cpiValue;
    const realIncomeInTodaysDollars = disposableIncome * inflationAdjustmentFactor;
    const purchasingPowerIndex = Math.round((realIncomeInTodaysDollars / purchasingPowerBaseline) * 100);
    
    // Calculate projected disposable income adjusted for inflation
    const adjustedIncome = Math.round(realIncomeInTodaysDollars);
    
    scenario.push({
      year,
      cpiValue,
      purchasingPowerIndex,
      projectedDisposableIncome: adjustedIncome
    });
  });
  
  console.log(`Generated ${scenario.length} purchasing power data points for ${scenarioName}`);
  console.log(`${scenarioName} disposable income: $${disposableIncome.toLocaleString()}`);
  console.log(`${scenarioName} baseline income: $${purchasingPowerBaseline.toLocaleString()}`);
  
  return scenario;
}

/**
 * Calculates purchasing power over time for policy scenarios
 */
export function calculatePurchasingPowerOverTime(
  currentDisposableIncome: number,
  proposedDisposableIncome: number,
  cpiData: CPIData[]
): {
  currentScenario: PurchasingPowerData[];
  proposedScenario: PurchasingPowerData[];
} {
  console.log(`\n=== PURCHASING POWER CALCULATION ===`);
  console.log(`Current Law disposable income: $${currentDisposableIncome.toLocaleString()}`);
  console.log(`Proposed Policy disposable income: $${proposedDisposableIncome.toLocaleString()}`);
  console.log(`Difference: $${(proposedDisposableIncome - currentDisposableIncome).toLocaleString()}`);
  
  const currentScenario = calculatePurchasingPowerForScenario(
    currentDisposableIncome,
    cpiData,
    'Current Law'
  );
  
  const proposedScenario = calculatePurchasingPowerForScenario(
    proposedDisposableIncome,
    cpiData,
    'Proposed Policy'
  );
  
  return { currentScenario, proposedScenario };
}

/**
 * Gets income midpoint from income range selection
 */
export function getIncomeMidpoint(incomeRange: string): number {
  const ranges: { [key: string]: number } = {
    'under_25k': 20000,
    '25k_50k': 37500,
    '50k_75k': 62500,
    '75k_100k': 87500,
    '100k_150k': 125000,
    '150k_250k': 200000,
    '250k_500k': 375000,
    'over_500k': 750000
  };
  
  return ranges[incomeRange] || 62500; // Default to median
}