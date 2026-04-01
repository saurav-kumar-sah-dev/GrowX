import { Quiz } from "../models/quiz.model.js";
import { QuizResult } from "../models/quizResult.model.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";

// ── helpers ──────────────────────────────────────────────
const uploadImage = async (file) => {
  const dataUri = getDataUri(file);
  const res = await cloudinary.uploader.upload(dataUri.content, { folder: "quiz_images" });
  return res.secure_url;
};

const deleteImage = async (url) => {
  if (!url || url.startsWith("data:")) return;
  try {
    const publicId = url.split("/").slice(-2).join("/").replace(/\.[^/.]+$/, "");
    await cloudinary.uploader.destroy(publicId);
  } catch {}
};

// ── CREATE ────────────────────────────────────────────────
export const createQuiz = async (req, res) => {
  try {
    const { title, description, category, level, timeLimit, questions } = req.body;

    if (!title || !category || !questions || questions.length === 0) {
      return res.status(400).json({ message: "Title, category, and questions are required", success: false });
    }

    let categoryImage = "";
    if (req.file) {
      categoryImage = await uploadImage(req.file);
    }

    const parsedQuestions = typeof questions === "string" ? JSON.parse(questions) : questions;
    const totalMarks = parsedQuestions.reduce((sum, q) => sum + (q.marks || 1), 0);

    const quiz = await Quiz.create({
      title, description, category, categoryImage,
      level, timeLimit, totalMarks,
      questions: parsedQuestions,
      createdBy: req.id,
    });

    return res.status(201).json({ message: "Quiz created successfully", quiz, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// ── GET ALL ───────────────────────────────────────────────
export const getAllQuizzes = async (req, res) => {
  try {
    const { category, level } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (level) filter.level = level;

    const quizzes = await Quiz.find(filter)
      .populate("createdBy", "fullname email")
      .sort({ createdAt: -1 });

    return res.status(200).json({ quizzes, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// ── GET BY ID ─────────────────────────────────────────────
export const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate("createdBy", "fullname email");
    if (!quiz) return res.status(404).json({ message: "Quiz not found", success: false });
    return res.status(200).json({ quiz, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// ── UPDATE ────────────────────────────────────────────────
export const updateQuiz = async (req, res) => {
  try {
    const { title, description, category, level, timeLimit, questions } = req.body;

    const existing = await Quiz.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Quiz not found", success: false });

    let categoryImage = existing.categoryImage;
    if (req.file) {
      await deleteImage(existing.categoryImage);
      categoryImage = await uploadImage(req.file);
    }

    const parsedQuestions = questions
      ? (typeof questions === "string" ? JSON.parse(questions) : questions)
      : existing.questions;

    const totalMarks = parsedQuestions.reduce((sum, q) => sum + (q.marks || 1), 0);

    const quiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      { title, description, category, categoryImage, level, timeLimit, questions: parsedQuestions, totalMarks },
      { new: true }
    );

    return res.status(200).json({ message: "Quiz updated successfully", quiz, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// ── DELETE ────────────────────────────────────────────────
export const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found", success: false });

    // Delete Cloudinary image
    await deleteImage(quiz.categoryImage);

    // Delete all results linked to this quiz
    await QuizResult.deleteMany({ quiz: quiz._id });

    await quiz.deleteOne();

    return res.status(200).json({ message: "Quiz deleted successfully", success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// ── QUIZ STATS (admin) ────────────────────────────────────
export const getQuizStats = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found", success: false });

    const results = await QuizResult.find({ quiz: req.params.id })
      .populate("user", "fullname email profile")
      .sort({ score: -1 });

    const total = results.length;
    const avgScore = total ? Math.round(results.reduce((s, r) => s + r.percentage, 0) / total) : 0;
    const passed = results.filter(r => r.percentage >= 50).length;
    const passRate = total ? Math.round((passed / total) * 100) : 0;
    const topScore = total ? Math.max(...results.map(r => r.score)) : 0;

    return res.status(200).json({
      success: true,
      stats: { total, avgScore, passRate, topScore },
      leaderboard: results.slice(0, 10),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};
