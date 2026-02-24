"use client";

import { useEffect, useMemo, useCallback, useSyncExternalStore } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import Alert from "@mui/material/Alert";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import BoardColumn from "./BoardColumn";
import { useTasks, useUpdateTask } from "@/hooks/useTasks";
import { type ColumnId, type Task } from "@/types/task";
import { useColumnsStore } from "@/store/columns";

interface Props {
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onAdd: (columnId: string) => void;
  onAddColumn: () => void;
}

export default function KanbanBoard({
  onEdit,
  onDelete,
  onAdd,
  onAddColumn,
}: Props) {
  const columns = useColumnsStore((s) => s.columns);
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useTasks();
  const updateTask = useUpdateTask();

  /*
   * SSR hydration fix: @hello-pangea/dnd cannot render during SSR.
   * useSyncExternalStore returns false on the server, true on the client,
   * so the DnD tree is only mounted after hydration completes.
   */
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const allTasks = useMemo(
    () => data?.pages.flatMap((p) => p.data) ?? [],
    [data],
  );

  const grouped = useMemo(() => {
    const map: Record<string, Task[]> = {};
    columns.forEach((c) => (map[c.id] = []));
    allTasks.forEach((t) => {
      if (map[t.column]) map[t.column].push(t);
    });
    return map;
  }, [allTasks, columns]);

  const onDragEnd = useCallback(
    (result: DropResult) => {
      const { draggableId, destination } = result;
      if (!destination) return;

      const newColumn = destination.droppableId as ColumnId;
      const task = allTasks.find((t) => t.id === draggableId);
      if (!task || task.column === newColumn) return;

      updateTask.mutate({ id: task.id, column: newColumn });
    },
    [allTasks, updateTask],
  );

  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isError) {
    return (
      <Alert severity="error" sx={{ m: 3 }}>
        Failed to load tasks. Make sure json-server is running on port 3001.
      </Alert>
    );
  }

  if (!mounted) return null;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Box
        sx={{
          display: "flex",
          gap: 3,
          p: 3,
          overflowX: "auto",
          alignItems: "flex-start",
          minHeight: "calc(100vh - 64px)",
        }}
      >
        {columns.map((col) => (
          <BoardColumn
            key={col.id}
            column={col}
            tasks={grouped[col.id] || []}
            loading={isLoading}
            onEdit={onEdit}
            onDelete={onDelete}
            onAdd={onAdd}
          />
        ))}
        <IconButton
          onClick={onAddColumn}
          sx={{
            mt: 0.5,
            width: 44,
            height: 44,
            flexShrink: 0,
            border: "2px dashed",
            borderColor: "rgba(0,0,0,0.15)",
            color: "rgba(0,0,0,0.35)",
            "&:hover": {
              borderColor: "rgba(0,0,0,0.3)",
              color: "rgba(0,0,0,0.55)",
              bgcolor: "rgba(0,0,0,0.04)",
            },
          }}
        >
          <AddIcon />
        </IconButton>
      </Box>
    </DragDropContext>
  );
}
