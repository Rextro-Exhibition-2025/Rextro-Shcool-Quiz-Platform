import { Router } from "express";

import { createQuestion } from "../controllers/questionController.js";
import { adminOnly } from "../middleware/adminAuthMiddleware.js";

const QuestionRouter = Router();

QuestionRouter.route("/")
  .post(adminOnly, createQuestion);  // POST /api/questions

export default QuestionRouter;


