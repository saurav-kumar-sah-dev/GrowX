import { Problem } from "../models/Problem.model.js";
import CodingCategory from "../models/CodingCategory.model.js";
import UserProgress from "../models/UserProgress.model.js";
import { Submission } from "../models/Submission.model.js";

// ============ PROBLEM CONTROLLERS ============

export const createProblem = async (req, res) => {
  try {
    const problem = new Problem(req.body);
    await problem.save();
    
    if (req.body.category && typeof req.body.category === 'string') {
      const cat = await CodingCategory.findOne({ name: req.body.category });
      if (cat) {
        await CodingCategory.findByIdAndUpdate(cat._id, {
          $push: { problems: problem._id },
          $inc: { problemCount: 1 }
        });
      }
    }
    
    res.status(201).json({ success: true, data: problem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllProblems = async (req, res) => {
  try {
    const { difficulty, category, search, page = 1, limit = 20, sort = "order" } = req.query;
    
    const query = { isPublished: true };
    
    if (difficulty) query.difficulty = difficulty;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } }
      ];
    }
    
    const skip = (page - 1) * limit;
    
    const [problems, total] = await Promise.all([
      Problem.find(query)
        .populate("category", "name slug")
        .sort({ [sort]: 1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Problem.countDocuments(query)
    ]);
    
    res.json({
      success: true,
      data: problems,
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

export const getProblemBySlug = async (req, res) => {
  try {
    const problem = await Problem.findOne({ slug: req.params.slug })
      .populate("category", "name slug");
    
    if (!problem) {
      return res.status(404).json({ success: false, message: "Problem not found" });
    }
    
    const userProgress = req.user ? await UserProgress.findOne({
      user: req.user._id,
      problem: problem._id
    }) : null;
    
    res.json({
      success: true,
      data: problem,
      userProgress: userProgress || null
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id)
      .populate("category", "name slug");
    
    if (!problem) {
      return res.status(404).json({ success: false, message: "Problem not found" });
    }
    
    res.json({ success: true, data: problem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProblem = async (req, res) => {
  try {
    const problem = await Problem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!problem) {
      return res.status(404).json({ success: false, message: "Problem not found" });
    }
    
    res.json({ success: true, data: problem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProblem = async (req, res) => {
  try {
    const problem = await Problem.findByIdAndDelete(req.params.id);
    
    if (!problem) {
      return res.status(404).json({ success: false, message: "Problem not found" });
    }
    
    await CodingCategory.findByIdAndUpdate(problem.category, {
      $pull: { problems: problem._id },
      $inc: { problemCount: -1 }
    });
    
    res.json({ success: true, message: "Problem deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProblemsStats = async (req, res) => {
  try {
    const [total, easy, medium, hard] = await Promise.all([
      Problem.countDocuments({ isPublished: true }),
      Problem.countDocuments({ isPublished: true, difficulty: "easy" }),
      Problem.countDocuments({ isPublished: true, difficulty: "medium" }),
      Problem.countDocuments({ isPublished: true, difficulty: "hard" })
    ]);
    
    res.json({
      success: true,
      data: { total, easy, medium, hard }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const seedProblems = async (req, res) => {
  try {
    const problems = [
      {
        title: "Two Sum",
        slug: "two-sum",
        description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.`,
        difficulty: "easy",
        category: "Arrays",
        tags: ["Array", "Hash Table"],
        constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "-10^9 <= target <= 10^9", "Only one valid answer exists."],
        examples: [
          { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." },
          { input: "nums = [3,2,4], target = 6", output: "[1,2]", explanation: "" },
          { input: "nums = [3,3], target = 6", output: "[0,1]", explanation: "" }
        ],
        hints: ["A brute force approach would be O(n^2). Can you do better?", "Think about using a hash map to store complement values."],
        testCases: [
          { input: "[2,7,11,15]\n9", expectedOutput: "[0,1]", isHidden: false },
          { input: "[3,2,4]\n6", expectedOutput: "[1,2]", isHidden: false },
          { input: "[3,3]\n6", expectedOutput: "[0,1]", isHidden: true }
        ],
        starterCode: { javascript: "function twoSum(nums, target) {\n    // Write your code here\n}\n\nconsole.log(twoSum([2,7,11,15], 9));", python: "def two_sum(nums, target):\n    # Write your code here\n    pass\n\nprint(two_sum([2,7,11,15], 9))" },
        solution: { javascript: "function twoSum(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) {\n            return [map.get(complement), i];\n        }\n        map.set(nums[i], i);\n    }\n    return [];\n}", python: "def two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []" },
        supportedLanguages: ["javascript", "python", "java", "cpp", "c"],
        createdBy: req.user?._id,
        isPublished: true,
        order: 1
      },
      {
        title: "Valid Parentheses",
        slug: "valid-parentheses",
        description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
        difficulty: "easy",
        category: "Stack",
        tags: ["String", "Stack"],
        constraints: ["1 <= s.length <= 10^4", "s consists of parentheses only '()[]{}'."],
        examples: [
          { input: 's = "()"', output: "true", explanation: "" },
          { input: 's = "()[]{}"', output: "true", explanation: "" },
          { input: 's = "(]"', output: "false", explanation: "" }
        ],
        hints: ["Use a stack to keep track of opening brackets.", "When you encounter a closing bracket, check if it matches the top of the stack."],
        testCases: [
          { input: '"()"', expectedOutput: "true", isHidden: false },
          { input: '"()[]{}"', expectedOutput: "true", isHidden: false },
          { input: '"(]"', expectedOutput: "false", isHidden: false },
          { input: '"([)]"', expectedOutput: "false", isHidden: true }
        ],
        starterCode: { javascript: "function isValid(s) {\n    // Write your code here\n}\n\nconsole.log(isValid('()[]{}'));", python: "def is_valid(s):\n    # Write your code here\n    pass\n\nprint(is_valid('()[]{}'))" },
        solution: { javascript: "function isValid(s) {\n    const stack = [];\n    const map = { ')': '(', '}': '{', ']': '[' };\n    for (let char of s) {\n        if (map[char]) {\n            if (stack.pop() !== map[char]) return false;\n        } else {\n            stack.push(char);\n        }\n    }\n    return stack.length === 0;\n}", python: "def is_valid(s):\n    stack = []\n    mapping = {')': '(', '}': '{', ']': '['}\n    for char in s:\n        if char in mapping:\n            if not stack or stack.pop() != mapping[char]:\n                return False\n        else:\n            stack.append(char)\n    return len(stack) == 0" },
        supportedLanguages: ["javascript", "python", "java", "cpp", "c"],
        createdBy: req.user?._id,
        isPublished: true,
        order: 2
      },
      {
        title: "Reverse Linked List",
        slug: "reverse-linked-list",
        description: `Given the \`head\` of a singly linked list, reverse the list, and return the reversed list.

A linked list can be reversed either iteratively or recursively.`,
        difficulty: "easy",
        category: "Linked List",
        tags: ["Linked List", "Recursion"],
        constraints: ["The number of nodes in the list is in the range [0, 5000].", "-5000 <= Node.val <= 5000"],
        examples: [
          { input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]", explanation: "" },
          { input: "head = [1,2]", output: "[2,1]", explanation: "" },
          { input: "head = []", output: "[]", explanation: "" }
        ],
        hints: ["Think about using three pointers: previous, current, and next.", "Can you solve it recursively?"],
        testCases: [
          { input: "[1,2,3,4,5]", expectedOutput: "[5,4,3,2,1]", isHidden: false },
          { input: "[1,2]", expectedOutput: "[2,1]", isHidden: false },
          { input: "[]", expectedOutput: "[]", isHidden: true }
        ],
        starterCode: { javascript: "// Definition for singly-linked list.\n// function ListNode(val, next) {\n//     this.val = (val===undefined ? 0 : val)\n//     this.next = (next===undefined ? null : next)\n// }\n\nfunction reverseList(head) {\n    // Write your code here\n}\n\nconsole.log(reverseList([1,2,3,4,5]));", python: "# class ListNode:\n#     def __init__(self, val=0, next=None):\n#         self.val = val\n#         self.next = next\n\ndef reverse_list(head):\n    # Write your code here\n    pass\n\nprint(reverse_list([1,2,3,4,5]))" },
        solution: { javascript: "function reverseList(head) {\n    let prev = null;\n    let curr = head;\n    while (curr) {\n        const next = curr.next;\n        curr.next = prev;\n        prev = curr;\n        curr = next;\n    }\n    return prev;\n}", python: "def reverse_list(head):\n    prev = None\n    curr = head\n    while curr:\n        next_temp = curr.next\n        curr.next = prev\n        prev = curr\n        curr = next_temp\n    return prev" },
        supportedLanguages: ["javascript", "python", "java", "cpp", "c"],
        createdBy: req.user?._id,
        isPublished: true,
        order: 3
      },
      {
        title: "Merge Two Sorted Lists",
        slug: "merge-two-sorted-lists",
        description: `You are given the heads of two sorted linked lists \`list1\` and \`list2\`.

Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.

Return the head of the merged linked list.`,
        difficulty: "easy",
        category: "Linked List",
        tags: ["Linked List", "Recursion"],
        constraints: ["The number of nodes in both lists is in the range [0, 50].", "-100 <= Node.val <= 100", "Both list1 and list2 are sorted in non-decreasing order."],
        examples: [
          { input: "list1 = [1,2,4], list2 = [1,3,4]", output: "[1,1,2,3,4,4]", explanation: "" },
          { input: "list1 = [], list2 = []", output: "[]", explanation: "" },
          { input: "list1 = [], list2 = [0]", output: "[0]", explanation: "" }
        ],
        hints: ["Use a dummy node to simplify the merging process.", "Compare the heads of both lists and pick the smaller one."],
        testCases: [
          { input: "[1,2,4]\n[1,3,4]", expectedOutput: "[1,1,2,3,4,4]", isHidden: false },
          { input: "[]\n[]", expectedOutput: "[]", isHidden: false },
          { input: "[]\n[0]", expectedOutput: "[0]", isHidden: true }
        ],
        starterCode: { javascript: "function mergeTwoLists(list1, list2) {\n    // Write your code here\n}\n\nconsole.log(mergeTwoLists([1,2,4], [1,3,4]));", python: "def merge_two_lists(list1, list2):\n    # Write your code here\n    pass\n\nprint(merge_two_lists([1,2,4], [1,3,4]))" },
        solution: { javascript: "function mergeTwoLists(l1, l2) {\n    const dummy = new ListNode(-1);\n    let curr = dummy;\n    while (l1 && l2) {\n        if (l1.val <= l2.val) {\n            curr.next = l1;\n            l1 = l1.next;\n        } else {\n            curr.next = l2;\n            l2 = l2.next;\n        }\n        curr = curr.next;\n    }\n    curr.next = l1 || l2;\n    return dummy.next;\n}", python: "def merge_two_lists(l1, l2):\n    dummy = ListNode(-1)\n    curr = dummy\n    while l1 and l2:\n        if l1.val <= l2.val:\n            curr.next = l1\n            l1 = l1.next\n        else:\n            curr.next = l2\n            l2 = l2.next\n        curr = curr.next\n    curr.next = l1 or l2\n    return dummy.next" },
        supportedLanguages: ["javascript", "python", "java", "cpp", "c"],
        createdBy: req.user?._id,
        isPublished: true,
        order: 4
      },
      {
        title: "Maximum Subarray",
        slug: "maximum-subarray",
        description: `Given an integer array \`nums\`, find the subarray with the largest sum, and return its sum.

A **subarray** is a contiguous non-empty sequence of elements within an array.`,
        difficulty: "medium",
        category: "Dynamic Programming",
        tags: ["Array", "Dynamic Programming", "Divide and Conquer"],
        constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
        examples: [
          { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "The subarray [4,-1,2,1] has the largest sum 6." },
          { input: "nums = [1]", output: "1", explanation: "The subarray [1] has the largest sum 1." },
          { input: "nums = [5,4,-1,7,8]", output: "23", explanation: "The subarray [5,4,-1,7,8] has the largest sum 23." }
        ],
        hints: ["Think about Kadane's Algorithm.", "At each position, decide whether to extend the current subarray or start a new one."],
        testCases: [
          { input: "[-2,1,-3,4,-1,2,1,-5,4]", expectedOutput: "6", isHidden: false },
          { input: "[1]", expectedOutput: "1", isHidden: false },
          { input: "[5,4,-1,7,8]", expectedOutput: "23", isHidden: true }
        ],
        starterCode: { javascript: "function maxSubArray(nums) {\n    // Write your code here\n}\n\nconsole.log(maxSubArray([-2,1,-3,4,-1,2,1,-5,4]));", python: "def max_sub_array(nums):\n    # Write your code here\n    pass\n\nprint(max_sub_array([-2,1,-3,4,-1,2,1,-5,4]))" },
        solution: { javascript: "function maxSubArray(nums) {\n    let maxSum = nums[0];\n    let currentSum = nums[0];\n    for (let i = 1; i < nums.length; i++) {\n        currentSum = Math.max(nums[i], currentSum + nums[i]);\n        maxSum = Math.max(maxSum, currentSum);\n    }\n    return maxSum;\n}", python: "def max_sub_array(nums):\n    max_sum = nums[0]\n    current_sum = nums[0]\n    for num in nums[1:]:\n        current_sum = max(num, current_sum + num)\n        max_sum = max(max_sum, current_sum)\n    return max_sum" },
        supportedLanguages: ["javascript", "python", "java", "cpp", "c"],
        createdBy: req.user?._id,
        isPublished: true,
        order: 5
      },
      {
        title: "Binary Search",
        slug: "binary-search",
        description: `Given an array of integers \`nums\` which is sorted in ascending order, and an integer \`target\`, write a function to search \`target\` in \`nums\`. If \`target\` exists, then return its index. Otherwise, return \`-1\`.

You must write an algorithm with **O(log n)** runtime complexity.`,
        difficulty: "easy",
        category: "Binary Search",
        tags: ["Array", "Binary Search"],
        constraints: ["1 <= nums.length <= 10^4", "-10^4 < nums[i], target < 10^4", "All the integers in nums are unique.", "nums is sorted in ascending order."],
        examples: [
          { input: "nums = [-1,0,3,5,9,12], target = 9", output: "4", explanation: "9 exists in nums and its index is 4" },
          { input: "nums = [-1,0,3,5,9,12], target = 2", output: "-1", explanation: "2 does not exist in nums so return -1" }
        ],
        hints: ["Think about the two-pointer approach.", "The array is sorted, so you can use binary search."],
        testCases: [
          { input: "[-1,0,3,5,9,12]\n9", expectedOutput: "4", isHidden: false },
          { input: "[-1,0,3,5,9,12]\n2", expectedOutput: "-1", isHidden: false },
          { input: "[5]\n5", expectedOutput: "0", isHidden: true }
        ],
        starterCode: { javascript: "function search(nums, target) {\n    // Write your code here\n}\n\nconsole.log(search([-1,0,3,5,9,12], 9));", python: "def search(nums, target):\n    # Write your code here\n    pass\n\nprint(search([-1,0,3,5,9,12], 9))" },
        solution: { javascript: "function search(nums, target) {\n    let left = 0;\n    let right = nums.length - 1;\n    while (left <= right) {\n        const mid = Math.floor((left + right) / 2);\n        if (nums[mid] === target) return mid;\n        else if (nums[mid] < target) left = mid + 1;\n        else right = mid - 1;\n    }\n    return -1;\n}", python: "def search(nums, target):\n    left, right = 0, len(nums) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if nums[mid] == target:\n            return mid\n        elif nums[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1" },
        supportedLanguages: ["javascript", "python", "java", "cpp", "c"],
        createdBy: req.user?._id,
        isPublished: true,
        order: 6
      },
      {
        title: "Climbing Stairs",
        slug: "climbing-stairs",
        description: `You are climbing a staircase. It takes \`n\` steps to reach the top.

Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?`,
        difficulty: "easy",
        category: "Dynamic Programming",
        tags: ["Math", "Dynamic Programming", "Memoization"],
        constraints: ["1 <= n <= 45"],
        examples: [
          { input: "n = 2", output: "2", explanation: "There are two ways to climb to the top: 1. 1 step + 1 step, 2. 2 steps" },
          { input: "n = 3", output: "3", explanation: "There are three ways to climb to the top: 1. 1+1+1, 2. 1+2, 3. 2+1" }
        ],
        hints: ["This is a classic Fibonacci sequence problem.", "Think about how many ways to reach each step."],
        testCases: [
          { input: "2", expectedOutput: "2", isHidden: false },
          { input: "3", expectedOutput: "3", isHidden: false },
          { input: "4", expectedOutput: "5", isHidden: true }
        ],
        starterCode: { javascript: "function climbStairs(n) {\n    // Write your code here\n}\n\nconsole.log(climbStairs(5));", python: "def climb_stairs(n):\n    # Write your code here\n    pass\n\nprint(climb_stairs(5))" },
        solution: { javascript: "function climbStairs(n) {\n    if (n <= 2) return n;\n    let a = 1, b = 2;\n    for (let i = 3; i <= n; i++) {\n        [a, b] = [b, a + b];\n    }\n    return b;\n}", python: "def climb_stairs(n):\n    if n <= 2:\n        return n\n    a, b = 1, 2\n    for _ in range(3, n + 1):\n        a, b = b, a + b\n    return b" },
        supportedLanguages: ["javascript", "python", "java", "cpp", "c"],
        createdBy: req.user?._id,
        isPublished: true,
        order: 7
      },
      {
        title: "Best Time to Buy and Sell Stock",
        slug: "best-time-to-buy-and-sell-stock",
        description: `You are given an array \`prices\` where \`prices[i]\` is the price of a given stock on the \`i\`th day.

You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.

Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return \`0\`.`,
        difficulty: "easy",
        category: "Arrays",
        tags: ["Array", "Dynamic Programming"],
        constraints: ["1 <= prices.length <= 10^5", "0 <= prices[i] <= 10^4"],
        examples: [
          { input: "prices = [7,1,5,3,6,4]", output: "5", explanation: "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5." },
          { input: "prices = [7,6,4,3,1]", output: "0", explanation: "In this case, no transactions are done and the max profit = 0." }
        ],
        hints: ["Track the minimum price seen so far.", "At each day, calculate the potential profit if you sold at that price."],
        testCases: [
          { input: "[7,1,5,3,6,4]", expectedOutput: "5", isHidden: false },
          { input: "[7,6,4,3,1]", expectedOutput: "0", isHidden: false },
          { input: "[2,4,1]", expectedOutput: "2", isHidden: true }
        ],
        starterCode: { javascript: "function maxProfit(prices) {\n    // Write your code here\n}\n\nconsole.log(maxProfit([7,1,5,3,6,4]));", python: "def max_profit(prices):\n    # Write your code here\n    pass\n\nprint(max_profit([7,1,5,3,6,4]))" },
        solution: { javascript: "function maxProfit(prices) {\n    let minPrice = Infinity;\n    let maxProfit = 0;\n    for (const price of prices) {\n        minPrice = Math.min(minPrice, price);\n        maxProfit = Math.max(maxProfit, price - minPrice);\n    }\n    return maxProfit;\n}", python: "def max_profit(prices):\n    min_price = float('inf')\n    max_profit = 0\n    for price in prices:\n        min_price = min(min_price, price)\n        max_profit = max(max_profit, price - min_price)\n    return max_profit" },
        supportedLanguages: ["javascript", "python", "java", "cpp", "c"],
        createdBy: req.user?._id,
        isPublished: true,
        order: 8
      },
      {
        title: "Longest Common Subsequence",
        slug: "longest-common-subsequence",
        description: `Given two strings \`text1\` and \`text2\`, return the length of their longest common subsequence.

A **subsequence** is a sequence that can be derived from another sequence by deleting some or no elements without changing the order of the remaining elements.

If there is no common subsequence, return 0.`,
        difficulty: "medium",
        category: "Dynamic Programming",
        tags: ["String", "Dynamic Programming"],
        constraints: ["1 <= text1.length, text2.length <= 1000", "The input strings consist only of lowercase English characters."],
        examples: [
          { input: 'text1 = "abcde", text2 = "ace"', output: "3", explanation: "The longest common subsequence is 'ace' and its length is 3." },
          { input: 'text1 = "abc", text2 = "def"', output: "0", explanation: "There is no common subsequence." }
        ],
        hints: ["Use dynamic programming with a 2D array.", "dp[i][j] represents the LCS length for text1[0:i] and text2[0:j]."],
        testCases: [
          { input: '"abcde"\n"ace"', expectedOutput: "3", isHidden: false },
          { input: '"abc"\n"def"', expectedOutput: "0", isHidden: false },
          { input: '"abcba"\n"abcbcba"', expectedOutput: "5", isHidden: true }
        ],
        starterCode: { javascript: "function longestCommonSubsequence(text1, text2) {\n    // Write your code here\n}\n\nconsole.log(longestCommonSubsequence('abcde', 'ace'));", python: "def longest_common_subsequence(text1, text2):\n    # Write your code here\n    pass\n\nprint(longest_common_subsequence('abcde', 'ace'))" },
        solution: { javascript: "function longestCommonSubsequence(text1, text2) {\n    const m = text1.length, n = text2.length;\n    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));\n    for (let i = 1; i <= m; i++) {\n        for (let j = 1; j <= n; j++) {\n            if (text1[i-1] === text2[j-1]) dp[i][j] = dp[i-1][j-1] + 1;\n            else dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);\n        }\n    }\n    return dp[m][n];\n}", python: "def longest_common_subsequence(text1, text2):\n    m, n = len(text1), len(text2)\n    dp = [[0] * (n + 1) for _ in range(m + 1)]\n    for i in range(1, m + 1):\n        for j in range(1, n + 1):\n            if text1[i-1] == text2[j-1]:\n                dp[i][j] = dp[i-1][j-1] + 1\n            else:\n                dp[i][j] = max(dp[i-1][j], dp[i][j-1])\n    return dp[m][n]" },
        supportedLanguages: ["javascript", "python", "java", "cpp", "c"],
        createdBy: req.user?._id,
        isPublished: true,
        order: 9
      },
      {
        title: "Binary Tree Level Order Traversal",
        slug: "binary-tree-level-order-traversal",
        description: `Given the \`root\` of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).`,
        difficulty: "medium",
        category: "Trees",
        tags: ["Tree", "Breadth-First Search", "Binary Tree"],
        constraints: ["The number of nodes in the tree is in the range [0, 2000].", "-1000 <= Node.val <= 1000"],
        examples: [
          { input: "root = [3,9,20,null,null,15,7]", output: "[[3],[9,20],[15,7]]", explanation: "" },
          { input: "root = [1]", output: "[[1]]", explanation: "" },
          { input: "root = []", output: "[]", explanation: "" }
        ],
        hints: ["Use a queue to perform BFS.", "Keep track of the number of nodes at each level."],
        testCases: [
          { input: "[3,9,20,null,null,15,7]", expectedOutput: "[[3],[9,20],[15,7]]", isHidden: false },
          { input: "[1]", expectedOutput: "[[1]]", isHidden: false },
          { input: "[]", expectedOutput: "[]", isHidden: true }
        ],
        starterCode: { javascript: "// Definition for binary tree node.\n// class TreeNode {\n//     constructor(val) {\n//         this.val = val;\n//         this.left = this.right = null;\n//     }\n// }\n\nfunction levelOrder(root) {\n    // Write your code here\n}\n\nconsole.log(levelOrder([3,9,20,null,null,15,7]));", python: "# class TreeNode:\n#     def __init__(self, val=0, left=None, right=None):\n#         self.val = val\n#         self.left = left\n#         self.right = right\n\ndef level_order(root):\n    # Write your code here\n    pass\n\nprint(level_order([3,9,20,None,None,15,7]))" },
        solution: { javascript: "function levelOrder(root) {\n    if (!root) return [];\n    const result = [], queue = [root];\n    while (queue.length) {\n        const level = [], size = queue.length;\n        for (let i = 0; i < size; i++) {\n            const node = queue.shift();\n            level.push(node.val);\n            if (node.left) queue.push(node.left);\n            if (node.right) queue.push(node.right);\n        }\n        result.push(level);\n    }\n    return result;\n}", python: "from collections import deque\n\ndef level_order(root):\n    if not root:\n        return []\n    result, queue = [], deque([root])\n    while queue:\n        level = []\n        for _ in range(len(queue)):\n            node = queue.popleft()\n            level.append(node.val)\n            if node.left:\n                queue.append(node.left)\n            if node.right:\n                queue.append(node.right)\n        result.append(level)\n    return result" },
        supportedLanguages: ["javascript", "python", "java", "cpp", "c"],
        createdBy: req.user?._id,
        isPublished: true,
        order: 10
      },
      {
        title: "Median of Two Sorted Arrays",
        slug: "median-of-two-sorted-arrays",
        description: `Given two sorted arrays \`nums1\` and \`nums2\` of size \`m\` and \`n\` respectively, return **the median** of the two sorted arrays.

The overall run time complexity should be **O(log (m+n))**.`,
        difficulty: "hard",
        category: "Binary Search",
        tags: ["Array", "Binary Search", "Divide and Conquer"],
        constraints: ["nums1.length == m", "nums2.length == n", "0 <= m <= 1000", "0 <= n <= 1000", "1 <= m + n <= 2000", "-10^6 <= nums1[i], nums2[i] <= 10^6"],
        examples: [
          { input: "nums1 = [1,3], nums2 = [2]", output: "2.00000", explanation: "merged array = [1,2,3] and median is 2." },
          { input: "nums1 = [1,2], nums2 = [3,4]", output: "2.50000", explanation: "merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5." }
        ],
        hints: ["Think about binary search on the smaller array.", "The key is to partition both arrays such that left side has equal or almost equal elements."],
        testCases: [
          { input: "[1,3]\n[2]", expectedOutput: "2.0", isHidden: false },
          { input: "[1,2]\n[3,4]", expectedOutput: "2.5", isHidden: false },
          { input: "[0,0]\n[0,0]", expectedOutput: "0.0", isHidden: true }
        ],
        starterCode: { javascript: "function findMedianSortedArrays(nums1, nums2) {\n    // Write your code here\n}\n\nconsole.log(findMedianSortedArrays([1,3], [2]));", python: "def find_median_sorted_arrays(nums1, nums2):\n    # Write your code here\n    pass\n\nprint(find_median_sorted_arrays([1,3], [2]))" },
        solution: { javascript: "function findMedianSortedArrays(nums1, nums2) {\n    if (nums1.length > nums2.length) [nums1, nums2] = [nums2, nums1];\n    const m = nums1.length, n = nums2.length;\n    let left = 0, right = m, half = (m + n + 1) / 2;\n    while (left <= right) {\n        const i = Math.floor((left + right) / 2);\n        const j = half - i;\n        const maxLeftA = i === 0 ? -Infinity : nums1[i - 1];\n        const minRightA = i === m ? Infinity : nums1[i];\n        const maxLeftB = j === 0 ? -Infinity : nums2[j - 1];\n        const minRightB = j === n ? Infinity : nums2[j];\n        if (maxLeftA <= minRightB && maxLeftB <= minRightA) {\n            if ((m + n) % 2 === 0) return (Math.max(maxLeftA, maxLeftB) + Math.min(minRightA, minRightB)) / 2;\n            else return Math.max(maxLeftA, maxLeftB);\n        } else if (maxLeftA > minRightB) right = i - 1;\n        else left = i + 1;\n    }\n    return 0;\n}", python: "def find_median_sorted_arrays(nums1, nums2):\n    if len(nums1) > len(nums2):\n        nums1, nums2 = nums2, nums1\n    m, n = len(nums1), len(nums2)\n    left, right = 0, m\n    half = (m + n + 1) // 2\n    while left <= right:\n        i = (left + right) // 2\n        j = half - i\n        max_left_a = float('-inf') if i == 0 else nums1[i-1]\n        min_right_a = float('inf') if i == m else nums1[i]\n        max_left_b = float('-inf') if j == 0 else nums2[j-1]\n        min_right_b = float('inf') if j == n else nums2[j]\n        if max_left_a <= min_right_b and max_left_b <= min_right_a:\n            if (m + n) % 2 == 0:\n                return (max(max_left_a, max_left_b) + min(min_right_a, min_right_b)) / 2\n            else:\n                return max(max_left_a, max_left_b)\n        elif max_left_a > min_right_b:\n            right = i - 1\n        else:\n            left = i + 1\n    return 0" },
        supportedLanguages: ["javascript", "python", "java", "cpp", "c"],
        createdBy: req.user?._id,
        isPublished: true,
        order: 11
      }
    ];
    
    const count = await Problem.countDocuments();
    if (count > 0) {
      return res.json({ success: true, message: "Problems already seeded", count });
    }
    
    const created = await Problem.insertMany(problems);
    
    const categories = [
      { name: "Arrays", slug: "arrays", description: "Array manipulation problems", icon: "Grid3X3", color: "#3b82f6" },
      { name: "Strings", slug: "strings", description: "String manipulation problems", icon: "Type", color: "#8b5cf6" },
      { name: "Linked List", slug: "linked-list", description: "Linked list problems", icon: "Link2", color: "#10b981" },
      { name: "Trees", slug: "trees", description: "Binary tree problems", icon: "GitBranch", color: "#f59e0b" },
      { name: "Dynamic Programming", slug: "dynamic-programming", description: "DP problems", icon: "Layers", color: "#ef4444" },
      { name: "Binary Search", slug: "binary-search", description: "Binary search problems", icon: "Search", color: "#06b6d4" },
      { name: "Stack", slug: "stack", description: "Stack-based problems", icon: "Database", color: "#ec4899" },
      { name: "Graphs", slug: "graphs", description: "Graph traversal problems", icon: "Share2", color: "#84cc16" },
    ];
    
    await CodingCategory.insertMany(categories);
    
    res.json({ success: true, message: "Seeded problems and categories", count: created.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ CATEGORY CONTROLLERS ============

export const createCategory = async (req, res) => {
  try {
    const category = new CodingCategory(req.body);
    await category.save();
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await CodingCategory.find({ isActive: true })
      .populate("problems", "title slug difficulty")
      .sort({ order: 1 });
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCategoryBySlug = async (req, res) => {
  try {
    const category = await CodingCategory.findOne({ slug: req.params.slug })
      .populate({
        path: "problems",
        match: { isPublished: true },
        select: "title slug difficulty acceptance totalSubmissions"
      });
    
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    
    res.json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    await CodingCategory.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
