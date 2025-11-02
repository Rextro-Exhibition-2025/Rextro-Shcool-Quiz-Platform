import express from 'express';
import { getCache, setCache, deleteCache } from '../config/cache.js';
import { callMainBackend } from '../services/mainBackendService.js';

const router = express.Router();

// GET all school teams with caching
router.get('/', async (req, res) => {
    try {
        const cacheKey = 'school-teams:all';
        let data = getCache(cacheKey);
        if (!data) {
            console.log("no data in caching. calling main backend")
            data = await callMainBackend('/school-teams');
            setCache(cacheKey, data, 600);
        }
        res.json(data);
    } catch (error) {
        console.error('❌ Error fetching school teams:', error);
        res.status(500).json({ error: 'Failed to fetch school teams' });
    }
});

// POST create school team (invalidate cache)
router.post('/', async (req, res) => {
    try {
        const data = await callMainBackend('/school-teams', {
            method: 'POST',
            body: JSON.stringify(req.body),
            headers: req.headers as Record<string, string>
        });
        deleteCache('school-teams:all');
        res.json(data);
    } catch (error) {
        console.error('❌ Error creating school team:', error);
        res.status(500).json({ error: 'Failed to create school team' });
    }
});

// GET school team by ID with caching
router.get('/:id', async (req, res) => {
    try {
        const cacheKey = `school-team:${req.params.id}`;
        let data = getCache(cacheKey);
        if (!data) {
            data = await callMainBackend(`/school-teams/${req.params.id}`);
            setCache(cacheKey, data, 600);
        }
        res.json(data);
    } catch (error) {
        console.error('❌ Error fetching school team:', error);
        res.status(500).json({ error: 'Failed to fetch school team' });
    }
});

// PUT update school team (invalidate cache)
router.put('/:id', async (req, res) => {
    try {
        const data = await callMainBackend(`/school-teams/${req.params.id}`, {
            method: 'PUT',
            body: JSON.stringify(req.body),
            headers: req.headers as Record<string, string>
        });
        deleteCache('school-teams:all');
        deleteCache(`school-team:${req.params.id}`);
        res.json(data);
    } catch (error) {
        console.error('❌ Error updating school team:', error);
        res.status(500).json({ error: 'Failed to update school team' });
    }
});

// DELETE school team (invalidate cache)
router.delete('/:id', async (req, res) => {
    try {
        const data = await callMainBackend(`/school-teams/${req.params.id}`, {
            method: 'DELETE',
            headers: req.headers as Record<string, string>
        });
        deleteCache('school-teams:all');
        deleteCache(`school-team:${req.params.id}`);
        res.json(data);
    } catch (error) {
        console.error('❌ Error deleting school team:', error);
        res.status(500).json({ error: 'Failed to delete school team' });
    }
});

export default router;