import { useEffect, useState } from "react";
import { categoryService } from "@/service/categoryService";
import type {
  CategoryRead,
  CategoryCreate,
  CategoryUpdate,
} from "@/types/expenses";

export const useCategories = () => {
  const [categories, setCategories] = useState<CategoryRead[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await categoryService.getAll();

        setCategories(data);
      } catch {
        setError("Categories couldn't be loaded");
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const createCategory = async (payload: CategoryCreate) => {
    const category = await categoryService.create(payload);

    setCategories((prev) => [...prev, category]);
  };

  const updateCategory = async (id: string, payload: CategoryUpdate) => {
    const updated = await categoryService.update(id, payload);

    setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));
  };

  const deleteCategory = async (id: string) => {
    await categoryService.delete(id);

    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  return {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};
