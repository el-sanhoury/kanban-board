"use client";

import { useEffect, useMemo, useCallback, useSyncExternalStore, useState } from "react";
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

  // Local ordering state so drag & drop can control
  // the exact position of tasks within each column.
  const [orderMap, setOrderMap] = useState<Record<ColumnId, string[]>>({});

  const grouped = useMemo(() => {
    const map: Record<string, Task[]> = {};
    columns.forEach((c) => (map[c.id] = []));
    allTasks.forEach((t) => {
      if (map[t.column]) map[t.column].push(t);
    });
    return map;
  }, [allTasks, columns]);

  // Derived, normalized ordering that stays in sync with the latest
  // tasks while preserving any manual ordering from drag & drop.
  const normalizedOrderMap = useMemo(() => {
    const next: Record<ColumnId, string[]> = { ...orderMap };

    columns.forEach((col) => {
      const currentTasks = grouped[col.id] || [];
      const currentIds = currentTasks.map((t) => t.id);
      const currentIdSet = new Set(currentIds);

      const existing = next[col.id] || [];
      const filteredExisting = existing.filter((id) => currentIdSet.has(id));

      const existingSet = new Set(filteredExisting);
      const toAdd = currentIds.filter((id) => !existingSet.has(id));

      if (!filteredExisting.length && toAdd.length) {
        next[col.id] = currentIds;
      } else if (filteredExisting.length || toAdd.length) {
        next[col.id] = [...filteredExisting, ...toAdd];
      }
    });

    return next;
  }, [columns, grouped, orderMap]);

  const orderedByColumn = useMemo(() => {
    const result: Record<string, Task[]> = {};

    columns.forEach((col) => {
      const colTasks = grouped[col.id] || [];
      const colOrder = normalizedOrderMap[col.id];

      if (!colOrder || !colOrder.length) {
        result[col.id] = colTasks;
        return;
      }

      const byId = new Map(colTasks.map((t) => [t.id, t] as const));
      const ordered: Task[] = [];

      colOrder.forEach((id) => {
        const task = byId.get(id);
        if (task) ordered.push(task);
      });

      const orderedIds = new Set(colOrder);
      const remaining = colTasks.filter((t) => !orderedIds.has(t.id));

      result[col.id] = [...ordered, ...remaining];
    });

    return result;
  }, [columns, grouped, normalizedOrderMap]);

  const onDragEnd = useCallback(
    (result: DropResult) => {
      const { draggableId, destination, source } = result;
      if (!destination) return;

      const sourceColumn = source.droppableId as ColumnId;
      const destColumn = destination.droppableId as ColumnId;

      // Update local ordering so the card visually stays
      // where the user dropped it.
      setOrderMap(() => {
        const next: Record<ColumnId, string[]> = { ...normalizedOrderMap };

        const getIdsForColumn = (colId: ColumnId) => {
          const fromState = next[colId];
          if (fromState && fromState.length) return [...fromState];
          const tasksInCol = grouped[colId] || [];
          return tasksInCol.map((t) => t.id);
        };

        const sourceIds = getIdsForColumn(sourceColumn);
        const destIds =
          sourceColumn === destColumn
            ? sourceIds
            : getIdsForColumn(destColumn);

        const [movedId] = sourceIds.splice(source.index, 1);
        if (!movedId) return normalizedOrderMap;

        if (sourceColumn === destColumn) {
          sourceIds.splice(destination.index, 0, movedId);
          return { ...next, [sourceColumn]: sourceIds };
        }

        destIds.splice(destination.index, 0, movedId);
        return {
          ...next,
          [sourceColumn]: sourceIds,
          [destColumn]: destIds,
        };
      });

      const task = allTasks.find((t) => t.id === draggableId);
      if (!task || task.column === destColumn) return;

      updateTask.mutate({ id: task.id, column: destColumn });
    },
    [allTasks, grouped, normalizedOrderMap, updateTask],
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
        sx={(theme) => ({
          display: "flex",
          gap: 3,
          p: 3,
          overflowX: "auto",
          alignItems: "flex-start",
          minHeight: "calc(100vh - 64px)",
          background:
            theme.palette.mode === "dark"
              ? "radial-gradient(circle at top left, #1e293b 0, #020617 55%)"
              : "transparent",
        })}
      >
        {columns.map((col) => (
          <BoardColumn
            key={col.id}
            column={col}
            tasks={orderedByColumn[col.id] || []}
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
            borderColor: "rgba(148,163,184,0.45)",
            color: "rgba(148,163,184,0.85)",
            "&:hover": {
              borderColor: "rgba(226,232,240,0.9)",
              color: "rgba(226,232,240,1)",
              bgcolor: "rgba(15,23,42,0.35)",
            },
          }}
        >
          <AddIcon />
        </IconButton>
      </Box>
    </DragDropContext>
  );
}
