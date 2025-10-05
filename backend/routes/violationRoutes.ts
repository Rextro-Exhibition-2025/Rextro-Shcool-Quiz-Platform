import { Router } from "express";
import { countViolationsForTeamMember, createViolation, getViolationsForTeam } from "../controllers/violationController.js";

const ViolationRouter = Router();

ViolationRouter.route("/").post(createViolation);

ViolationRouter.route("/").get(getViolationsForTeam);

ViolationRouter.route("/count").get(countViolationsForTeamMember);

export default ViolationRouter;