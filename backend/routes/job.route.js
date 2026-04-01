import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { 
    postJob, 
    getAllJobs, 
    getJobById, 
    getAdminJobs, 
    updateJob, 
    deleteJob,
    restoreJob,
    getDeletedJobs,
    bulkUpdateStatus,
    toggleFeatured,
    toggleUrgent,
    duplicateJob,
    getJobStats,
    seedInternships
} from "../controllers/job.controller.js";

const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC ROUTES (for students/users)
// ─────────────────────────────────────────────────────────────────────────────
router.route("/get").get(isAuthenticated, getAllJobs);
router.route("/get/:id").get(isAuthenticated, getJobById);

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN ROUTES
// ─────────────────────────────────────────────────────────────────────────────
router.route("/post").post(isAuthenticated, postJob);
router.route("/getadminjobs").get(isAuthenticated, getAdminJobs);
router.route("/getdeleted").get(isAuthenticated, getDeletedJobs);
router.route("/stats").get(isAuthenticated, getJobStats);
router.route("/seed-internships").post(isAuthenticated, seedInternships);

// ─────────────────────────────────────────────────────────────────────────────
// CRUD OPERATIONS
// ─────────────────────────────────────────────────────────────────────────────
router.route("/update/:id").put(isAuthenticated, updateJob);
router.route("/delete/:id").delete(isAuthenticated, deleteJob);
router.route("/restore/:id").patch(isAuthenticated, restoreJob);

// ─────────────────────────────────────────────────────────────────────────────
// BULK OPERATIONS
// ─────────────────────────────────────────────────────────────────────────────
router.route("/bulk-update").patch(isAuthenticated, bulkUpdateStatus);

// ─────────────────────────────────────────────────────────────────────────────
// FEATURE TOGGLES
// ─────────────────────────────────────────────────────────────────────────────
router.route("/toggle-featured/:id").patch(isAuthenticated, toggleFeatured);
router.route("/toggle-urgent/:id").patch(isAuthenticated, toggleUrgent);
router.route("/duplicate/:id").post(isAuthenticated, duplicateJob);

export default router;
