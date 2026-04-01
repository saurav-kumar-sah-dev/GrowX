import express from "express";
import { saveJob, unsaveJob, getSavedJobs } from "../controllers/savedJob.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.post("/save", isAuthenticated, saveJob);
router.delete("/unsave/:jobId", isAuthenticated, unsaveJob);
router.get("/user", isAuthenticated, getSavedJobs);

export default router;
