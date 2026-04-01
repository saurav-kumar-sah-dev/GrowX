import express from "express";
import {
  createProblem,
  getAllProblems,
  getProblemBySlug,
  getProblemById,
  updateProblem,
  deleteProblem,
  getProblemsStats,
  seedProblems,
  createCategory,
  getAllCategories,
  getCategoryBySlug,
  deleteCategory,
} from "../controllers/codingController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = express.Router();

// ============ PROBLEM ROUTES ============

// Public routes
router.get("/", getAllProblems);
router.get("/stats", getProblemsStats);
router.get("/categories", getAllCategories);
router.get("/category/:slug", getCategoryBySlug);
router.get("/:slug", getProblemBySlug);
router.get("/id/:id", getProblemById);

// Protected routes (Admin only)
router.post("/", isAuthenticated, isAdmin, createProblem);
router.put("/:id", isAuthenticated, isAdmin, updateProblem);
router.delete("/:id", isAuthenticated, isAdmin, deleteProblem);
router.post("/seed", isAuthenticated, isAdmin, seedProblems);

// ============ CATEGORY ROUTES ============

router.post("/category", isAuthenticated, isAdmin, createCategory);
router.delete("/category/:id", isAuthenticated, isAdmin, deleteCategory);

export default router;
