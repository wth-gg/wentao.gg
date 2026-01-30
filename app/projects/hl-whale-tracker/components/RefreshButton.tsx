"use client";

import { RefreshCw } from "lucide-react";
import { formatRelativeTime } from "../lib/formatters";

interface RefreshButtonProps {
  onRefresh: () => void;
  loading: boolean;
  lastUpdated: number | null;
}

export default function RefreshButton({
  onRefresh,
  loading,
  lastUpdated,
}: RefreshButtonProps) {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {lastUpdated && (
        <span className="text-xs text-muted hidden sm:inline">
          Updated {formatRelativeTime(lastUpdated)}
        </span>
      )}
      <button
        onClick={onRefresh}
        disabled={loading}
        className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-background rounded-lg text-sm font-medium transition-colors ${
          loading
            ? "text-muted cursor-not-allowed"
            : "text-foreground hover:text-accent"
        }`}
      >
        <RefreshCw
          size={14}
          className={`${loading ? "animate-spin" : ""}`}
        />
        <span className="hidden sm:inline">{loading ? "Loading..." : "Refresh"}</span>
      </button>
    </div>
  );
}
