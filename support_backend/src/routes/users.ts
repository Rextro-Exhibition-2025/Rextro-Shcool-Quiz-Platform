import express from 'express';
import { getCache, setCache, deleteCache } from '../config/cache.js';
import { callMainBackend } from '../services/mainBackendService.js';

const router = express.Router();

// GET all users with caching
router.get('/', async (req, res) => {
    try {
        const cacheKey = 'users:all';
        let data = getCache(cacheKey);
        if (!data) {
            data = await callMainBackend('/users');
            setCache(cacheKey, data, 600);
        }
        res.json(data);
    } catch (error) {
        console.error('❌ Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// POST new user (invalidate cache)
router.post('/', async (req, res) => {
    try {
        const data = await callMainBackend('/users', {
            method: 'POST',
            body: JSON.stringify(req.body),
            headers: req.headers as Record<string, string>
        });
        deleteCache('users:all');
        res.json(data);
    } catch (error) {
        console.error('❌ Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// GET user by ID with caching
router.get('/:id', async (req, res) => {
    try {
        const cacheKey = `user:${req.params.id}`;
        let data = getCache(cacheKey);
        if (!data) {
            data = await callMainBackend(`/users/${req.params.id}`);
            setCache(cacheKey, data, 600);
        }
        res.json(data);
    } catch (error) {
        console.error('❌ Error fetching user:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

// PUT update user (invalidate cache)
router.put('/:id', async (req, res) => {
    try {
        const data = await callMainBackend(`/users/${req.params.id}`, {
            method: 'PUT',
            body: JSON.stringify(req.body),
            headers: req.headers as Record<string, string>
        });
        deleteCache('users:all');
        deleteCache(`user:${req.params.id}`);
        res.json(data);
    } catch (error) {
        console.error('❌ Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

// DELETE user (invalidate cache)
router.delete('/:id', async (req, res) => {
    try {
        const data = await callMainBackend(`/users/${req.params.id}`, {
            method: 'DELETE',
            headers: req.headers as Record<string, string>
        });
        deleteCache('users:all');
        deleteCache(`user:${req.params.id}`);
        res.json(data);
    } catch (error) {
        console.error('❌ Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

export default router;