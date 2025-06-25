// Bureau of Labor Statistics API integration
// Consumer Price Index (CPI) data for purchasing power calculations

interface CPIDataPoint {
  year: number;
  month: number;
  value: number;
  index: number;
}

interface PurchasingPowerPoint {
  year: number;
  purchasingPowerIndex: number;
  projectedDisposableIncome: number;
}

export async function fetchCPIData(startYear: number, endYear: number): Promise<CPIDataPoint[]> {
  // Generate fallback CPI data based on historical trends
  // In a production environment, this would make actual API calls to BLS
  const data: CPIDataPoint[] = [];
  const baseIndex = 310; // Approximate 2024 CPI-U value
  const avgInflationRate = 0.025; // 2.5% average inflation
  
  for (let year = startYear; year <= endYear; year++) {
    const yearsFromBase = year - 2024;
    const projectedIndex = baseIndex * Math.pow(1 + avgInflationRate, yearsFromBase);
    
    data.push({
      year,
      month: 12, // December value
      value: projectedIndex,
      index: Math.round(projectedIndex * 100) / 100
    });
  }
  
  return data;
}

export function calculatePurchasingPowerOverTime(
  baseIncome: number,
  cpiData: CPIDataPoint[],
  startYear: number = new Date().getFullYear()
): PurchasingPowerPoint[] {
  const baseYearData = cpiData.find(d => d.year === startYear);
  if (!baseYearData) {
    throw new Error(`No CPI data available for base year ${startYear}`);
  }
  
  return cpiData.map(dataPoint => {
    // Calculate purchasing power index relative to base year
    const inflationFactor = dataPoint.index / baseYearData.index;
    const purchasingPowerIndex = Math.round((100 / inflationFactor) * 100) / 100;
    const adjustedIncome = Math.round(baseIncome / inflationFactor);
    
    return {
      year: dataPoint.year,
      purchasingPowerIndex,
      projectedDisposableIncome: adjustedIncome
    };
  });
}

export function calculatePurchasingPowerForScenario(
  disposableIncome: number,
  cpiData: CPIDataPoint[],
  scenarioName: string,
  baselineIncome?: number
): PurchasingPowerPoint[] {
  const currentYear = new Date().getFullYear();
  const baseIndex = cpiData.find(d => d.year === currentYear)?.index || cpiData[0]?.index || 310;
  
  return cpiData.map(dataPoint => {
    const inflationFactor = dataPoint.index / baseIndex;
    const purchasingPowerIndex = Math.round((100 / inflationFactor) * 100) / 100;
    const adjustedIncome = Math.round(disposableIncome / inflationFactor);
    
    return {
      year: dataPoint.year,
      purchasingPowerIndex,
      projectedDisposableIncome: adjustedIncome
    };
  });
}

export function getIncomeMidpoint(incomeRange: string): number {
  const incomeMidpoints: { [key: string]: number } = {
    "under-15k": 12000,
    "15k-45k": 30000,
    "45k-95k": 70000,
    "95k-200k": 147500,
    "200k-400k": 300000,
    "over-400k": 500000,
  };
  
  return incomeMidpoints[incomeRange] || 70000;
}