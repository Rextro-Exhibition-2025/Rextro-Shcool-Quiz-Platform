import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const adminOnly = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        let token;

        // Check for token in Authorization header
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }

        // Check if token exists
        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Not authorized to access this route'
            });
            return;
        }
        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.NEXTAUTH_SECRET || 'your_secret_key'
        ) as {

            exp?: number;
        };


        if (decoded.exp && Date.now() >= decoded.exp * 1000) {
            res.status(401).json({ error: 'Token expired' });
            return;
        }
        // Find the team by ID
        next();

    } catch (error) {

        res.status(500).json({
            success: false,
            message: 'Authentication error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
