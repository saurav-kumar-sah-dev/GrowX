import express from "express";
import {
  addTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus
} from "../controllers/taskController.js";

const router = express.Router();

// -----------------------
// Task CRUD Endpoints
// -----------------------

// Create a new task
router.post("/add", addTask);

// Get all tasks
router.get("/get", getTasks);

// Get a single task by ID
router.get("/get/:id", getTaskById);

// Update task by ID
router.put("/update/:id", updateTask);

// Delete task by ID
router.delete("/delete/:id", deleteTask);

// Update task status & position (for drag & drop)
router.put("/update-status/:id", updateTaskStatus);

export default router;
