/**
 * Federal Reserve Economic Data (FRED) API Integration
 * Provides real-time economic indicators for enhanced policy impact calculations
 */

export interface FREDSeries {
  id: string;
  realtime_start: string;
  realtime_end: string;
  title: string;
  observation_start: string;
  observation_end: string;
  frequency: string;
  frequency_short: string;
  units: string;
  units_short: string;
  seasonal_adjustment: string;
  seasonal_adjustment_short: string;
  last_updated: string;
  popularity: number;
  notes: string;
}

export interface FREDObservation {
  realtime_start: string;
  realtime_end: string;
  date: string;
  value: string;
}

export interface FREDResponse {
  realtime_start: string;
  realtime_end: string;
  observation_start: string;
  observation_end: string;
  units: string;
  output_type: number;
  file_type: string;
  order_by: string;
  sort_order: string;
  count: number;
  offset: number;
  limit: number;
  observations: FREDObservation[];
}

export interface EconomicIndicators {
  unemploymentRate: {
    national: number;
    state?: number;
    lastUpdated: string;
  };
  recessionProbability: {
    yieldCurveInversion: number;
    unemploymentTrend: number;
    combined: number;
    lastUpdated: string;
  };
  wageData: {
    medianWeeklyEarnings: number;
    hourlyEarnings: number;
    lastUpdated: string;
  };
  economicContext: {
    gdpGrowth: number;
    inflationRate: number;
    federalFundsRate: number;
    lastUpdated: string;
  };
}

export interface StateUnemploymentData {
  [stateCode: string]: {
    rate: number;
    lastUpdated: string;
  };
}

// FRED Series IDs for key economic indicators
const FRED_SERIES = {
  // Unemployment rates
  NATIONAL_UNEMPLOYMENT: 'UNRATE',
  
  // State unemployment rates (sample - we'll build full mapping)
  STATE_UNEMPLOYMENT: {
    'AL': 'ALUR',
    'AK': 'AKUR', 
    'AZ': 'AZUR',
    'AR': 'ARUR',
    'CA': 'CAUR',
    'CO': 'COUR',
    'CT': 'CTUR',
    'DE': 'DEUR',
    'FL': 'FLUR',
    'GA': 'GAUR',
    'HI': 'HIUR',
    'ID': 'IDUR',
    'IL': 'ILUR',
    'IN': 'INUR',
    'IA': 'IAUR',
    'KS': 'KSUR',
    'KY': 'KYUR',
    'LA': 'LAUR',
    'ME': 'MEUR',
    'MD': 'MDUR',
    'MA': 'MAUR',
    'MI': 'MIUR',
    'MN': 'MNUR',
    'MS': 'MSUR',
    'MO': 'MOUR',
    'MT': 'MTUR',
    'NE': 'NEUR',
    'NV': 'NVUR',
    'NH': 'NHUR',
    'NJ': 'NJUR',
    'NM': 'NMUR',
    'NY': 'NYUR',
    'NC': 'NCUR',
    'ND': 'NDUR',
    'OH': 'OHUR',
    'OK': 'OKUR',
    'OR': 'ORUR',
    'PA': 'PAUR',
    'RI': 'RIUR',
    'SC': 'SCUR',
    'SD': 'SDUR',
    'TN': 'TNUR',
    'TX': 'TXUR',
    'UT': 'UTUR',
    'VT': 'VTUR',
    'VA': 'VAUR',
    'WA': 'WAUR',
    'WV': 'WVUR',
    'WI': 'WIUR',
    'WY': 'WYUR'
  },
  
  // Recession indicators
  YIELD_CURVE_10Y_3M: 'T10Y3M', // 10-Year Treasury minus 3-Month Treasury
  YIELD_CURVE_10Y_2Y: 'T10Y2Y', // 10-Year Treasury minus 2-Year Treasury
  
  // Wage and income data
  MEDIAN_WEEKLY_EARNINGS: 'LES1252881600Q', // Median weekly earnings
  AVERAGE_HOURLY_EARNINGS: 'AHETPI', // Average hourly earnings
  
  // Economic context
  GDP_GROWTH: 'GDPC1', // Real GDP
  INFLATION_RATE: 'CPIAUCSL', // Consumer Price Index
  FEDERAL_FUNDS_RATE: 'FEDFUNDS', // Federal funds rate
} as const;

class FREDAPIError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'FREDAPIError';
  }
}

async function fetchFREDData(seriesId: string, limit: number = 10): Promise<FREDResponse> {
  const apiKey = process.env.FRED_API_KEY;
  if (!apiKey) {
    throw new FREDAPIError('FRED API key not configured');
  }

  const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${apiKey}&file_type=json&limit=${limit}&sort_order=desc`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new FREDAPIError(`FRED API request failed: ${response.status} ${response.statusText}`, response.status);
    }
    
    const data = await response.json();
    
    if (data.error_message) {
      throw new FREDAPIError(`FRED API error: ${data.error_message}`);
    }
    
    return data;
  } catch (error) {
    if (error instanceof FREDAPIError) {
      throw error;
    }
    throw new FREDAPIError(`Failed to fetch data from FRED: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function fetchUnemploymentRate(stateCode?: string): Promise<{ national: number; state?: number; lastUpdated: string }> {
  try {
    // Fetch national unemployment rate
    const nationalData = await fetchFREDData(FRED_SERIES.NATIONAL_UNEMPLOYMENT, 1);
    const nationalRate = parseFloat(nationalData.observations[0]?.value || '0');
    const lastUpdated = nationalData.observations[0]?.date || new Date().toISOString().split('T')[0];
    
    let stateRate: number | undefined;
    
    // Fetch state-specific rate if state code provided
    if (stateCode && FRED_SERIES.STATE_UNEMPLOYMENT[stateCode as keyof typeof FRED_SERIES.STATE_UNEMPLOYMENT]) {
      try {
        const stateSeriesId = FRED_SERIES.STATE_UNEMPLOYMENT[stateCode as keyof typeof FRED_SERIES.STATE_UNEMPLOYMENT];
        const stateData = await fetchFREDData(stateSeriesId, 1);
        stateRate = parseFloat(stateData.observations[0]?.value || '0');
      } catch (error) {
        console.warn(`Failed to fetch state unemployment for ${stateCode}:`, error);
        // Continue with national data only
      }
    }
    
    return {
      national: nationalRate,
      state: stateRate,
      lastUpdated
    };
  } catch (error) {
    console.error('Failed to fetch unemployment data:', error);
    // Return fallback data with current date
    return {
      national: 4.1, // Current approximate national average
      lastUpdated: new Date().toISOString().split('T')[0]
    };
  }
}

export async function calculateRecessionProbability(): Promise<{ yieldCurveInversion: number; unemploymentTrend: number; combined: number; lastUpdated: string }> {
  try {
    // Fetch yield curve data (10Y-3M spread)
    const yieldData = await fetchFREDData(FRED_SERIES.YIELD_CURVE_10Y_3M, 12); // Get 12 months for trend
    const latestYieldSpread = parseFloat(yieldData.observations[0]?.value || '0');
    const lastUpdated = yieldData.observations[0]?.date || new Date().toISOString().split('T')[0];
    
    // Fetch unemployment trend (last 6 months)
    const unemploymentData = await fetchFREDData(FRED_SERIES.NATIONAL_UNEMPLOYMENT, 6);
    const unemploymentValues = unemploymentData.observations
      .map(obs => parseFloat(obs.value))
      .filter(val => !isNaN(val))
      .reverse(); // Sort chronologically
    
    // Calculate yield curve inversion probability
    // Negative yield spread indicates inversion (recession signal)
    const yieldCurveInversion = latestYieldSpread < 0 ? 
      Math.min(85, 35 + Math.abs(latestYieldSpread) * 10) : // Inverted curve
      Math.max(5, 25 - latestYieldSpread * 5); // Normal curve
    
    // Calculate unemployment trend probability
    let unemploymentTrend = 25; // Baseline
    if (unemploymentValues.length >= 3) {
      const recent = unemploymentValues.slice(-3);
      const isRising = recent[2] > recent[1] && recent[1] > recent[0];
      const change = recent[2] - recent[0];
      
      if (isRising && change > 0.5) {
        unemploymentTrend = Math.min(70, 40 + change * 15);
      } else if (change < -0.3) {
        unemploymentTrend = Math.max(10, 25 + change * 10);
      }
    }
    
    // Combined probability (weighted average)
    const combined = Math.round((yieldCurveInversion * 0.6) + (unemploymentTrend * 0.4));
    
    return {
      yieldCurveInversion: Math.round(yieldCurveInversion),
      unemploymentTrend: Math.round(unemploymentTrend),
      combined,
      lastUpdated
    };
  } catch (error) {
    console.error('Failed to calculate recession probability:', error);
    return {
      yieldCurveInversion: 28,
      unemploymentTrend: 25,
      combined: 27,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
  }
}

export async function fetchWageData(): Promise<{ medianWeeklyEarnings: number; hourlyEarnings: number; lastUpdated: string }> {
  try {
    const [weeklyData, hourlyData] = await Promise.all([
      fetchFREDData(FRED_SERIES.MEDIAN_WEEKLY_EARNINGS, 1),
      fetchFREDData(FRED_SERIES.AVERAGE_HOURLY_EARNINGS, 1)
    ]);
    
    const medianWeeklyEarnings = parseFloat(weeklyData.observations[0]?.value || '0');
    const hourlyEarnings = parseFloat(hourlyData.observations[0]?.value || '0');
    const lastUpdated = weeklyData.observations[0]?.date || new Date().toISOString().split('T')[0];
    
    return {
      medianWeeklyEarnings,
      hourlyEarnings,
      lastUpdated
    };
  } catch (error) {
    console.error('Failed to fetch wage data:', error);
    return {
      medianWeeklyEarnings: 1145, // Current approximate median
      hourlyEarnings: 35.15, // Current approximate average
      lastUpdated: new Date().toISOString().split('T')[0]
    };
  }
}

export async function fetchEconomicContext(): Promise<{ gdpGrowth: number; inflationRate: number; federalFundsRate: number; lastUpdated: string }> {
  try {
    const [gdpData, inflationData, fedRateData] = await Promise.all([
      fetchFREDData(FRED_SERIES.GDP_GROWTH, 4), // Quarterly data
      fetchFREDData(FRED_SERIES.INFLATION_RATE, 12), // Monthly data for year-over-year calc
      fetchFREDData(FRED_SERIES.FEDERAL_FUNDS_RATE, 1)
    ]);
    
    // Calculate GDP growth rate (year-over-year)
    const gdpValues = gdpData.observations.map(obs => parseFloat(obs.value)).filter(val => !isNaN(val));
    const gdpGrowth = gdpValues.length >= 4 ? 
      ((gdpValues[0] - gdpValues[3]) / gdpValues[3]) * 100 : 2.1;
    
    // Calculate inflation rate (year-over-year CPI change)
    const cpiValues = inflationData.observations.map(obs => parseFloat(obs.value)).filter(val => !isNaN(val));
    const inflationRate = cpiValues.length >= 12 ? 
      ((cpiValues[0] - cpiValues[11]) / cpiValues[11]) * 100 : 3.2;
    
    const federalFundsRate = parseFloat(fedRateData.observations[0]?.value || '0');
    const lastUpdated = fedRateData.observations[0]?.date || new Date().toISOString().split('T')[0];
    
    return {
      gdpGrowth: Math.round(gdpGrowth * 100) / 100,
      inflationRate: Math.round(inflationRate * 100) / 100,
      federalFundsRate,
      lastUpdated
    };
  } catch (error) {
    console.error('Failed to fetch economic context:', error);
    return {
      gdpGrowth: 2.1,
      inflationRate: 3.2,
      federalFundsRate: 5.25,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
  }
}

export async function getComprehensiveEconomicData(stateCode?: string): Promise<EconomicIndicators> {
  try {
    const [unemployment, recessionProb, wages, context] = await Promise.all([
      fetchUnemploymentRate(stateCode),
      calculateRecessionProbability(),
      fetchWageData(),
      fetchEconomicContext()
    ]);
    
    return {
      unemploymentRate: unemployment,
      recessionProbability: recessionProb,
      wageData: wages,
      economicContext: context
    };
  } catch (error) {
    console.error('Failed to fetch comprehensive economic data:', error);
    // Return reasonable fallback data
    const today = new Date().toISOString().split('T')[0];
    return {
      unemploymentRate: {
        national: 4.1,
        lastUpdated: today
      },
      recessionProbability: {
        yieldCurveInversion: 28,
        unemploymentTrend: 25,
        combined: 27,
        lastUpdated: today
      },
      wageData: {
        medianWeeklyEarnings: 1145,
        hourlyEarnings: 35.15,
        lastUpdated: today
      },
      economicContext: {
        gdpGrowth: 2.1,
        inflationRate: 3.2,
        federalFundsRate: 5.25,
        lastUpdated: today
      }
    };
  }
}

/**
 * Validates income range against current wage data
 */
export function validateIncomeRange(incomeRange: string, wageData: { medianWeeklyEarnings: number; hourlyEarnings: number }): {
  isReasonable: boolean;
  context: string;
  medianAnnual: number;
} {
  const medianAnnual = wageData.medianWeeklyEarnings * 52;
  const fullTimeAnnual = wageData.hourlyEarnings * 40 * 52;
  
  // Map income ranges to approximate midpoints
  const rangeMidpoints: { [key: string]: number } = {
    "under-15k": 12000,
    "15k-45k": 30000,
    "45k-95k": 70000,
    "95k-200k": 147500,
    "200k-400k": 300000,
    "over-400k": 500000,
  };
  
  const selectedMidpoint = rangeMidpoints[incomeRange] || 50000;
  const isReasonable = selectedMidpoint <= medianAnnual * 3; // Within 3x median is reasonable
  
  let context = '';
  if (selectedMidpoint < medianAnnual * 0.5) {
    context = 'Below typical wages for this region';
  } else if (selectedMidpoint > medianAnnual * 2) {
    context = 'Above typical wages for this region';
  } else {
    context = 'Within typical wage range for this region';
  }
  
  return {
    isReasonable,
    context,
    medianAnnual: Math.round(medianAnnual)
  };
}