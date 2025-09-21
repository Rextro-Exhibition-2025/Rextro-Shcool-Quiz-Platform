import { Router } from "express";

import { createQuestion } from "../controllers/questionController.js";

const QuestionRouter = Router();

QuestionRouter.route("/")
  .post(createQuestion);  // POST /api/questions

export default QuestionRouter;


