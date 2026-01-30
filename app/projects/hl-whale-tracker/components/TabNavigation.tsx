"use client";

import { Trophy, Activity, TrendingUp, Wallet } from "lucide-react";

type Tab = "leaderboard" | "positions" | "trades" | "analytics";

interface TabNavigationProps {
  activeTab: Tab;
  onChange: (tab: Tab) => void;
}

const tabs: { id: Tab; label: string; icon: React.ElementType; disabled: boolean }[] = [
  { id: "leaderboard", label: "Leaderboard", icon: Trophy, disabled: false },
  { id: "positions", label: "Positions", icon: Wallet, disabled: true },
  { id: "trades", label: "Trades", icon: Activity, disabled: true },
  { id: "analytics", label: "Analytics", icon: TrendingUp, disabled: true },
];

export default function TabNavigation({ activeTab, onChange }: TabNavigationProps) {
  return (
    <div className="flex bg-card rounded-xl p-1 mb-4 sm:mb-6">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && onChange(tab.id)}
            disabled={tab.disabled}
            className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 rounded-lg font-medium transition-colors text-sm ${
              activeTab === tab.id
                ? "bg-accent text-white"
                : tab.disabled
                ? "text-muted/50 cursor-not-allowed"
                : "text-muted hover:text-foreground"
            }`}
          >
            <Icon size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span className="hidden sm:inline">{tab.label}</span>
            {tab.disabled && (
              <span className="hidden sm:inline text-[10px] opacity-60">(Soon)</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
