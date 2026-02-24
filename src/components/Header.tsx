"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Box from "@mui/material/Box";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import { useSearchStore } from "@/store/search";
import { useTasks } from "@/hooks/useTasks";

const SearchBox = styled("div")(({ theme }) => ({
  position: "relative",
  display: "flex",
  alignItems: "center",
  border: "1px solid #e0e0e0",
  borderRadius: 8,
  padding: "4px 12px",
  width: 220,
  backgroundColor: "#fff",
  [theme.breakpoints.down("sm")]: {
    width: 140,
    padding: "3px 8px",
  },
}));

export default function Header() {
  const setQuery = useSearchStore((s) => s.setQuery);
  const [value, setValue] = useState("");
  const { data } = useTasks();

  const totalTasks = useMemo(
    () => data?.pages.reduce((sum, p) => sum + p.data.length, 0) ?? 0,
    [data],
  );

  const debounce = useCallback(() => {
    const id = setTimeout(() => setQuery(value), 350);
    return () => clearTimeout(id);
  }, [value, setQuery]);

  useEffect(debounce, [debounce]);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "#fff",
        color: "#1a1a2e",
        borderBottom: "1px solid #eee",
      }}
    >
      <Toolbar sx={{ alignItems: "center" }}>
        <Box
          sx={{
            width: { xs: 28, sm: 38 },
            height: { xs: 28, sm: 38 },
            bgcolor: "#4c6ef5",
            borderRadius: { xs: 1.5, sm: 2 },
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: { xs: "3px", sm: "4px" },
            p: { xs: "5px", sm: "7px" },
            mr: { xs: 1, sm: 1.5 },
            flexShrink: 0,
          }}
        >
          {[0, 1, 2, 3].map((i) => (
            <Box key={i} sx={{ bgcolor: "#fff", borderRadius: 0.8 }} />
          ))}
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            lineHeight: 1, 
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 800,
              letterSpacing: 1.3,
              fontSize: { xs: "0.75rem", sm: "1rem" },
              lineHeight: 1.2,
            }}
          >
            KANBAN BOARD
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              fontSize: { xs: "0.6rem", sm: "0.7rem" },
              marginTop: "-2px"
            }}
          >
            {totalTasks} tasks
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <SearchBox>
          <SearchIcon
            sx={{ color: "#aaa", fontSize: { xs: 15, sm: 18 }, mr: 0.5 }}
          />
          <InputBase
            placeholder="Search tasks..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            sx={{ fontSize: { xs: "0.75rem", sm: "0.85rem" }, flex: 1 }}
          />
        </SearchBox>
      </Toolbar>
    </AppBar>
  );
}
