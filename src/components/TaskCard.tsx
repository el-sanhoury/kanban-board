"use client";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import EditIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import { Draggable } from "@hello-pangea/dnd";
import { PRIORITY_CONFIG, type Task } from "@/types/task";

interface Props {
  task: Task;
  index: number;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export default function TaskCard({ task, index, onEdit, onDelete }: Props) {
  const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          sx={{
            mb: 1.5,
            cursor: "grab",
            bgcolor: "#fff",
            border: "1px solid",
            borderColor: snapshot.isDragging ? "#4c6ef5" : "rgba(0,0,0,0.08)",
            boxShadow: snapshot.isDragging
              ? "0 8px 24px rgba(0,0,0,0.15)"
              : "0 1px 3px rgba(0,0,0,0.06)",
            borderRadius: 2,
            transition: "border-color 0.2s, box-shadow 0.2s",
            "&:hover .task-actions": { opacity: 1 },
            "&:hover": { borderColor: "rgba(0,0,0,0.15)" },
          }}
        >
          <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
            >
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  lineHeight: 1.5,
                  fontSize: "0.82rem",
                }}
              >
                {task.title}
              </Typography>
              <Stack
                className="task-actions"
                direction="row"
                spacing={0}
                sx={{
                  opacity: 0,
                  transition: "opacity 0.15s",
                  ml: 1,
                  flexShrink: 0,
                }}
              >
                <IconButton
                  size="small"
                  onClick={() => onEdit(task)}
                  sx={{ p: 0.4 }}
                >
                  <EditIcon sx={{ fontSize: 16 }} />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => onDelete(task)}
                  sx={{ p: 0.4 }}
                >
                  <DeleteIcon sx={{ fontSize: 16, color: "#aaa" }} />
                </IconButton>
              </Stack>
            </Stack>
            {task.description && (
              <Typography
                variant="body2"
                sx={{
                  mt: 0.5,
                  color: "#8c8c8c",
                  fontSize: "0.75rem",
                  lineHeight: 1.5,
                }}
              >
                {task.description}
              </Typography>
            )}
            <Chip
              label={priority.label}
              size="small"
              sx={{
                mt: 1.5,
                height: 22,
                fontSize: "0.65rem",
                fontWeight: 700,
                color: priority.color,
                bgcolor: priority.bg,
                borderRadius: 1,
                letterSpacing: 0.3,
              }}
            />
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
}
