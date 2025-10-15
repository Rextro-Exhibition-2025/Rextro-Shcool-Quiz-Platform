import { Router } from "express";

import { createQuestion } from "../controllers/questionController.js";
// Temporarily removed admin auth - TODO: implement proper Google OAuth verification
// import { adminOnly } from "../middleware/adminAuthMiddleware.js";

const QuestionRouter = Router();

QuestionRouter.route("/")
  .post(createQuestion);  // POST /api/questions (TODO: add proper authentication)

export default QuestionRouter;


