import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import SchoolTeam from '../models/SchoolTeam.js';

// Add user property to Express Request interface
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                teamName: string;
                schoolName: string;
                memberName: string;
            };
        }
    }
}

export const protect = async (
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

        try {
            // Verify token
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET || 'teamquizsecret'
            ) as {
                id: string;
                teamName: string;
                schoolName: string;
                memberName: string;
            };

            // Find the team by ID
            const team = await SchoolTeam.findById(decoded.id);

            if (!team) {
                res.status(401).json({
                    success: false,
                    message: 'Team not found'
                });
                return;
            }

            // Check if the member exists and is logged in
            const member = team.members.find(m =>
                m.name === decoded.memberName && m.isLoggedIn && m.authToken === token
            );

            if (!member) {
                res.status(401).json({
                    success: false,
                    message: 'Not authorized - member not logged in or token mismatch'
                });
                return;
            }

            // Add user info to request object
            req.user = {
                id: decoded.id,
                teamName: team.teamName,
                schoolName: team.schoolName,
                memberName: decoded.memberName
            };

            next();
        } catch (error) {
            res.status(401).json({
                success: false,
                message: 'Not authorized, token failed',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            return;
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Authentication error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};