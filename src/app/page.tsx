"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import KanbanBoard from "@/components/KanbanBoard";
import TaskDialog from "@/components/TaskDialog";
import DeleteDialog from "@/components/DeleteDialog";
import ColumnDialog from "@/components/ColumnDialog";
import { useCreateTask, useUpdateTask, useDeleteTask } from "@/hooks/useTasks";
import { useColumnsStore } from "@/store/columns";
import type { Task, ColumnId, Priority } from "@/types/task";

export default function Home() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Task | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);
  const [defaultColumn, setDefaultColumn] = useState<ColumnId>("todo");
  const [colDialogOpen, setColDialogOpen] = useState(false);

  const addColumn = useColumnsStore((s) => s.addColumn);
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const openCreate = (columnId: string) => {
    setEditTarget(null);
    setDefaultColumn(columnId as ColumnId);
    setDialogOpen(true);
  };

  const openEdit = (task: Task) => {
    setEditTarget(task);
    setDefaultColumn(task.column);
    setDialogOpen(true);
  };

  const handleSave = (data: {
    title: string;
    description: string;
    priority: Priority;
    column: ColumnId;
  }) => {
    if (editTarget) {
      updateTask.mutate(
        { id: editTarget.id, ...data },
        { onSuccess: () => setDialogOpen(false) },
      );
    } else {
      createTask.mutate(data, {
        onSuccess: () => setDialogOpen(false),
      });
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteTask.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  };

  const handleAddColumn = (data: { title: string; color: string }) => {
    const id = data.title.toLowerCase().replace(/\s+/g, "-");
    addColumn({ id, title: data.title, color: data.color });
  };

  return (
    <Box component="main" sx={{ minHeight: "calc(100vh - 64px)" }}>
      <KanbanBoard
        onEdit={openEdit}
        onDelete={setDeleteTarget}
        onAdd={openCreate}
        onAddColumn={() => setColDialogOpen(true)}
      />

      <TaskDialog
        open={dialogOpen}
        task={editTarget}
        defaultColumn={defaultColumn}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        loading={createTask.isPending || updateTask.isPending}
      />

      <DeleteDialog
        open={!!deleteTarget}
        taskTitle={deleteTarget?.title}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleteTask.isPending}
      />

      <ColumnDialog
        open={colDialogOpen}
        onClose={() => setColDialogOpen(false)}
        onSave={handleAddColumn}
      />
    </Box>
  );
}
