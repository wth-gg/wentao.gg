"use client";

import { useState, useCallback, useEffect } from "react";
import { TraderMetrics, TimePeriod, LeaderboardState } from "../lib/types";
import { getTopTraders } from "../lib/hyperliquid";

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
    setProgress({ completed: 0, total: 1 });

    try {
      const result = await getTopTraders(timePeriod, 50);

      if (result.error) {
        throw new Error(result.error);
      }

      setProgress({ completed: 1, total: 1 });

      setState({
        traders: result.data || [],
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
