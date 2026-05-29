import { useState } from "react";
import { Filter } from "lucide-react";

type Period = "day" | "week" | "month" | "quarter" | "year";

// Tipos basados en tus schemas de Python
interface CategoryRead {
  id: string;
  name: string;
}

interface ExpenseRead {
  id: string;
  amount: number;
  date: string;
  description?: string;
  category?: CategoryRead;
}

// Mock data para mientras conectas la API
const MOCK_EXPENSES: ExpenseRead[] = [
  {
    id: "1",
    amount: 12.5,
    date: "2025-05-28",
    description: "Lunch",
    category: { id: "1", name: "Food" },
  },
  {
    id: "2",
    amount: 45.0,
    date: "2025-05-27",
    description: "Uber",
    category: { id: "2", name: "Transport" },
  },
  {
    id: "3",
    amount: 8.99,
    date: "2025-05-26",
    description: "Netflix",
    category: { id: "4", name: "Entertainment" },
  },
  {
    id: "4",
    amount: 32.0,
    date: "2025-05-25",
    category: { id: "3", name: "Health" },
  },
];

const PERIODS: { label: string; value: Period }[] = [
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
  { label: "Quarter", value: "quarter" },
  { label: "Year", value: "year" },
];

export function ListExpenses() {
  const [period, setPeriod] = useState<Period>("month");

  const total = MOCK_EXPENSES.reduce((acc, e) => acc + e.amount, 0);

  return (
    <div className="flex flex-col px-4 pt-4 pb-6 gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Expenses</h1>
      </div>

      {/* Period filter */}
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

      {/* Total */}
      <div className="bg-gray-50 rounded-2xl p-4">
        <p className="text-sm text-gray-500">Total this {period}</p>
        <p className="text-3xl font-semibold mt-1">${total.toFixed(2)}</p>
      </div>

      {/* List */}
      <div className="flex flex-col gap-3">
        {MOCK_EXPENSES.map((expense) => (
          <div
            key={expense.id}
            className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl"
          >
            <div className="flex flex-col gap-0.5">
              <span className="font-medium text-sm">
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
            <span className="font-semibold">${expense.amount.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
