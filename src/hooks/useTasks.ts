"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  type TasksPage,
} from "@/api/tasks";
import { useSearchStore } from "@/store/search";

const TASKS_KEY = "tasks";

export function useTasks() {
  const search = useSearchStore((s) => s.query);

  // Infinite query: json-server returns x-total-count header for pagination.
  // The search param is part of the queryKey so changing it auto-refetches.
  return useInfiniteQuery<TasksPage>({
    queryKey: [TASKS_KEY, search],
    queryFn: ({ pageParam }) => fetchTasks(pageParam as number, search || undefined),
    initialPageParam: 1,
    getNextPageParam: (last) => last.nextPage,
  });
}

export function useCreateTask() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onSuccess: () => qc.invalidateQueries({ queryKey: [TASKS_KEY] }),
  });
}

export function useUpdateTask() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: updateTask,
    // Optimistic update: immediately reflect column changes in the UI
    // before the PATCH request completes. On error, rollback to the
    // previous snapshot stored in context.
    onMutate: async (updated) => {
      await qc.cancelQueries({ queryKey: [TASKS_KEY] });
      const prev = qc.getQueryData<InfiniteData<TasksPage>>([TASKS_KEY, ""]);

      qc.setQueriesData<InfiniteData<TasksPage>>(
        { queryKey: [TASKS_KEY] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              data: page.data.map((t) =>
                t.id === updated.id ? { ...t, ...updated } : t
              ),
            })),
          };
        }
      );

      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) {
        qc.setQueryData([TASKS_KEY, ""], ctx.prev);
      }
    },
    onSettled: () => qc.invalidateQueries({ queryKey: [TASKS_KEY] }),
  });
}

export function useDeleteTask() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => qc.invalidateQueries({ queryKey: [TASKS_KEY] }),
  });
}
