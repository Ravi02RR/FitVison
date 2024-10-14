import { Router } from "express";
import { signup, signin, forgetPassword, resetPassword } from "../controller/auth.controller.js";
const authRouter = Router();


authRouter.post("/signup", signup);
authRouter.post("/signin", signin);
authRouter.post("/forget-password", forgetPassword);
authRouter.post("/reset-password", resetPassword);
authRouter.post("/google",)


export default authRouter;