import { QuizResult } from "../models/quizResult.model.js";
import { Quiz } from "../models/quiz.model.js";

// ── SAVE RESULT ───────────────────────────────────────────
export const saveQuizResult = async (req, res) => {
  try {
    const { quizId, score, totalMarks, answers, timeTaken } = req.body;

    if (!quizId || score === undefined || !totalMarks) {
      return res.status(400).json({ message: "quizId, score, and totalMarks are required", success: false });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found", success: false });

    const percentage = Math.round((score / totalMarks) * 100);

    const result = await QuizResult.create({
      user: req.id,
      quiz: quizId,
      score,
      totalMarks,
      percentage,
      answers: answers || [],
      timeTaken: timeTaken || 0,
    });

    await result.populate("quiz", "title category level");

    return res.status(201).json({ message: "Quiz result saved", result, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// ── GET USER'S OWN RESULTS ────────────────────────────────
export const getUserQuizResults = async (req, res) => {
  try {
    const results = await QuizResult.find({ user: req.id })
      .populate("quiz", "title category level totalMarks categoryImage")
      .sort({ createdAt: -1 });

    return res.status(200).json({ results, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// ── GET ALL RESULTS (admin) ───────────────────────────────
export const getAllQuizResults = async (req, res) => {
  try {
    const results = await QuizResult.find()
      .populate("quiz", "title category level totalMarks")
      .populate("user", "fullname email profile")
      .sort({ createdAt: -1 });

    return res.status(200).json({ results, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// ── GET SINGLE RESULT BY ID ───────────────────────────────
export const getQuizResultById = async (req, res) => {
  try {
    const result = await QuizResult.findById(req.params.id)
      .populate("quiz", "title category level totalMarks questions")
      .populate("user", "fullname email");

    if (!result) return res.status(404).json({ message: "Result not found", success: false });

    // Only owner or admin can view
    if (result.user._id.toString() !== req.id) {
      return res.status(403).json({ message: "Unauthorized", success: false });
    }

    return res.status(200).json({ result, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// ── DELETE RESULT (admin) ─────────────────────────────────
export const deleteQuizResult = async (req, res) => {
  try {
    const result = await QuizResult.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: "Result not found", success: false });
    return res.status(200).json({ message: "Result deleted", success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};
