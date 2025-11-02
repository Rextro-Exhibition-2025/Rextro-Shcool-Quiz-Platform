import express from 'express';
import { getCache, setCache, deleteCache } from '../config/cache.js';
import { callMainBackend } from '../services/mainBackendService.js';

const router = express.Router();

// GET check quiz published status with caching
router.get('/check-quiz-published-status', async (req, res) => {
    try {
        const cacheKey = 'quiz:published:status';
        let data = getCache(cacheKey);
        if (!data) {
            data = await callMainBackend('/quizzes/check-quiz-published-status');
            setCache(cacheKey, data, 300); // Cache for 5 minutes
        }
        res.json(data);
    } catch (error) {
        console.error('❌ Error fetching quiz status:', error);
        res.status(500).json({ error: 'Failed to fetch quiz status' });
    }
});

// GET leaderboard with caching
router.get('/get-leaderboard', async (req, res) => {
    try {
        const cacheKey = 'quiz:leaderboard';
        console.log("getting leaderboard from caching backend")
        let data = getCache(cacheKey);
        if (!data) {
            console.log("no data in caching. calling main backend")
            data = await callMainBackend('/quizzes/get-leaderboard');
            setCache(cacheKey, data, 300); // Cache for 5 minutes
        }
        res.json(data);
    } catch (error) {
        console.error('❌ Error fetching leaderboard:', error);
        res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
});

// POST submit quiz (no caching, invalidate leaderboard)
router.post('/submit-quiz', async (req, res) => {
    try {
        const data = await callMainBackend('/quizzes/submit-quiz', {
            method: 'POST',
            body: JSON.stringify(req.body),
            headers: req.headers as Record<string, string>
        });
        deleteCache('quiz:leaderboard'); // Invalidate leaderboard cache
        res.json(data);
    } catch (error) {
        console.error('❌ Error submitting quiz:', error);
        res.status(500).json({ error: 'Failed to submit quiz' });
    }
});

// POST publish all quizzes (admin only, invalidate cache)
router.post('/publish-all-quizzes', async (req, res) => {
    try {
        const data = await callMainBackend('/quizzes/publish-all-quizzes', {
            method: 'POST',
            headers: req.headers as Record<string, string>
        });
        deleteCache('quiz:published:status');
        res.json(data);
    } catch (error) {
        console.error('❌ Error publishing quizzes:', error);
        res.status(500).json({ error: 'Failed to publish quizzes' });
    }
});

// POST unpublish all quizzes (admin only, invalidate cache)
router.post('/unpublish-all-quizzes', async (req, res) => {
    try {
        const data = await callMainBackend('/quizzes/unpublish-all-quizzes', {
            method: 'POST',
            headers: req.headers as Record<string, string>
        });
        deleteCache('quiz:published:status');
        res.json(data);
    } catch (error) {
        console.error('❌ Error unpublishing quizzes:', error);
        res.status(500).json({ error: 'Failed to unpublish quizzes' });
    }
});

// GET quiz by ID with questions (with caching)
router.get('/:quizId', async (req, res) => {
    try {
        const cacheKey = `quiz:${req.params.quizId}`;
        let data = getCache(cacheKey);
        if (!data) {
            data = await callMainBackend(`/quizzes/${req.params.quizId}`);
            setCache(cacheKey, data, 600); // Cache for 10 minutes
        }
        res.json(data);
    } catch (error) {
        console.error('❌ Error fetching quiz:', error);
        res.status(500).json({ error: 'Failed to fetch quiz' });
    }
});

export default router;