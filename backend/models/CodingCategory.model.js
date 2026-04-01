import mongoose from "mongoose";

const codingCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
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
  icon: {
    type: String,
    default: "Code",
  },
  color: {
    type: String,
    default: "#D4A853",
  },
  problems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Problem",
  }],
  order: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  problemCount: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

export default mongoose.model("CodingCategory", codingCategorySchema);
