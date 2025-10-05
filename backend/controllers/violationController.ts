import type { Request, Response } from 'express';
import type { IViolation } from '../models/Violation.js';
import Violation from '../models/Violation.js';
import mongoose from 'mongoose';

export const createViolation = async (req: Request, res: Response) => {
    try {
        const newViolation = await Violation.create(req.body);
        console.log(newViolation);
        res.status(201).json({
            success: true,
            data: newViolation,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Failed to create violation',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}

export const getViolationsForTeam = async (req: Request, res: Response) => {
    try {
        const { teamId } = req.body;
        if (!teamId || !mongoose.Types.ObjectId.isValid(teamId)) {
            res.status(400).json({
                success: false,
                message: "Invalid team ID format",
            });
            return;
        }

        const violations = await Violation.find({ teamId: teamId });

        if (!violations || violations.length === 0) {
            res.status(404).json({
                success: false,
                message: "No violations found for the specified team",
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: violations,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve violations",
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}

export const countViolationsForTeamMember = async (req: Request, res: Response) => {
    try {
        const { teamId, memberName } = req.body;
        if (!teamId || !mongoose.Types.ObjectId.isValid(teamId) || !memberName) {
            res.status(400).json({
                success: false,
                message: "Invalid team ID format or member name",
            });
            return;
        }

        const violationCount = await Violation.countDocuments({ teamId: teamId, memberName: memberName });

        res.status(200).json({
            success: true,
            data: { count: violationCount },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to count violations",
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
