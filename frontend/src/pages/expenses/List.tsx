import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useExpenses } from "../../hooks/useExpenses";
import { expenseService } from "../../service/expenseService";
import { ExpenseForm } from "../../components/ExpenseForm";
import type { ExpenseRead } from "../../types/expenses";

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

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="flex flex-col px-4 pt-4 pb-6 gap-6">
      <h1 className="text-2xl font-semibold">Expenses</h1>

      <div className="bg-gray-50 rounded-2xl p-4">
        <p className="text-sm text-gray-500">Total expenses</p>
        <p className="text-3xl font-semibold mt-1">${fmt(total)}</p>
      </div>

      <div className="flex flex-col gap-3">
        {expenses.map((expense) => (
          <div key={expense.id}>
            {deletingId === expense.id ? (
              <div
                className="flex items-center justify-between p-4 border border-red-100
                bg-red-50 rounded-2xl"
              >
                <span className="text-sm text-red-600">
                  Delete "{expense.description ?? "this expense"}"?
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDelete(expense.id)}
                    className="text-xs font-medium text-red-600 px-3 py-1.5 rounded-lg
                      bg-red-100 hover:bg-red-200"
                  >
                    Yes, delete
                  </button>
                  <button
                    onClick={() => setDeletingId(null)}
                    className="text-xs font-medium text-gray-500 px-3 py-1.5 rounded-lg
                      bg-gray-100 hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl">
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="font-medium text-sm truncate">
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
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <span className="font-semibold text-sm">
                    ${fmt(expense.amount)}
                  </span>
                  <button
                    onClick={() => setEditingExpense(expense)}
                    className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => setDeletingId(expense.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
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
          className="px-4 py-2 rounded-xl border text-sm"
        >
          Previous
        </button>
        <button
          onClick={nexPage}
          className="px-4 py-2 rounded-xl border text-sm"
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
            className="relative z-10 bg-white w-full max-w-lg rounded-t-3xl md:rounded-2xl
              shadow-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center pt-3 pb-1 md:hidden">
              <div className="w-10 h-1 rounded-full bg-gray-200" />
            </div>
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <h2 className="font-semibold">Edit expense</h2>
              <button
                onClick={() => setEditingExpense(null)}
                className="text-gray-400 hover:text-black"
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
