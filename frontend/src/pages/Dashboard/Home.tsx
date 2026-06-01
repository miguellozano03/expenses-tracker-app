import { TrendingDown, TrendingUp, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useDashboard } from "../../hooks/useDashboard";
import { useExpenses } from "../../hooks/useExpenses";
import { PeriodFilter } from "../../types/dashboard";

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

export function DashboardHome() {
  const { user } = useAuthStore();
  const { summary, loading: loadingSummary } = useDashboard(PeriodFilter.Month);
  const { expenses, loading: loadingExpenses } = useExpenses();

  const recentExpenses = expenses.slice(0, 3);
  const isPositive = Number(summary?.variation_pct) > 0;

  return (
    <div className="flex flex-col gap-6 px-4 pt-6 pb-4 max-w-2xl mx-auto w-full">
      {/* Header */}
      <div>
        <p className="text-sm text-gray-400">Good morning,</p>
        <h1 className="text-2xl font-semibold">{user?.nickname} 👋</h1>
      </div>

      {/* Total card */}
      <div className="bg-black text-white rounded-2xl p-5">
        {loadingSummary ? (
          <p className="text-gray-400 text-sm">Loading...</p>
        ) : (
          <>
            <p className="text-sm text-gray-400">This month</p>
            <p className="text-4xl font-semibold mt-1">
              ${fmt(summary?.total_current_period ?? 0)}
            </p>
            <div className="flex items-center gap-1 mt-3">
              {isPositive ? (
                <TrendingUp size={16} className="text-red-400" />
              ) : (
                <TrendingDown size={16} className="text-green-400" />
              )}
              <span
                className={`text-sm ${isPositive ? "text-red-400" : "text-green-400"}`}
              >
                {fmtPct(Math.abs(Number(summary?.variation_pct ?? 0)))}% vs last
                month
              </span>
            </div>
          </>
        )}
      </div>

      {/* Top categories */}
      <div>
        <p className="text-sm font-medium text-gray-500 mb-3">Top categories</p>
        {loadingSummary ? (
          <p className="text-sm text-gray-400">Loading...</p>
        ) : (
          <div className="flex flex-col gap-2">
            {(summary?.top_3_categories ?? []).map((cat) => (
              <div key={cat.name} className="flex flex-col gap-1">
                <div className="flex justify-between text-sm">
                  <span>{cat.name}</span>
                  <span className="font-medium">${fmt(cat.total)}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-black rounded-full"
                    style={{ width: `${Number(cat.pct_of_total)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent expenses */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-gray-500">Recent</p>
          <Link
            to="/expenses"
            className="text-sm text-gray-400 flex items-center gap-0.5"
          >
            See all <ArrowRight size={14} />
          </Link>
        </div>
        {loadingExpenses ? (
          <p className="text-sm text-gray-400">Loading...</p>
        ) : (
          <div className="flex flex-col gap-2">
            {recentExpenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-3 border border-gray-100 rounded-xl"
              >
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-sm font-medium truncate">
                    {expense.description ?? "No description"}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">
                      {expense.date}
                    </span>
                    {expense.category && (
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                        {expense.category.name}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-sm font-semibold shrink-0 ml-3">
                  ${fmt(expense.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
