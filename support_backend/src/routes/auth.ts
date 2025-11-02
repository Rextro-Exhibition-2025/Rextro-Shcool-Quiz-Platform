import express from 'express';
import { flushCache } from '../config/cache.js';
import { callMainBackend } from '../services/mainBackendService.js';

const router = express.Router();

// POST login (no caching)
router.post('/login', async (req, res) => {
    try {
        const data = await callMainBackend('/auth/login', {
            method: 'POST',
            body: JSON.stringify(req.body),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        res.json(data);
    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// GET logout (invalidate all cache)
router.get('/logout', async (req, res) => {
    try {
        flushCache(); // Clear all cache on logout
        const data = await callMainBackend('/auth/logout', {
            method: 'GET',
            headers: {
                Authorization: req.headers.authorization || ''
            }
        });
        res.json(data);
    } catch (error) {
        console.error('❌ Logout error:', error);
        res.status(500).json({ error: 'Logout failed' });
    }
});

// GET current user (me)
router.get('/me', async (req, res) => {
    try {
        const data = await callMainBackend('/auth/me', {
            method: 'GET',
            headers: {
                Authorization: req.headers.authorization || ''
            }
        });
        res.json(data);
    } catch (error) {
        console.error('❌ Get me error:', error);
        res.status(500).json({ error: 'Failed to get user info' });
    }
});

// PUT update member state
router.put('/update-state', async (req, res) => {
    try {
        const data = await callMainBackend('/auth/update-state', {
            method: 'PUT',
            body: JSON.stringify(req.body),
            headers: {
                'Content-Type': 'application/json',
                Authorization: req.headers.authorization || ''
            }
        });
        res.json(data);
    } catch (error) {
        console.error('❌ Update state error:', error);
        res.status(500).json({ error: 'Failed to update state' });
    }
});

// GET school member info
router.post('/school-member', async (req, res) => {
    try {
        const data = await callMainBackend('/auth/school-member', {
            method: 'POST',
            body: JSON.stringify(req.body),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        res.json(data);
    } catch (error) {
        console.error('❌ Get school member error:', error);
        res.status(500).json({ error: 'Failed to get school member info' });
    }
});

export default router;