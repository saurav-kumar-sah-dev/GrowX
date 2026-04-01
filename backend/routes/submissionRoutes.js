import express from "express";
import {
  createSubmission,
  getSubmissions,
  getSubmissionById,
  getUserStats,
  getLeaderboard,
} from "../controllers/submissionController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.post("/", isAuthenticated, createSubmission);
router.get("/", isAuthenticated, getSubmissions);
router.get("/stats", isAuthenticated, getUserStats);
router.get("/leaderboard", getLeaderboard);
router.get("/:id", isAuthenticated, getSubmissionById);

export default router;
