"use client";

import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

const PRESET_COLORS = [
  "#4c6ef5",
  "#f59f00",
  "#f76707",
  "#37b24d",
  "#e03131",
  "#ae3ec9",
  "#1098ad",
  "#d6336c",
];

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: { title: string; color: string }) => void;
}

export default function ColumnDialog({ open, onClose, onSave }: Props) {
  const [title, setTitle] = useState("");
  const [color, setColor] = useState(PRESET_COLORS[0]);

  const handleEnter = () => {
    setTitle("");
    setColor(PRESET_COLORS[0]);
  };

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSave({ title: title.trim().toUpperCase(), color });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      TransitionProps={{ onEnter: handleEnter }}
    >
      <DialogTitle sx={{ fontWeight: 600 }}>New Column</DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
          pt: "16px !important",
        }}
      >
        <TextField
          label="Column name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
          required
          fullWidth
          size="small"
        />
        <Box>
          <Box sx={{ fontSize: "0.8rem", color: "text.secondary", mb: 1 }}>
            Color
          </Box>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {PRESET_COLORS.map((c) => (
              <Box
                key={c}
                onClick={() => setColor(c)}
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  bgcolor: c,
                  cursor: "pointer",
                  border:
                    color === c ? "2px solid #1a1a2e" : "2px solid transparent",
                  transition: "border-color 0.15s",
                  "&:hover": { opacity: 0.8 },
                }}
              />
            ))}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!title.trim()}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
