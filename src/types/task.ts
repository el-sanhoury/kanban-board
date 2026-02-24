export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  column: ColumnId;
}

export type Priority = "high" | "medium" | "low";

export type ColumnId = string;

export interface Column {
  id: string;
  title: string;
  color: string;
}

export const COLUMNS: Column[] = [
  { id: "todo", title: "TO DO", color: "#4c6ef5" },
  { id: "in-progress", title: "IN PROGRESS", color: "#f59f00" },
  { id: "review", title: "IN REVIEW", color: "#f76707" },
  { id: "done", title: "DONE", color: "#37b24d" },
];

export const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; bg: string }> = {
  high: { label: "HIGH", color: "#e03131", bg: "#ffe3e3" },
  medium: { label: "MEDIUM", color: "#e8590c", bg: "#fff4e6" },
  low: { label: "LOW", color: "#868e96", bg: "#f1f3f5" },
};
