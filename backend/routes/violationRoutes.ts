import { Router } from "express";
import { countViolationsForTeam, countViolationsForTeamMember, createViolation, getViolationsForTeam } from "../controllers/violationController.js";

const ViolationRouter = Router();

ViolationRouter.route("/").post(createViolation);

ViolationRouter.route("/").get(getViolationsForTeam);

ViolationRouter.route("/count").get(countViolationsForTeamMember);

ViolationRouter.route("/count-team").get(countViolationsForTeam);

export default ViolationRouter;