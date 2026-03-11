"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import AddIcon from "@mui/icons-material/Add";
import { Droppable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";
import type { Task, Column } from "@/types/task";

interface Props {
  column: Column;
  tasks: Task[];
  loading?: boolean;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onAdd: (columnId: string) => void;
}

export default function BoardColumn({
  column,
  tasks,
  loading,
  onEdit,
  onDelete,
  onAdd,
}: Props) {
  return (
    <Box
      sx={(theme) => ({
        minWidth: 260,
        flex: "1 1 260px",
        display: "flex",
        flexDirection: "column",
        maxHeight: "calc(100vh - 140px)",
        bgcolor:
          theme.palette.mode === "dark"
            ? "rgba(15,23,42,0.9)"
            : "oklch(92.5% 0.005 214.3)",
        borderRadius: 2.5,
        p: 1,
        border: "1px solid",
        borderColor:
          theme.palette.mode === "dark"
            ? "rgba(148,163,184,0.25)"
            : "rgba(15,23,42,0.04)",
      })}
    >
      <Box
        sx={{ px: 0.5, pb: 1.5, display: "flex", alignItems: "center", gap: 1 }}
      >
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            bgcolor: column.color,
          }}
        />
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 700,
            fontSize: "0.72rem",
            letterSpacing: 1,
          }}
        >
          {column.title}
        </Typography>
        <Typography
          variant="caption"
          sx={(theme) => ({
            fontWeight: 600,
            fontSize: "0.72rem",
            bgcolor:
              theme.palette.mode === "dark"
                ? "rgba(148,163,184,0.18)"
                : "oklch(96.3% 0.002 197.1)",
            width: 20,
            height: 20,
            textAlign: "center",
            borderRadius: "50%",
          })}
        >
          {tasks.length}
        </Typography>
      </Box>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{
              flex: 1,
              overflowY: "auto",
              px: 0.5,
              pb: 1,
              minHeight: 60,
              bgcolor: snapshot.isDraggingOver
                ? "rgba(76,110,245,0.04)"
                : "transparent",
              borderRadius: 1,
              transition: "background-color 0.2s",
            }}
          >
            {loading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <Skeleton
                  key={i}
                  variant="rounded"
                  height={100}
                  sx={{ mb: 1.5, borderRadius: 2 }}
                />
              ))
            ) : tasks.length === 0 ? (
              <Typography
                variant="body2"
                color="inherit"
                sx={(theme) => ({
                  textAlign: "center",
                  py: 3,
                  fontSize: "0.8rem",
                  color:
                    theme.palette.mode === "dark"
                      ? "rgba(148,163,184,0.7)"
                      : "rgba(0,0,0,0.35)",
                })}
              >
                No tasks
              </Typography>
            ) : (
              tasks.map((task, i) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={i}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>

      <Button
        startIcon={<AddIcon sx={{ fontSize: 16 }} />}
        onClick={() => onAdd(column.id)}
        sx={(theme) => ({
          mt: 0.5,
          mx: 0.5,
          py: 1,
          color:
            theme.palette.mode === "dark"
              ? "rgba(226,232,240,0.8)"
              : "rgba(51, 48, 48, 0.7)",
          fontWeight: 500,
          fontSize: "0.78rem",
          textTransform: "none",
          justifyContent: "center",
          borderRadius: 2,
          border: "1px dashed",
          borderColor:
            theme.palette.mode === "dark"
              ? "rgba(148,163,184,0.5)"
              : "rgba(51, 48, 48, 0.17)",
          "&:hover": {
            bgcolor:
              theme.palette.mode === "dark"
                ? "rgba(148,163,184,0.12)"
                : "rgba(255,255,255,0.8)",
            borderColor:
              theme.palette.mode === "dark"
                ? "rgba(226,232,240,0.8)"
                : "rgba(51, 48, 48, 0.35)",
            color:
              theme.palette.mode === "dark"
                ? "rgba(226,232,240,0.95)"
                : "rgba(0,0,0,0.7)",
          },
        })}
      >
        Add task
      </Button>
    </Box>
  );
}
