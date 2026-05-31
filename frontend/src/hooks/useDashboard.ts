import { useEffect, useState } from "react";
import { dashboardService } from "../service/dashboardService";
import type { DashboardSummary, PeriodFilter } from "../types/dashboard";

export const useDashboard = (period?: PeriodFilter) => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = period
          ? await dashboardService.getSummaryPeriod(period)
          : await dashboardService.getSummary();

        setSummary(data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Error loading dashboard",
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [period]);

  return { summary, loading, error };
};
