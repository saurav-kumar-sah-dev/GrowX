import mongoose from "mongoose";

const testResultSchema = new mongoose.Schema({
  testCase: {
    input: String,
    expectedOutput: String
  },
  passed: { type: Boolean, default: false },
  actualOutput: String,
  error: String,
  executionTime: Number,
  memoryUsed: Number
}, { _id: false });

const submissionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    problem: { type: mongoose.Schema.Types.ObjectId, ref: "Problem", required: true },
    code: { type: String, required: true },
    language: { type: String, required: true },
    status: { type: String, enum: ["accepted", "wrong_answer", "runtime_error", "error"], default: "error" },
    passedCount: { type: Number, default: 0 },
    totalCount: { type: Number, default: 0 },
    testResults: [testResultSchema],
    isFirstAccept: { type: Boolean, default: false },
    executionTime: Number,
    memory: Number,
    solved: { type: Boolean, default: false },
    error: String
  },
  { timestamps: true }
);

submissionSchema.index({ user: 1, problem: 1 });
submissionSchema.index({ user: 1 });

export const Submission = mongoose.model("Submission", submissionSchema);
