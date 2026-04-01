import mongoose from "mongoose";

const testCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  expectedOutput: { type: String, required: true },
  isHidden: { type: Boolean, default: false },
  points: { type: Number, default: 10 },
});

const problemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], required: true },
    category: { type: String, required: true },
    tags: [{ type: String }],
    starterCode: { type: Map, of: String, default: {} },
    solution: { type: Map, of: String, default: {} },
    testCases: [testCaseSchema],
    constraints: [{ type: String }],
    examples: [
      {
        input: String,
        output: String,
        explanation: String,
      },
    ],
    supportedLanguages: [
      {
        type: String,
        enum: [
          "javascript", "typescript", "python", "java", "cpp", "c",
          "csharp", "go", "rust", "ruby", "php", "swift", "kotlin",
          "scala", "r", "perl", "haskell", "lua", "sql", "bash",
        ],
        default: ["javascript", "python", "java", "cpp", "c"],
      },
    ],
    hints: [{ type: String }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isPublished: { type: Boolean, default: false },
    totalSubmissions: { type: Number, default: 0 },
    successfulSubmissions: { type: Number, default: 0 },
    acceptanceRate: { type: Number, default: 0 },
  },
  { timestamps: true }
);

problemSchema.index({ slug: 1 });
problemSchema.index({ difficulty: 1 });
problemSchema.index({ category: 1 });
problemSchema.index({ tags: 1 });

problemSchema.pre("save", function (next) {
  if (this.totalSubmissions > 0) {
    this.acceptanceRate = Math.round(
      (this.successfulSubmissions / this.totalSubmissions) * 100
    );
  }
  if (!this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  next();
});

export const Problem = mongoose.model("Problem", problemSchema);
