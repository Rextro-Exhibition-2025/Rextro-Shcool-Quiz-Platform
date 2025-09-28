import { Router } from "express";
import { createViolation, getViolationsForTeam } from "../controllers/violationController.js";

const ViolationRouter = Router();

ViolationRouter.route("/").post(createViolation);

ViolationRouter.route("/:teamId").get(getViolationsForTeam);

export default ViolationRouter;