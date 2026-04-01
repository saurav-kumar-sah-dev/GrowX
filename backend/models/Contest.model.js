import mongoose from "mongoose";

const contestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    default: "",
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  problems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Problem",
  }],
  participants: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    score: { type: Number, default: 0 },
    joinedAt: { type: Date },
  }],
  maxParticipants: {
    type: Number,
    default: 1000,
  },
  registrationRequired: {
    type: Boolean,
    default: false,
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
  isRated: {
    type: Boolean,
    default: false,
  },
  ratingChange: {
    type: Boolean,
    default: false,
  },
  prize: {
    type: String,
  },
  rules: [{
    type: String,
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  status: {
    type: String,
    enum: ["upcoming", "ongoing", "ended"],
    default: "upcoming",
  },
}, { timestamps: true });

contestSchema.index({ slug: 1 });
contestSchema.index({ startTime: 1, endTime: 1 });
contestSchema.index({ status: 1 });

export default mongoose.model("Contest", contestSchema);
