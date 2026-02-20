// Main task board — fetches tasks, manages filters,
//          handles create/edit/delete with modals and stats.
//
// DATA FLOW:
//   useQuery   → fetches tasks from backend → stores in cache
//   useMutation → sends create/edit/delete to backend
//   invalidateQueries → refreshes cache after every mutation
// ============================================================

import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import api from "../../api/api";
import { ITask, TaskPayload, TaskStatus } from "../../types";
import TaskItem from "./TaskItem";
import TaskForm from "./TaskForm";
import Modal from "../UI/Modal";

// Backend may return tasks in two shapes — we handle both
type TasksResponse = {
  tasks?: ITask[];
};

// Filter buttons at top of the board
// "all" shows every task, others filter by status
const statusFilters: Array<{ value: "all" | TaskStatus; label: string }> = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

// Response Normalizer
// Backend might return plain array OR { tasks: [...] }
// This function always gives us a simple ITask[] to work with
const getTasksFromResponse = (responseData: unknown): ITask[] => {
  // Case 1: raw array response
  if (Array.isArray(responseData)) return responseData as ITask[];

  // Case 2: wrapped in { tasks: [...] } object
  if (
    responseData &&
    typeof responseData === "object" &&
    "tasks" in responseData &&
    Array.isArray((responseData as TasksResponse).tasks)
  ) {
    return (responseData as TasksResponse).tasks as ITask[];
  }

  // Case 3: unexpected shape — safe empty default
  return [];
};

const TaskList: React.FC = () => {
  // queryClient lets us manually refresh cached data after mutations
  const queryClient = useQueryClient();

  // Modal and UI State
  const [editingTask, setEditingTask] = useState<ITask | null>(null);
  // null = create mode | ITask object = edit mode

  const [showForm, setShowForm] = useState(false);

  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  const [activeFilter, setActiveFilter] = useState<"all" | TaskStatus>("all");

  //  Fetch Tasks
  // useQuery automatically:
  //   → fetches on component mount
  //   → caches result with key ["tasks"]
  //   → re-fetches when window regains focus
  //   → provides isLoading and isError states automatically
  const {
    data: tasks = [],
    isLoading,
    isError,
  } = useQuery<ITask[]>({
    queryKey: ["tasks"], // cache key — invalidateQueries uses this
    queryFn: async () => {
      // api.get adds Authorization: Bearer <token> automatically
      const res = await api.get("/tasks");
      return getTasksFromResponse(res.data);
    },
  });

  // Create / Edit Mutation
  // useMutation is for operations that CHANGE data (POST, PUT, DELETE)
  // Unlike useQuery it does NOT run automatically
  // We call mutation.mutate() to trigger it
  const mutation = useMutation({
    mutationFn: async (taskData: TaskPayload) => {
      if (editingTask) {
        // EDIT MODE — PUT with task ID in URL
        return api.put(`/tasks/${editingTask._id}`, taskData);
      }
      // CREATE MODE — POST to create new task
      return api.post("/tasks", taskData);
    },
    onSuccess: () => {
      // Tell React Query the ["tasks"] cache is now stale
      // This triggers automatic re-fetch → list updates instantly
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setShowForm(false); // close modal
      setEditingTask(null); // reset to create mode for next open
      toast.success(editingTask ? "Task updated!" : "Task created!");
    },
    onError: () => {
      toast.error("Unable to save task");
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => api.delete(`/tasks/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setDeletingTaskId(null); // close confirm modal
      toast.success("Task deleted!");
    },
    onError: () => {
      toast.error("Unable to delete task");
    },
  });

  //  Event Handlers

  // Called by TaskForm onSubmit — fires create or edit mutation
  const handleSubmit = (taskData: TaskPayload) => {
    mutation.mutate(taskData);
  };

  // Called by TaskItem Delete button — opens confirm modal
  // We store ID here, confirm button then calls confirmDelete
  const handleDelete = (id: string) => {
    setDeletingTaskId(id);
  };

  // Called when user clicks Confirm Delete in the modal
  const confirmDelete = () => {
    if (!deletingTaskId) return;
    deleteMutation.mutate(deletingTaskId);
  };

  // Called by TaskItem Edit button — pre-fills form + opens modal
  const handleEdit = (task: ITask) => {
    setEditingTask(task); // pass task to TaskForm for pre-filling
    setShowForm(true); // open the modal
  };

  // Called by Add New Task button — opens modal in create mode
  const handleOpenCreate = () => {
    setEditingTask(null); // null = create mode, no pre-fill
    setShowForm(true);
  };

  // Client Side Filtering
  // Filter tasks without extra API call
  // "all" shows everything, others match by status field
  const filteredTasks =
    activeFilter === "all"
      ? tasks
      : tasks.filter((task) => task.status === activeFilter);

  // Dashboard Stats
  // Always computed from FULL tasks array not filtered view
  // So stats show totals regardless of active filter
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const pendingTasks = tasks.filter((t) => t.status === "pending").length;

  // Render
  return (
    <section className="space-y-5">
      {/* TOP CARD — header, filters, stats */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-sky-100 bg-white/90 p-5 shadow-sm backdrop-blur"
      >
        {/* Title + Add New Task button */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Task Board</h2>
            <p className="text-sm text-slate-500">
              Create, edit, and track your work in one place.
            </p>
          </div>

          <button
            className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-700"
            onClick={handleOpenCreate}
          >
            Add New Task
          </button>
        </div>

        {/* Filter buttons — clicking updates activeFilter state */}
        <div className="mt-4 flex flex-wrap gap-2">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                activeFilter === filter.value
                  ? "bg-blue-700 text-white" // active filter style
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Stats cards — always show totals from full task list */}
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Total Tasks
            </p>
            <p className="text-2xl font-semibold text-slate-900">
              {totalTasks}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-green-50 px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-green-700">
              Completed
            </p>
            <p className="text-2xl font-semibold text-green-800">
              {completedTasks}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-amber-50 px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-amber-700">
              Pending
            </p>
            <p className="text-2xl font-semibold text-amber-800">
              {pendingTasks}
            </p>
          </div>
        </div>
      </motion.div>

      {/* CREATE / EDIT MODAL */}
      <Modal
        isOpen={showForm}
        title={editingTask ? "Update Task" : "Add Task"}
        onClose={() => {
          setShowForm(false);
          setEditingTask(null);
        }}
      >
        <TaskForm
          onSubmit={handleSubmit}
          onClose={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
          task={editingTask || undefined}
          isSubmitting={mutation.isPending}
        />
      </Modal>

      {/* DELETE CONFIRM MODAL */}
      <Modal
        isOpen={Boolean(deletingTaskId)}
        title="Confirm Delete"
        onClose={() => setDeletingTaskId(null)}
      >
        <p className="text-sm text-slate-600">
          Are you sure you want to delete this task? This action cannot be
          undone.
        </p>
        <div className="mt-5 flex gap-2">
          <button
            onClick={confirmDelete}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Confirm Delete
          </button>
          <button
            onClick={() => setDeletingTaskId(null)}
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Cancel
          </button>
        </div>
      </Modal>

      {/* TASK LIST — conditional rendering based on fetch state */}
      {isLoading ? (
        // Loading state while useQuery fetches
        <div className="rounded-xl border border-sky-100 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-sky-200 border-t-sky-600" />
          <p className="mt-3 text-sm text-slate-500">Loading tasks...</p>
        </div>
      ) : isError ? (
        // Error state if API call failed
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-800 shadow-sm">
          Failed to load tasks. Please refresh and try again.
        </div>
      ) : filteredTasks.length === 0 ? (
        // Empty state when no tasks match filter
        <div className="rounded-xl border border-sky-100 bg-white p-8 text-center shadow-sm">
          <p className="text-slate-700">No tasks found for this filter.</p>
          <p className="mt-1 text-sm text-slate-500">
            Click "Add New Task" to create your first task.
          </p>
        </div>
      ) : (
        // Task grid — one TaskItem per filtered task
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filteredTasks.map((task) => (
            <TaskItem
              key={task._id} // unique key for React list rendering
              task={task} // full task data for display
              onEdit={handleEdit} // opens edit modal with this task
              onDelete={handleDelete} // opens delete confirm with this ID
            />
          ))}
        </div>
      )}

      {/* INLINE ERROR BANNER — if save or delete mutation fails */}
      {(mutation.isError || deleteMutation.isError) && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Task action failed. Please try again.
        </div>
      )}
    </section>
  );
};

export default TaskList;
