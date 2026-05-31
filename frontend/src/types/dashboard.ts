export interface CategorySummary {
  name: string;
  total: string;
  pct_of_total: string;
}

export interface DashboardSummary {
  total_all_time: string;
  total_current_period: string;
  total_previous_period: string;
  variation_pct: string;
  by_category: CategorySummary[];
  top_3_categories: CategorySummary[];
}

export interface TotalExpenses {
  total: string;
}

export const PeriodFilter = {
  Day: "day",
  Week: "week",
  Month: "month",
  Quarter: "quarter",
  Year: "year",
} as const;

export type PeriodFilter = (typeof PeriodFilter)[keyof typeof PeriodFilter];
