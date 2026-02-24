import { NextRequest, NextResponse } from "next/server";

export interface TaskData {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  column: string;
}

// ── In-memory store (persists within a single serverless invocation) ──
const initialTasks: TaskData[] = [
  { id: "3", title: "Performance audit", description: "Lighthouse scores and bundle analysis", priority: "low", column: "todo" },
  { id: "4", title: "Notification system", description: "Toast notifications and in-app alerts", priority: "medium", column: "in-progress" },
  { id: "5", title: "User settings page", description: "Profile editing, preferences, and account management", priority: "low", column: "in-progress" },
  { id: "6", title: "Authentication flow", description: "Implement login, signup, and password reset screens", priority: "high", column: "todo" },
  { id: "7", title: "File upload component", description: "Drag and drop file upload with preview", priority: "medium", column: "todo" },
  { id: "8", title: "Dark mode support", description: "Add theme toggle and CSS variable switching", priority: "medium", column: "review" },
  { id: "9", title: "Dashboard layout", description: "Build responsive sidebar and main content area", priority: "medium", column: "review" },
  { id: "10", title: "Design system tokens", description: "Set up color palette, typography, and spacing scales", priority: "high", column: "done" },
  { id: "11", title: "sanhouri", description: "lorem", priority: "low", column: "in-progress" },
  { id: "12", title: "mohamed", description: "", priority: "medium", column: "magdey" },
];

// Global variable so the array survives across requests in the same process
declare global {
  var __kanbanTasks: TaskData[] | undefined;
}

function getTasks(): TaskData[] {
  if (!globalThis.__kanbanTasks) {
    globalThis.__kanbanTasks = [...initialTasks];
  }
  return globalThis.__kanbanTasks;
}

// ── GET /api/tasks ──────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = Number(searchParams.get("_page") || "1");
  const limit = Number(searchParams.get("_limit") || "20");
  const query = searchParams.get("q")?.toLowerCase();

  let tasks = getTasks();

  // Full-text search across title & description
  if (query) {
    tasks = tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query)
    );
  }

  const total = tasks.length;
  const start = (page - 1) * limit;
  const paged = tasks.slice(start, start + limit);

  return NextResponse.json(paged, {
    headers: { "x-total-count": String(total) },
  });
}

// ── POST /api/tasks ─────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const body = await request.json();
  const tasks = getTasks();

  const newTask: TaskData = {
    id: Math.random().toString(36).substring(2, 9),
    title: body.title,
    description: body.description ?? "",
    priority: body.priority ?? "medium",
    column: body.column ?? "todo",
  };

  tasks.push(newTask);
  return NextResponse.json(newTask, { status: 201 });
}
