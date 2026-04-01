import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { createRequire } from "module";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import helmet from "helmet";
import rateLimit from "express-rate-limit";

// ✅ LOAD ENV VARIABLES FIRST
dotenv.config();

import admin from "firebase-admin";
import connectDB from "./utils/db.js";
import { verifyMailer } from "./utils/mailer.js";

// Routes
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import contactRoute from "./routes/contactRoutes.js";
import resumeRoutes from "./routes/ReumeRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import quizRoute from "./routes/quiz.route.js";
import quizResultRoute from "./routes/quizResult.route.js";
import savedJobRoute from "./routes/savedJob.route.js";
import atsAnalysisRoute from "./routes/atsAnalysis.route.js";
import internshipRoute from "./routes/internship.route.js";
import aiChatRoute from "./routes/aiChat.route.js";
import categoryRoute from "./routes/category.route.js";

const require = createRequire(import.meta.url);
const { Server } = require("socket.io");

const app = express();

// Render / most PaaS sit behind a reverse proxy (X-Forwarded-For). Required for correct
// client IPs and so express-rate-limit does not throw ERR_ERL_UNEXPECTED_X_FORWARDED_FOR (500s on every request).
app.set("trust proxy", 1);

// ✅ Firebase Init (safe)
if (!admin.apps.length && process.env.FIREBASE_PROJECT_ID) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        type: "service_account",
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });
    console.log("🔥 Firebase Admin initialized");
  } catch (err) {
    console.error("Firebase Admin error:", err.message);
  }
}

// ✅ Security
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        "default-src": ["'self'"],
        "style-src": ["'self'", "'unsafe-inline'"],
        "script-src": ["'self'", "'unsafe-inline'"],
        "img-src": ["'self'", "data:", "https:", "blob:"],
        "connect-src": ["'self'", "https:"],
        "font-src": ["'self'", "data:"],
        "object-src": ["'none'"],
        "media-src": ["'self'", "https:", "blob:"],
      },
    },
  })
);

// ✅ CORS
const allowedOrigins = [
  "http://localhost:5173",
  "https://growx-yp2u.onrender.com",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ✅ Body Parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// ✅ Rate limit API only (not static /assets — avoids burning the budget on chunk loads)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
});
app.use("/api", limiter);

// ✅ Server + Socket
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: allowedOrigins, credentials: true },
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

// ✅ Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use("/api/v1/internship", internshipRoute);
app.use("/api/contact", contactRoute);
app.use("/api/resumes", resumeRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/v1/quiz", quizRoute);
app.use("/api/v1/quiz-result", quizResultRoute);
app.use("/api/v1/saved-job", savedJobRoute);
app.use("/api/v1/ats", atsAnalysisRoute);
app.use("/api/v1/ai-chat", aiChatRoute);
app.use("/api/v1/category", categoryRoute);

// ✅ Health Check (must be before SPA catch-all)
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "API running" });
});

// ✅ Serve Frontend Static Files
app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// ✅ Start Server (FIXED)
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();       // ✅ DB first
    await verifyMailer();    // ✅ Mail check

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("❌ Server failed:", err.message);
    process.exit(1);
  }
};

startServer();