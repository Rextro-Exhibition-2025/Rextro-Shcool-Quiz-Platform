import * as express from 'express';
import type { Request, Response } from 'express';
import { getCache, setCache } from '../config/cache.js';
import { callMainBackend } from '../services/mainBackendService.js';

const leaderboardRoutes = express.Router();

// GET leaderboard with caching (longer TTL since it's frequently accessed)
leaderboardRoutes.get('/', async (req: Request, res: Response) => {
    const cacheKey = 'leaderboard:all';

    let data = getCache(cacheKey);
    if (!data) {
        data = await callMainBackend('/api/quizzes/get-leaderboard');
        setCache(cacheKey, data, 900); // Cache for 15 minutes
    }
    res.json(data);
});

// GET leaderboard by ID/filter with caching
leaderboardRoutes.get('/:id', async (req: Request, res: Response) => {
    const cacheKey = `leaderboard:${req.params.id}`;

    let data = getCache(cacheKey);
    if (!data) {
        data = await callMainBackend(`/leaderboard/${req.params.id}`);
        setCache(cacheKey, data, 900);
    }
    res.json(data);
});

export default leaderboardRoutes;