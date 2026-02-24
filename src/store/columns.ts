import { create } from "zustand";
import { persist } from "zustand/middleware";
import { COLUMNS, type Column } from "@/types/task";

interface ColumnsState {
  columns: Column[];
  addColumn: (col: Column) => void;
  removeColumn: (id: string) => void;
}

export const useColumnsStore = create<ColumnsState>()(
  persist(
    (set) => ({
      columns: [...COLUMNS],
      addColumn: (col) => set((s) => ({ columns: [...s.columns, col] })),
      removeColumn: (id) =>
        set((s) => ({ columns: s.columns.filter((c) => c.id !== id) })),
    }),
    { name: "kanban-columns" },
  ),
);
