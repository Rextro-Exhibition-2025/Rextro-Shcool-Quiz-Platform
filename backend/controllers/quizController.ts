import Quiz from '../models/Quiz.js';
import type { Request, Response } from 'express';
export const getQuizWithQuestions = async (req: Request, res: Response) => {
  try {
    const quizId = Number(req.params.quizId);
    if (![1, 2, 3, 4].includes(quizId)) {
      return res.status(400).json({ success: false, message: 'Invalid quizId. Must be 1, 2, 3, or 4.' });
    }

    // Find the quiz and populate questions
    const quiz = await Quiz.findOne({ quizId }).populate('questions');
    if (!quiz) {
      return res.status(404).json({ success: false, message: `Quiz with quizId ${quizId} not found.` });
    }

    // Remove correctOption from each question
    const quizObj = quiz.toObject();
    quizObj.questions = (quizObj.questions || []).map((q: any) => {
      const { correctOption, ...rest } = q;
      return rest;
    });

    return res.status(200).json({
      success: true,
      quiz: quizObj,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching quiz',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
