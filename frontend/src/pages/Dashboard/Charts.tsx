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
import { useDashboard } from "../../hooks/useDashboard";
import type { PeriodFilter } from "../../types/dashboard";

type Period = "day" | "week" | "month" | "quarter" | "year";

const PERIODS: { label: string; value: Period }[] = [
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
  { label: "Quarter", value: "quarter" },
  { label: "Year", value: "year" },
];

const COLORS = ["#000000", "#6b7280", "#9ca3af", "#d1d5db"];

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

export function Charts() {
  const [period, setPeriod] = useState<Period>("month");
  const { summary, loading, error } = useDashboard(period as PeriodFilter);

  if (loading) {
    return (
      <div className="flex flex-col px-4 pt-6 pb-4 gap-6">
        <h1 className="text-2xl font-semibold">Charts</h1>
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="flex flex-col px-4 pt-6 pb-4 gap-6">
        <h1 className="text-2xl font-semibold">Charts</h1>
        <p className="text-sm text-red-500">{error ?? "No data available"}</p>
      </div>
    );
  }

  const comparisonData = [
    { label: "Previous", value: Number(summary.total_previous_period) },
    { label: "Current", value: Number(summary.total_current_period) },
  ];

  const isDown = Number(summary.variation_pct) <= 0;

  return (
    <div className="flex flex-col px-4 pt-6 pb-4 gap-6">
      <h1 className="text-2xl font-semibold">Charts</h1>

      {/* Period selector */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {PERIODS.map((p) => (
          <button
            key={p.value}
            onClick={() => setPeriod(p.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              period === p.value
                ? "bg-black text-white"
                : "border border-gray-200 text-gray-500"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 rounded-2xl p-4">
          <p className="text-xs text-gray-400">This {period}</p>
          <p className="text-xl font-semibold mt-1">
            ${fmt(summary.total_current_period)}
          </p>
        </div>
        <div className="bg-gray-50 rounded-2xl p-4">
          <p className="text-xs text-gray-400">Variation</p>
          <p
            className={`text-xl font-semibold mt-1 ${
              isDown ? "text-green-600" : "text-red-500"
            }`}
          >
            {isDown ? "" : "+"}
            {fmtPct(summary.variation_pct)}%
          </p>
        </div>
      </div>

      {/* Bar chart — current vs previous */}
      <div>
        <p className="text-sm font-medium text-gray-500 mb-3">
          Current vs previous {period}
        </p>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={comparisonData} barSize={48}>
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#9ca3af" }}
            />
            <YAxis hide />
            <Tooltip
              formatter={(v: number | string | undefined) => [`$${fmt(v ?? 0)}`, ""]}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #f3f4f6",
                fontSize: 12,
              }}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {comparisonData.map((_, i) => (
                <Cell key={i} fill={i === 1 ? "#000" : "#e5e7eb"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Donut chart — by category */}
      <div>
        <p className="text-sm font-medium text-gray-500 mb-3">By category</p>
        <div className="flex items-center gap-4">
          <ResponsiveContainer width={140} height={140}>
            <PieChart>
              <Pie
                data={summary.by_category.map((cat) => ({
                  ...cat,
                  total: Number(cat.total),
                }))}
                dataKey="total"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={65}
                paddingAngle={3}
              >
                {summary.by_category.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="flex flex-col gap-2 flex-1">
            {summary.by_category.map((cat, i) => (
              <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  />
                  <span className="text-xs text-gray-600">{cat.name}</span>
                </div>
                <span className="text-xs font-medium">
                  {fmtPct(cat.pct_of_total)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* All time total */}
      <div className="border border-gray-100 rounded-2xl p-4 flex justify-between items-center">
        <p className="text-sm text-gray-500">All time</p>
        <p className="text-lg font-semibold">${fmt(summary.total_all_time)}</p>
      </div>
    </div>
  );
}
