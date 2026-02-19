// CURD MAP:
// createTask --> POST  /api/tasks
//getTask     --> GET   /api/tasks
//updateTask  --> PUT   /api/tasks/:id
//deleteTask  --> DELETE /api/tasks/:id
import { Response, NextFunction } from "express";
import Task from "../models/task.model";
import { AuthRequest } from "../middlewares/auth.middleware";
import { CreateTaskInput, UpdateTaskInput } from "../validators/task.schemas";
// CREATE TASK — POST /api/tasks
export const createTask = async (
  req: AuthRequest,   // AuthRequest has req.userId from the JWT middleware
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Destructure and type the request body using Zod-validated input
    const { title, description, status  } = req.body as CreateTaskInput;
    // Guard: title is required — return early if missing
    if (!title) {
      res.status(400).json({ message: "Title is required" });
      return;
    }
    // Create a new Task document and link it to the logged-in user.
    // req.userId comes from the auth middleware that decoded the JWT.
    const task = new Task({
      title,
      description,
      status,
      user: req.userId, // this is HOW the task is tied to THIS user only
    });
    // Save to MongoDB
    await task.save();
    // Return 201 Created with the new task object
    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    next(error); // pass to error middleware
  }
};
// GET ALL TASKS — GET /api/tasks
export const getMyTasks = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Find tasks WHERE user field matches the logged-in user's ID.
    // This is the key security filter — never return all tasks globally.
    const tasks = await Task.find({ user: req.userId });
    res.status(200).json({ count: tasks.length, tasks });
  } catch (error) {
    next(error);
  }
};
// UPDATE TASK — PUT /api/tasks/:id
export const updateTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params; // task ID from the URL e.g. /api/tasks/64a2f...
    const { title, description, status } = req.body as UpdateTaskInput;
    // Check if task exists in DB
    const task = await Task.findById(id);
    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }
    // OWNERSHIP CHECK — make sure this task belongs to the logged-in user.
    // Without this, any logged-in user could edit anyone else's task
    if (task.user.toString() !== req.userId) {
      res.status(403).json({ message: "Not authorized to update this task" });
      return;
    }
    // Update only the fields that were provided in the request body.
    // If a field is undefined (not sent), we keep the existing value.
    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (status) task.status = status;
    
    // Save triggers the updatedAt timestamp to update automatically
    await task.save();

    res.status(200).json({ message: "Task updated successfully", task });
  } catch (error) {
    next(error);
  }
};

// DELETE TASK — DELETE /api/tasks/:id
export const deleteTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const task = await Task.findById(req.params.id);

    // Check task exists
    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    // OWNERSHIP CHECK — same as update
    if (task.user.toString() !== req.userId) {
      res.status(403).json({ message: "Not authorized to delete this task" });
      return;
    }

    // deleteOne() removes this specific document from MongoDB
    await task.deleteOne();

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    next(error);
  }
};