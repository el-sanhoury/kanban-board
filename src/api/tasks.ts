import axios from "axios";
import type { Task } from "@/types/task";

// Use relative URL so it works both locally and on Vercel
const api = axios.create({ baseURL: "/api" });

const LIMIT = 6;

export interface TasksPage {
  data: Task[];
  nextPage: number | null;
}

export async function fetchTasks(page: number, search?: string): Promise<TasksPage> {
  const params: Record<string, string | number> = { _page: page, _limit: LIMIT };
  if (search) params.q = search;

  const res = await api.get<Task[]>("/tasks", { params });
  const total = Number(res.headers["x-total-count"] || 0);

  return {
    data: res.data,
    nextPage: page * LIMIT < total ? page + 1 : null,
  };
}

export async function createTask(task: Omit<Task, "id">): Promise<Task> {
  const { data } = await api.post<Task>("/tasks", task);
  return data;
}

export async function updateTask({ id, ...patch }: Partial<Task> & { id: string }): Promise<Task> {
  const { data } = await api.patch<Task>(`/tasks/${id}`, patch);
  return data;
}

export async function deleteTask(id: string): Promise<void> {
  await api.delete(`/tasks/${id}`);
}
