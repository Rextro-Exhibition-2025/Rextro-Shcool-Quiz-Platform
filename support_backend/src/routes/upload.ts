import express from 'express';
import { callMainBackend } from '../services/mainBackendService.js';

const router = express.Router();

// POST upload image (no caching)
router.post('/upload', async (req, res) => {
    try {
        const data = await callMainBackend('/upload/upload', {
            method: 'POST',
            body: JSON.stringify(req.body),
            headers: req.headers as Record<string, string>
        });
        res.json(data);
    } catch (error) {
        console.error('❌ Error uploading image:', error);
        res.status(500).json({ error: 'Failed to upload image' });
    }
});

// DELETE delete image (no caching)
router.delete('/delete', async (req, res) => {
    try {
        const data = await callMainBackend('/upload/delete', {
            method: 'DELETE',
            body: JSON.stringify(req.body),
            headers: req.headers as Record<string, string>
        });
        res.json(data);
    } catch (error) {
        console.error('❌ Error deleting image:', error);
        res.status(500).json({ error: 'Failed to delete image' });
    }
});

export default router;