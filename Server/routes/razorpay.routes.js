
import { Router } from 'express';
import { checkout, verifyPayment } from "../controller/razorpay.controller.js";
import config from '../config/congif.js';



const paymentRouter = Router();

paymentRouter.post("/checkout", checkout);
paymentRouter.post("/verify", verifyPayment);
paymentRouter.get("/key", (req, res) => {
    res.status(200).json({
        message: "razorpay key",
        key: config.razorpay.keyId
    })
})



export default paymentRouter;