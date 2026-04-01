import mongoose from "mongoose";

const atsAnalysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resumeText: {
      type: String,
      required: true,
    },
    jobDescription: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    matchedKeywords: [String],
    missingKeywords: [String],
    suggestions: [String],
    detailedAnalysis: {
      formatting: {
        score: Number,
        issues: [String],
      },
      content: {
        score: Number,
        hasContactInfo: Boolean,
        hasSummary: Boolean,
        hasExperience: Boolean,
        hasEducation: Boolean,
        hasSkills: Boolean,
      },
      keywords: {
        score: Number,
        technicalSkills: [String],
        softSkills: [String],
        actionVerbs: [String],
      },
      readability: {
        score: Number,
        wordCount: Number,
        avgWordLength: Number,
      },
      optimization: {
        score: Number,
        hasQuantifiableAchievements: Boolean,
        hasRelevantExperience: Boolean,
        keywordDensity: Number,
      },
    },
  },
  { timestamps: true }
);

export const ATSAnalysis = mongoose.model("ATSAnalysis", atsAnalysisSchema);
