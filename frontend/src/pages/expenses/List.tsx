import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useExpenses } from "@/hooks/useExpenses";
import { expenseService } from "@/service/expenseService";
import { ExpenseForm } from "@/components/ExpenseForm";
import type { ExpenseRead } from "@/types/expenses";

const fmt = (value: string | number) =>
  Number(value).toLocaleString("es-CO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export function ListExpenses() {
  const { expenses, loading, error, nexPage, previousPage, refetch } =
    useExpenses();
  const [editingExpense, setEditingExpense] = useState<ExpenseRead | null>(
    null,
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const total = expenses.reduce((acc, e) => acc + Number(e.amount), 0);

  const handleDelete = async (id: string) => {
    await expenseService.delete(id);
    setDeletingId(null);
    refetch();
  };

  if (loading)
    return (
      <p className="p-4 text-spendly-900 dark:text-dark-text">Loading...</p>
    );
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="flex flex-col px-4 pt-4 pb-6 gap-6 transition-colors duration-200">
      <h1 className="text-2xl font-semibold text-spendly-900 dark:text-dark-text">
        Expenses
      </h1>

      <div className="bg-spendly-50 dark:bg-dark-card rounded-2xl p-4 transition-colors duration-200">
        <p className="text-sm text-spendly-700 dark:text-dark-muted">
          Total expenses
        </p>
        <p className="text-3xl font-semibold mt-1 text-spendly-900 dark:text-dark-text">
          ${fmt(total)}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {expenses.map((expense) => (
          <div key={expense.id}>
            {deletingId === expense.id ? (
              <div
                className="flex items-center justify-between p-4 border border-red-200 dark:border-red-500/30
                bg-red-50 dark:bg-red-500/10 rounded-2xl transition-colors duration-200"
              >
                <span className="text-sm text-red-600 dark:text-red-400">
                  Delete "{expense.description ?? "this expense"}"?
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDelete(expense.id)}
                    className="text-xs font-medium text-red-600 dark:text-red-400 px-3 py-1.5 rounded-lg
                      bg-red-100 dark:bg-red-500/20 hover:bg-red-200 dark:hover:bg-red-500/30 transition-colors"
                  >
                    Yes, delete
                  </button>
                  <button
                    onClick={() => setDeletingId(null)}
                    className="text-xs font-medium text-spendly-700 dark:text-dark-muted px-3 py-1.5 rounded-lg
                      bg-spendly-100 dark:bg-dark-border hover:bg-spendly-200 dark:hover:bg-dark-border/80 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 border border-spendly-100 dark:border-dark-border rounded-2xl bg-white dark:bg-dark-card transition-colors duration-200">
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="font-medium text-sm truncate text-spendly-900 dark:text-dark-text">
                    {expense.description ?? "No description"}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-spendly-700 dark:text-dark-muted">
                      {expense.date}
                    </span>
                    {expense.category && (
                      <span className="text-xs bg-spendly-100 dark:bg-dark-border text-spendly-700 dark:text-dark-muted px-2 py-0.5 rounded-full">
                        {expense.category.name}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <span className="font-semibold text-sm text-spendly-900 dark:text-dark-text">
                    ${fmt(expense.amount)}
                  </span>
                  <button
                    onClick={() => setEditingExpense(expense)}
                    className="p-1.5 text-spendly-600 dark:text-dark-muted hover:text-spendly-900 dark:hover:text-dark-text hover:bg-spendly-50 dark:hover:bg-dark-border rounded-lg transition-colors"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => setDeletingId(expense.id)}
                    className="p-1.5 text-spendly-600 dark:text-dark-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between gap-4">
        <button
          onClick={previousPage}
          className="px-4 py-2 rounded-xl border border-spendly-200 dark:border-dark-border text-sm text-spendly-900 dark:text-dark-text hover:bg-spendly-50 dark:hover:bg-dark-card transition-colors"
        >
          Previous
        </button>
        <button
          onClick={nexPage}
          className="px-4 py-2 rounded-xl border border-spendly-200 dark:border-dark-border text-sm text-spendly-900 dark:text-dark-text hover:bg-spendly-50 dark:hover:bg-dark-card transition-colors"
        >
          Next
        </button>
      </div>

      {/* Edit modal */}
      {editingExpense && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
          onClick={() => setEditingExpense(null)}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="relative z-10 bg-white dark:bg-dark-card w-full max-w-lg rounded-t-3xl md:rounded-2xl
              shadow-xl max-h-[90vh] overflow-y-auto transition-colors duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center pt-3 pb-1 md:hidden">
              <div className="w-10 h-1 rounded-full bg-spendly-200 dark:bg-dark-border" />
            </div>
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <h2 className="font-semibold text-spendly-900 dark:text-dark-text">
                Edit expense
              </h2>
              <button
                onClick={() => setEditingExpense(null)}
                className="text-spendly-600 dark:text-dark-muted hover:text-spendly-900 dark:hover:text-dark-text transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="px-5 pb-6">
              <ExpenseForm
                initialValues={{
                  id: editingExpense.id,
                  amount: String(editingExpense.amount),
                  date: editingExpense.date,
                  description: editingExpense.description ?? "",
                  category_id: editingExpense.category?.id ?? "",
                }}
                onSuccess={() => {
                  setEditingExpense(null);
                  refetch();
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
