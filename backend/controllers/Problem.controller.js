import { Problem } from "../models/Problem.model.js";
import { Submission } from "../models/Submission.model.js";

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    + "-" + Date.now().toString(36);
};

const LANGUAGE_STARTER_CODE = {
  javascript: {
    default: `// Write your solution here
function solve(input) {
    // Your code here
    
}
// Example usage:
console.log(solve([1, 2, 3]));`,
    function: `function solution(arr) {
    // Your code here
    return arr;
}`,
  },
  python: {
    default: `# Write your solution here
def solve(input_data):
    # Your code here
    pass

# Example usage:
print(solve([1, 2, 3]))`,
    function: `def solution(arr):
    # Your code here
    return arr`,
  },
  java: {
    default: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        // Your code here
    }
    
    public static Object solve(Object input) {
        // Your code here
        return input;
    }
}`,
    function: `class Solution {
    public static Object solve(Object input) {
        // Your code here
        return input;
    }
}`,
  },
  cpp: {
    default: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    // Your code here
    return 0;
}`,
    function: `#include <iostream>
#include <vector>
using namespace std;

class Solution {
public:
    vector<int> solve(vector<int> arr) {
        // Your code here
        return arr;
    }
};`,
  },
  c: {
    default: `#include <stdio.h>

int main() {
    // Your code here
    return 0;
}`,
    function: `#include <stdio.h>

int* solve(int* arr, int n) {
    // Your code here
    return arr;
}`,
  },
  csharp: {
    default: `using System;
using System.Linq;

public class Solution {
    public static void Main() {
        // Your code here
    }
}`,
    function: `using System;
using System.Linq;

public class Solution {
    public static int[] Solve(int[] arr) {
        // Your code here
        return arr;
    }
}`,
  },
  go: {
    default: `package main

import "fmt"

func main() {
    // Your code here
}`,
    function: `package main

func solve(arr []int) []int {
    // Your code here
    return arr
}`,
  },
  rust: {
    default: `fn main() {
    // Your code here
}`,
    function: `fn solve(arr: Vec<i32>) -> Vec<i32> {
    // Your code here
    arr
}`,
  },
  ruby: {
    default: `# Write your solution here
def solve(input)
  # Your code here
end

# Example usage:
p solve([1, 2, 3])`,
    function: `def solve(arr)
  # Your code here
  arr
end`,
  },
  php: {
    default: `<?php
// Write your solution here
function solve($input) {
    // Your code here
}

// Example usage:
print_r(solve([1, 2, 3]));
?>`,
    function: `<?php
function solve($arr) {
    // Your code here
    return $arr;
}
?>`,
  },
  swift: {
    default: `import Foundation

// Your code here`,
    function: `import Foundation

func solve(_ arr: [Int]) -> [Int] {
    // Your code here
    return arr
}`,
  },
  kotlin: {
    default: `fun main() {
    // Your code here
}`,
    function: `fun solve(arr: List<Int>): List<Int> {
    // Your code here
    return arr
}`,
  },
  typescript: {
    default: `// Write your solution here
function solve(input: any): any {
    // Your code here
    return input;
}

// Example usage:
console.log(solve([1, 2, 3]));`,
    function: `function solve(arr: number[]): number[] {
    // Your code here
    return arr;
}`,
  },
  sql: {
    default: `-- Write your SQL query here
SELECT * FROM table_name;`,
    function: `-- Write your SQL query here
SELECT column1, column2
FROM table_name
WHERE condition;`,
  },
};

export const createProblem = async (req, res) => {
  try {
    const {
      title,
      description,
      difficulty,
      category,
      tags,
      testCases,
      constraints,
      examples,
      hints,
      supportedLanguages,
    } = req.body;

    if (!title || !description || !difficulty || !category) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const starterCode = {};
    const languages = supportedLanguages || ["javascript", "python"];
    languages.forEach((lang) => {
      starterCode[lang] =
        LANGUAGE_STARTER_CODE[lang]?.default ||
        LANGUAGE_STARTER_CODE.javascript.default;
    });

    const problem = await Problem.create({
      title,
      slug: generateSlug(title),
      description,
      difficulty,
      category,
      tags: tags || [],
      starterCode,
      testCases: testCases || [],
      constraints: constraints || [],
      examples: examples || [],
      hints: hints || [],
      supportedLanguages: languages,
      createdBy: req.id,
      isPublished: true,
    });

    return res
      .status(201)
      .json({ success: true, message: "Problem created", problem });
  } catch (err) {
    console.error("createProblem:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllProblems = async (req, res) => {
  try {
    const { difficulty, category, search, page = 1, limit = 20 } = req.query;
    const filter = { isPublished: true };

    if (difficulty) filter.difficulty = difficulty;
    if (category) filter.category = category;
    if (search)
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];

    const skip = (page - 1) * limit;
    const [problems, total] = await Promise.all([
      Problem.find(filter)
        .select(
          "title slug difficulty category tags acceptanceRate totalSubmissions supportedLanguages createdAt"
        )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Problem.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      problems,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getProblemBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const problem = await Problem.findOne({ slug, isPublished: true }).populate(
      "createdBy",
      "fullname"
    );

    if (!problem) {
      return res
        .status(404)
        .json({ success: false, message: "Problem not found" });
    }

    const visibleTestCases = problem.testCases.filter((tc) => !tc.isHidden);
    const problemData = problem.toObject();
    problemData.visibleTestCases = visibleTestCases;
    delete problemData.solution;

    return res.status(200).json({ success: true, problem: problemData });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    delete updates.totalSubmissions;
    delete updates.successfulSubmissions;
    delete updates.acceptanceRate;

    const problem = await Problem.findByIdAndUpdate(id, updates, { new: true });

    if (!problem) {
      return res
        .status(404)
        .json({ success: false, message: "Problem not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Problem updated", problem });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const problem = await Problem.findByIdAndUpdate(
      id,
      { isPublished: false },
      { new: true }
    );

    if (!problem) {
      return res
        .status(404)
        .json({ success: false, message: "Problem not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Problem deleted" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Problem.distinct("category", {
      isPublished: true,
    });
    return res.status(200).json({ success: true, categories });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getStarterCode = async (req, res) => {
  try {
    const { language } = req.query;
    const code = LANGUAGE_STARTER_CODE[language]?.default ||
      LANGUAGE_STARTER_CODE.javascript.default;
    return res.status(200).json({ success: true, code, language });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const recordSubmission = async (req, res) => {
  try {
    const { id, code, language, passed, passedCount, totalCount } = req.body;
    
    const submission = await Submission.create({
      user: req.id,
      problem: id,
      code,
      language,
      status: passed ? "accepted" : "wrong",
      passedCount: passedCount || 0,
      totalCount: totalCount || 0,
      solved: passed,
    });

    const update = passed
      ? { $inc: { totalSubmissions: 1, successfulSubmissions: 1 } }
      : { $inc: { totalSubmissions: 1 } };

    const updatedProblem = await Problem.findByIdAndUpdate(id, update, { new: true });
    
    if (updatedProblem && updatedProblem.totalSubmissions > 0) {
      const newRate = Math.round((updatedProblem.successfulSubmissions / updatedProblem.totalSubmissions) * 100);
      updatedProblem.acceptanceRate = newRate;
      await updatedProblem.save();
    }
    
    if (passed) {
      await Submission.updateMany(
        { user: req.id, problem: id, solved: false },
        { solved: true }
      );
    }

    return res.status(200).json({ success: true, submission });
  } catch (err) {
    console.error("recordSubmission error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getUserSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ user: req.id })
      .populate("problem", "title slug")
      .sort({ createdAt: -1 })
      .limit(50);
    
    const solvedProblems = await Submission.distinct("problem", { 
      user: req.id, 
      solved: true 
    });
    
    return res.status(200).json({ 
      success: true, 
      submissions,
      solvedProblems 
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getProblemSubmissions = async (req, res) => {
  try {
    const { id } = req.params;
    const submissions = await Submission.find({ 
      problem: id, 
      solved: true 
    })
      .populate("user", "fullname")
      .sort({ createdAt: -1 })
      .limit(10);
    
    return res.status(200).json({ success: true, submissions });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getProblemsByDifficulty = async (req, res) => {
  try {
    const stats = await Problem.aggregate([
      { $match: { isPublished: true } },
      {
        $group: {
          _id: "$difficulty",
          count: { $sum: 1 },
          avgAcceptance: { $avg: "$acceptanceRate" },
        },
      },
    ]);

    const result = {
      easy: { count: 0, avgAcceptance: 0 },
      medium: { count: 0, avgAcceptance: 0 },
      hard: { count: 0, avgAcceptance: 0 },
    };

    stats.forEach((s) => {
      result[s._id] = { count: s.count, avgAcceptance: Math.round(s.avgAcceptance) };
    });

    return res.status(200).json({ success: true, stats: result });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
