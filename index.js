import express from "express";
import cors from "cors";

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Simple health check route
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

// Import and use routes only after basic setup
let routesLoaded = false;

const loadRoutes = async () => {
  if (routesLoaded) return;

  try {
    const { default: userRoute } = await import("./routes/user.js");
    const { default: authRoute } = await import("./routes/authroute.js");
    const { default: gameroute } = await import("./routes/gamesroute.js");
    const { default: quizroute } = await import("./routes/quizroute.js");
    const { default: scoreroute } = await import("./routes/gamescoreroute.js");

    app.use("/api/user", userRoute);
    app.use("/api/auth", authRoute);
    app.use("/api/games", gameroute);
    app.use("/api/quiz", quizroute);
    app.use("/api/gamesscore", scoreroute);

    routesLoaded = true;
  } catch (error) {
    console.error("Error loading routes:", error);
  }
};

// Load routes for any API call
app.use("/api/*", async (req, res, next) => {
  await loadRoutes();
  next();
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found", path: req.path });
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
