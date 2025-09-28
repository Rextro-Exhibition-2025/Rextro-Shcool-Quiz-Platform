import Quiz from '../models/Quiz.js';
import type { Request, Response } from 'express';
import SchoolTeam from '../models/SchoolTeam.js';

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


function countCorrectAnswers(submittedAnswers: { questionId: number, answer: string }[], correctAnswers: { questionId: number, correctOption: string }[]): number {
  let correctCount = 0;
  submittedAnswers.forEach(sub => {
    const correct = correctAnswers.find(ca => ca.questionId === sub.questionId);
    if (correct && correct.correctOption.toLowerCase() === sub.answer.toLowerCase()) {
      correctCount++;
    }
  });
  return correctCount;
}
export const submitQuiz = async (req: Request, res: Response) => {
  
  try {
    const { quizId, submittedAnswers  } = req.body;
    const memberName = req.user?.memberName;
    const schoolName = req.user?.schoolName;


    

    const quiz = await Quiz.findOne({ quizId }).populate({ path: 'questions', select: 'correctOption' });

 
    const correctAnswers: { questionId: number, correctOption: string }[] = (quiz?.questions ?? []).map((q: any, idx: number) => ({
      questionId: idx,
      correctOption: q.correctOption.toLowerCase()
  
    }));



    
    if (!quiz) {
      return res.status(404).json({ success: false, message: `Quiz with quizId ${quizId} not found.` });
    }

    const correctCount = countCorrectAnswers(submittedAnswers, correctAnswers);


    const score = (correctCount/15)*100;

    try {


   await SchoolTeam.findOneAndUpdate(
        { schoolName, "members.name": memberName },
        { $set: { "members.$.marks": score } },
        { new: true }
      );


      
   
      

    } catch (error) {

      console.error("Error submitting quiz:", error);
      
    }


    



    return res.status(200).json({
      success: true,
      message: 'Quiz submitted successfully',
      data: {
    
        quizId,
        score,
   
      }
    });





    

  }catch (error) {



    }
}
