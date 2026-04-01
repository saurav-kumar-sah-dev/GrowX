import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: Number,
        default: null,           // optional for Google signup
    },
    password: {
        type: String,
        default: null,           // null for Google-only accounts
    },
    role: {
        type: String,
        enum: ['student', 'recruiter', 'admin'],
        required: true
    },
    profile: {
        bio:                { type: String },
        skills:             [{ type: String }],
        resume:             { type: String },
        resumeOriginalName: { type: String },
        company:            { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
        profilePhoto:       { type: String, default: "" }
    },
    isActive: {
        type: Boolean,
        default: true
    },

    // ── Email Verification ─────────────────────────────────────────────────────
    isEmailVerified:         { type: Boolean, default: false },
    emailVerificationToken:  { type: String,  default: null  },
    emailVerificationExpiry: { type: Date,    default: null  },

    // ── Google OAuth ───────────────────────────────────────────────────────────
    googleId:     { type: String, default: null },
    authProvider: { type: String, enum: ["local", "google"], default: "local" },

    // ── Password Reset OTP ─────────────────────────────────────────────────────
    resetOtp:         { type: String, default: null },   // 6-digit OTP
    resetOtpExpires:  { type: Date,   default: null },   // expires in 10 min
    resetOtpVerified: { type: Boolean, default: false }, // true after OTP verified

}, { timestamps: true });

export const User = mongoose.model('User', userSchema);