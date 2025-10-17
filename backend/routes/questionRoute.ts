import { Router } from "express";

import { createQuestion, deleteQuestion, editQuestion } from "../controllers/questionController.js";
// Temporarily removed admin auth - TODO: implement proper Google OAuth verification
// import { adminOnly } from "../middleware/adminAuthMiddleware.js";

const QuestionRouter = Router();

QuestionRouter.route("/").post(createQuestion)

QuestionRouter.route("/:questionId").put( editQuestion ).delete( deleteQuestion );


export default QuestionRouter;




