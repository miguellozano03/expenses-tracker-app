import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartPie } from "lucide-react";
import { useDashboard } from "../../hooks/useDashboard";
import type { PeriodFilter } from "../../types/dashboard";
import type { ValueType } from "recharts/types/component/DefaultTooltipContent";

type Period = "day" | "week" | "month" | "quarter" | "year";

const PERIODS: { label: string; value: Period }[] = [
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
  { label: "Quarter", value: "quarter" },
  { label: "Year", value: "year" },
];

const COLORS_LIGHT = ["#166534", "#4ade80", "#86efac", "#dcfce7"];
const COLORS_DARK = ["#4ade80", "#22c55e", "#15803d", "#166534"];

const fmt = (value: string | number) =>
  Number(value).toLocaleString("es-CO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const fmtPct = (value: string | number) =>
  Number(value).toLocaleString("es-CO", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { value: number }[];
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-dark-card border border-spendly-100 dark:border-dark-border rounded-xl px-3 py-2 text-xs font-medium text-spendly-900 dark:text-dark-text">
      ${fmt(payload[0].value)}
    </div>
  );
};

// Estado vacío reutilizable
function EmptyState({ period }: { period: string }) {
  return (
    <div className="bg-white dark:bg-dark-card border border-spendly-100 dark:border-dark-border rounded-2xl p-8 flex flex-col items-center gap-3 text-center">
      <div className="w-11 h-11 rounded-xl bg-spendly-50 dark:bg-dark-border flex items-center justify-center text-spendly-300 dark:text-dark-muted">
        <ChartPie size={22} />
      </div>
      <p className="text-sm font-medium text-spendly-900 dark:text-dark-text">
        No expenses this {period}
      </p>
      <p className="text-xs text-spendly-600 dark:text-dark-muted">
        Add an expense to start seeing your charts
      </p>
    </div>
  );
}

export function Charts() {
  const [period, setPeriod] = useState<Period>("month");
  const { summary, loading, error } = useDashboard(period as PeriodFilter);

  const isDark = document.documentElement.classList.contains("dark");
  const COLORS = isDark ? COLORS_DARK : COLORS_LIGHT;
  const barCurrent = isDark ? "#4ade80" : "#166534";
  const barPrevious = isDark ? "#1e4030" : "#dcfce7";
  const tickColor = isDark ? "#6ee7b7" : "#15803d";

  const hasData = summary && Number(summary.total_current_period) > 0;

  if (loading) {
    return (
      <div className="flex flex-col px-4 pt-6 pb-4 gap-6">
        <h1 className="text-2xl font-semibold text-spendly-900 dark:text-dark-text">
          Charts
        </h1>
        <div className="bg-white dark:bg-dark-card border border-spendly-100 dark:border-dark-border rounded-2xl p-6">
          <p className="text-sm text-spendly-600 dark:text-dark-muted animate-pulse">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col px-4 pt-6 pb-4 gap-6">
        <h1 className="text-2xl font-semibold text-spendly-900 dark:text-dark-text">
          Charts
        </h1>
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  const comparisonData = [
    { label: "Previous", value: Number(summary?.total_previous_period ?? 0) },
    { label: "Current", value: Number(summary?.total_current_period ?? 0) },
  ];

  const isDown = Number(summary?.variation_pct ?? 0) <= 0;

  return (
    <div className="flex flex-col px-4 pt-6 pb-20 md:pb-4 gap-5 transition-colors duration-200">
      <h1 className="text-2xl font-semibold text-spendly-900 dark:text-dark-text">
        Charts
      </h1>

      {/* Period selector */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {PERIODS.map((p) => (
          <button
            key={p.value}
            onClick={() => setPeriod(p.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              period === p.value
                ? "bg-spendly-800 dark:bg-spendly-600 text-white"
                : "border border-spendly-200 dark:border-dark-border text-spendly-700 dark:text-dark-muted hover:border-spendly-500 dark:hover:border-dark-muted"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Summary cards — siempre visibles */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white dark:bg-dark-card border border-spendly-100 dark:border-dark-border rounded-2xl p-4">
          <p className="text-xs text-spendly-600 dark:text-dark-muted mb-1">
            This {period}
          </p>
          <p className="text-xl font-semibold text-spendly-900 dark:text-dark-text">
            ${fmt(summary?.total_current_period ?? 0)}
          </p>
        </div>
        <div className="bg-white dark:bg-dark-card border border-spendly-100 dark:border-dark-border rounded-2xl p-4">
          <p className="text-xs text-spendly-600 dark:text-dark-muted mb-1">
            Variation
          </p>
          <p
            className={`text-xl font-semibold ${
              !hasData
                ? "text-spendly-300 dark:text-dark-border"
                : isDown
                  ? "text-spendly-600 dark:text-spendly-400"
                  : "text-red-500 dark:text-red-400"
            }`}
          >
            {!hasData
              ? "—"
              : `${isDown ? "" : "+"}${fmtPct(summary!.variation_pct)}%`}
          </p>
        </div>
      </div>

      {/* Sin datos → empty state */}
      {!hasData ? (
        <EmptyState period={period} />
      ) : (
        <>
          {/* Bar chart */}
          <div className="bg-white dark:bg-dark-card border border-spendly-100 dark:border-dark-border rounded-2xl p-4">
            <p className="text-sm font-medium text-spendly-700 dark:text-dark-muted mb-4">
              Current vs previous {period}
            </p>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={comparisonData} barSize={52} barCategoryGap="30%">
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: tickColor }}
                />
                <YAxis hide />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: isDark ? "#1e4030" : "#f0fdf4" }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {comparisonData.map((_, i) => (
                    <Cell key={i} fill={i === 1 ? barCurrent : barPrevious} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Donut */}
          <div className="bg-white dark:bg-dark-card border border-spendly-100 dark:border-dark-border rounded-2xl p-4">
            <p className="text-sm font-medium text-spendly-700 dark:text-dark-muted mb-4">
              By category
            </p>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width={130} height={130}>
                <PieChart>
                  <Pie
                    data={summary!.by_category.map((cat) => ({
                      ...cat,
                      total: Number(cat.total),
                    }))}
                    dataKey="total"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={38}
                    outerRadius={60}
                    paddingAngle={3}
                  >
                    {summary!.by_category.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              <div className="flex flex-col gap-2.5 flex-1">
                {summary!.by_category.map((cat, i) => (
                  <div
                    key={cat.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: COLORS[i % COLORS.length] }}
                      />
                      <span className="text-xs text-spendly-700 dark:text-dark-muted truncate max-w-[80px]">
                        {cat.name}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-spendly-900 dark:text-dark-text">
                      {fmtPct(cat.pct_of_total)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* All time */}
          <div className="bg-white dark:bg-dark-card border border-spendly-100 dark:border-dark-border rounded-2xl p-4 flex justify-between items-center">
            <p className="text-sm text-spendly-700 dark:text-dark-muted">
              All time
            </p>
            <p className="text-lg font-semibold text-spendly-900 dark:text-dark-text">
              ${fmt(summary!.total_all_time)}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
