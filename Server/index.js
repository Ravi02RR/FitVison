import app from "./app/app.js";
import mongoConnect from "./db/db.js";
import config from "./config/congif.js";
import errorMiddleware from "./middleware/error.middleware.js";
import reqMiddleware from "./middleware/req.middeware.js";
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.route.js";
import userAuthMiddleware from "./middleware/auth.middleware.js";
import logMiddleware from "./middleware/admin.log.middleware.js";
import adminUserRouter from "./routes/admin.user.route.js";
import progressRouter from "./routes/progress.router.js";
import paymentRouter from "./routes/razorpay.routes.js";
import plannerRouter from "./routes/planner.routes.js";
import { reqperuser, trackRequests } from "./routes/rePerUser.routes.js";
import AdminProgressRouter from "./routes/progressReport.route.js";
import SubscribedRoute from './routes/subscribed.route.js'
import nutritionRouter from "./routes/nutrition.route.js";



app.get("/", (req, res) => {
    res.json({
        message: "Hello World"
    })
});
app.use(trackRequests)
// app.use(logMiddleware);
//========= V1 Routes=========================
app.use("/api/v1/user", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin/", adminUserRouter);
app.use("/api/v1/progress", userAuthMiddleware, progressRouter);
app.use("/api/v1/payment", userAuthMiddleware, paymentRouter);
app.use("/api/v1/planner", userAuthMiddleware, plannerRouter);
app.use("/api/v1/reqperuser", userAuthMiddleware, reqperuser);
app.use("/api/v1/progressReport", userAuthMiddleware, AdminProgressRouter);
app.use("/api/v1/foodnutrition", userAuthMiddleware,nutritionRouter)
app.use("/api/v1/subs", SubscribedRoute);


//==================Error Middleware===================
// app.use(reqMiddleware);
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