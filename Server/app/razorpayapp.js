import razorpay from 'razorpay';
import config from '../config/congif.js';

export const razorpayinstance = new razorpay({
    key_id: config.razorpay.keyId,
    key_secret: config.razorpay.keySecret,
});



// console.log(config.razorpay.keyId);
// console.log(config.razorpay.keySecret);