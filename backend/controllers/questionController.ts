
import jwt from "jsonwebtoken";
import Question from "../models/Question.js";
import Quiz from "../models/Quiz.js";
import type { Request, Response } from "express";



export const createQuestion = async (req: Request, res: Response): Promise<any> => {
  try {
    console.log('📝 Received question data:', JSON.stringify(req.body, null, 2));

    const quiz = await Quiz.findOne({ quizId: req.body.quizId });

    if (!quiz) {
      res.status(404).json({
        success: false,
        message: `Quiz with quizId ${req.body.quizId} not found`,
      });
      return;
    }

    // Check if quiz already has 15 or more questions
    const currentQuestionCount = quiz.questions?.length || 0;
    if (currentQuestionCount >= 15) {
      res.status(400).json({
        success: false,
        message: `Quiz ${req.body.quizId} already has the maximum number of questions (15). Cannot add more questions.`,
        currentQuestionCount: currentQuestionCount
      });
      return;
    }

    // Create the question
    console.log('✅ Creating question in database...');
    const question = await Question.create(req.body);
    console.log('✅ Question created with ID:', question._id);

    // Add the question to the quiz
    if (!quiz.questions) {
      quiz.questions = [];
    }
    quiz.questions.push(question._id as any);
    await quiz.save();
    console.log('✅ Question added to quiz:', quiz.quizId);

    res.status(201).json({
      success: true,
      data: question,
    });
  } catch (error) {
    console.error('❌ Error creating question:', error);
    res.status(400).json({
      success: false,
      message: "Error Adding Question",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};