import express from 'express';
import { getCache, setCache, deleteCache } from '../config/cache.js';
import { callMainBackend } from '../services/mainBackendService.js';

const router = express.Router();

// POST create violation (invalidate cache)
router.post('/', async (req, res) => {
    try {
        const data = await callMainBackend('/violations', {
            method: 'POST',
            body: JSON.stringify(req.body),
            headers: {
                'Content-Type': 'application/json',
                Authorization: req.headers.authorization || ''
            }
        });
        deleteCache('violations:team:all');
        res.json(data);
    } catch (error) {
        console.error('❌ Error creating violation:', error);
        res.status(500).json({ error: 'Failed to create violation' });
    }
});

// GET violations for team with caching (accepts body with teamId)
// Convert GET to POST when calling backend since GET can't have body
router.get('/', async (req, res) => {
    try {
        const teamId = req.body?.teamId;
        const cacheKey = `violations:team:${teamId || 'all'}`;

        let data = getCache(cacheKey);
        if (!data) {
            // Send as POST to main backend since GET can't have body
            data = await callMainBackend('/violations', {
                method: 'GET',
                body: JSON.stringify(req.body),
                headers: {
                    'Content-Type': 'application/json',
                    'X-HTTP-Method-Override': 'GET', // Optional: indicate original method
                    Authorization: req.headers.authorization || ''
                }
            });
            setCache(cacheKey, data, 300);
        }
        res.json(data);
    } catch (error) {
        console.error('❌ Error fetching violations:', error);
        res.status(500).json({ error: 'Failed to fetch violations' });
    }
});

// GET count violations for team member (accepts body with teamId & memberName)
// Convert GET to POST when calling backend
router.get('/count', async (req, res) => {
    try {
        const teamId = req.body?.teamId;
        const memberName = req.body?.memberName;
        const cacheKey = `violations:count:${teamId}:${memberName}`;

        let data = getCache(cacheKey);
        if (!data) {
            // Send as POST to main backend since GET can't have body
            data = await callMainBackend('/violations/count', {
                method: 'GET',
                body: JSON.stringify(req.body),
                headers: {
                    'Content-Type': 'application/json',
                    'X-HTTP-Method-Override': 'GET',
                    Authorization: req.headers.authorization || ''
                }
            });
            setCache(cacheKey, data, 300);
        }
        res.json(data);
    } catch (error) {
        console.error('❌ Error counting violations:', error);
        res.status(500).json({ error: 'Failed to count violations' });
    }
});

// GET count violations for team (accepts body with teamId)
// Convert GET to POST when calling backend
router.get('/count-team', async (req, res) => {
    try {
        const teamId = req.body?.teamId;
        const cacheKey = `violations:count:team:${teamId}`;

        let data = getCache(cacheKey);
        if (!data) {
            // Send as POST to main backend since GET can't have body
            data = await callMainBackend('/violations/count-team', {
                method: 'GET',
                body: JSON.stringify(req.body),
                headers: {
                    'Content-Type': 'application/json',
                    'X-HTTP-Method-Override': 'GET',
                    Authorization: req.headers.authorization || ''
                }
            });
            setCache(cacheKey, data, 300);
        }
        res.json(data);
    } catch (error) {
        console.error('❌ Error counting team violations:', error);
        res.status(500).json({ error: 'Failed to count team violations' });
    }
});

// GET all violations with school details
router.get('/get-all', async (req, res) => {
    try {
        const cacheKey = 'violations:all:detailed';

        let data = getCache(cacheKey);
        if (!data) {
            data = await callMainBackend('/violations/get-all', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: req.headers.authorization || ''
                }
            });
            setCache(cacheKey, data, 300);
        }
        res.json(data);
    } catch (error) {
        console.error('❌ Error fetching all violations:', error);
        res.status(500).json({ error: 'Failed to fetch all violations' });
    }
});

export default router;