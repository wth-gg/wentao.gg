import { Fill, TraderMetrics, ClearinghouseState } from "./types";

interface TradeResult {
  pnl: number;
  isWin: boolean;
  volume: number;
}

// Calculate PnL from fills
export function calculatePnL(fills: Fill[]): number {
  return fills.reduce((total, fill) => {
    return total + parseFloat(fill.closedPnl || "0");
  }, 0);
}

// Calculate win rate from fills
// A "win" is defined as a trade with positive closed PnL
export function calculateWinRate(fills: Fill[]): number {
  if (fills.length === 0) return 0;

  const trades = groupFillsIntoTrades(fills);
  if (trades.length === 0) return 0;

  const wins = trades.filter((t) => t.pnl > 0).length;
  return (wins / trades.length) * 100;
}

// Group fills into logical trades (round trips)
function groupFillsIntoTrades(fills: Fill[]): TradeResult[] {
  const trades: TradeResult[] = [];

  // Group by coin and process fills chronologically
  const byCoin = new Map<string, Fill[]>();
  for (const fill of fills) {
    const coinFills = byCoin.get(fill.coin) || [];
    coinFills.push(fill);
    byCoin.set(fill.coin, coinFills);
  }

  for (const coinFills of byCoin.values()) {
    // Sort by time
    const sorted = [...coinFills].sort((a, b) => a.time - b.time);

    let position = 0;
    let tradePnl = 0;
    let tradeVolume = 0;

    for (const fill of sorted) {
      const size = parseFloat(fill.sz);
      const price = parseFloat(fill.px);
      const value = size * price;
      const isBuy = fill.side === "B";
      const signedSize = isBuy ? size : -size;

      const prevPosition = position;
      position += signedSize;
      tradeVolume += value;

      // Add closed PnL
      tradePnl += parseFloat(fill.closedPnl || "0");

      // If position crossed zero or closed, record the trade
      if (
        (prevPosition > 0 && position <= 0) ||
        (prevPosition < 0 && position >= 0)
      ) {
        trades.push({
          pnl: tradePnl,
          isWin: tradePnl > 0,
          volume: tradeVolume,
        });
        tradePnl = 0;
        tradeVolume = 0;
      }
    }
  }

  return trades;
}

// Calculate Sharpe ratio
// Uses daily returns approximation
export function calculateSharpe(fills: Fill[], periodDays: number): number {
  if (fills.length < 2 || periodDays < 1) return 0;

  // Group fills by day
  const dailyPnL = new Map<string, number>();

  for (const fill of fills) {
    const date = new Date(fill.time).toISOString().split("T")[0];
    const pnl = parseFloat(fill.closedPnl || "0");
    dailyPnL.set(date, (dailyPnL.get(date) || 0) + pnl);
  }

  const returns = Array.from(dailyPnL.values());
  if (returns.length < 2) return 0;

  // Calculate mean and standard deviation
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance =
    returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) /
    (returns.length - 1);
  const stdDev = Math.sqrt(variance);

  if (stdDev === 0) return 0;

  // Annualize (assuming 365 trading days for crypto)
  const annualizedMean = mean * 365;
  const annualizedStdDev = stdDev * Math.sqrt(365);

  return annualizedMean / annualizedStdDev;
}

// Calculate total volume
export function calculateVolume(fills: Fill[]): number {
  return fills.reduce((total, fill) => {
    const size = parseFloat(fill.sz);
    const price = parseFloat(fill.px);
    return total + size * price;
  }, 0);
}

// Calculate all metrics for a trader
export function calculateTraderMetrics(
  address: string,
  state: ClearinghouseState | null,
  fills: Fill[],
  periodDays: number,
  label?: string
): TraderMetrics {
  const accountValue = state
    ? parseFloat(state.marginSummary.accountValue)
    : 0;

  return {
    address,
    label,
    pnl: calculatePnL(fills),
    winRate: calculateWinRate(fills),
    sharpe: calculateSharpe(fills, periodDays),
    trades: fills.length,
    volume: calculateVolume(fills),
    accountValue,
    lastUpdated: Date.now(),
  };
}
