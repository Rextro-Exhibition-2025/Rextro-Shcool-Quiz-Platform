import express from 'express';
import { getCache, setCache, deleteCache } from '../config/cache.js';
import { callMainBackend } from '../services/mainBackendService.js';

const router = express.Router();

// GET all questions with caching (admin only)
router.get('/', async (req, res) => {
    try {
        const cacheKey = 'questions:all';
        let data = getCache(cacheKey);
        if (!data) {
            data = await callMainBackend('/questions');
            setCache(cacheKey, data, 600); // Cache for 10 minutes
        }
        res.json(data);
    } catch (error) {
        console.error('❌ Error fetching questions:', error);
        res.status(500).json({ error: 'Failed to fetch questions' });
    }
});

// POST new question (admin only, invalidate cache)
router.post('/', async (req, res) => {
    try {
        const data = await callMainBackend('/questions', {
            method: 'POST',
            body: JSON.stringify(req.body),
            headers: req.headers as Record<string, string>
        });
        deleteCache('questions:all');
        res.json(data);
    } catch (error) {
        console.error('❌ Error creating question:', error);
        res.status(500).json({ error: 'Failed to create question' });
    }
});

// GET question by ID with caching (admin only)
router.get('/:questionId', async (req, res) => {
    try {
        const cacheKey = `question:${req.params.questionId}`;
        let data = getCache(cacheKey);
        if (!data) {
            data = await callMainBackend(`/questions/${req.params.questionId}`);
            setCache(cacheKey, data, 600);
        }
        res.json(data);
    } catch (error) {
        console.error('❌ Error fetching question:', error);
        res.status(500).json({ error: 'Failed to fetch question' });
    }
});

// PUT update question (admin only, invalidate cache)
router.put('/:questionId', async (req, res) => {
    try {
        const data = await callMainBackend(`/questions/${req.params.questionId}`, {
            method: 'PUT',
            body: JSON.stringify(req.body),
            headers: req.headers as Record<string, string>
        });
        deleteCache('questions:all');
        deleteCache(`question:${req.params.questionId}`);
        res.json(data);
    } catch (error) {
        console.error('❌ Error updating question:', error);
        res.status(500).json({ error: 'Failed to update question' });
    }
});

// DELETE question (admin only, invalidate cache)
router.delete('/:questionId', async (req, res) => {
    try {
        const data = await callMainBackend(`/questions/${req.params.questionId}`, {
            method: 'DELETE',
            headers: req.headers as Record<string, string>
        });
        deleteCache('questions:all');
        deleteCache(`question:${req.params.questionId}`);
        res.json(data);
    } catch (error) {
        console.error('❌ Error deleting question:', error);
        res.status(500).json({ error: 'Failed to delete question' });
    }
});

export default router;