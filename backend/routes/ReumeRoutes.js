import express from "express";
import {
  createResume,
  getAllResumes,
  getResumeById,
  updateResume,
  deleteResume,
  getMyResumes,
  uploadResume,
} from "../controllers/ResumeController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import multer from "multer";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", isAuthenticated, createResume);
router.post("/upload", isAuthenticated, upload.single("file"), uploadResume);
router.get("/", getAllResumes);                          // admin: all resumes
router.get("/my", isAuthenticated, getMyResumes);       // user: own resumes
router.get("/:id", getResumeById);
router.put("/update/:id", isAuthenticated, updateResume);
router.delete("/:id", isAuthenticated, deleteResume);

export default router;
