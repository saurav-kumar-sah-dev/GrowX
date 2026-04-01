import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    status: {
      type: String,
      enum: ["todo", "thisweek", "inprocess", "done"],
      default: "todo",
    },
    date: { type: Date, default: Date.now }, // ✅ Auto-set current date
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
