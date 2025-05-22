import express from "express";
import cors from "cors";

// Import routes directly
import userRoute from "./routes/user.js";
import authRoute from "./routes/authroute.js";
import gameroute from "./routes/gamesroute.js";
import quizroute from "./routes/quizroute.js";
import scoreroute from "./routes/gamescoreroute.js";

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Health check route
app.get("/", (req, res) => {
  try {
    res.json({
      message: "CyberFort Backend is running!",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
    });
  } catch (error) {
    console.error("Health check error:", error);
    res.status(500).json({ error: "Health check failed" });
  }
});

// Test endpoint for environment variables
app.get("/api/test", (req, res) => {
  res.json({
    message: "API is working!",
    hasDBUrl: !!process.env.DATABASE_URL,
    hasJWTSecret: !!process.env.JWT_SECRET,
    nodeEnv: process.env.NODE_ENV,
  });
});

// API Routes
app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/games", gameroute);
app.use("/api/quiz", quizroute);
app.use("/api/gamesscore", scoreroute);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.path,
    method: req.method,
    availableRoutes: [
      "GET /",
      "GET /api/test",
      "POST /api/user/login",
      "POST /api/user/signup",
      "GET /api/games/getgames",
      "GET /api/quiz/getquizzes",
    ],
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error("Server error:", error);
  res.status(500).json({
    error: "Internal server error",
    message: error.message,
  });
});

export default app;
