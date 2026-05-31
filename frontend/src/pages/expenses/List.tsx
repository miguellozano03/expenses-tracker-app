import { useExpenses } from "../../hooks/useExpenses";

export function ListExpenses() {
  const { expenses, loading, error, nexPage, previousPage } = useExpenses();

  const total = expenses.reduce(
    (acc, expense) => acc + Number(expense.amount),
    0,
  );

  if (loading) {
    return <p className="p-4">Loading...</p>;
  }

  if (error) {
    return <p className="p-4 text-red-500">{error}</p>;
  }

  return (
    <div className="flex flex-col px-4 pt-4 pb-6 gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Expenses</h1>
      </div>

      <div className="bg-gray-50 rounded-2xl p-4">
        <p className="text-sm text-gray-500">Total expenses</p>

        <p className="text-3xl font-semibold mt-1">${total.toFixed(2)}</p>
      </div>

      <div className="flex flex-col gap-3">
        {expenses.map((expense) => (
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

            <span className="font-semibold">
              ${Number(expense.amount).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div className="flex justify-between gap-4">
        <button onClick={previousPage} className="px-4 py-2 rounded-xl border">
          Previous
        </button>

        <button onClick={nexPage} className="px-4 py-2 rounded-xl border">
          Next
        </button>
      </div>
    </div>
  );
}
