import jwt from "jsonwebtoken";
import Question from "../models/Question.js";
import Quiz from "../models/Quiz.js";
import type { Request, Response } from "express";
import SchoolTeam from "../models/SchoolTeam.js";



export const createQuestion = async (req: Request, res: Response): Promise<any> => {
  try {


    console.log("request body", req.body);



    // Validate that each option has either text or image
    if (req.body.options && Array.isArray(req.body.options)) {
      for (let i = 0; i < req.body.options.length; i++) {
        const option = req.body.options[i];
        if (!option.optionText && !option.optionImage) {
          res.status(400).json({
            success: false,
            message: `Option ${option.option || i + 1} must have either text or image`,
          });
          return;
        }
      }
    }

    const quiz = await Quiz.findOne({ quizId: req.body.quizId });

    if (!quiz) {
      res.status(404).json({
        success: false,
        message: `Quiz with quizId ${req.body.quizId} not found`,
      });
      return;
    }

    // Check if quiz already has 20 or more questions
    const currentQuestionCount = quiz.questions?.length || 0;
    if (currentQuestionCount >= 20) {
      res.status(400).json({
        success: false,
        message: `Quiz ${req.body.quizId} already has the maximum number of questions (20). Cannot add more questions.`,
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

export const editQuestion = async (req: Request, res: Response): Promise<any> => {
  try {
    const questionId = req.params.questionId;
    const updatedData = req.body;

    // Validate that each option has either text or image
    if (updatedData.options && Array.isArray(updatedData.options)) {
      for (let i = 0; i < updatedData.options.length; i++) {
        const option = updatedData.options[i];
        if (!option.optionText && !option.optionImage) {
          res.status(400).json({
            success: false,
            message: `Option ${option.option || i + 1} must have either text or image`,
          });
          return;
        }
      }
    }

    const question = await Question.findByIdAndUpdate(questionId, updatedData, { new: true });
    if (!question) {
      return res.status(404).json({ success: false, message: `Question with ID ${questionId} not found.` });
    }
    res.status(200).json({ success: true, data: question });
  } catch (error) {
    console.error('❌ Error editing question:', error);
    res.status(400).json({
      success: false,
      message: "Error Editing Question",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const deleteQuestion = async (req: Request, res: Response): Promise<any> => {

  try {
    const questionId = req.params.questionId;
    const question = await Question.findByIdAndDelete(questionId);
    if (!question) {
      return res.status(404).json({ success: false, message: `Question with ID ${questionId} not found.` });
    }


    // Also remove the question from any quizzes that reference it
    await Quiz.updateMany(
      { questions: question._id },
      { $pull: { questions: question._id } }
    );
    res.status(200).json({ success: true, message: `Question with ID ${questionId} deleted successfully.` });
  } catch (error) {
    console.error('❌ Error deleting question:', error);
    res.status(400).json({
      success: false,
      message: "Error Deleting Question",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};


export const getAllQuestions = async (req: Request, res: Response): Promise<any> => {

  try {

    const questions = await Question.find();
    res.status(200).json({ success: true, data: questions });

  } catch (error) {

    console.error('❌ Error fetching questions:', error);
    res.status(400).json({
      success: false,
      message: "Error Fetching Questions",
      error: error instanceof Error ? error.message : "Unknown error",
    });

  }

}


export const getQuestionById = async (req: Request, res: Response) => {
  try {
    const questionId = req.params.questionId;
    console.log("Fetching question with ID:", questionId);

    const question = await Question.findById(questionId);
    if (!question) {
      res.status(404).json({ success: false, message: `Question with ID ${questionId} not found.` });
    }
    res.status(200).json({ success: true, data: question });
  } catch (error) {
    console.error('❌ Error fetching question by ID:', error);
    res.status(400).json({
      success: false,
      message: "Error Fetching Question",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export const submitAnswer = async (req: Request, res: Response) => {
  try {

    // console.log(req.body)

    const { answer, timeSpent, questionId } = req.body;
    console.log(`Received answer submission for question ID: ${questionId}, answer ID: ${answer}, time spent: ${timeSpent} seconds`);
    const schoolName = req.user?.schoolName;



    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ success: false, message: `Question with ID ${questionId} not found.` });
    }

    const team = await SchoolTeam.findOne({ schoolName });

    if (!team) {
      return res.status(404).json({ success: false, message: `School team with name ${schoolName} not found.` });
    }












    const isCorrect = question.correctOption.toString() === answer;
    console.log(`Answer is ${isCorrect ? 'correct' : 'incorrect'}`);

    // Calculate score logic
    // Example: max score 100, min score 10, linear decrease up to 30 seconds
    let score = 0;
    if (isCorrect) {
      const maxScore = 10;
      const minScore = 3;
      const maxTime = 120; // seconds
      // Clamp timeSpent to maxTime
      const time = Math.max(0, Math.min(Number(timeSpent), maxTime));
      // Linear interpolation: faster = higher score
      score = Math.round(maxScore - ((maxScore - minScore) * (time / maxTime)));
    }

    console.log(`Answer is ${isCorrect ? 'correct' : 'incorrect'} score is ${score}`);

    if (team.finalRoundScore === undefined) {
      team.finalRoundScore = score;
    }
    else {
      team.finalRoundScore += score;
    }

    const totalScore = team.finalRoundScore || 0;

    await team.save();

    res.status(200).json({ success: true, isCorrect, score, totalScore });
  } catch (error) {
    console.error('❌ Error submitting answer:', error);
    res.status(400).json({
      success: false,
      message: "Error Submitting Answer",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
