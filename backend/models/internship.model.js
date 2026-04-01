import mongoose from "mongoose";

const internshipSchema = new mongoose.Schema({
  applicant: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  gender: { type: String },
  college: { type: String },
  course: { type: String },
  year: { type: String },
  city: { type: String },
  state: { type: String },
  category: { type: String, required: true },
  experience: { type: String },
  duration: { type: String },
  linkedin: { type: String },
  github: { type: String },
  portfolio: { type: String },
  resume: { type: String },
  message: { type: String },
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  
  // Advanced Fields
  coverLetter: { type: String },
  availability: { type: String, enum: ["Immediately", "Within 1 Week", "Within 2 Weeks", "Within 1 Month", "Flexible"] },
  expectedStartDate: { type: Date },
  preferredShift: { type: String, enum: ["Morning", "Afternoon", "Evening", "Night", "Flexible"] },
  languageProficiency: [{
    language: String,
    proficiency: { type: String, enum: ["Beginner", "Intermediate", "Advanced", "Native"] }
  }],
  certifications: [{ type: String }],
  projects: [{
    title: String,
    description: String,
    link: String
  }],
  workSamples: [{ type: String }],
  referralSource: { type: String, enum: ["LinkedIn", "Website", "Friend", "Social Media", "Job Portal", "College", "Other"] },
  
  // Review & Rating (after completion)
  rating: { type: Number, min: 1, max: 5, default: null },
  review: { type: String, default: null },
  reviewDate: { type: Date, default: null },
  
  // Admin assigned fields
  assignedMentor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  startDate: { type: Date },
  endDate: { type: Date },
  completionStatus: { type: String, enum: ["Not Started", "In Progress", "Completed", "Terminated"], default: "Not Started" },
  certificateIssued: { type: Boolean, default: false },
  certificateUrl: { type: String },
  
  // Interview tracking
  interviewScheduled: { type: Boolean, default: false },
  interviewDate: { type: Date },
  interviewFeedback: { type: String },
  
  // Notes (admin only)
  adminNotes: { type: String },
  lastUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

internshipSchema.index({ email: 1, category: 1 });
internshipSchema.index({ status: 1 });
internshipSchema.index({ createdAt: -1 });
internshipSchema.index({ category: 1 });

export default mongoose.model("Internship", internshipSchema);
