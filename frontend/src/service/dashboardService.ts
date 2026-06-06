import api from "@/api/axiosInstance";
import type {
  DashboardSummary,
  TotalExpenses,
  PeriodFilter,
} from "@/types/dashboard";

export const dashboardService = {
  async getTotal(): Promise<TotalExpenses> {
    const { data } = await api.get<TotalExpenses>("/dashboard/total");
    return data;
  },

  async getSummary(): Promise<DashboardSummary> {
    const { data } = await api.get<DashboardSummary>(
      "/dashboard/summary",
    );
    return data;
  },

  async getSummaryPeriod(period: PeriodFilter): Promise<DashboardSummary> {
    const { data } = await api.get<DashboardSummary>(
      `/dashboard/summary/${period}`,
    );
    return data;
  },
};
