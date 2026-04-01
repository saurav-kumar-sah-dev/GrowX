import express from "express";
import {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  getQuizStats,
} from "../controllers/quiz.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/mutler.js";

const router = express.Router();

router.post("/create",      isAuthenticated, singleUpload, createQuiz);
router.get("/all",          getAllQuizzes);
router.get("/:id",          getQuizById);
router.put("/:id",          isAuthenticated, singleUpload, updateQuiz);
router.delete("/:id",       isAuthenticated, deleteQuiz);
router.get("/:id/stats",    isAuthenticated, getQuizStats);

export default router;
