import { Router } from "express";

import { createQuestion, deleteQuestion, editQuestion, getAllQuestions, getQuestionById, submitAnswer } from "../controllers/questionController.js";
import { adminOnly } from "../middleware/adminAuthMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";
// Temporarily removed admin auth - TODO: implement proper Google OAuth verification
// import { adminOnly } from "../middleware/adminAuthMiddleware.js";

const QuestionRouter = Router();

QuestionRouter.route("/").post(adminOnly,createQuestion).get(adminOnly, getAllQuestions);

QuestionRouter.route("/:questionId").put(adminOnly, editQuestion).delete(adminOnly, deleteQuestion).get(adminOnly, getQuestionById);

QuestionRouter.route("/submit").post(protect , submitAnswer);


export default QuestionRouter;




