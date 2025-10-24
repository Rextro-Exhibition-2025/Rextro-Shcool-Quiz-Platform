import type { Request, Response } from "express";
import SchoolTeam from "../models/SchoolTeam.js";

export const loginMember = async (req: Request, res: Response): Promise<void> => {
    try {
        const { schoolName, password, memberName } = req.body;

        if (!schoolName || !password || !memberName) {
            res.status(400).json({
                success: false,
                message: "School name, password, and member name are required",
            });
            return;
        }

        const schoolTeam = await SchoolTeam.findOne({ schoolName });
        if (!schoolTeam) {
            res.status(404).json({
                success: false,
                message: "School team not found",
            });
            return;
        }

        const isMatch = await schoolTeam.comparePassword(password);
        if (!isMatch) {
            res.status(401).json({
                success: false,
                message: "Invalid password",
            });
            return;
        }

        const member = schoolTeam.members.find((m) => m.name === memberName);
        if (!member) {
            res.status(404).json({
                success: false,
                message: "Member not found in the team",
            });
            return;
        }

        // Generate auth token for the member
        const authToken = schoolTeam.generateAuthTokenForMember(memberName);
        member.isLoggedIn = true;
        member.authToken = authToken;

        await schoolTeam.save();

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                teamId: schoolTeam._id,
                teamName: schoolTeam.teamName,
                memberName: member.name,
                schoolName: schoolTeam.schoolName,
                hasEndedQuiz: member.hasEndedQuiz,
                number: member.number,
                authToken,
            },
        });
        console.log("Member logged in:", memberName, "from school:", schoolTeam.schoolName);
    } catch (error) {
        console.error("Error logging in member:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

export const logoutMember = async (req: Request, res: Response): Promise<void> => {
    try {
        // User data is already attached to req.user by the protect middleware
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'User not found'
            });
            return;
        }

        const { schoolName, memberName } = req.user;

        const schoolTeam = await SchoolTeam.findOne({ schoolName });
        if (!schoolTeam) {
            res.status(404).json({
                success: false,
                message: "School team not found",
            });
            return;
        }

        const member = schoolTeam.members.find((m) => m.name === memberName);
        if (!member) {
            res.status(404).json({
                success: false,
                message: "Member not found in the team",
            });
            return;
        }

        member.isLoggedIn = false;
        member.authToken = "";

        await schoolTeam.save();

        res.status(200).json({
            success: true,
            message: "Logout successful",
        });
    } catch (error) {
        console.error("Error logging out member:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

export const getAllSchoolTeams = async (req: Request, res: Response): Promise<void> => {
    try {
        const schoolTeams = await SchoolTeam.find();

        res.status(200).json({
            success: true,
            data: schoolTeams,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching school teams",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
    try {
        // User data is already attached to req.user by the protect middleware
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'User not found'
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: {
                memberName: req.user.memberName,
                schoolName: req.user.schoolName,
                teamName: req.user.teamName,
                marks: req.user.marks,
                authToken: req.headers.authorization?.split(' ')[1] // Include token in response
            }
        });
    } catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const updateStateOfMember = async (req: Request, res: Response): Promise<void> => {
    try {
        const { schoolName, memberName, hasEndedQuiz } = req.body;

        if (!schoolName || !memberName || typeof hasEndedQuiz !== 'boolean') {
            res.status(400).json({
                success: false,
                message: "School name, member name, and hasEndedQuiz status are required",
            });
            return;
        }

        const schoolTeam = await SchoolTeam.findOne({ schoolName });
        if (!schoolTeam) {
            res.status(404).json({
                success: false,
                message: "School team not found",
            });
            return;
        }

        const member = schoolTeam.members.find((m) => m.name === memberName);
        if (!member) {
            res.status(404).json({
                success: false,
                message: "Member not found in the team",
            });
            return;
        }

        member.hasEndedQuiz = hasEndedQuiz;

        await schoolTeam.save();

        res.status(200).json({
            success: true,
            message: "Member state updated successfully",
            data: { memberName: member.name, hasEndedQuiz: member.hasEndedQuiz }
        });
    } catch (error) {
        console.error("Error updating member state:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

export const getMemberOfSchoolTeam = async (req: Request, res: Response): Promise<void> => {
    try {
        const { schoolName, memberName } = req.body;

        if (!schoolName || !memberName) {
            res.status(400).json({
                success: false,
                message: "School name and member name are required",
            });
            return;
        }

        const schoolTeam = await SchoolTeam.findOne({ schoolName });
        if (!schoolTeam) {
            res.status(404).json({
                success: false,
                message: "School team not found",
            });
            return;
        }

        const member = schoolTeam.members.find((m) => m.name === memberName);
        if (!member) {
            res.status(404).json({
                success: false,
                message: "Member not found in the team",
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: member,
        });
    } catch (error) {
        console.error("Error fetching member:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}