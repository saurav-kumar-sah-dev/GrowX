import mongoose from "mongoose";

const userProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  problem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Problem",
    required: true,
  },
  status: {
    type: String,
    enum: ["not_started", "attempted", "solved", "bookmarked"],
    default: "not_started",
  },
  solvedAt: {
    type: Date,
  },
  attempts: {
    type: Number,
    default: 0,
  },
  timeSpent: {
    type: Number,
    default: 0,
  },
  lastSubmittedCode: {
    type: String,
  },
  lastLanguage: {
    type: String,
  },
  bookmarkedAt: {
    type: Date,
  },
  notes: {
    type: String,
  },
}, { timestamps: true });

userProgressSchema.index({ user: 1, problem: 1 }, { unique: true });
userProgressSchema.index({ user: 1, status: 1 });

export default mongoose.model("UserProgress", userProgressSchema);
