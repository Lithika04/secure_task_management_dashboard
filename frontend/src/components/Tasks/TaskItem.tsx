
//  Displays one task as a card with status badge,
//          timestamps, and edit/delete action buttons.
//
// THIS IS A PRESENTATIONAL COMPONENT:
//   → receives data and callbacks as props
//   → does NOT fetch data or call APIs
//   → all actions passed UP to TaskList via callbacks


import React from "react";
import { format, formatDistanceToNowStrict } from "date-fns";
import { motion } from "framer-motion";
import { ITask, TaskStatus } from "../../types";

interface TaskItemProps {
  task: ITask;                      // full task object to display
  onEdit: (task: ITask) => void;    // called when Edit button clicked
  onDelete: (id: string) => void;   // called when Delete button clicked
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit, onDelete }) => {

  // Status Styling Maps 
  // Object lookup is cleaner than if/else chains
  // Maps each status value to Tailwind color classes

  // Background + text color for the status badge
  const statusStyles: Record<TaskStatus, string> = {
    pending: "bg-amber-100 text-amber-800 border-amber-200",
    "in-progress": "bg-blue-100 text-blue-800 border border-blue-200",
  completed: "bg-emerald-100 text-emerald-800 border border-emerald-200",
  };

  // Human readable labels for each status
  const statusLabel: Record<TaskStatus, string> = {
    pending: "Pending",
    "in-progress": "In Progress",
    completed: "Completed",
  };

  // Simple text icons — no icon library needed
  const statusIcon: Record<TaskStatus, string> = {
    pending: "●",
    "in-progress": "●",
    completed: "●",
  };

  return (
    // layout: animates position when tasks reorder after filter change
    // initial/animate: card slides up and fades in when first rendered
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="rounded-xl border border-sky-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="space-y-3">

        {/* HEADER — title + status badge */}
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-lg font-semibold text-slate-900">
            {task.title}
          </h3>

          {/* Status badge — color from statusStyles lookup */}
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[task.status]}`}
          >
            {statusIcon[task.status]} {statusLabel[task.status]}
          </span>
        </div>

        {/* DESCRIPTION — only shown if task has one */}
        {task.description && (
          <p className="text-sm leading-6 text-slate-600">
            {task.description}
          </p>
        )}

        {/* CREATED AT — formatted with date-fns */}
        {/* Output: "15 Jan 2025, 02:30 PM" */}
        <p className="text-xs text-slate-400">
          Created {format(new Date(task.createdAt), "dd MMM yyyy, hh:mm a")}
        </p>

        {/* UPDATED AT — relative time */}
        {/* Falls back to createdAt if updatedAt missing */}
        <p className="text-xs text-slate-500">
          Updated{" "}
          {formatDistanceToNowStrict(
            new Date(task.updatedAt || task.createdAt),
            { addSuffix: true } // adds "ago" at the end
          )}
        </p>

        {/* DUE DATE — only shown if set */}
        {task.dueDate && (
          <p className="text-xs text-slate-500">
            Due {format(new Date(task.dueDate), "dd MMM yyyy")}
          </p>
        )}
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex shrink-0 gap-2 self-start mt-3">

        {/* EDIT — passes full task object to TaskList's handleEdit */}
        {/* TaskList will pre-fill the form with this task's data */}
        <button
          onClick={() => onEdit(task)}
          className="rounded-md border border-blue-600 px-3 py-1.5 text-sm font-medium text-blue-700 transition hover:bg-blue-50"
        >
          Edit
        </button>
        {/* DELETE — passes only task ID to TaskList's handleDelete */}
        {/* TaskList will show confirm modal before actually deleting */}
        <button
          onClick={() => onDelete(task._id)}
          className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </motion.div>
  );
};

export default TaskItem;