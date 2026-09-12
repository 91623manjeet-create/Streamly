import type { DashboardStats, MockTransaction, PublicCreator } from "@/types/database";

export const demoCreator: PublicCreator = {
  id: "00000000-0000-4000-8000-000000000001",
  username: "demo",
  display_name: "Aarav Mehta",
  avatar: null,
  bio: "I live-stream strategy games and weekend cricket recaps. Tips keep the lights on and the overlays extra loud.",
  is_active: true,
};

export const dashboardStats: DashboardStats = {
  totalTipsInr: 42850,
  monthlyTipsInr: 12640,
  supporters: 187,
};

export const recentTransactions: MockTransaction[] = [
  {
    id: "txn_01",
    supporter: "Neha K.",
    amountInr: 250,
    message: "That clutch round was insane.",
    createdAt: "2026-09-10T18:12:00.000Z",
  },
  {
    id: "txn_02",
    supporter: "Rohit S.",
    amountInr: 100,
    message: "Love the new overlay.",
    createdAt: "2026-09-09T14:40:00.000Z",
  },
  {
    id: "txn_03",
    supporter: "Anonymous",
    amountInr: 500,
    message: "Keep going. Best IPL takes on YouTube.",
    createdAt: "2026-09-08T09:05:00.000Z",
  },
  {
    id: "txn_04",
    supporter: "Priya M.",
    amountInr: 50,
    message: "First tip — more soon.",
    createdAt: "2026-09-07T21:18:00.000Z",
  },
];

export const revenuePreview = [
  { label: "Apr", value: 8200 },
  { label: "May", value: 11400 },
  { label: "Jun", value: 9800 },
  { label: "Jul", value: 15100 },
  { label: "Aug", value: 13200 },
  { label: "Sep", value: 12640 },
];
