import { useState } from "react";
import { Pencil, Trash2, Check, X, Plus } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";

export function CategoryManager() {
  const {
    categories,
    loading,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategories();
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    try {
      setCreating(true);
      await createCategory({ name: newName.trim() });
      setNewName("");
    } finally {
      setCreating(false);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editingName.trim()) return;
    await updateCategory(id, { name: editingName.trim() });
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    await deleteCategory(id);
    setDeletingId(null);
  };

  if (loading)
    return (
      <p className="text-sm text-spendly-700 dark:text-dark-muted py-4">
        Loading...
      </p>
    );

  return (
    <div className="flex flex-col gap-4 pt-2 transition-colors duration-200">
      <div className="flex gap-2">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          placeholder="New category name"
          className="flex-1 border border-spendly-200 dark:border-dark-border rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-dark-card text-spendly-900 dark:text-dark-text placeholder:text-spendly-300 dark:placeholder:text-dark-border"
        />
        <button
          onClick={handleCreate}
          disabled={creating || !newName.trim()}
          className="flex items-center gap-1 bg-spendly-800 dark:bg-spendly-600 text-white px-4 py-2.5 rounded-xl
            text-sm font-medium disabled:opacity-50 hover:bg-spendly-900 dark:hover:bg-spendly-700 transition-colors duration-200"
        >
          <Plus size={16} /> Add
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {categories.length === 0 && (
          <p className="text-sm text-spendly-700 dark:text-dark-muted text-center py-4">
            No categories yet
          </p>
        )}
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center justify-between px-4 py-3 border border-spendly-100 dark:border-dark-border rounded-xl bg-white dark:bg-dark-card transition-colors duration-200"
          >
            {editingId === cat.id ? (
              <input
                autoFocus
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleUpdate(cat.id)}
                className="flex-1 text-sm border-b border-spendly-300 dark:border-dark-border outline-none mr-2 py-0.5 bg-white dark:bg-dark-card text-spendly-900 dark:text-dark-text"
              />
            ) : deletingId === cat.id ? (
              <span className="text-sm text-red-500 flex-1">
                Delete "{cat.name}"?
              </span>
            ) : (
              <span className="text-sm font-medium flex-1 text-spendly-900 dark:text-dark-text">
                {cat.name}
              </span>
            )}

            <div className="flex items-center gap-1 shrink-0">
              {editingId === cat.id ? (
                <>
                  <button
                    onClick={() => handleUpdate(cat.id)}
                    className="p-1.5 text-green-600 hover:bg-spendly-50 dark:hover:bg-dark-border rounded-lg transition-colors duration-200"
                  >
                    <Check size={16} />
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="p-1.5 text-spendly-600 dark:text-dark-muted hover:bg-spendly-50 dark:hover:bg-dark-border rounded-lg transition-colors duration-200"
                  >
                    <X size={16} />
                  </button>
                </>
              ) : deletingId === cat.id ? (
                <>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg text-xs font-medium px-2 transition-colors duration-200"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setDeletingId(null)}
                    className="p-1.5 text-spendly-600 dark:text-dark-muted hover:bg-spendly-50 dark:hover:bg-dark-border rounded-lg text-xs font-medium px-2 transition-colors duration-200"
                  >
                    No
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setEditingId(cat.id);
                      setEditingName(cat.name);
                    }}
                    className="p-1.5 text-spendly-600 dark:text-dark-muted hover:text-spendly-900 dark:hover:text-dark-text hover:bg-spendly-50 dark:hover:bg-dark-border rounded-lg transition-colors duration-200"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => setDeletingId(cat.id)}
                    className="p-1.5 text-spendly-600 dark:text-dark-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/20 rounded-lg transition-colors duration-200"
                  >
                    <Trash2 size={15} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
