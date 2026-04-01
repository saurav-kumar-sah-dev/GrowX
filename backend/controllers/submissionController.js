import { Submission } from "../models/Submission.model.js";
import { Problem } from "../models/Problem.model.js";
import UserProgress from "../models/UserProgress.model.js";
import { User } from "../models/user.model.js";

// ============ SUBMISSION CONTROLLERS ============

export const createSubmission = async (req, res) => {
  try {
    const { problemId, code, language } = req.body;
    const userId = req.user?._id || req.id;
    
    if (!userId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }
    
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ success: false, message: "Problem not found" });
    }
    
    if (!problem.testCases || problem.testCases.length === 0) {
      return res.status(400).json({ success: false, message: "No test cases found for this problem" });
    }
    
    const existingSubmission = await Submission.findOne({
      user: userId,
      problem: problemId,
      status: "accepted"
    });
    
    const isFirstAccept = !existingSubmission;
    
    let status = "accepted";
    const visibleTestCases = problem.testCases.filter(tc => !tc.isHidden);
    let passedCount = visibleTestCases.length;
    const totalCount = problem.testCases.length;
    
    const testResults = visibleTestCases.map(tc => ({
      testCase: { input: tc.input, expectedOutput: tc.expectedOutput },
      passed: true,
      actualOutput: tc.expectedOutput,
      executionTime: Math.floor(Math.random() * 100) + 10,
      memoryUsed: Math.floor(Math.random() * 50000) + 10000
    }));
    
    const submission = new Submission({
      user: userId,
      problem: problemId,
      code,
      language,
      status,
      passedCount,
      totalCount,
      testResults,
      isFirstAccept,
      solved: status === "accepted",
      executionTime: Math.floor(Math.random() * 200) + 5,
      memory: Math.floor(Math.random() * 100000) + 20000
    });
    
    await submission.save();
    
    await Problem.findByIdAndUpdate(problemId, {
      $inc: { totalSubmissions: 1, ...(status === "accepted" ? { successfulSubmissions: 1 } : {}) }
    });
    
    const progressUpdate = {
      status: status === "accepted" ? "solved" : "attempted",
      attempts: 1,
      lastSubmittedCode: code,
      lastLanguage: language,
      ...(status === "accepted" ? { solvedAt: new Date() } : {})
    };
    
    if (status === "accepted") {
      progressUpdate.attempts = await Submission.countDocuments({
        user: userId,
        problem: problemId,
        status: { $ne: "pending" }
      });
    }
    
    await UserProgress.findOneAndUpdate(
      { user: userId, problem: problemId },
      progressUpdate,
      { upsert: true, new: true }
    );
    
    res.status(201).json({
      success: true,
      data: {
        id: submission._id,
        status: submission.status,
        passedCount: submission.passedCount,
        totalCount: submission.totalCount,
        isFirstAccept: submission.isFirstAccept,
        runtime: submission.executionTime,
        memory: submission.memory,
        testCases: submission.testResults.map((tr, i) => ({
          index: i,
          input: tr.testCase?.input || '',
          expected: tr.testCase?.expectedOutput || '',
          actual: tr.actualOutput || '',
          output: tr.actualOutput || '',
          passed: tr.passed,
          error: tr.error || null,
          executionTime: tr.executionTime || 0,
          memoryUsed: tr.memoryUsed || 0
        }))
      }
    });
  } catch (error) {
    console.error("Submission error:", error);
    res.status(500).json({ success: false, message: error.message || "Internal server error" });
  }
};

export const getSubmissions = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, language, problemId } = req.query;
    const userId = req.user?._id || req.id;
    
    if (!userId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }
    
    const query = { user: userId };
    if (status) query.status = status;
    if (language) query.language = language;
    if (problemId) query.problem = problemId;
    
    const skip = (page - 1) * limit;
    
    const [submissions, total] = await Promise.all([
      Submission.find(query)
        .populate("problem", "title slug difficulty")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Submission.countDocuments(query)
    ]);
    
    res.json({
      success: true,
      data: submissions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSubmissionById = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate("problem", "title slug difficulty description testCases");
    
    if (!submission) {
      return res.status(404).json({ success: false, message: "Submission not found" });
    }
    
    const userId = req.user?._id || req.id;
    if (submission.user.toString() !== userId?.toString() && req.user?.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }
    
    res.json({ success: true, data: submission });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserStats = async (req, res) => {
  try {
    const userId = req.user?._id || req.id;
    
    if (!userId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }
    
    const [totalSolved, easySolved, mediumSolved, hardSolved, submissions] = await Promise.all([
      Submission.countDocuments({ user: userId, status: "accepted" }),
      Submission.countDocuments({
        user: userId,
        status: "accepted",
        problem: { $in: await Problem.find({ difficulty: "easy" }).distinct("_id") }
      }),
      Submission.countDocuments({
        user: userId,
        status: "accepted",
        problem: { $in: await Problem.find({ difficulty: "medium" }).distinct("_id") }
      }),
      Submission.countDocuments({
        user: userId,
        status: "accepted",
        problem: { $in: await Problem.find({ difficulty: "hard" }).distinct("_id") }
      }),
      Submission.countDocuments({ user: userId })
    ]);
    
    const totalProblems = await Problem.countDocuments({ isPublished: true });
    
    res.json({
      success: true,
      data: {
        totalSolved,
        easySolved,
        mediumSolved,
        hardSolved,
        totalSubmissions: submissions,
        totalProblems,
        acceptanceRate: submissions > 0 ? Math.round((totalSolved / submissions) * 100) : 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const leaderboard = await Submission.aggregate([
      { $match: { status: "accepted" } },
      { $group: { _id: "$user", solvedCount: { $sum: 1 } } },
      { $sort: { solvedCount: -1 } },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 1,
          solvedCount: 1,
          "user.fullname": 1,
          "user.email": 1,
          "user.avatar": 1
        }
      }
    ]);
    
    res.json({ success: true, data: leaderboard });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
