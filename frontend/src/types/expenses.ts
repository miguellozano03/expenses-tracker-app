// =========================================================
// CATEGORY TYPES
// =========================================================

export interface CategoryCreate {
  name: string;
}

export interface CategoryUpdate {
  name?: string | null;
}

export interface CategoryRead {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

// =========================================================
// EXPENSE TYPES
// =========================================================

export interface ExpenseCreate {
  amount: number;
  date?: string;
  description?: string | null;
  category_id?: string | null;
}

export interface ExpenseUpdate {
  amount?: number | null;
  date?: string | null;
  description?: string | null;
  category_id?: string | null;
}

export interface ExpenseRead {
  id: string;
  amount: number;
  date: string;
  description?: string | null;
  category?: CategoryRead | null;
  created_at: string;
  updated_at: string;
}
