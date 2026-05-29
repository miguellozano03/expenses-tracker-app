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

type Period = "day" | "week" | "month" | "quarter" | "year";

interface CategorySummary {
  name: string;
  total: number;
  pct_of_total: number;
}

interface DashboardSummary {
  total_all_time: number;
  total_current_period: number;
  total_previous_period: number;
  variation_pct: number;
  by_category: CategorySummary[];
  top_3_categories: CategorySummary[];
}

// Mock — reemplazar con API call
const MOCK_SUMMARY: DashboardSummary = {
  total_all_time: 1240.0,
  total_current_period: 248.5,
  total_previous_period: 310.0,
  variation_pct: -19.8,
  by_category: [
    { name: "Food", total: 98.5, pct_of_total: 39.6 },
    { name: "Transport", total: 75.0, pct_of_total: 30.2 },
    { name: "Health", total: 45.0, pct_of_total: 18.1 },
    { name: "Entertainment", total: 30.0, pct_of_total: 12.1 },
  ],
  top_3_categories: [],
};

const PERIODS: { label: string; value: Period }[] = [
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
  { label: "Quarter", value: "quarter" },
  { label: "Year", value: "year" },
];

const COLORS = ["#000000", "#6b7280", "#9ca3af", "#d1d5db"];

export function Charts() {
  const [period, setPeriod] = useState<Period>("month");
  const summary = MOCK_SUMMARY;

  const comparisonData = [
    { label: "Previous", value: summary.total_previous_period },
    { label: "Current", value: summary.total_current_period },
  ];

  const isDown = summary.variation_pct <= 0;

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
            ${summary.total_current_period.toFixed(2)}
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
            {summary.variation_pct.toFixed(1)}%
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
              formatter={(v: number) => [`$${v.toFixed(2)}`, ""]}
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
                data={summary.by_category}
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
                  {cat.pct_of_total.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* All time total */}
      <div className="border border-gray-100 rounded-2xl p-4 flex justify-between items-center">
        <p className="text-sm text-gray-500">All time</p>
        <p className="text-lg font-semibold">
          ${summary.total_all_time.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
