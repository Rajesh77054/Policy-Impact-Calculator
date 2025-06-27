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

interface LocationInfo {
  zipCode?: string;
  state?: string;
}

// BLS CPI Series IDs for major metropolitan areas
const METRO_CPI_SERIES: { [key: string]: string } = {
  // Texas metro areas
  "DALLAS": "CUURA316SA0", // Dallas-Fort Worth-Arlington
  "HOUSTON": "CUURA318SA0", // Houston-The Woodlands-Sugar Land
  "SAN_ANTONIO": "CUURA319SA0", // San Antonio-New Braunfels
  
  // California metro areas
  "LOS_ANGELES": "CUURA421SA0", // Los Angeles-Long Beach-Anaheim
  "SAN_FRANCISCO": "CUURA422SA0", // San Francisco-Oakland-Hayward
  
  // Other major metro areas
  "NEW_YORK": "CUURA101SA0", // New York-Newark-Jersey City
  "CHICAGO": "CUURA207SA0", // Chicago-Naperville-Elgin
  "PHILADELPHIA": "CUURA102SA0", // Philadelphia-Camden-Wilmington
  "ATLANTA": "CUURA319SA0", // Atlanta-Sandy Springs-Roswell
  "BOSTON": "CUURA103SA0", // Boston-Cambridge-Newton
  "DETROIT": "CUURA208SA0", // Detroit-Warren-Dearborn
  "SEATTLE": "CUURA423SA0", // Seattle-Tacoma-Bellevue
  "MIAMI": "CUURA320SA0", // Miami-Fort Lauderdale-West Palm Beach
  "PHOENIX": "CUURA425SA0", // Phoenix-Mesa-Scottsdale
  "MINNEAPOLIS": "CUURA211SA0", // Minneapolis-St. Paul-Bloomington
  
  // Regional CPI for states without metro coverage
  "WEST": "CUURA400SA0", // West Region
  "SOUTH": "CUURA300SA0", // South Region
  "MIDWEST": "CUURA200SA0", // Midwest Region
  "NORTHEAST": "CUURA100SA0", // Northeast Region
  
  // National fallback
  "NATIONAL": "CUUR0000SA0" // U.S. City Average
};

// ZIP code to metro area mapping for major metros
const getMetroFromZip = (zip: string): string | null => {
  if (!zip || zip.length !== 5) return null;
  
  const zipNum = parseInt(zip);
  
  // Texas metros
  if ((zipNum >= 75000 && zipNum <= 76299) || (zipNum >= 76000 && zipNum <= 76299)) return "DALLAS";
  if ((zipNum >= 77000 && zipNum <= 77999)) return "HOUSTON";
  if ((zipNum >= 78000 && zipNum <= 78299)) return "SAN_ANTONIO";
  
  // California metros
  if ((zipNum >= 90000 && zipNum <= 90999) || (zipNum >= 91000 && zipNum <= 91999)) return "LOS_ANGELES";
  if ((zipNum >= 94000 && zipNum <= 94999)) return "SAN_FRANCISCO";
  
  // Other major metros
  if ((zipNum >= 10000 && zipNum <= 11999) || (zipNum >= 6000 && zipNum <= 8999)) return "NEW_YORK";
  if ((zipNum >= 60000 && zipNum <= 60999)) return "CHICAGO";
  if ((zipNum >= 19000 && zipNum <= 19999)) return "PHILADELPHIA";
  if ((zipNum >= 30000 && zipNum <= 30999)) return "ATLANTA";
  if ((zipNum >= 2000 && zipNum <= 2999)) return "BOSTON";
  if ((zipNum >= 48000 && zipNum <= 48999)) return "DETROIT";
  if ((zipNum >= 98000 && zipNum <= 98999)) return "SEATTLE";
  if ((zipNum >= 33000 && zipNum <= 33999)) return "MIAMI";
  if ((zipNum >= 85000 && zipNum <= 85999)) return "PHOENIX";
  if ((zipNum >= 55000 && zipNum <= 55999)) return "MINNEAPOLIS";
  
  return null;
};

// State to regional CPI mapping
const getRegionFromState = (state: string): string => {
  const stateToRegion: { [key: string]: string } = {
    // West Region
    "AK": "WEST", "AZ": "WEST", "CA": "WEST", "CO": "WEST", "HI": "WEST", 
    "ID": "WEST", "MT": "WEST", "NV": "WEST", "NM": "WEST", "OR": "WEST", 
    "UT": "WEST", "WA": "WEST", "WY": "WEST",
    
    // South Region
    "AL": "SOUTH", "AR": "SOUTH", "DE": "SOUTH", "FL": "SOUTH", "GA": "SOUTH",
    "KY": "SOUTH", "LA": "SOUTH", "MD": "SOUTH", "MS": "SOUTH", "NC": "SOUTH",
    "OK": "SOUTH", "SC": "SOUTH", "TN": "SOUTH", "TX": "SOUTH", "VA": "SOUTH",
    "WV": "SOUTH",
    
    // Midwest Region
    "IA": "MIDWEST", "IL": "MIDWEST", "IN": "MIDWEST", "KS": "MIDWEST", "MI": "MIDWEST",
    "MN": "MIDWEST", "MO": "MIDWEST", "ND": "MIDWEST", "NE": "MIDWEST", "OH": "MIDWEST",
    "SD": "MIDWEST", "WI": "MIDWEST",
    
    // Northeast Region
    "CT": "NORTHEAST", "MA": "NORTHEAST", "ME": "NORTHEAST", "NH": "NORTHEAST",
    "NJ": "NORTHEAST", "NY": "NORTHEAST", "PA": "NORTHEAST", "RI": "NORTHEAST",
    "VT": "NORTHEAST"
  };
  
  return stateToRegion[state] || "NATIONAL";
};

// Determine the best CPI series to use based on location
export const getCPISeriesForLocation = (location: LocationInfo): { seriesId: string; description: string } => {
  // Try metro area first if ZIP code is available
  if (location.zipCode) {
    const metro = getMetroFromZip(location.zipCode);
    if (metro && METRO_CPI_SERIES[metro]) {
      return {
        seriesId: METRO_CPI_SERIES[metro],
        description: `${metro.replace('_', ' ')} Metropolitan Area CPI`
      };
    }
  }
  
  // Fall back to regional CPI based on state
  if (location.state) {
    const region = getRegionFromState(location.state);
    return {
      seriesId: METRO_CPI_SERIES[region],
      description: `${region.replace('_', ' ')} Regional CPI`
    };
  }
  
  // National fallback
  return {
    seriesId: METRO_CPI_SERIES.NATIONAL,
    description: "National Average CPI"
  };
};

export async function fetchCPIData(startYear: number, endYear: number, location?: LocationInfo): Promise<CPIDataPoint[]> {
  // Determine the best CPI series for the location
  const { seriesId, description } = getCPISeriesForLocation(location || {});
  
  console.log(`Using CPI data source: ${description} (Series: ${seriesId})`);
  
  // Generate location-adjusted CPI data based on regional trends
  // In a production environment, this would make actual API calls to BLS
  const data: CPIDataPoint[] = [];
  const baseIndex = 310; // Approximate 2024 CPI-U value
  
  // Adjust inflation rate based on location type
  let avgInflationRate = 0.025; // 2.5% baseline
  
  // Metro areas typically have higher inflation rates
  if (seriesId.includes("CUURA3") || seriesId.includes("CUURA4")) { // Major metros
    avgInflationRate = 0.028; // 2.8% for major metros
  } else if (seriesId.includes("CUURA1") || seriesId.includes("CUURA2")) { // Northeast/Midwest metros
    avgInflationRate = 0.026; // 2.6% for these regions
  } else if (seriesId === METRO_CPI_SERIES.WEST) {
    avgInflationRate = 0.029; // 2.9% for West region (higher costs)
  } else if (seriesId === METRO_CPI_SERIES.SOUTH) {
    avgInflationRate = 0.023; // 2.3% for South region (lower costs)
  }
  
  // Apply location-specific adjustments
  const locationMultiplier = getLocationCostMultiplier(location);
  const adjustedBaseIndex = baseIndex * locationMultiplier;
  
  for (let year = startYear; year <= endYear; year++) {
    const yearsFromBase = year - 2024;
    const projectedIndex = adjustedBaseIndex * Math.pow(1 + avgInflationRate, yearsFromBase);
    
    data.push({
      year,
      month: 12, // December value
      value: projectedIndex,
      index: Math.round(projectedIndex * 100) / 100
    });
  }
  
  return data;
}

// Get location-specific cost multiplier for CPI baseline adjustment
const getLocationCostMultiplier = (location?: LocationInfo): number => {
  if (!location) return 1.0;
  
  // Metro area cost adjustments
  if (location.zipCode) {
    const metro = getMetroFromZip(location.zipCode);
    const metroCostMultipliers: { [key: string]: number } = {
      "SAN_FRANCISCO": 1.25, // 25% higher baseline costs
      "NEW_YORK": 1.20,
      "LOS_ANGELES": 1.15,
      "SEATTLE": 1.12,
      "BOSTON": 1.10,
      "CHICAGO": 1.05,
      "DALLAS": 0.98,
      "HOUSTON": 0.96,
      "ATLANTA": 0.95,
      "PHOENIX": 0.94,
      "SAN_ANTONIO": 0.92,
      "MIAMI": 1.08,
      "PHILADELPHIA": 1.06,
      "DETROIT": 0.90,
      "MINNEAPOLIS": 1.02
    };
    
    if (metro && metroCostMultipliers[metro]) {
      return metroCostMultipliers[metro];
    }
  }
  
  // State-level regional adjustments
  if (location.state) {
    const stateCostMultipliers: { [key: string]: number } = {
      // High-cost states
      "CA": 1.15, "NY": 1.12, "MA": 1.10, "CT": 1.08, "NJ": 1.07,
      "WA": 1.06, "MD": 1.04, "CO": 1.03,
      
      // Low-cost states
      "MS": 0.88, "AR": 0.89, "WV": 0.90, "KY": 0.91, "AL": 0.92,
      "TN": 0.93, "OK": 0.94, "KS": 0.95, "TX": 0.96, "GA": 0.97
    };
    
    return stateCostMultipliers[location.state] || 1.0;
  }
  
  return 1.0;
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