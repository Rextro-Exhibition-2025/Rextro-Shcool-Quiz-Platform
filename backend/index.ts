import dotenv from "dotenv";
import cors from "cors";
import type { Application } from "express";
import express from "express";
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import connectDB from "./config/db.js";
import UserRouter from "./routes/userRoutes.js";
import QuestionRouter from "./routes/questionRoute.js";
import QuizRouter from "./routes/quizRoute.js";
import AuthRouter from "./routes/authRoutes.js";
import SchoolTeamRouter from "./routes/schoolTeamRoutes.js";
import ViolationRouter from "./routes/violationRoutes.js";
import UploadRouter from "./routes/uploadRoutes.js";
import { Server } from "socket.io";
import http from "node:http";

dotenv.config();

const app: Application = express();
const server = http.createServer(app);
const io = new Server(server,{
  path: '/socket.io',
  cors: {
    origin: ['http://localhost:3001', 'http://localhost:3000', 'https://rextro-shcool-quiz-platform.vercel.app', 'https://mathquest.rextro.lk', 'https://rextro-shcool-quiz-platform-mk9quv3jh.vercel.app'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['polling', 'websocket'],
  allowEIO3: true,
  pingTimeout: 60000,
  pingInterval: 25000,
});

io.on("connection", (socket) => {
  console.log("✅ Socket.IO: User connected -", socket.id);
  console.log("📊 Total connections:", io.engine.clientsCount);

  socket.on('publish_question', (data) => {
    console.log(`Question published: ${data.question} by socket ${socket.id}`);
    // You can fetch the question data from DB if needed, here just echoing back
    // For demo, let's send back the questionId and a dummy question text
    // In real use, fetch the question from DB using data.questionId
   
    io.emit('new_question_published', data.question);
  });


   socket.on('unpublish_question', () => {
    console.log(`Question unpublished by socket ${socket.id}`);
    // You can fetch the question data from DB if needed, here just echoing back
    // For demo, let's send back the questionId and a dummy question text
    // In real use, fetch the question from DB using data.questionId
   
    io.emit('unpublish_current_question');
  });

  socket.on('disconnect', (reason) => {
    console.log(`🔌 Socket.IO: User disconnected - ${socket.id}, Reason: ${reason}`);
  });
});

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load OpenAPI specification
const swaggerDocument = YAML.load(path.join(__dirname, 'openapi.yaml'));

//CORS
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3000' , 'https://rextro-shcool-quiz-platform.vercel.app','https://mathquest.rextro.lk', 'https://rextro-shcool-quiz-platform-mk9quv3jh.vercel.app'], // Allow both frontend ports
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// Middleware - Increase limit for image uploads (base64 images can be large)
app.use(express.json({ limit: '10mb' })); // Allow up to 10MB for base64 images
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Connect to MongoDB
connectDB();

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Rextro Quiz API Documentation',
  customfavIcon: '/favicon.ico',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    docExpansion: 'none',
    filter: true,
    showExtensions: true,
    tryItOutEnabled: true
  }
}));

// API documentation JSON endpoint
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json(swaggerDocument);
});

// Routes
app.get("/", (req, res) => {
  res.send(`
    <h1>🚀 Rextro Quiz Platform API</h1>
    <p>API is running successfully!</p>
    <p><a href="/api-docs" target="_blank">📚 View API Documentation</a></p>
    <p><a href="/api-docs.json" target="_blank">📄 Download OpenAPI JSON</a></p>
  `);
});

// API Routes
app.use("/api/users", UserRouter);
app.use("/api/questions", QuestionRouter);
app.use("/api/quizzes", QuizRouter);
app.use("/api/auth", AuthRouter);
app.use("/api/school-teams", SchoolTeamRouter);
app.use("/api/violations", ViolationRouter);
app.use("/api/upload", UploadRouter);

// Start the server (handles both HTTP and Socket.IO)
const PORT = Number(process.env.PORT) || 5000;
const HOST = process.env.HOST || '0.0.0.0';
server.listen(PORT, HOST, () => {
  console.log(`✅ Server running on ${HOST}:${PORT}`);
  console.log(`🔌 Socket.io enabled`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`📄 OpenAPI JSON: http://localhost:${PORT}/api-docs.json`);
});

// handling unhandled promise rejections
process.on("unhandledRejection", (err: Error) => {
  console.error(`❌ Error: ${err.message}`);
  // Close server & exit process
  process.exit(1);
});
