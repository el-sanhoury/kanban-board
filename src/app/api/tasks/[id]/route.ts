import { NextRequest, NextResponse } from "next/server";

// Re-use the same global store declared in the parent route
declare global {
  var __kanbanTasks: import("../route").TaskData[] | undefined;
}

function getTasks() {
  // The parent route's GET will always be called first, seeding the array.
  // But guard anyway so this file works in isolation during cold starts.
  return globalThis.__kanbanTasks ?? [];
}

// ── PATCH /api/tasks/:id ────────────────────────────────────────────────
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const tasks = getTasks();
  const idx = tasks.findIndex((t) => t.id === id);

  if (idx === -1) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  const body = await request.json();
  tasks[idx] = { ...tasks[idx], ...body, id }; // never overwrite id
  return NextResponse.json(tasks[idx]);
}

// ── DELETE /api/tasks/:id ───────────────────────────────────────────────
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const tasks = getTasks();
  const idx = tasks.findIndex((t) => t.id === id);

  if (idx === -1) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  tasks.splice(idx, 1);
  return new NextResponse(null, { status: 204 });
}
