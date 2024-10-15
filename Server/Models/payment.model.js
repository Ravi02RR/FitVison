import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    razorpay_order_id: {
        type: String,
        required: true,
    },
    razorpay_payment_id: {
        type: String,
        required: true,
    },
    razorpay_signature: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        default: "Success",
    },
});

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
