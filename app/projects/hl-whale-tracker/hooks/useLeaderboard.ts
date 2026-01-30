"use client";

import { useState, useCallback, useEffect } from "react";
import { TraderMetrics, TimePeriod, LeaderboardState } from "../lib/types";
import { WHALE_ADDRESSES, getWhaleLabel } from "../lib/whales";
import { batchFetchTraderData } from "../lib/hyperliquid";
import { calculateTraderMetrics } from "../lib/calculations";

const TIME_PERIOD_MS: Record<TimePeriod, number> = {
  "24h": 24 * 60 * 60 * 1000,
  "7d": 7 * 24 * 60 * 60 * 1000,
  "30d": 30 * 24 * 60 * 60 * 1000,
  all: Infinity,
};

const TIME_PERIOD_DAYS: Record<TimePeriod, number> = {
  "24h": 1,
  "7d": 7,
  "30d": 30,
  all: 365,
};

export function useLeaderboard(timePeriod: TimePeriod) {
  const [state, setState] = useState<LeaderboardState>({
    traders: [],
    loading: false,
    error: null,
    lastUpdated: null,
  });

  const [progress, setProgress] = useState({ completed: 0, total: 0 });

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    setProgress({ completed: 0, total: WHALE_ADDRESSES.length });

    try {
      const addresses = WHALE_ADDRESSES.map((w) => w.address);
      const periodMs = TIME_PERIOD_MS[timePeriod];
      const periodDays = TIME_PERIOD_DAYS[timePeriod];

      const results = await batchFetchTraderData(
        addresses,
        periodMs,
        (completed, total) => {
          setProgress({ completed, total });
        }
      );

      const traders: TraderMetrics[] = [];

      for (const [address, data] of results) {
        if (data.error) continue;

        const metrics = calculateTraderMetrics(
          address,
          data.state,
          data.fills,
          periodDays,
          getWhaleLabel(address)
        );

        // Only include traders with some activity
        if (metrics.trades > 0 || metrics.accountValue > 0) {
          traders.push(metrics);
        }
      }

      setState({
        traders,
        loading: false,
        error: null,
        lastUpdated: Date.now(),
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Failed to fetch data",
      }));
    }
  }, [timePeriod]);

  // Fetch on mount and when time period changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    ...state,
    progress,
    refresh: fetchData,
  };
}
