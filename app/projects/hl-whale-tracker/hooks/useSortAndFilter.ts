"use client";

import { useState, useMemo } from "react";
import { TraderMetrics, SortField, SortDirection, TimePeriod } from "../lib/types";

export function useSortAndFilter(traders: TraderMetrics[]) {
  const [sortField, setSortField] = useState<SortField>("pnl");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("7d");

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      // Toggle direction
      setSortDirection((prev) => (prev === "desc" ? "asc" : "desc"));
    } else {
      // New field, default to descending
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const sortedTraders = useMemo(() => {
    const sorted = [...traders].sort((a, b) => {
      let aVal: number;
      let bVal: number;

      switch (sortField) {
        case "pnl":
          aVal = a.pnl;
          bVal = b.pnl;
          break;
        case "winRate":
          aVal = a.winRate;
          bVal = b.winRate;
          break;
        case "sharpe":
          aVal = a.sharpe;
          bVal = b.sharpe;
          break;
        case "trades":
          aVal = a.trades;
          bVal = b.trades;
          break;
        case "volume":
          aVal = a.volume;
          bVal = b.volume;
          break;
        default:
          return 0;
      }

      const diff = aVal - bVal;
      return sortDirection === "desc" ? -diff : diff;
    });

    return sorted;
  }, [traders, sortField, sortDirection]);

  return {
    sortedTraders,
    sortField,
    sortDirection,
    timePeriod,
    handleSort,
    setTimePeriod,
  };
}
