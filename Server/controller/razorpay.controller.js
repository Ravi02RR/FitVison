import { razorpayinstance } from "../app/razorpayapp.js";
import UserModel from "../Models/user.model.js";
import Payment from "../Models/payment.model.js";
import crypto from "crypto";
import config from "../config/congif.js";
import nodemailer from "nodemailer";


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


const email = config.nodemailer.email
const password = config.nodemailer.password

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: email,
        pass: password
    }
});
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

            const user = await UserModel.findByIdAndUpdate(req.userID, {
                isPro: true,
                proExpirationDate: oneMonthFromNow
            }, { new: true });


            const mailOptions = {
                from: '"noreply@fitVision.com" <your_actual_email@gmail.com>',
                to: user.email,
                subject: 'Fit Vision Subscription Confirmation',
                html: `
                    <html>
                        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                            <h2>Thank you for subscribing to Fit Vision!</h2>
                            <p>Dear ${user.firstname},</p>
                            <p>We're excited to confirm your subscription worth 999 INR to Fit Vision. Here are your transaction details:</p>
                            <ul>
                                <li><strong>Order ID:</strong> ${razorpay_order_id}</li>
                                <li><strong>Payment ID:</strong> ${razorpay_payment_id}</li>
                                <li><strong>Subscription Start Date:</strong> ${new Date().toLocaleDateString()}</li>
                                <li><strong>Subscription Expiry Date:</strong> ${oneMonthFromNow.toLocaleDateString()}</li>
                            </ul>
                            <p>Your pro features are now active. Enjoy all the benefits of your Fit Vision subscription!</p>
                            <p>If you have any questions, please don't hesitate to contact our support team.</p>
                            <p>Best regards,<br>The Fit Vision Team</p>
                        </body>
                    </html>
                `
            };

            await transporter.sendMail(mailOptions);

            res.redirect(
                `${process.env.FRONTEND_URL}/paymentsuccess?reference=${razorpay_payment_id}`
            );
        } else {
            res.status(400).json({
                success: false,
                message: "Payment verification failed"
            });
        }

    } catch (err) {
        console.error('Error in verifying payment:', err);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message
        });
    }
};
