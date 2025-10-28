import { Router } from "express";
import { getLeaderBoard, getQuizWithQuestions, submitQuiz } from "../controllers/quizController.js";
import { protect } from "../middleware/authMiddleware.js";


const QuizRouter = Router();



QuizRouter.route("/submit-quiz")
  .post( protect , submitQuiz);

QuizRouter.route("/get-leaderboard")
  .get(getLeaderBoard);



QuizRouter.route("/:quizId")
  .get(getQuizWithQuestions);

export default QuizRouter;

