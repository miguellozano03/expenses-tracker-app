import { useState } from "react";
import { Pencil, Trash2, Check, X, Plus } from "lucide-react";
import { useCategories } from "../hooks/useCategories";

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

  if (loading) return <p className="text-sm text-gray-400 py-4">Loading...</p>;

  return (
    <div className="flex flex-col gap-4 pt-2">
      <div className="flex gap-2">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          placeholder="New category name"
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm"
        />
        <button
          onClick={handleCreate}
          disabled={creating || !newName.trim()}
          className="flex items-center gap-1 bg-black text-white px-4 py-2.5 rounded-xl
            text-sm font-medium disabled:opacity-50"
        >
          <Plus size={16} /> Add
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {categories.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">
            No categories yet
          </p>
        )}
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center justify-between px-4 py-3 border border-gray-100 rounded-xl"
          >
            {editingId === cat.id ? (
              <input
                autoFocus
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleUpdate(cat.id)}
                className="flex-1 text-sm border-b border-gray-300 outline-none mr-2 py-0.5"
              />
            ) : deletingId === cat.id ? (
              <span className="text-sm text-red-500 flex-1">
                Delete "{cat.name}"?
              </span>
            ) : (
              <span className="text-sm font-medium flex-1">{cat.name}</span>
            )}

            <div className="flex items-center gap-1 shrink-0">
              {editingId === cat.id ? (
                <>
                  <button
                    onClick={() => handleUpdate(cat.id)}
                    className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg"
                  >
                    <Check size={16} />
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg"
                  >
                    <X size={16} />
                  </button>
                </>
              ) : deletingId === cat.id ? (
                <>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg text-xs font-medium px-2"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setDeletingId(null)}
                    className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg text-xs font-medium px-2"
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
                    className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => setDeletingId(cat.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
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
