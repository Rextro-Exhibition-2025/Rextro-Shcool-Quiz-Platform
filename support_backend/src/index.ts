import type { Application, Request, Response } from 'express';
import express from "express"
import cors from 'cors';
import * as dotenv from 'dotenv';
import { initializeCache } from './config/cache.js';
import quizRoutes from './routes/quizzes.js';
import questionRoutes from './routes/questions.js';
import userRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';
import violationRoutes from './routes/violations.js';
import schoolTeamRoutes from './routes/school-teams.js';
import uploadRoutes from './routes/upload.js';

dotenv.config();

const app: Application = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Initialize cache
initializeCache();

// Root route
app.get('/', (req: Request, res: Response) => {
    res.send(`
        <h1>🚀 Support Backend (Cache Layer)</h1>
        <p>Caching proxy server running successfully!</p>
    `);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/violations', violationRoutes);
app.use('/api/school-teams', schoolTeamRoutes);
app.use('/api/upload', uploadRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`✅ Support Backend running on port ${PORT}`);
    console.log(`📍 Main Backend URL: ${process.env.MAIN_BACKEND_URL || 'http://localhost:4000/api'}`);
});

process.on('unhandledRejection', (err: Error) => {
    console.error(`❌ Error: ${err.message}`);
    process.exit(1);
});