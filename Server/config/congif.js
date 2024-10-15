const config = {
    database: {
        uri: process.env.MONGODB_URI,
    },
    server: {
        port: process.env.PORT,
    },
    bcrypt: {
        saltRounds: parseInt(process.env.SALT_ROUNDS),
    },
    jwt: {
        secret: process.env.JWT_SECRET,
    },
    nodemailer: {
        email: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASS,
    },
    razorpay: {
        keyId: process.env.RAZORPAY_KEY_ID.toString(),
        keySecret: process.env.RAZORPAY_KEY_SECRET.toString(),
    }

}

export default config;