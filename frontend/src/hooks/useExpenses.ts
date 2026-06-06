import { useState, useEffect } from "react";
import { expenseService } from "@/service/expenseService";
import { type ExpenseRead } from "@/types/expenses";

const LIMIT = 10;

export const useExpenses = () => {
  const [trigger, setTrigger] = useState(0);
  const [expenses, setExpenses] = useState<ExpenseRead[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await expenseService.getAll();

        setExpenses(data);
      } catch {
        setError("The data couldn't be loaded");
      } finally {
        setLoading(false);
      }
    };

    loadExpenses();
  }, [offset, trigger]);

  return {
    expenses,
    loading,
    error,
    nexPage: () => setOffset((prev) => prev + LIMIT),
    previousPage: () => setOffset((prev) => Math.max(0, prev - LIMIT)),
    refetch: () => setTrigger((t) => t + 1),
  };
};
