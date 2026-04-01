import express from "express";
import { 
  createCategory, 
  getAllCategories, 
  getCategoryById, 
  getCategoryByName,
  updateCategory, 
  deleteCategory, 
  toggleCategoryStatus,
  seedCategories 
} from "../controllers/category.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

// Public routes
router.get("/all", getAllCategories);
router.get("/name/:name", getCategoryByName);
router.get("/:id", getCategoryById);

// Admin routes (protected)
router.post("/create", isAuthenticated, createCategory);
router.put("/update/:id", isAuthenticated, updateCategory);
router.patch("/toggle/:id", isAuthenticated, toggleCategoryStatus);
router.delete("/delete/:id", isAuthenticated, deleteCategory);
router.post("/seed", isAuthenticated, seedCategories);

export default router;
