import api from "@/api/axiosInstance";
import type {
  CategoryCreate,
  CategoryRead,
  CategoryUpdate,
} from "@/types/expenses";

export const categoryService = {
  async create(payload: CategoryCreate): Promise<CategoryRead> {
    const { data } = await api.post("/categories/", payload);
    return data;
  },

  async getAll(): Promise<CategoryRead[]> {
    const { data } = await api.get("/categories/");
    return data;
  },

  async update(id: string, payload: CategoryUpdate): Promise<CategoryRead> {
    const { data } = await api.patch(`/categories/${id}`, payload);
    return data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/categories/${id}`);
  },
};
