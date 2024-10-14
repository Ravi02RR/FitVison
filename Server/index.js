import app from "./app/app.js";
import mongoConnect from "./db/db.js";
import config from "./config/congif.js";
import errorMiddleware from "./middleware/error.middleware.js";
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.route.js";

//========= V1 Routes=========================
app.use("/api/v1/user", userRouter);
app.use("/api/v1/auth", authRouter);

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