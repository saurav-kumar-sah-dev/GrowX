import mongoose from "mongoose";
const { Schema } = mongoose;

const EducationSchema = new Schema({

  institution: String,
  degree: String,
  cgpa: String,
  startDate: Date,
  endDate: Date,
  city: String,

});

const ExperienceSchema = new Schema({
  company: String,
  role: String,
  location: String,
  startDate: Date,
  endDate: Date,
  currentlyWorking: { type: Boolean, default: false },
  descriptions: [String],
});

const ProjectSchema = new Schema({
  title: String,
  link: String,
  createdDate: Date,
  descriptions: [String],
});

const CertificationSchema = new Schema({
  name: String,
  provider: String,
});

const ResumeSchema = new Schema(
  {
    title: String,
    fileUrl: String,
    fileName: String,
    personalInfo: {
      fullName: { type: String },
      title: String,
      email: String,
      phone: String,
      address: String,
      linkedin: String,
      github: String,
      portfolio: String,

    },
    education: [EducationSchema],
    technicalSkills: {
      Languages: [String],
      "Libraries / Frameworks": [String],
      Databases: [String],
      "Cloud Platforms": [String],
      Tools: [String],
      CsFundamentals: [String],
    },
    experience: [ExperienceSchema],
    projects: [ProjectSchema],
    achievements: [String],
    certifications: [CertificationSchema],
    user: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Resume", ResumeSchema);
