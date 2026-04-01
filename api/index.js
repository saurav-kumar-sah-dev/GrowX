import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

const app = express();

app.use(cors({
  origin: ["https://grow-x-nine.vercel.app", process.env.FRONTEND_URL, "http://localhost:3000", "http://localhost:5173"],
  credentials: true,
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

const userRoute = (await import("../backend/routes/user.route.js")).default;
const companyRoute = (await import("../backend/routes/company.route.js")).default;
const jobRoute = (await import("../backend/routes/job.route.js")).default;
const applicationRoute = (await import("../backend/routes/application.route.js")).default;
const contactRoute = (await import("../backend/routes/contactRoutes.js")).default;
const resumeRoutes = (await import("../backend/routes/ReumeRoutes.js")).default;
const taskRoutes = (await import("../backend/routes/taskRoutes.js")).default;
const quizRoute = (await import("../backend/routes/quiz.route.js")).default;
const quizResultRoute = (await import("../backend/routes/quizResult.route.js")).default;
const savedJobRoute = (await import("../backend/routes/savedJob.route.js")).default;
const atsAnalysisRoute = (await import("../backend/routes/atsAnalysis.route.js")).default;
const internshipRoute = (await import("../backend/routes/internship.route.js")).default;
const aiChatRoute = (await import("../backend/routes/aiChat.route.js")).default;
const categoryRoute = (await import("../backend/routes/category.route.js")).default;

app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use("/api/contact", contactRoute);
app.use("/api/resumes", resumeRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/v1/quiz", quizRoute);
app.use("/api/v1/quiz-result", quizResultRoute);
app.use("/api/v1/saved-job", savedJobRoute);
app.use("/api/v1/ats", atsAnalysisRoute);
app.use("/api/v1/internship", internshipRoute);
app.use("/api/v1/ai-chat", aiChatRoute);
app.use("/api/v1/category", categoryRoute);

let dbConnected = false;

async function connectDB() {
  if (!dbConnected) {
    const { default: connectDB } = await import("../backend/utils/db.js");
    await connectDB();
    dbConnected = true;
    console.log("Connected to DB");
  }
}

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message });
});

export default async function handler(req, res) {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error("Handler error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
