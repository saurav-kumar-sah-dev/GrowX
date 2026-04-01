import Task from "../models/Task.js";
import { EVENTS, emitEvent } from "../utils/socketEvents.js";

/**
 * @desc Add a new task
 * @route POST /api/tasks/add
 */
export const addTask = async (req, res) => {
  try {
    const { title, description, status, date } = req.body;

    // Validate date (optional but recommended)
    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const task = await Task.create({ title, description, status, date });

    // Emit event to all connected clients
    emitEvent(req.io, EVENTS.TASK_ADDED, task);

    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc Get all tasks
 * @route GET /api/tasks/get
 */
export const getTasks = async (req, res) => {
  try {
    // Sort tasks by date (newest first)
    const tasks = await Task.find().sort({ date: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Get a task by ID
 * @route GET /api/tasks/get/:id
 */
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Update a task by ID
 * @route PUT /api/tasks/update/:id
 */
export const updateTask = async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return updated document
    });

    if (!updatedTask) return res.status(404).json({ message: "Task not found" });

    emitEvent(req.io, EVENTS.TASK_UPDATED, updatedTask);

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Delete a task by ID
 * @route DELETE /api/tasks/delete/:id
 */
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    emitEvent(req.io, EVENTS.TASK_DELETED, task._id);

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Update task status (Removed position handling)
 * @route PUT /api/tasks/update-status/:id
 */
export const updateTaskStatus = async (req, res) => {
  try {
    const { status, date } = req.body; // include date if needed

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { status, date },
      { new: true }
    );

    if (!updatedTask) return res.status(404).json({ message: "Task not found" });

    emitEvent(req.io, EVENTS.STATUS_UPDATED, updatedTask);

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
