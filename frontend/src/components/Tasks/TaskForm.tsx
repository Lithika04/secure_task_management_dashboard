//single form that handle both create and edit
//FLOW:
//   User fills form → clicks submit → onSubmit(taskData)
//   -> TaskList receives data → calls API (POST or PUT)


import React, { useState, useEffect } from "react";
import { ITask, TaskPayload, TaskStatus } from "../../types";
import { motion } from "framer-motion";

interface TaskFormProps {
  task?: ITask;          // undefined = create, ITask object = edit
  onSubmit: (taskData: TaskPayload) => void; // passes data up to TaskList
  onClose: () => void;   
  isSubmitting?: boolean; // true while API call is running
}

// Status dropdown options
// Using array of objects makes it easy to add new statuses later
const statusOptions: Array<{ value: TaskStatus; label: string }> = [
  { value: "pending", label: "Pending" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

const TaskForm: React.FC<TaskFormProps> = ({
  task,
  onSubmit,
  onClose,
  isSubmitting = false,
}) => {
  // Local State
  // Initialize from task prop if editing, or defaults if creating
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [status, setStatus] = useState<TaskStatus>(task?.status || "pending");

  // dueDate from backend is full ISO string "2025-01-15T00:00:00.000Z"
  // input type="date" needs only "YYYY-MM-DD" so we slice first 10 chars
  const [dueDate, setDueDate] = useState(
    task?.dueDate ? task.dueDate.slice(0, 10) : ""
  );

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return; // guard against empty title

    // Pass clean data up to TaskList
    // undefined fields are NOT sent to backend (cleaner request)
    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      status,
      dueDate: dueDate || undefined,
    });
  };

  // Sync Effect 
  // If user clicks Edit on a DIFFERENT task while form is open,
  // this re-syncs all fields to the new task's data.
  // Without this, old task data would remain in the form.
 useEffect(() => {
  if (task) {
    setTitle(task.title);
    setDescription(task.description || "");
    setStatus(task.status);
    setDueDate(task.dueDate || "");
  } else {
    setTitle("");
    setDescription("");
    setStatus("pending");
    setDueDate("");
  }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [task?._id]);// runs every time task prop changes

  return (
    // Fade in when form appears inside Modal
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

      {/* Dynamic heading based on mode */}
      <h3 className="mb-5 text-xl font-semibold text-slate-900">
        {task ? "Edit Task" : "Create New Task"}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Title
          </label>
          <input
            type="text"
            placeholder="e.g. Finish quarterly report"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none ring-0 transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            placeholder="Add details for this task (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-24 w-full rounded-md border border-slate-300 px-3 py-2 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Due Date
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none ring-0 transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
            // cast needed: e.target.value is string, we need TaskStatus type
            className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2 pt-2">
          {/* Submit — disabled while API call runs */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {/* Dynamic label: Saving... / Update Task / Add Task */}
            {isSubmitting ? "Saving..." : task ? "Update Task" : "Add Task"}
          </button>

          {/* Cancel — type="button" prevents form submission */}
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-amber-300 hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-70"
          >
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default TaskForm;