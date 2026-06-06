import api from "@/api/axiosInstance";
import type {
  ExpenseCreate,
  ExpenseRead,
  ExpenseUpdate,
} from "@/types/expenses";

export const expenseService = {
  async create(payload: ExpenseCreate): Promise<ExpenseRead> {
    const { data } = await api.post("/expenses/", payload);
    return data;
  },

  async getAll(limit = 10, offset = 0): Promise<ExpenseRead[]> {
    const { data } = await api.get("/expenses/", {
      params: {
        limit,
        offset,
      },
    });
    return data;
  },

  async update(id: string, payload: ExpenseUpdate) {
    const { data } = await api.patch(`/expenses/${id}`, payload);
    return data;
  },

  async delete(id: string) {
    await api.delete(`/expenses/${id}`);
  },
};
