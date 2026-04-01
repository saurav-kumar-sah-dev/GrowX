import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
    recruiter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    scheduledAt: { type: Date, required: true },
    duration: { type: Number, default: 60 }, // minutes
    timezone: { type: String, default: "Asia/Kolkata" },

    status: {
      type: String,
      enum: ["scheduled", "ongoing", "completed", "cancelled", "no-show"],
      default: "scheduled",
    },

    type: {
      type: String,
      enum: ["video", "phone", "in-person", "technical"],
      default: "video",
    },

    roomId: { type: String, unique: true, sparse: true }, // WebRTC room
    meetingLink: { type: String },

    questions: [
      {
        questionId: { type: mongoose.Schema.Types.ObjectId, ref: "QuestionBank" },
        text: String,
        type: { type: String, enum: ["mcq", "subjective", "coding"] },
        answer: String,      // candidate's answer
        score: Number,
        feedback: String,
      },
    ],

    proctoring: {
      faceDetected: { type: Boolean, default: true },
      multipleFacesDetected: { type: Boolean, default: false },
      tabSwitchCount: { type: Number, default: 0 },
      violations: [{ type: String, timestamp: Date }],
      proctoringEnabled: { type: Boolean, default: false },
    },

    recording: {
      enabled: { type: Boolean, default: false },
      url: String,
      duration: Number,
    },

    evaluation: {
      overallScore: { type: Number, min: 0, max: 100 },
      communicationScore: { type: Number, min: 0, max: 100 },
      technicalScore: { type: Number, min: 0, max: 100 },
      confidenceScore: { type: Number, min: 0, max: 100 },
      recommendation: {
        type: String,
        enum: ["strongly-recommend", "recommend", "neutral", "not-recommend", "reject"],
      },
      notes: String,
      evaluatedAt: Date,
    },

    feedback: {
      candidateFeedback: String,
      recruiterFeedback: String,
      candidateRating: { type: Number, min: 1, max: 5 },
      submittedAt: Date,
    },

    chat: [
      {
        sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        message: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],

    emailSent: { type: Boolean, default: false },
    reminderSent: { type: Boolean, default: false },
    startedAt: Date,
    endedAt: Date,
  },
  { timestamps: true }
);

interviewSchema.index({ candidate: 1, scheduledAt: -1 });
interviewSchema.index({ recruiter: 1, scheduledAt: -1 });
interviewSchema.index({ status: 1 });
interviewSchema.index({ roomId: 1 });

export const Interview = mongoose.model("Interview", interviewSchema);