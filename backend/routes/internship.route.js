import express from "express";
import multer from "multer";
import { applyInternship, getAllInternships, updateInternshipStatus, deleteInternship } from "../controllers/internship.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import Internship from "../models/internship.model.js";
import { User } from "../models/user.model.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/apply", isAuthenticated, upload.single("resume"), applyInternship);
router.get("/all", isAuthenticated, getAllInternships);                        // admin
router.get("/my", isAuthenticated, async (req, res) => {                     // user: own applications
  try {
    const user = await User.findById(req.id).select('email');
    const applications = await Internship.find({
      $or: [{ applicant: req.id }, { email: user?.email }]
    }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
router.patch("/status/:id", isAuthenticated, updateInternshipStatus);         // admin
router.delete("/:id", isAuthenticated, deleteInternship);                     // admin

export default router;
