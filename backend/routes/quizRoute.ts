import { Router } from "express";
import { getQuizWithQuestions } from "../controllers/quizController.js";


const QuizRouter = Router();

QuizRouter.route("/:quizId")
  .get(getQuizWithQuestions);

export default QuizRouter;

