import { Router } from "express";

import { createQuestion, deleteQuestion, editQuestion } from "../controllers/questionController.js";
import { adminOnly } from "../middleware/adminAuthMiddleware.js";
// Temporarily removed admin auth - TODO: implement proper Google OAuth verification
// import { adminOnly } from "../middleware/adminAuthMiddleware.js";

const QuestionRouter = Router();

QuestionRouter.route("/").post(adminOnly,createQuestion)

QuestionRouter.route("/:questionId").put(adminOnly, editQuestion).delete(adminOnly, deleteQuestion);


export default QuestionRouter;




