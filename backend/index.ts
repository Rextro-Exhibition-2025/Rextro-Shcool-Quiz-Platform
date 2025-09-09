import dotenv from "dotenv";
import type { Application } from "express";
import express from "express";
import connectDB from "./config/db.js";
import UserRouter from "./routes/userRoutes.js";
import QuestionRouter from "./routes/questionRoute.js";
import QuizRouter from "./routes/quizRoute.js";

dotenv.config();

const app: Application = express();

// Middleware
app.use(express.json());
    
// Connect to MongoDB
connectDB();

// Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

// API Routes
app.use("/api/users", UserRouter);
app.use("/api/questions", QuestionRouter);
app.use("/api/quizzes", QuizRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});


