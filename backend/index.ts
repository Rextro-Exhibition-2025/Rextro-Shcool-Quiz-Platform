import dotenv from "dotenv";
import cors from "cors";
import type { Application } from "express";
import express from "express";
import connectDB from "./config/db.js";
import UserRouter from "./routes/userRoutes.js";
import AuthRouter from "./routes/authRoutes.js";
import SchoolTeamRouter from "./routes/schoolTeamRoutes.js";

dotenv.config();

const app: Application = express();

//CORS
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3000'], // Allow both frontend ports
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

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
app.use("/api/auth", AuthRouter);
app.use("/api/school-teams", SchoolTeamRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

// handling unhandled promise rejections
process.on("unhandledRejection", (err: Error) => {
  console.error(`❌ Error: ${err.message}`);
  // Close server & exit process
  process.exit(1);
});
