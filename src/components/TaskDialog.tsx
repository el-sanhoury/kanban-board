"use client";

import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import {
  PRIORITY_CONFIG,
  type ColumnId,
  type Priority,
  type Task,
} from "@/types/task";
import { useColumnsStore } from "@/store/columns";

interface Props {
  open: boolean;
  task?: Task | null;
  defaultColumn?: ColumnId;
  onClose: () => void;
  onSave: (data: {
    title: string;
    description: string;
    priority: Priority;
    column: ColumnId;
  }) => void;
  loading?: boolean;
}

export default function TaskDialog({
  open,
  task,
  defaultColumn = "todo",
  onClose,
  onSave,
  loading,
}: Props) {
  const columns = useColumnsStore((s) => s.columns);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [column, setColumn] = useState<ColumnId>("todo");

  const handleEnter = () => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setPriority(task.priority);
      setColumn(task.column);
    } else {
      setTitle("");
      setDescription("");
      setPriority("medium");
      setColumn(defaultColumn);
    }
  };

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      description: description.trim(),
      priority,
      column,
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      TransitionProps={{ onEnter: handleEnter }}
    >
      <DialogTitle sx={{ fontWeight: 600 }}>
        {task ? "Edit Task" : "New Task"}
      </DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
          pt: "16px !important",
        }}
      >
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
          required
          fullWidth
          size="small"
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={3}
          fullWidth
          size="small"
        />
        <TextField
          label="Priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          select
          fullWidth
          size="small"
        >
          {(Object.keys(PRIORITY_CONFIG) as Priority[]).map((p) => (
            <MenuItem key={p} value={p}>
              {PRIORITY_CONFIG[p].label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Column"
          value={column}
          onChange={(e) => setColumn(e.target.value as ColumnId)}
          select
          fullWidth
          size="small"
        >
          {columns.map((c) => (
            <MenuItem key={c.id} value={c.id}>
              {c.title}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!title.trim() || loading}
        >
          {task ? "Save" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
