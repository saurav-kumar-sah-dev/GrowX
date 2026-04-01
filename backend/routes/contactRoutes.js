import express from "express";
import { createContact } from "../controllers/contactController.js";

const router = express.Router();

// POST /api/contact - create a contact
router.post("/", createContact);

export default router;
