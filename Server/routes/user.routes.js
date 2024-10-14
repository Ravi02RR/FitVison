import { Router } from "express";

const userRouter = Router();

userRouter.get("/", (req, res) => {
    res.json({
        message: "Hello from user router"
    });
});

export default userRouter;