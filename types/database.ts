export type UserRow = {
  id: string;
  email: string | null;
  created_at: string;
  updated_at: string;
};

export type CreatorRow = {
  id: string;
  user_id: string;
  username: string;
  display_name: string;
  avatar: string | null;
  bio: string | null;
  widget_shape?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type PublicCreator = Pick<
  CreatorRow,
  "id" | "username" | "display_name" | "avatar" | "bio" | "widget_shape" | "is_active"
>;

export type CreatorSettingsRow = {
  id: string;
  creator_id: string;
  currency: string;
  min_tip_amount: number;
  overlay_enabled: boolean;
  alert_enabled: boolean;
  alert_duration: number;
  created_at: string;
  updated_at: string;
};

export type DashboardStats = {
  totalTipsInr: number;
  monthlyTipsInr: number;
  supporters: number;
};

export type MockTransaction = {
  id: string;
  supporter: string;
  amountInr: number;
  message: string;
  createdAt: string;
};
