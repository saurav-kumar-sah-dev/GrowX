import mongoose from "mongoose";

const questionBankSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["mcq", "subjective", "coding"],
      required: true,
    },
    category: {
      type: String,
      enum: [
        "javascript", "python", "java", "cpp", "react", "nodejs",
        "dsa", "system-design", "database", "devops", "hr",
        "behavioral", "aptitude", "general",
      ],
      default: "general",
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    options: [{ text: String, isCorrect: Boolean }], // for MCQ
    sampleAnswer: String,
    explanation: String,
    tags: [String],
    timeLimit: { type: Number, default: 120 }, // seconds
    marks: { type: Number, default: 5 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isActive: { type: Boolean, default: true },
    usageCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

questionBankSchema.index({ category: 1, difficulty: 1 });
questionBankSchema.index({ tags: 1 });

export const QuestionBank = mongoose.model("QuestionBank", questionBankSchema);