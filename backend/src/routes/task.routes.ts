
import express from "express";
import { createTask, getMyTasks, updateTask, deleteTask } from "../controllers/task.controller";
import { protect } from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validate.middleware";
import { createTaskSchema, updateTaskSchema } from "../validators/task.schemas";

const router = express.Router()

// Route to create a new task (protected)
router.post("/", protect, validateRequest(createTaskSchema), createTask) // Only authenticated users can create tasks

// Route to get all tasks of the logged-in user (protected)
router.get("/", protect, getMyTasks) // Fetch tasks belonging to the authenticated user

// Route to update a task by ID (protected)
router.put("/:id", protect, validateRequest(updateTaskSchema), updateTask) // Only task owner can update

// Route to delete a task by ID (protected)
router.delete("/:id", protect,deleteTask) // Only task owner can delete

export default router;
