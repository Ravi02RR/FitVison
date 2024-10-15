import { Router } from "express";
import { getDietSchedule ,getExerciseSchedule} from "../controller/planner.controller.js";

const plannerRouter = Router();

plannerRouter.post("/dietplan", getDietSchedule)
plannerRouter.post("/exercisepaln", getExerciseSchedule)



export default plannerRouter;