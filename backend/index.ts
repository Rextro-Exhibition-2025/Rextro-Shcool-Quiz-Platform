import dotenv from "dotenv";
import type { Application } from "express";
import express from "express";
import connectDB from "./config/db.js";
import UserRouter from "./routes/userRoutes.js";

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});


