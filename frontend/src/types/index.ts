// ── TaskStatus ────────────────────────────────────────────────
// Union type: a variable of TaskStatus can ONLY be one of these
// three string values. TypeScript will error if you try to assign
// any other string like "done" or "active".
//
// Used in: ITask, TaskPayload, TaskForm, TaskItem, TaskList
export type TaskStatus = "pending" | "in-progress" | "completed";

// ── ITask ─────────────────────────────────────────────────────
// Represents a task object as returned FROM the backend API.
// The "I" prefix is a TypeScript convention for interfaces.
//
// Fields with "?" are optional — they may or may not be present.
// _id is MongoDB's auto-generated document identifier.
export interface ITask {
  _id: string;           // MongoDB ObjectId as string (e.g. "64a2f...")
  title: string;         // task title — always required
  description?: string;  // optional details about the task
  status: TaskStatus;    // always one of the three valid values
  dueDate?: string;      // ISO date string (e.g. "2025-06-15T00:00:00.000Z")
  createdAt: string;     // set by MongoDB automatically on creation
  updatedAt?: string;    // set by MongoDB automatically on every update
}

// ── TaskPayload ───────────────────────────────────────────────
// Represents data we SEND to the backend when creating or
// editing a task. It does NOT include _id, createdAt, updatedAt
// because those are assigned by the backend, not the user.
export interface TaskPayload {
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate?: string;
}