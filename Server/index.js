import app from "./app/app.js";
import mongoConnect from "./db/db.js";
import config from "./config/congif.js";
import errorMiddleware from "./middleware/error.middleware.js";
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.route.js";
import userAuthMiddleware from "./middleware/auth.middleware.js";
import logMiddleware from "./middleware/admin.log.middleware.js";
import adminLogRouter from "./routes/admin.log.route.js";
import progressRouter from "./routes/progress.router.js";
import paymentRouter from "./routes/razorpay.routes.js";



app.get("/", userAuthMiddleware, (req, res) => {
    res.json({
        message: "Hello World"
    })
});
app.use(logMiddleware);
//========= V1 Routes=========================
app.use("/api/v1/user", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin/log", adminLogRouter);
app.use("/api/v1/progress", userAuthMiddleware, progressRouter);
app.use("/api/v1/payment", userAuthMiddleware, paymentRouter);

//==================Error Middleware===================
app.use(errorMiddleware);

//==========================server=========================
try {
    mongoConnect(config.database.uri).then(() => {
        app.listen(config.server.port, () => {
            console.log(`Server is running on port ${config.server.port}`);
        });
    });
} catch (err) {
    console.log(err);
}