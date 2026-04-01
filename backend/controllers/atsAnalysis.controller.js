import { ATSAnalysis } from "../models/atsAnalysis.model.js";

const technicalSkillsKeywords = ['javascript', 'python', 'java', 'react', 'node', 'sql', 'aws', 'docker', 'kubernetes', 'git', 'api', 'database', 'mongodb', 'typescript', 'angular', 'vue', 'express', 'django', 'spring', 'html', 'css', 'redux', 'graphql', 'rest', 'agile', 'scrum', 'ci/cd', 'jenkins', 'terraform', 'linux', 'azure', 'gcp'];
const softSkillsKeywords = ['leadership', 'communication', 'teamwork', 'problem-solving', 'analytical', 'creative', 'organized', 'detail-oriented', 'collaborative', 'adaptable', 'motivated', 'initiative'];
const actionVerbs = ['developed', 'created', 'managed', 'led', 'implemented', 'designed', 'built', 'improved', 'optimized', 'achieved', 'increased', 'reduced', 'launched', 'delivered', 'coordinated', 'analyzed', 'established', 'streamlined'];

const analyzeFormatting = (resumeText) => {
  const issues = [];
  let score = 100;

  if (resumeText.length < 200) {
    issues.push('Resume is too short (minimum 200 characters recommended)');
    score -= 30;
  }
  if (resumeText.length > 5000) {
    issues.push('Resume is too long (keep it under 5000 characters)');
    score -= 20;
  }
  if (!/[A-Z]/.test(resumeText)) {
    issues.push('Use proper capitalization');
    score -= 10;
  }
  if ((resumeText.match(/\n/g) || []).length < 5) {
    issues.push('Add more line breaks for better readability');
    score -= 15;
  }

  return { score: Math.max(0, score), issues };
};

const analyzeContent = (resumeText) => {
  const lower = resumeText.toLowerCase();
  const hasContactInfo = /email|phone|linkedin|github/.test(lower);
  const hasSummary = /summary|objective|profile|about/.test(lower);
  const hasExperience = /experience|work|employment|position/.test(lower);
  const hasEducation = /education|degree|university|college|school/.test(lower);
  const hasSkills = /skills|technologies|tools|proficient/.test(lower);

  let score = 0;
  if (hasContactInfo) score += 20;
  if (hasSummary) score += 15;
  if (hasExperience) score += 25;
  if (hasEducation) score += 20;
  if (hasSkills) score += 20;

  return { score, hasContactInfo, hasSummary, hasExperience, hasEducation, hasSkills };
};

const analyzeKeywords = (resumeText) => {
  const lower = resumeText.toLowerCase();
  const technicalSkills = technicalSkillsKeywords.filter(skill => lower.includes(skill));
  const softSkills = softSkillsKeywords.filter(skill => lower.includes(skill));
  const foundActionVerbs = actionVerbs.filter(verb => lower.includes(verb));

  const score = Math.min(100, (technicalSkills.length * 3) + (softSkills.length * 2) + (foundActionVerbs.length * 2));

  return { score, technicalSkills, softSkills, actionVerbs: foundActionVerbs };
};

const analyzeReadability = (resumeText) => {
  const words = resumeText.match(/\b[a-zA-Z]+\b/g) || [];
  const wordCount = words.length;
  const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / wordCount || 0;

  let score = 100;
  if (wordCount < 100) score -= 30;
  if (wordCount > 1000) score -= 20;
  if (avgWordLength > 7) score -= 15;

  return { score: Math.max(0, score), wordCount, avgWordLength: Math.round(avgWordLength * 10) / 10 };
};

const analyzeOptimization = (resumeText, jobDescription) => {
  const lower = resumeText.toLowerCase();
  const hasQuantifiableAchievements = /\d+%|\d+\+|increased|decreased|improved|reduced/.test(lower);
  const hasRelevantExperience = /years|experience|worked|developed/.test(lower);
  
  const resumeWords = lower.match(/\b[a-z]{3,}\b/g) || [];
  const jobWords = jobDescription.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
  const commonWords = resumeWords.filter(word => jobWords.includes(word));
  const keywordDensity = (commonWords.length / resumeWords.length) * 100;

  let score = 0;
  if (hasQuantifiableAchievements) score += 40;
  if (hasRelevantExperience) score += 30;
  if (keywordDensity > 10) score += 30;

  return { score, hasQuantifiableAchievements, hasRelevantExperience, keywordDensity: Math.round(keywordDensity * 10) / 10 };
};

const analyzeATS = (resumeText, jobDescription) => {
  const resumeLower = resumeText.toLowerCase();
  const jobLower = jobDescription.toLowerCase();

  const jobWords = jobLower.match(/\b[a-z]{3,}\b/g) || [];
  const keywords = [...new Set(jobWords)].filter(
    word => !['the', 'and', 'for', 'with', 'this', 'that', 'from', 'have', 'will', 'are', 'was', 'were', 'you', 'your', 'our', 'can', 'all', 'but', 'not'].includes(word)
  );

  const matchedKeywords = [];
  const missingKeywords = [];

  keywords.forEach(keyword => {
    if (resumeLower.includes(keyword)) {
      matchedKeywords.push(keyword);
    } else {
      missingKeywords.push(keyword);
    }
  });

  const keywordScore = Math.round((matchedKeywords.length / keywords.length) * 100);

  // Detailed analysis
  const formatting = analyzeFormatting(resumeText);
  const content = analyzeContent(resumeText);
  const keywordAnalysis = analyzeKeywords(resumeText);
  const readability = analyzeReadability(resumeText);
  const optimization = analyzeOptimization(resumeText, jobDescription);

  // Calculate overall score
  const overallScore = Math.round(
    (keywordScore * 0.3) +
    (formatting.score * 0.15) +
    (content.score * 0.2) +
    (keywordAnalysis.score * 0.15) +
    (readability.score * 0.1) +
    (optimization.score * 0.1)
  );

  // Generate suggestions
  const suggestions = [];
  if (overallScore < 50) suggestions.push('Major improvements needed - focus on adding relevant keywords');
  if (overallScore < 70) suggestions.push('Good start - enhance with more specific achievements');
  if (keywordScore < 60) suggestions.push('Add more keywords from the job description');
  if (!content.hasContactInfo) suggestions.push('Include contact information (email, phone, LinkedIn)');
  if (!content.hasSummary) suggestions.push('Add a professional summary at the top');
  if (!optimization.hasQuantifiableAchievements) suggestions.push('Include numbers and metrics (e.g., "Increased sales by 25%")');
  if (formatting.issues.length > 0) suggestions.push(...formatting.issues);
  if (keywordAnalysis.technicalSkills.length < 5) suggestions.push('Add more technical skills relevant to the role');
  if (keywordAnalysis.actionVerbs.length < 5) suggestions.push('Use more action verbs to describe your achievements');
  if (readability.wordCount < 100) suggestions.push('Expand your resume with more details about your experience');

  return {
    score: overallScore,
    matchedKeywords,
    missingKeywords: missingKeywords.slice(0, 30),
    suggestions: suggestions.slice(0, 10),
    detailedAnalysis: {
      formatting,
      content,
      keywords: keywordAnalysis,
      readability,
      optimization,
    },
  };
};

export const checkATS = async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({ message: "Resume and job description are required", success: false });
    }

    const analysis = analyzeATS(resumeText, jobDescription);

    const atsAnalysis = await ATSAnalysis.create({
      user: req.id,
      resumeText,
      jobDescription,
      ...analysis,
    });

    return res.status(201).json({ 
      message: "ATS analysis completed", 
      analysis: atsAnalysis, 
      success: true 
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const getAllATS = async (req, res) => {
  try {
    const records = await ATSAnalysis.find()
      .populate('user', 'fullname email profile')
      .select('-resumeText -jobDescription')
      .sort({ createdAt: -1 });
    return res.status(200).json({ records, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Server error', success: false });
  }
};

export const deleteATS = async (req, res) => {
  try {
    const record = await ATSAnalysis.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ message: 'Record not found', success: false });
    return res.status(200).json({ message: 'Deleted successfully', success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Server error', success: false });
  }
};

export const getUserATSHistory = async (req, res) => {
  try {
    const history = await ATSAnalysis.find({ user: req.id })
      .select('-resumeText -jobDescription')
      .sort({ createdAt: -1 })
      .limit(10);
    
    return res.status(200).json({ history, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const uploadResumeFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded", success: false });
    }

    const resumeText = req.file.buffer.toString('utf-8');
    const jobDescription = "General job requirements including technical skills, experience, education, and professional achievements.";

    const analysis = analyzeATS(resumeText, jobDescription);

    const atsAnalysis = await ATSAnalysis.create({
      user: req.id,
      resumeText,
      jobDescription,
      ...analysis,
    });

    return res.status(201).json({ 
      message: "Resume analyzed successfully", 
      analysis: atsAnalysis, 
      success: true 
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};
