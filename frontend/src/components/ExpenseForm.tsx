import { useState } from "react";
import { DollarSign, Calendar, Tag, FileText } from "lucide-react";
import { useCategories } from "../hooks/useCategories";
import { expenseService } from "../service/expenseService";

interface ExpenseFormProps {
  onSuccess: () => void;
  initialValues?: {
    id: string;
    amount: string;
    date: string;
    description: string;
    category_id: string;
  };
}

export function ExpenseForm({ onSuccess, initialValues }: ExpenseFormProps) {
  const { categories, loading: loadingCategories } = useCategories();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    amount: initialValues?.amount ?? "",
    date: initialValues?.date ?? new Date().toISOString().split("T")[0],
    description: initialValues?.description ?? "",
    category_id: initialValues?.category_id ?? "",
  });

  const isEdit = !!initialValues?.id;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        amount: Number(form.amount),
        date: form.date,
        description: form.description || null,
        category_id: form.category_id || null,
      };
      if (isEdit) {
        await expenseService.update(initialValues!.id, payload);
      } else {
        await expenseService.create(payload);
      }
      onSuccess();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 pt-2">
      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-500 flex items-center gap-1">
          <DollarSign size={14} /> Amount
        </label>
        <input
          type="number"
          step="0.01"
          min="0"
          required
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          className="border border-gray-200 rounded-xl px-4 py-3"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-500 flex items-center gap-1">
          <Calendar size={14} /> Date
        </label>
        <input
          type="date"
          required
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="border border-gray-200 rounded-xl px-4 py-3"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-500 flex items-center gap-1">
          <Tag size={14} /> Category
        </label>
        <select
          value={form.category_id}
          disabled={loadingCategories}
          onChange={(e) => setForm({ ...form, category_id: e.target.value })}
          className="border border-gray-200 rounded-xl px-4 py-3 bg-white"
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
        <label className="text-sm text-gray-500 flex items-center gap-1">
          <FileText size={14} /> Description
        </label>
        <textarea
          maxLength={500}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border border-gray-200 rounded-xl px-4 py-3 resize-none h-24"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-2 w-full bg-black text-white rounded-xl py-4 font-medium disabled:opacity-60"
      >
        {loading ? "Saving..." : isEdit ? "Save changes" : "Save expense"}
      </button>
    </form>
  );
}
