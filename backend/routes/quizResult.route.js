import express from "express";
import {
  saveQuizResult,
  getUserQuizResults,
  getAllQuizResults,
  getQuizResultById,
  deleteQuizResult,
} from "../controllers/quizResult.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.post("/save",        isAuthenticated, saveQuizResult);
router.get("/user",         isAuthenticated, getUserQuizResults);
router.get("/all",          isAuthenticated, getAllQuizResults);
router.get("/:id",          isAuthenticated, getQuizResultById);
router.delete("/:id",       isAuthenticated, deleteQuizResult);

export default router;
