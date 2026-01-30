import { Metadata } from "next";

export const metadata: Metadata = {
  title: "HL Whale Tracker | Wentao",
  description: "Track top Hyperliquid traders by PnL, win rate, and Sharpe ratio",
};

export default function HLWhaleTrackerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
