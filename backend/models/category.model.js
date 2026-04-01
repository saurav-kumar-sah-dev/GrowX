import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  icon: {
    type: String,
    default: "Briefcase"
  },
  color: {
    type: String,
    default: "#D4A853"
  },
  topics: [{
    type: String,
    trim: true
  }],
  projects: [{
    type: String,
    trim: true
  }],
  description: {
    type: String,
    default: ""
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

categorySchema.index({ isActive: 1 });
categorySchema.index({ order: 1 });

export const Category = mongoose.model("Category", categorySchema);
