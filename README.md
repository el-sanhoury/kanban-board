# Kanban Board

A feature-rich, drag-and-drop Kanban task management board built with **Next.js 16**, **Material UI**, **React Query**, and **json-server**.

---

## ✨ Features

- **Drag & Drop** — Move tasks between columns with instant optimistic UI updates
- **CRUD Operations** — Create, edit, and delete tasks via dialogs
- **Dynamic Columns** — Add custom columns with a name and color picker (persisted in localStorage)
- **Search** — Debounced full-text search powered by json-server's `q` parameter
- **Infinite Scroll** — Automatic pagination via `useInfiniteQuery`
- **Priority Badges** — Color-coded HIGH / MEDIUM / LOW labels on every card
- **Responsive Design** — Scales cleanly from desktop to mobile
- **SSR Safe** — Hydration-safe DnD rendering using `useSyncExternalStore`

---

## 🛠 Tech Stack

| Layer | Technology |
<!-- |---|---| -->
| Framework | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| UI | [Material UI v6](https://mui.com/) |
| Drag & Drop | [@hello-pangea/dnd](https://github.com/hello-pangea/dnd) |
| Data Fetching | [TanStack React Query v5](https://tanstack.com/query) |
| HTTP Client | [Axios](https://axios-http.com/) |
| State Management | [Zustand](https://zustand-demo.pmnd.rs/) |
| Mock API | [json-server](https://github.com/typicode/json-server) |
| Language | TypeScript |

---

## 📂 Project Structure

src/
├── api/            # Axios HTTP functions (fetchTasks, createTask, etc.)
├── app/            # Next.js App Router (layout, page, globals.css)
├── components/     # React components
│   ├── BoardColumn.tsx
│   ├── ColumnDialog.tsx
│   ├── DeleteDialog.tsx
│   ├── Header.tsx
│   ├── KanbanBoard.tsx
│   ├── TaskCard.tsx
│   └── TaskDialog.tsx
├── hooks/          # Custom React Query hooks (useTasks, mutations)
├── providers/      # Theme and QueryClient providers
├── store/          # Zustand stores (search, columns)
├── theme/          # MUI theme configuration
└── types/          # TypeScript interfaces and constants

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd kanban-board

# Install dependencies
npm install
```

### Running the App

You need to start **two processes** — the Next.js dev server and the json-server mock API:

```bash
# Terminal 1 — Start the mock API (port 3001)
npm run server

# Terminal 2 — Start the Next.js dev server (port 3000)
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

> **Note:** The json-server must still be running separately for the API to work.

---

## 📡 API

The mock API is powered by `json-server` reading from `db.json` on port **3001**.

| Method | Endpoint | Description |
<!-- |---|---|---| -->
| `GET` | `/tasks?_page=1&_limit=6` | Paginated task list |
| `GET` | `/tasks?q=search` | Full-text search |
| `POST` | `/tasks` | Create a task |
| `PATCH` | `/tasks/:id` | Update a task |
| `DELETE` | `/tasks/:id` | Delete a task |

---

## 🧩 Key Architecture Decisions

- **Optimistic Updates** — `useUpdateTask` applies column changes instantly via React Query's `onMutate`, with automatic rollback on error
- **Infinite Pagination** — `useInfiniteQuery` fetches pages automatically using `x-total-count` from json-server headers
- **SSR Hydration** — `useSyncExternalStore` ensures DnD components only mount client-side, avoiding hydration mismatches
- **Dynamic Columns** — Stored in Zustand with `persist` middleware (localStorage), separate from the server-backed task data

---

## 📜 Available Scripts

| Script | Description |
<!-- |---|---| -->
| `npm run dev` | Start Next.js dev server with Turbopack |
| `npm run build` | Production build |
| `npm start` | Serve production build |
| `npm run server` | Start json-server on port 3001 |
| `npm run lint` | Run ESLint |

---

## 📄 License

MIT
