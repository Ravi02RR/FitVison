import { Router } from "express";
import { signup, signin, forgetPassword, resetPassword, google, signout } from "../controller/auth.controller.js";
// import userAuthMiddleware from "../middleware/auth.middleware.js";
const authRouter = Router();


authRouter.post("/signup", signup);
authRouter.post("/signin", signin);
authRouter.post("/forget-password", forgetPassword);
authRouter.post("/reset-password", resetPassword);
authRouter.post("/google", google)
authRouter.post("/signout", signout);



export default authRouter;