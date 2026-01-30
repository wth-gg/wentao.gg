import {
  LeaderboardApiResponse,
  LeaderboardRow,
  TimePeriod,
  TIME_WINDOW_INDEX,
  TraderMetrics,
} from "./types";

const LEADERBOARD_URL = "https://stats-data.hyperliquid.xyz/Mainnet/leaderboard";

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

// Fetch the leaderboard from Hyperliquid's stats endpoint
export async function fetchLeaderboard(): Promise<ApiResponse<LeaderboardApiResponse>> {
  try {
    const response = await fetch(LEADERBOARD_URL);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Convert leaderboard row to TraderMetrics for a specific time period
function rowToMetrics(row: LeaderboardRow, timePeriod: TimePeriod): TraderMetrics | null {
  const windowIndex = TIME_WINDOW_INDEX[timePeriod];
  const performance = row.windowPerformances[windowIndex];

  // Skip if no performance data for this period
  if (!performance) {
    return null;
  }

  const pnl = parseFloat(performance.pnl) || 0;
  const roi = parseFloat(performance.roi) || 0;
  const volume = parseFloat(performance.vlm) || 0;
  const accountValue = parseFloat(row.accountValue) || 0;

  return {
    address: row.ethAddress,
    pnl,
    // ROI is given as a decimal (0.1 = 10%), convert to percentage
    winRate: roi * 100,
    volume,
    accountValue,
    lastUpdated: Date.now(),
  };
}

// Get top traders for a specific time period
export async function getTopTraders(
  timePeriod: TimePeriod,
  limit: number = 50
): Promise<ApiResponse<TraderMetrics[]>> {
  const result = await fetchLeaderboard();

  if (result.error || !result.data) {
    return { data: null, error: result.error };
  }

  const traders: TraderMetrics[] = [];

  for (const row of result.data.leaderboardRows) {
    const metrics = rowToMetrics(row, timePeriod);
    if (metrics) {
      traders.push(metrics);
    }
  }

  // Sort by PnL descending and limit results
  traders.sort((a, b) => b.pnl - a.pnl);

  return {
    data: traders.slice(0, limit),
    error: null,
  };
}
