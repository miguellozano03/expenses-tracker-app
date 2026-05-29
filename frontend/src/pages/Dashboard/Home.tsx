import { TrendingDown, TrendingUp, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

// Mock data — reemplazar con API calls
const MOCK_USER = { nickname: "Carlos" };

const MOCK_SUMMARY = {
  total_current_period: 248.5,
  total_previous_period: 310.0,
  variation_pct: -19.8,
  top_3_categories: [
    { name: "Food", total: 98.5, pct_of_total: 39.6 },
    { name: "Transport", total: 75.0, pct_of_total: 30.2 },
    { name: "Health", total: 45.0, pct_of_total: 18.1 },
  ],
};

const MOCK_RECENT: {
  id: string;
  description?: string;
  amount: number;
  date: string;
  category?: { name: string };
}[] = [
  {
    id: "1",
    amount: 12.5,
    date: "2025-05-28",
    description: "Lunch",
    category: { name: "Food" },
  },
  {
    id: "2",
    amount: 45.0,
    date: "2025-05-27",
    description: "Uber",
    category: { name: "Transport" },
  },
  {
    id: "3",
    amount: 8.99,
    date: "2025-05-26",
    description: "Netflix",
    category: { name: "Entertainment" },
  },
];

export function DashboardHome() {
  const isPositive = MOCK_SUMMARY.variation_pct > 0;

  return (
    <div className="flex flex-col gap-6 px-4 pt-6 pb-4">
      {/* Header */}
      <div>
        <p className="text-sm text-gray-400">Good morning,</p>
        <h1 className="text-2xl font-semibold">{MOCK_USER.nickname} 👋</h1>
      </div>

      {/* Total card */}
      <div className="bg-black text-white rounded-2xl p-5">
        <p className="text-sm text-gray-400">This month</p>
        <p className="text-4xl font-semibold mt-1">
          ${MOCK_SUMMARY.total_current_period.toFixed(2)}
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
            {Math.abs(MOCK_SUMMARY.variation_pct)}% vs last month
          </span>
        </div>
      </div>

      {/* Top categories */}
      <div>
        <p className="text-sm font-medium text-gray-500 mb-3">Top categories</p>
        <div className="flex flex-col gap-2">
          {MOCK_SUMMARY.top_3_categories.map((cat) => (
            <div key={cat.name} className="flex flex-col gap-1">
              <div className="flex justify-between text-sm">
                <span>{cat.name}</span>
                <span className="font-medium">${cat.total.toFixed(2)}</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-black rounded-full"
                  style={{ width: `${cat.pct_of_total}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent expenses */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-gray-500">Recent</p>
          <Link
            to="/reports"
            className="text-sm text-gray-400 flex items-center gap-0.5"
          >
            See all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          {MOCK_RECENT.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between p-3 border border-gray-100 rounded-xl"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">
                  {expense.description ?? "No description"}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{expense.date}</span>
                  {expense.category && (
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                      {expense.category.name}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-sm font-semibold">
                ${expense.amount.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
