// Leaderboard API response types
export interface LeaderboardWindowPerformance {
  pnl: string;
  roi: string;
  vlm: string;
}

export interface LeaderboardRow {
  ethAddress: string;
  accountValue: string;
  windowPerformances: (LeaderboardWindowPerformance | null)[];
}

export interface LeaderboardApiResponse {
  leaderboardRows: LeaderboardRow[];
}

// Time window indices in the windowPerformances array
// Based on Hyperliquid's leaderboard API
export const TIME_WINDOW_INDEX = {
  "1d": 0,   // day
  "7d": 1,   // week
  "30d": 2,  // month
  "allTime": 3, // all time
} as const;

export type TimePeriod = "1d" | "7d" | "30d" | "allTime";

export type SortField = "pnl" | "winRate" | "volume";

export type SortDirection = "asc" | "desc";

export interface TraderMetrics {
  address: string;
  label?: string;
  pnl: number;
  winRate: number; // Actually ROI from API
  volume: number;
  accountValue: number;
  lastUpdated: number;
}

export interface LeaderboardState {
  traders: TraderMetrics[];
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
}
