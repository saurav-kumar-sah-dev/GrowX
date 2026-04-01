import express from "express";
import {
    login,
    logout,
    register,
    googleAuth,
    verifyEmail,
    resendVerificationEmail,
    forgotPassword,
    verifyOtp,
    resetPassword,
    updateProfile,
    getAllUsers,
    getUserById,
    deleteUser,
    toggleUserStatus,
    testEmail,
    verifyUser,
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import multer from "multer";
import { singleUpload } from "../middlewares/mutler.js";

const multiUpload = multer({ storage: multer.memoryStorage() }).fields([
    { name: "file",   maxCount: 1 },
    { name: "resume", maxCount: 1 },
]);

const router = express.Router();

// ── Test Email (for debugging) ─────────────────────────────────────────────────
router.post("/test-email", testEmail);

// ── Auth ───────────────────────────────────────────────────────────────────────
router.post("/register",                  singleUpload, register);
router.post("/login",                     login);
router.post("/google",                    googleAuth);
router.get ("/verify-email",              verifyEmail);
router.post("/resend-verification-email", resendVerificationEmail);
router.get ("/logout",                    logout);
router.get ("/verify-user", isAuthenticated, verifyUser);

// ── Password Reset (OTP flow) ──────────────────────────────────────────────────
router.post("/forgot-password",           forgotPassword);  // step 1: send OTP
router.post("/verify-otp",                verifyOtp);       // step 2: verify OTP
router.post("/reset-password",            resetPassword);   // step 3: set new password

// ── Profile ────────────────────────────────────────────────────────────────────
router.post("/profile/update", isAuthenticated, multiUpload, updateProfile);

// ── Admin — User Management ────────────────────────────────────────────────────
router.get   ("/all",                isAuthenticated, getAllUsers);
router.delete("/delete/:id",         isAuthenticated, deleteUser);
router.patch ("/toggle-status/:id",  isAuthenticated, toggleUserStatus);
router.get   ("/:id",                isAuthenticated, getUserById);

export default router;