import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Software Development", "Web Development", "Android Development", "Cybersecurity",
        "UI/UX Design", "Cloud Computing", "Data Science", "Machine Learning",
        "Java Full Stack Developer", "Python Full Stack Developer", "JS Full Stack Developer",
        "DevOps", "AI/ML with Python", "Blockchain Developer", "Game Development",
      ],
    },

    categoryImage: {
      type: String,
      default: "",
    },

    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },

    timeLimit: {
      type: Number,
      default: 10,
    },

    totalMarks: {
      type: Number,
      default: 0,
    },

    questions: [
      {
        questionText: {
          type: String,
          required: true,
        },

        options: [
          {
            optionText: {
              type: String,
              required: true,
            },
          },
        ],

        correctAnswer: {
          type: Number,
          required: true,
        },

        marks: {
          type: Number,
          default: 1,
        },

        difficulty: {
          type: String,
          enum: ["Easy", "Medium", "Hard"],
          default: "Easy",
        },
      },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Quiz = mongoose.model("Quiz", quizSchema);
