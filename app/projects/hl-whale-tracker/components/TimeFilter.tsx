"use client";

import { TimePeriod } from "../lib/types";

interface TimeFilterProps {
  value: TimePeriod;
  onChange: (period: TimePeriod) => void;
}

const periods: { value: TimePeriod; label: string }[] = [
  { value: "24h", label: "24H" },
  { value: "7d", label: "7D" },
  { value: "30d", label: "30D" },
  { value: "all", label: "All" },
];

export default function TimeFilter({ value, onChange }: TimeFilterProps) {
  return (
    <div className="flex bg-background rounded-lg p-0.5 sm:p-1 gap-0.5 sm:gap-1">
      {periods.map((period) => (
        <button
          key={period.value}
          type="button"
          onClick={() => onChange(period.value)}
          className={`px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-md transition-colors ${
            value === period.value
              ? "bg-accent text-white"
              : "text-muted hover:text-foreground"
          }`}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
}
