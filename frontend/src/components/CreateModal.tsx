import { useState } from "react";
import { X } from "lucide-react";
import { ExpenseForm } from "./ExpenseForm";
import { CategoryManager } from "./CategoryManager";

type Tab = "expense" | "category";

interface CreateModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateModal({ open, onClose }: CreateModalProps) {
  const [tab, setTab] = useState<Tab>("expense");

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Sheet */}
      <div
        className="relative z-10 bg-white dark:bg-dark-card w-full max-w-lg rounded-t-3xl md:rounded-2xl
          shadow-xl max-h-[90vh] overflow-y-auto transition-colors duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 md:hidden">
          <div className="w-10 h-1 rounded-full bg-spendly-200 dark:bg-dark-border" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <div className="flex gap-1 bg-spendly-50 dark:bg-dark-surface rounded-xl p-1">
            <button
              onClick={() => setTab("expense")}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                tab === "expense"
                  ? "bg-white dark:bg-dark-card shadow-sm text-spendly-900 dark:text-dark-text"
                  : "text-spendly-700 dark:text-dark-muted"
              }`}
            >
              Expense
            </button>
            <button
              onClick={() => setTab("category")}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                tab === "category"
                  ? "bg-white dark:bg-dark-card shadow-sm text-spendly-900 dark:text-dark-text"
                  : "text-spendly-700 dark:text-dark-muted"
              }`}
            >
              Category
            </button>
          </div>
          <button
            onClick={onClose}
            className="text-spendly-600 dark:text-dark-muted hover:text-spendly-900 dark:hover:text-dark-text transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 pb-6 pt-2">
          {tab === "expense" ? (
            <ExpenseForm onSuccess={onClose} />
          ) : (
            <CategoryManager />
          )}
        </div>
      </div>
    </div>
  );
}
