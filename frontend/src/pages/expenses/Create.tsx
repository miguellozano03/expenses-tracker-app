import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, DollarSign, Calendar, Tag, FileText } from "lucide-react";

const MOCK_CATEGORIES = [
  { id: "1", name: "Food" },
  { id: "2", name: "Transport" },
  { id: "3", name: "Health" },
  { id: "4", name: "Entertainment" },
  { id: "5", name: "Other" },
];

export function CreateExpense() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    amount: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
    category_id: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: llamar a tu API aquí
    console.log(form);
    navigate("/home");
  };

  return (
    <div className="flex flex-col h-full px-4 pt-4 pb-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-gray-500 mb-6 w-fit"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <h1 className="text-2xl font-semibold mb-6">New expense</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Amount */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-500 flex items-center gap-1">
            <DollarSign size={14} /> Amount
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            required
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="border border-gray-200 rounded-xl px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Date */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-500 flex items-center gap-1">
            <Calendar size={14} /> Date
          </label>
          <input
            type="date"
            required
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-500 flex items-center gap-1">
            <Tag size={14} /> Category
          </label>
          <select
            value={form.category_id}
            onChange={(e) => setForm({ ...form, category_id: e.target.value })}
            className="border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black bg-white"
          >
            <option value="">No category</option>
            {MOCK_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-500 flex items-center gap-1">
            <FileText size={14} /> Description
          </label>
          <textarea
            placeholder="Optional note..."
            maxLength={500}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border border-gray-200 rounded-xl px-4 py-3 resize-none h-24 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <button
          type="submit"
          className="mt-2 w-full bg-black text-white rounded-xl py-4 font-medium hover:opacity-90 active:scale-95 transition-all"
        >
          Save expense
        </button>
      </form>
    </div>
  );
}
