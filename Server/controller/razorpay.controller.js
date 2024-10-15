import { razorpayinstance } from "../app/razorpayapp.js";
import UserModel from "../Models/user.model.js";
import Payment from "../Models/payment.model.js";
import crypto from "crypto";
import config from "../config/congif.js";

export const checkout = async (req, res) => {
    try {
        const user = req.userID;
        const validUSer = await UserModel.findById(user);
        if (validUSer.isPro) {
            return res.status(400).json({
                message: "User is already a pro user"
            });
        }
        const options = {
            amount: 99900,
            currency: "INR",

        };

        const order = await razorpayinstance.orders.create(options);

        res.status(200).json(order);
    } catch (er) {

        console.error('Error in creating order:', er);

        res.status(500).json({
            message: er.message
        });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        console.log(req.body);
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", config.razorpay.keySecret)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            await Payment.create({
                user: req.userID,
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
            });

            const oneMonthFromNow = new Date();
            oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

            await UserModel.findByIdAndUpdate(req.userID, {
                isPro: true,
                proExpirationDate: oneMonthFromNow
            });

            res.redirect(
                `http://localhost:5173/paymentsuccess?reference=${razorpay_payment_id}`
            );
        } else {
            res.status(400).json({
                success: false,
                message: "Payment verification failed"
            });
        } Paymentsucess
        Paymentsucess
        Paymentsucess
    } catch (err) {
        console.error('Error in verifying payment:', err);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message
        });
    }
};