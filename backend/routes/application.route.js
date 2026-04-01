import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { applyJob, getApplicants, getAppliedJobs, updateStatus, getAllApplications, deleteApplication } from "../controllers/application.controller.js";
 
const router = express.Router();

router.route("/all").get(isAuthenticated, getAllApplications);
router.route("/apply/:id").get(isAuthenticated, applyJob);
router.route("/get").get(isAuthenticated, getAppliedJobs);
router.route("/:id/applicants").get(isAuthenticated, getApplicants);
router.route("/status/:id/update").post(isAuthenticated, updateStatus);
router.route("/:id").delete(isAuthenticated, deleteApplication);
 
 
export default router;

