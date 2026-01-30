export interface WhaleAddress {
  address: string;
  label?: string;
}

export interface Position {
  coin: string;
  szi: string; // Size (positive = long, negative = short)
  entryPx: string;
  positionValue: string;
  unrealizedPnl: string;
  returnOnEquity: string;
  leverage: {
    type: string;
    value: number;
  };
}

export interface Fill {
  coin: string;
  px: string; // Price
  sz: string; // Size
  side: "B" | "A"; // Buy or Ask (Sell)
  time: number; // Unix timestamp ms
  startPosition: string;
  dir: string;
  closedPnl: string;
  hash: string;
  oid: number;
  crossed: boolean;
  fee: string;
  tid: number;
}

export interface ClearinghouseState {
  assetPositions: {
    position: Position;
    type: string;
  }[];
  crossMarginSummary: {
    accountValue: string;
    totalMarginUsed: string;
    totalNtlPos: string;
    totalRawUsd: string;
  };
  marginSummary: {
    accountValue: string;
    totalMarginUsed: string;
    totalNtlPos: string;
    totalRawUsd: string;
  };
  withdrawable: string;
}

export type TimePeriod = "24h" | "7d" | "30d" | "all";

export type SortField = "pnl" | "winRate" | "sharpe" | "trades" | "volume";

export type SortDirection = "asc" | "desc";

export interface TraderMetrics {
  address: string;
  label?: string;
  pnl: number;
  winRate: number;
  sharpe: number;
  trades: number;
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
