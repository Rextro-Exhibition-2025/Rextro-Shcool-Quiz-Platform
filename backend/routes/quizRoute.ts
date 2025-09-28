import { Router } from "express";
import { getQuizWithQuestions, submitQuiz } from "../controllers/quizController.js";
import { protect } from "../middleware/authMiddleware.js";


const QuizRouter = Router();

QuizRouter.route("/:quizId")
  .get(getQuizWithQuestions);

QuizRouter.route("/submit-quiz")
  .post( protect , submitQuiz);

export default QuizRouter;

