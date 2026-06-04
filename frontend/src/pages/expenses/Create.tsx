import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, DollarSign, Calendar, Tag, FileText } from "lucide-react";

import { useCategories } from "../../hooks/useCategories";
import { expenseService } from "../../service/expenseService";

export function CreateExpense() {
  const navigate = useNavigate();

  const { categories, loading: loadingCategories } = useCategories();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    amount: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
    category_id: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      await expenseService.create({
        amount: Number(form.amount),
        date: form.date,
        description: form.description || null,

        category_id: form.category_id || null,
      });

      navigate("/expenses");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full px-4 pt-4 pb-6 transition-colors duration-200">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-spendly-700 dark:text-dark-muted mb-6 w-fit hover:text-spendly-900 dark:hover:text-dark-text transition-colors"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <h1 className="text-2xl font-semibold mb-6 text-spendly-900 dark:text-dark-text">New expense</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-spendly-700 dark:text-dark-muted flex items-center gap-1">
            <DollarSign size={14} />
            Amount
          </label>

          <input
            type="number"
            step="0.01"
            min="0"
            required
            value={form.amount}
            onChange={(e) =>
              setForm({
                ...form,
                amount: e.target.value,
              })
            }
            className="border border-spendly-200 dark:border-dark-border rounded-xl px-4 py-3 bg-white dark:bg-dark-card text-spendly-900 dark:text-dark-text placeholder:text-spendly-300 dark:placeholder:text-dark-border focus:border-spendly-600 transition-colors duration-200"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-spendly-700 dark:text-dark-muted flex items-center gap-1">
            <Calendar size={14} />
            Date
          </label>

          <input
            type="date"
            required
            value={form.date}
            onChange={(e) =>
              setForm({
                ...form,
                date: e.target.value,
              })
            }
            className="border border-spendly-200 dark:border-dark-border rounded-xl px-4 py-3 bg-white dark:bg-dark-card text-spendly-900 dark:text-dark-text placeholder:text-spendly-300 dark:placeholder:text-dark-border focus:border-spendly-600 transition-colors duration-200"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-spendly-700 dark:text-dark-muted flex items-center gap-1">
            <Tag size={14} />
            Category
          </label>

          <select
            value={form.category_id}
            disabled={loadingCategories}
            onChange={(e) =>
              setForm({
                ...form,
                category_id: e.target.value,
              })
            }
            className="border border-spendly-200 dark:border-dark-border rounded-xl px-4 py-3 bg-white dark:bg-dark-card text-spendly-900 dark:text-dark-text placeholder:text-spendly-300 dark:placeholder:text-dark-border focus:border-spendly-600 transition-colors duration-200"
          >
            <option value="">No category</option>

            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-spendly-700 dark:text-dark-muted flex items-center gap-1">
            <FileText size={14} />
            Description
          </label>

          <textarea
            maxLength={500}
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
            className="border border-spendly-200 dark:border-dark-border rounded-xl px-4 py-3 bg-white dark:bg-dark-card text-spendly-900 dark:text-dark-text placeholder:text-spendly-300 dark:placeholder:text-dark-border focus:border-spendly-600 resize-none h-24 transition-colors duration-200"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full bg-spendly-800 dark:bg-spendly-600 text-white rounded-xl py-4 font-medium hover:bg-spendly-900 dark:hover:bg-spendly-700 disabled:opacity-50 transition-colors duration-200"
        >
          {loading ? "Saving..." : "Save expense"}
        </button>
      </form>
    </div>
  );
}
